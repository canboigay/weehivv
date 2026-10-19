export interface CompileOptions {
  title: string;
  bodyHtmlOrText: string;
  senderName: string;
  publicationName: string;
  referralLink: string;
  unsubscribeUrl: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function compileToBulletproofEmailHtml(options: CompileOptions): string {
  const {
    title,
    bodyHtmlOrText,
    senderName,
    publicationName,
    referralLink,
    unsubscribeUrl,
    buttonText = 'Read & Share on Web',
    buttonUrl = referralLink,
  } = options;

  // Format paragraphs safely
  const formattedBody = bodyHtmlOrText
    .split('\n\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="margin: 0 0 16px; line-height: 26px; font-size: 16px; color: #374151;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    table, td, div, p, a { font-family: 'Segoe UI', Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: #ff5a36; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f8; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f8;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <!--[if mso]>
        <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <!-- Main Email Container (600px max) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0b0c10; border-bottom: 2px solid #ff5a36;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${publicationName}</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-family: monospace; color: #9ca3af; text-transform: uppercase;">Verified Deliverability</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; line-height: 32px;">
                ${title}
              </h1>
              
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px;">
                By ${senderName} &bull; ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              ${formattedBody}

              <!-- Bulletproof Outlook VML Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${buttonUrl}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="12%" stroke="f" fillcolor="#ff5a36">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:bold;">
                        ${buttonText} &rarr;
                      </center>
                    </v:roundrect>
                    <![endif]-->
                    <![if !mso]>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #ff5a36;">
                          <a href="${buttonUrl}" target="_blank" style="font-size: 14px; font-weight: 700; font-family: sans-serif; color: #ffffff; text-decoration: none; padding: 14px 28px; display: inline-block; border-radius: 8px; border: 1px solid #ff5a36; line-height: 1;">
                            ${buttonText} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <![endif]>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer (RFC 8058 compliant) -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; line-height: 18px;">
                You received this email because you subscribed to <strong>${publicationName}</strong>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">
                  One-Click Unsubscribe (RFC 8058)
                </a>
                &bull;
                <a href="${referralLink}" style="color: #6b7280; text-decoration: underline;">
                  Referral Hub
                </a>
              </p>
            </td>
          </tr>

        </table>

        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}
