import 'server-only'

/**
 * Brevo transactional email over plain fetch — no SDK, no extra dependency.
 *
 * Configuration is read here and nowhere else, and the diagnostics name the
 * missing variables. An earlier version reported every failure as a single
 * generic "not configured", which made a real misconfiguration in production
 * impossible to diagnose from the outside.
 *
 * Nothing here is referenced from a client component, so no key can reach
 * the browser.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

/** Where enquiries are delivered. SUPPORT_EMAIL is accepted as an alias. */
function recipient(): string | undefined {
  return process.env.CONTACT_RECIPIENT_EMAIL || process.env.SUPPORT_EMAIL
}

/**
 * Which required settings are absent. Returns variable NAMES only — never
 * values — so this is safe to log.
 */
export function missingEmailConfig(): string[] {
  const missing: string[] = []
  if (!process.env.BREVO_API_KEY) missing.push('BREVO_API_KEY')
  if (!process.env.BREVO_SENDER_EMAIL) missing.push('BREVO_SENDER_EMAIL')
  if (!recipient()) missing.push('CONTACT_RECIPIENT_EMAIL (or SUPPORT_EMAIL)')
  return missing
}

export function isEmailConfigured(): boolean {
  return missingEmailConfig().length === 0
}

export class EmailNotConfiguredError extends Error {
  readonly missing: string[]
  constructor(missing: string[]) {
    super(`Brevo is not configured. Missing: ${missing.join(', ')}`)
    this.name = 'EmailNotConfiguredError'
    this.missing = missing
  }
}

export class EmailSendError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'EmailSendError'
    this.status = status
  }
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
  const missing = missingEmailConfig()
  if (missing.length > 0) throw new EmailNotConfiguredError(missing)

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: process.env.BREVO_SENDER_NAME ?? process.env.APP_NAME ?? 'Portfolio',
      },
      to: [{ email: recipient()! }],
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
    /**
     * Brevo returns a JSON body with a machine-readable `code` — most often
     * `unauthorized` for a bad key or `invalid_parameter` for an unverified
     * sender. Both are configuration problems that look identical without
     * this, so the code is surfaced. The body is read but never logged
     * wholesale, since it can echo submitted content.
     */
    let code: string | undefined
    try {
      const body = (await response.json()) as { code?: string }
      code = body?.code
    } catch {
      // Non-JSON error body; the status alone will have to do.
    }

    throw new EmailSendError(
      code
        ? `Brevo rejected the request: ${response.status} ${code}`
        : `Brevo responded with ${response.status}`,
      response.status,
    )
  }
}
