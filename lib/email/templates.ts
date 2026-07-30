import 'server-only'

import { siteConfig } from '@/content/site-config'
import { ENQUIRY_TYPES, type ContactInput } from '@/lib/validation/contact'

/**
 * Branded HTML for the enquiry notification.
 *
 * Written in table layout with inline styles because that is what actually
 * survives Outlook and Gmail. A plain-text version is always sent alongside
 * this, since most clients block remote images until the reader allows them —
 * so the mark is an enhancement, never the only way to read the message.
 *
 * The logo resolves against siteConfig.url so it always matches the origin
 * the site is actually served from. Emails are only sent where the Brevo
 * keys exist — production — so this never points at a preview URL that
 * would stop resolving.
 */
const LOGO_URL = `${siteConfig.url}/images/brand/logo-email.png`

/**
 * Everything interpolated below comes from a public form, so it is escaped.
 * Without this, a submitted message containing markup would render as markup
 * in the inbox.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Preserves the visitor's line breaks after escaping. */
function toParagraphs(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />')
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#8b93a1;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#f3f0e8;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`
}

export function renderEnquiryEmail(data: ContactInput): string {
  const rows: string[] = [
    row('Type', ENQUIRY_TYPES[data.enquiryType]),
    row('Name', data.name),
    row('Email', data.email),
  ]

  if (data.organisation) rows.push(row('Organisation', data.organisation))

  if (data.enquiryType === 'website') {
    if (data.targetDate) rows.push(row('Target launch', data.targetDate))
    if (data.scope) rows.push(row('Scope', data.scope))
    if (data.budgetRange) rows.push(row('Budget', data.budgetRange))
  }

  if (data.enquiryType === 'event') {
    if (data.eventDate) rows.push(row('Event date', data.eventDate))
    if (data.eventLocation) rows.push(row('Location', data.eventLocation))
    if (data.audienceType) rows.push(row('Audience', data.audienceType))
    if (data.audienceSize) rows.push(row('Audience size', data.audienceSize))
    if (data.roleRequired) rows.push(row('Role required', data.roleRequired))
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background:#06070a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#06070a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#0e1216;border:1px solid #1e252c;border-radius:4px;">

          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #1e252c;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;">
                    <img src="${LOGO_URL}" width="36" height="36" alt="${escapeHtml(siteConfig.name)}" style="display:block;border:0;" />
                  </td>
                  <td>
                    <div style="color:#f3f0e8;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;">${escapeHtml(siteConfig.name)}</div>
                    <div style="color:#8b93a1;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;padding-top:3px;">New enquiry</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Helvetica,Arial,sans-serif;">
                ${rows.join('')}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 28px;">
              <div style="border-top:1px solid #1e252c;padding-top:20px;color:#f3f0e8;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;">
                ${toParagraphs(data.message)}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid #1e252c;">
              <div style="color:#8b93a1;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;">
                Reply directly to this email to reach
                <a href="mailto:${escapeHtml(data.email)}" style="color:#f4b942;text-decoration:none;">${escapeHtml(data.name)}</a>.
                Sent from the contact form at
                <a href="${siteConfig.url}" style="color:#f4b942;text-decoration:none;">mohdaslam.dev</a>.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
