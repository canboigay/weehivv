import { ApiKeys, PublicationSettings } from '../types';

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  unsubscribeUrl?: string;
}

export interface SendResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  latencyMs: number;
}

export async function sendNewsletterEmail(
  payload: SendEmailPayload,
  keys: ApiKeys,
  settings: PublicationSettings
): Promise<SendResult> {
  const startTime = performance.now();
  const toList = Array.isArray(payload.to) ? payload.to : [payload.to];
  const fromAddress = `${settings.senderName} <${settings.senderEmail}>`;
  const unsubUrl = payload.unsubscribeUrl || `https://${settings.customDomain}/unsubscribe`;

  // 1. Resend API
  if (settings.activeProvider === 'resend' || (keys.resendApiKey && settings.activeProvider !== 'simulator')) {
    if (!keys.resendApiKey) {
      return {
        success: false,
        provider: 'Resend',
        error: 'Missing Resend API Key in Settings.',
        latencyMs: Math.round(performance.now() - startTime),
      };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: toList,
          subject: payload.subject,
          html: payload.html,
          headers: {
            'List-Unsubscribe': `<${unsubUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Resend HTTP error ${res.status}`);
      }

      return {
        success: true,
        provider: 'Resend (Live)',
        messageId: data.id,
        latencyMs: Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'Resend',
        error: err.message || 'Failed to dispatch via Resend API',
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  // 2. SendGrid API
  if (settings.activeProvider === 'sendgrid' && keys.sendgridApiKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys.sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: toList.map(email => ({ to: [{ email }] })),
          from: { email: settings.senderEmail, name: settings.senderName },
          subject: payload.subject,
          content: [{ type: 'text/html', value: payload.html }],
          headers: {
            'List-Unsubscribe': `<${unsubUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `SendGrid error ${res.status}`);
      }

      return {
        success: true,
        provider: 'SendGrid (Live)',
        messageId: `sg_${Date.now()}`,
        latencyMs: Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'SendGrid',
        error: err.message || 'Failed to dispatch via SendGrid API',
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  // 3. Postmark API
  if (settings.activeProvider === 'postmark' && keys.postmarkToken) {
    try {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': keys.postmarkToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: fromAddress,
          To: toList.join(','),
          Subject: payload.subject,
          HtmlBody: payload.html,
          Headers: [
            { Name: 'List-Unsubscribe', Value: `<${unsubUrl}>` },
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.Message || `Postmark error ${res.status}`);
      }

      return {
        success: true,
        provider: 'Postmark (Live)',
        messageId: data.MessageID,
        latencyMs: Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'Postmark',
        error: err.message || 'Failed to dispatch via Postmark API',
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  // Fallback: Simulator mode (local edge queue simulation)
  await new Promise(r => setTimeout(r, 350));
  return {
    success: true,
    provider: 'Cloudflare Edge Simulator',
    messageId: `sim_${Date.now()}_prod`,
    latencyMs: Math.round(performance.now() - startTime),
  };
}
