import { contactSchema } from '@/lib/validation/contact'

const base = {
  name: 'Jamie Tan',
  email: 'jamie@example.com',
  enquiryType: 'event',
  message:
    'We are running a student hackathon in October and need a host for the opening segment.',
  website: '',
}

describe('contact schema', () => {
  it('accepts a well-formed enquiry', () => {
    expect(contactSchema.safeParse(base).success).toBe(true)
  })

  it('rejects a malformed email', () => {
    const result = contactSchema.safeParse({ ...base, email: 'jamie-at-example' })
    expect(result.success).toBe(false)
  })

  it('rejects a message too short to reply to usefully', () => {
    const result = contactSchema.safeParse({ ...base, message: 'hi' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown enquiry type', () => {
    const result = contactSchema.safeParse({ ...base, enquiryType: 'spam' })
    expect(result.success).toBe(false)
  })

  it('accepts the optional event fields', () => {
    const result = contactSchema.safeParse({
      ...base,
      eventDate: '2026-10-17',
      eventLocation: 'Singapore',
      audienceType: 'Students',
      audienceSize: '120',
      roleRequired: 'Host',
    })
    expect(result.success).toBe(true)
  })

  /**
   * The honeypot is a max-length-zero string. The action treats any value as
   * a bot and discards the submission, so this must not parse.
   */
  it('rejects a filled honeypot', () => {
    const result = contactSchema.safeParse({ ...base, website: 'http://spam.example' })
    expect(result.success).toBe(false)
  })

  /**
   * Regression guard. React injects hidden $ACTION_* inputs into a Server
   * Action form; the schema is strict, so parsing raw FormData entries would
   * fail on every real submission. The action must read an explicit
   * allowlist instead.
   */
  it('rejects React internal action fields, proving strict mode is active', () => {
    const result = contactSchema.safeParse({ ...base, $ACTION_KEY: 'k' })
    expect(result.success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    const result = contactSchema.safeParse({ ...base, name: '  Jamie Tan  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('Jamie Tan')
  })
})
