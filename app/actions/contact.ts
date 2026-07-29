'use server'

import { headers } from 'next/headers'

import {
  EmailNotConfiguredError,
  isEmailConfigured,
  sendTransactionalEmail,
} from '@/lib/email/brevo'
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

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>
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

  if (!isEmailConfigured()) {
    // Honest unavailable state rather than a fake success. The form is fully
    // testable now and goes live the moment the Brevo keys are set.
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
      textContent: formatEnquiry(data),
    })
  } catch (error) {
    // Log the failure class only. The message body is never logged (PRD s21.2).
    console.error(
      'Contact form delivery failed:',
      error instanceof EmailNotConfiguredError ? 'not configured' : 'send error',
    )
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
