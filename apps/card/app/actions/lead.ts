'use server'

import { createHash } from 'node:crypto'

import { z } from 'zod'

import { getOwnerEmail, getPublishedCard, insertLead, recentLeadCounts } from '@/lib/data'
import { emailConfigured, sendEmail } from '@/lib/email'
import { requireEnv, siteUrl } from '@/lib/env'
import { clientIp } from '@/lib/throttle'

export type LeadState =
  | { status: 'idle' }
  | { status: 'sent' }
  | { status: 'error'; message: string }

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(80),
  email: z.string().trim().email('Please enter a valid email.').max(200),
  designation: z.string().trim().max(80).optional(),
  company: z.string().trim().max(80).optional(),
  mobile: z.string().trim().max(40).optional(),
  message: z.string().trim().max(1000).optional(),
})

const PER_SENDER_PER_HOUR = 3
const PER_PROFILE_PER_HOUR = 30

/**
 * A visitor sending their details through a card's contact form.
 *
 * Spam defences, cheapest first: a honeypot field, then per-sender and
 * per-card hourly limits keyed on a daily-salted hash. The raw IP is never
 * stored.
 */
export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  // Bots that fill every field get a quiet success and store nothing.
  if (String(form.get('website') ?? '') !== '') return { status: 'sent' }

  const handle = String(form.get('handle') ?? '')
  const card = await getPublishedCard(handle)
  const widget = card?.doc.widgets.find((w) => w.type === 'form' && !w.hidden)
  if (!card || !widget || widget.type !== 'form') {
    return { status: 'error', message: 'This card is not accepting messages.' }
  }

  const consent = String(form.get('consent') ?? '')
  if (!consent) return { status: 'error', message: 'Please tick the consent box to send.' }

  const raw = (key: string) => {
    const v = form.get(key)
    return typeof v === 'string' && v.trim() ? v : undefined
  }
  const parsed = leadSchema.safeParse({
    name: raw('name'),
    email: raw('email'),
    // Only keep the fields this card actually asks for.
    designation: widget.fields.designation ? raw('designation') : undefined,
    company: widget.fields.company ? raw('company') : undefined,
    mobile: widget.fields.mobile ? raw('mobile') : undefined,
    message: widget.fields.message ? raw('message') : undefined,
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }

  // IP only: including the User-Agent let a sender reset their limit by
  // changing it on each request.
  const day = new Date().toISOString().slice(0, 10)
  const senderHash = createHash('sha256')
    .update(`${requireEnv('LEAD_HASH_SALT')}:${day}:${await clientIp()}`)
    .digest('hex')

  const counts = await recentLeadCounts(card.id, senderHash)
  if (counts.sender >= PER_SENDER_PER_HOUR || counts.profile >= PER_PROFILE_PER_HOUR) {
    return { status: 'error', message: 'Too many messages right now. Please try again later.' }
  }

  const fields = Object.fromEntries(
    Object.entries(parsed.data).filter((e): e is [string, string] => typeof e[1] === 'string'),
  )
  // The consent text is rebuilt server-side so a tampered form cannot store
  // different wording from what the card shows.
  const consentText = `I agree to share these details with ${card.doc.header.name} so they can contact me.`
  await insertLead(card.id, fields, consentText, senderHash)

  await notifyOwner(card.id, card.doc.header.name, fields).catch((err: unknown) =>
    console.error('Lead notification failed', err instanceof Error ? err.message : 'unknown error'),
  )

  return { status: 'sent' }
}

/** Visitor text in a header field: no control characters, one short line. */
function singleLine(value: string): string {
  const isControl = (n: number) => n < 0x20 || (n >= 0x7f && n <= 0x9f) || n === 0x2028 || n === 0x2029
  return Array.from(value, (c) => (isControl(c.codePointAt(0) ?? 0) ? ' ' : c))
    .join('')
    .replace(/ {2,}/g, ' ')
    .trim()
    .slice(0, 80)
}

/** Email the card owner through Brevo. Skipped when email is not configured. */
async function notifyOwner(profileId: string, cardName: string, fields: Record<string, string>) {
  if (!emailConfigured()) return
  const to = await getOwnerEmail(profileId)
  if (!to) return

  const lines = Object.entries(fields).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`)
  await sendEmail({
    to,
    replyTo: fields.email,
    subject: `New contact from your card: ${singleLine(fields.name ?? '')}`,
    text: [
      `Someone sent their details through ${cardName}'s card.`,
      '',
      ...lines,
      '',
      `See all submissions: ${siteUrl()}/edit`,
      'Reply to this email to answer them directly.',
    ].join('\n'),
  })
}
