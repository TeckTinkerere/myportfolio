import 'server-only'

/**
 * Brevo transactional email over plain fetch — no SDK, no extra dependency.
 *
 * BREVO_API_KEY is read on the server only and is never referenced from a
 * client component, so it cannot leak into the bundle.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('BREVO_API_KEY is not set')
    this.name = 'EmailNotConfiguredError'
  }
}

export class EmailSendError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailSendError'
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY)
}

export async function sendTransactionalEmail({
  subject,
  textContent,
  htmlContent,
  replyTo,
}: {
  subject: string
  /** Always sent. Many clients block remote images, so this is the fallback. */
  textContent: string
  htmlContent?: string
  replyTo?: { email: string; name?: string }
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new EmailNotConfiguredError()

  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL
  if (!senderEmail || !recipientEmail) throw new EmailNotConfiguredError()

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME ?? 'Portfolio' },
      to: [{ email: recipientEmail }],
      // The visitor's address goes in replyTo, not sender — sending as them
      // would fail SPF and land the message in spam.
      ...(replyTo ? { replyTo } : {}),
      subject,
      textContent,
      ...(htmlContent ? { htmlContent } : {}),
    }),
    // Never let a hanging provider hold a request open indefinitely.
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    // Log the status, not the body: the body can echo submitted content.
    throw new EmailSendError(`Brevo responded with ${response.status}`)
  }
}
