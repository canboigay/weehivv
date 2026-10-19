export interface DomainDnsAudit {
  domain: string;
  hasMx: boolean;
  mxRecords: string[];
  hasSpf: boolean;
  spfRecord?: string;
  hasDmarc: boolean;
  dmarcRecord?: string;
  dmarcPolicy?: string; // 'reject' | 'quarantine' | 'none'
  rawDkimFound: boolean;
  isCompliant: boolean;
  issues: string[];
}

export async function auditDomainDns(domain: string): Promise<DomainDnsAudit> {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const issues: string[] = [];

  let hasMx = false;
  let mxRecords: string[] = [];
  let hasSpf = false;
  let spfRecord: string | undefined;
  let hasDmarc = false;
  let dmarcRecord: string | undefined;
  let dmarcPolicy: string | undefined;
  let rawDkimFound = false;

  try {
    // 1. Query MX records
    const mxRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=MX`, {
      headers: { Accept: 'application/dns-json' },
    });
    const mxJson = await mxRes.json();
    if (mxJson.Answer && mxJson.Answer.length > 0) {
      hasMx = true;
      mxRecords = mxJson.Answer.map((a: any) => a.data);
    } else {
      issues.push(`No MX records found for ${cleanDomain}. Inbound mail delivery will fail.`);
    }

    // 2. Query TXT records for SPF
    const txtRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=TXT`, {
      headers: { Accept: 'application/dns-json' },
    });
    const txtJson = await txtRes.json();
    if (txtJson.Answer) {
      for (const ans of txtJson.Answer) {
        const dataStr = (ans.data || '').replace(/^"|"$/g, '');
        if (dataStr.startsWith('v=spf1')) {
          hasSpf = true;
          spfRecord = dataStr;
          break;
        }
      }
    }
    if (!hasSpf) {
      issues.push(`No SPF record (v=spf1) found. Gmail & Yahoo will flag or drop messages.`);
    }

    // 3. Query DMARC at _dmarc.<domain>
    const dmarcRes = await fetch(`https://cloudflare-dns.com/dns-query?name=_dmarc.${cleanDomain}&type=TXT`, {
      headers: { Accept: 'application/dns-json' },
    });
    const dmarcJson = await dmarcRes.json();
    if (dmarcJson.Answer) {
      for (const ans of dmarcJson.Answer) {
        const dataStr = (ans.data || '').replace(/^"|"$/g, '');
        if (dataStr.includes('v=DMARC1')) {
          hasDmarc = true;
          dmarcRecord = dataStr;
          const match = dataStr.match(/p=([a-zA-Z]+)/);
          if (match) {
            dmarcPolicy = match[1].toLowerCase();
          }
          break;
        }
      }
    }
    if (!hasDmarc) {
      issues.push(`No DMARC record found at _dmarc.${cleanDomain}. Mandatory for 2024+ sender guidelines.`);
    } else if (dmarcPolicy === 'none') {
      issues.push(`DMARC policy is set to "p=none" (monitoring only). Recommend upgrading to "p=reject" or "p=quarantine".`);
    }

    // 4. Quick check common DKIM selector
    const dkimRes = await fetch(`https://cloudflare-dns.com/dns-query?name=k1._domainkey.${cleanDomain}&type=TXT`, {
      headers: { Accept: 'application/dns-json' },
    });
    const dkimJson = await dkimRes.json();
    if (dkimJson.Answer && dkimJson.Answer.length > 0) {
      rawDkimFound = true;
    }

  } catch (err) {
    console.error('DNS DoH lookup error', err);
    issues.push('Network timeout querying Cloudflare DNS-over-HTTPS.');
  }

  const isCompliant = hasMx && hasSpf && hasDmarc && (dmarcPolicy === 'reject' || dmarcPolicy === 'quarantine');

  return {
    domain: cleanDomain,
    hasMx,
    mxRecords,
    hasSpf,
    spfRecord,
    hasDmarc,
    dmarcRecord,
    dmarcPolicy,
    rawDkimFound,
    isCompliant,
    issues,
  };
}
