import { z } from 'zod'

/**
 * Shared between the client form and the server action. The client uses it
 * for immediate feedback; the server re-validates from scratch, because
 * client validation is a convenience and never a control.
 */

export const ENQUIRY_TYPES = {
  technical: 'Technical opportunity',
  website: 'Website or product project',
  event: 'Event hosting or facilitation',
  community: 'Community partnership',
  other: 'Other',
} as const

export type EnquiryType = keyof typeof ENQUIRY_TYPES

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'Please tell me your name.').max(120),
    email: z.string().trim().email('That email address does not look right.').max(200),
    organisation: z.string().trim().max(160).optional().or(z.literal('')),
    enquiryType: z.enum(
      Object.keys(ENQUIRY_TYPES) as [EnquiryType, ...EnquiryType[]],
      { errorMap: () => ({ message: 'Please choose an enquiry type.' }) },
    ),
    message: z
      .string()
      .trim()
      .min(20, 'A little more detail would help me reply usefully.')
      .max(4000, 'That is longer than the form accepts — email me directly instead.'),

    // Website / product enquiries
    targetDate: z.string().trim().max(80).optional().or(z.literal('')),
    scope: z.string().trim().max(400).optional().or(z.literal('')),
    budgetRange: z.string().trim().max(120).optional().or(z.literal('')),

    // Event enquiries
    eventDate: z.string().trim().max(80).optional().or(z.literal('')),
    eventLocation: z.string().trim().max(160).optional().or(z.literal('')),
    audienceType: z.string().trim().max(160).optional().or(z.literal('')),
    audienceSize: z.string().trim().max(80).optional().or(z.literal('')),
    roleRequired: z.string().trim().max(160).optional().or(z.literal('')),

    /**
     * Honeypot. Hidden from sighted users and from assistive technology, so
     * only an automated submitter fills it. Any value means discard.
     */
    website: z.string().max(0).optional().or(z.literal('')),
  })
  .strict()

export type ContactInput = z.infer<typeof contactSchema>

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /** Field-level errors, keyed by input name. */
  errors?: Partial<Record<keyof ContactInput, string>>
  /** Echoed back so a validation failure never wipes what was typed. */
  values?: Partial<Record<keyof ContactInput, string>>
}
