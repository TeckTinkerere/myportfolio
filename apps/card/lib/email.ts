import 'server-only'

import { optionalEnv } from './env'

/**
 * Transactional email through Brevo's HTTP API.
 *
 * Optional by design: without BREVO_API_KEY and EMAIL_FROM nothing is sent
 * and the caller carries on (contact-form submissions still reach the
 * inbox). Auth emails such as password resets are sent by Neon Auth, which
 * can be pointed at Brevo's SMTP relay separately; see apps/card/README.md.
 */
export interface Email {
  to: string
  subject: string
  text: string
  replyTo?: string
}

export function emailConfigured(): boolean {
  return Boolean(optionalEnv('BREVO_API_KEY') && optionalEnv('EMAIL_FROM'))
}

export async function sendEmail(email: Email): Promise<boolean> {
  const key = optionalEnv('BREVO_API_KEY')
  const from = optionalEnv('EMAIL_FROM')
  if (!key || !from) return false

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: from, name: optionalEnv('EMAIL_FROM_NAME') ?? 'Cards' },
      to: [{ email: email.to }],
      ...(email.replyTo ? { replyTo: { email: email.replyTo } } : {}),
      subject: email.subject,
      textContent: email.text,
    }),
  })
  if (!res.ok) {
    throw new Error(`Brevo responded ${res.status}: ${(await res.text()).slice(0, 300)}`)
  }
  return true
}
