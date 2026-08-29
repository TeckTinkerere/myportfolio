/**
 * Guards the Brevo configuration check.
 *
 * This exists because production had BREVO_SENDER_EMAIL and
 * BREVO_SENDER_NAME set but not BREVO_API_KEY or a recipient, and the form
 * reported a single generic "not configured" for every cause — which made
 * the real problem undiagnosable. These tests pin down that the check names
 * exactly what is missing, and never leaks a value.
 */
const REQUIRED = ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'CONTACT_RECIPIENT_EMAIL'] as const

const ORIGINAL = { ...process.env }

function setEnv(vars: Record<string, string | undefined>) {
  for (const key of [...REQUIRED, 'SUPPORT_EMAIL', 'BREVO_SENDER_NAME', 'APP_NAME']) {
    delete process.env[key]
  }
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) process.env[key] = value
  }
}

/** The module reads process.env at call time, but re-import to be safe. */
async function loadMissing() {
  jest.resetModules()
  const mod = await import('@/lib/email/brevo')
  return mod.missingEmailConfig()
}

afterAll(() => {
  process.env = ORIGINAL
})

describe('Brevo configuration check', () => {
  it('reports every required variable when nothing is set', async () => {
    setEnv({})
    const missing = await loadMissing()
    expect(missing).toHaveLength(3)
    expect(missing.join(' ')).toContain('BREVO_API_KEY')
    expect(missing.join(' ')).toContain('BREVO_SENDER_EMAIL')
    expect(missing.join(' ')).toContain('CONTACT_RECIPIENT_EMAIL')
  })

  /** Exactly the production state that prompted this. */
  it('identifies the api key and recipient when only sender details are set', async () => {
    setEnv({ BREVO_SENDER_EMAIL: 'sender@example.com', BREVO_SENDER_NAME: 'Portfolio' })
    const missing = await loadMissing()
    expect(missing.join(' ')).toContain('BREVO_API_KEY')
    expect(missing.join(' ')).toContain('CONTACT_RECIPIENT_EMAIL')
    expect(missing.join(' ')).not.toContain('BREVO_SENDER_EMAIL')
  })

  it('accepts SUPPORT_EMAIL as the recipient alias', async () => {
    setEnv({
      BREVO_API_KEY: 'key',
      BREVO_SENDER_EMAIL: 'sender@example.com',
      SUPPORT_EMAIL: 'inbox@example.com',
    })
    expect(await loadMissing()).toHaveLength(0)
  })

  it('passes when all three are set explicitly', async () => {
    setEnv({
      BREVO_API_KEY: 'key',
      BREVO_SENDER_EMAIL: 'sender@example.com',
      CONTACT_RECIPIENT_EMAIL: 'inbox@example.com',
    })
    expect(await loadMissing()).toHaveLength(0)
  })

  it('treats an empty string as missing, not as configured', async () => {
    setEnv({ BREVO_API_KEY: '', BREVO_SENDER_EMAIL: '', CONTACT_RECIPIENT_EMAIL: '' })
    expect(await loadMissing()).toHaveLength(3)
  })

  it('never includes a secret value in the diagnostic', async () => {
    setEnv({ BREVO_SENDER_EMAIL: 'sender@example.com' })
    const report = (await loadMissing()).join(' ')
    expect(report).not.toContain('sender@example.com')
    // Only variable names, so no value can appear.
    expect(report).not.toMatch(/@/)
  })
})
