'use server'

import { headers } from 'next/headers'

import {
  EmailNotConfiguredError,
  EmailSendError,
  missingEmailConfig,
  sendTransactionalEmail,
} from '@/lib/email/brevo'
import { renderEnquiryEmail } from '@/lib/email/templates'
import { checkRateLimit } from '@/lib/security/rate-limit'
import {
  ENQUIRY_TYPES,
  contactSchema,
  type ContactFormState,
  type ContactInput,
} from '@/lib/validation/contact'

/** Fields echoed back on failure so nothing typed is lost (PRD FR-07). */
const ECHOED_FIELDS = [
  'name',
  'email',
  'organisation',
  'enquiryType',
  'message',
  'targetDate',
  'scope',
  'budgetRange',
  'eventDate',
  'eventLocation',
  'audienceType',
  'audienceSize',
  'roleRequired',
] as const

/**
 * Read only the fields we know about.
 *
 * Not Object.fromEntries(formData): React injects its own hidden inputs
 * ($ACTION_REF, $ACTION_KEY and friends) into a Server Action form, and the
 * schema is strict, so those would fail validation on every submission. An
 * explicit allowlist also means no caller can smuggle in an extra key.
 */
function readFields(formData: FormData) {
  const out: Record<string, string> = {}
  for (const field of ECHOED_FIELDS) {
    const value = formData.get(field)
    if (typeof value === 'string') out[field] = value
  }
  const honeypot = formData.get('website')
  out.website = typeof honeypot === 'string' ? honeypot : ''
  return out
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = readFields(formData)
  const values = Object.fromEntries(
    ECHOED_FIELDS.map((field) => [field, raw[field] ?? '']),
  ) as ContactFormState['values']

  // Silently accept honeypot hits. Telling a bot it was detected only helps
  // it adapt, and a real person can never trigger this.
  if (raw.website) {
    return { status: 'success', message: 'Thanks — your message has been sent.' }
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    const errors: ContactFormState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput
      if (field && !errors[field]) errors[field] = issue.message
    }
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors,
      values,
    }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown'

  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return {
      status: 'error',
      message:
        'That is a few messages in a short time. Please wait a little, or email me directly.',
      values,
    }
  }

  const missing = missingEmailConfig()
  if (missing.length > 0) {
    // Names only, never values — safe to log, and this is the one line that
    // makes a production misconfiguration diagnosable from Vercel logs.
    console.error(`Contact form: Brevo not configured. Missing: ${missing.join(', ')}`)
    return {
      status: 'error',
      message:
        'The contact form is not connected to its email provider yet. Please email me directly in the meantime — the address is just below.',
      values,
    }
  }

  const data = parsed.data

  try {
    await sendTransactionalEmail({
      subject: `[${ENQUIRY_TYPES[data.enquiryType]}] ${data.name}`,
      replyTo: { email: data.email, name: data.name },
      // Both are sent. Clients that block remote images, or prefer plain
      // text, still get the whole enquiry.
      textContent: formatEnquiry(data),
      htmlContent: renderEnquiryEmail(data),
    })
  } catch (error) {
    /**
     * The reason is logged, the submitted content never is. Brevo's own
     * error code is included because the two common production failures —
     * a bad API key (401 unauthorized) and an unverified sender address
     * (400 invalid_parameter) — are indistinguishable without it.
     */
    if (error instanceof EmailNotConfiguredError) {
      console.error(`Contact form: missing config — ${error.missing.join(', ')}`)
    } else if (error instanceof EmailSendError) {
      console.error(`Contact form: ${error.message}`)
    } else if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('Contact form: Brevo request timed out after 10s')
    } else {
      console.error('Contact form: unexpected delivery failure')
    }

    return {
      status: 'error',
      message:
        'Something went wrong sending that. Please try again, or email me directly.',
      values,
    }
  }

  return {
    status: 'success',
    message: 'Thanks — your message has been sent. I usually reply within a day or two.',
  }
}

function formatEnquiry(data: ContactInput): string {
  const lines = [
    `Type: ${ENQUIRY_TYPES[data.enquiryType]}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ]

  if (data.organisation) lines.push(`Organisation: ${data.organisation}`)

  if (data.enquiryType === 'website') {
    if (data.targetDate) lines.push(`Target launch: ${data.targetDate}`)
    if (data.scope) lines.push(`Scope: ${data.scope}`)
    if (data.budgetRange) lines.push(`Budget: ${data.budgetRange}`)
  }

  if (data.enquiryType === 'event') {
    if (data.eventDate) lines.push(`Event date: ${data.eventDate}`)
    if (data.eventLocation) lines.push(`Location: ${data.eventLocation}`)
    if (data.audienceType) lines.push(`Audience: ${data.audienceType}`)
    if (data.audienceSize) lines.push(`Audience size: ${data.audienceSize}`)
    if (data.roleRequired) lines.push(`Role required: ${data.roleRequired}`)
  }

  lines.push('', '---', '', data.message)
  return lines.join('\n')
}
