import type { ZodError } from 'zod'

import { WIDGET_LABELS } from './defaults'
import type { CardDoc } from './schema'

/** Where a field lives in the editor, in the words the editor uses. */
const HEADER_FIELDS: Record<string, string> = {
  name: 'Profile → Name',
  title: 'Profile → Title',
  company: 'Profile → Company',
  pronouns: 'Profile → Pronouns',
  phone: 'Profile → Phone',
  email: 'Profile → Email',
  website: 'Profile → Website',
  address: 'Profile → Address',
  whatsapp: 'Profile → WhatsApp number',
  saveLabel: 'Profile → Save button text',
  whatsappMessage: 'Profile → WhatsApp message',
}

/**
 * A validation problem as an editor user would describe it, e.g.
 * "Block 2 (Link button): Enter a full link, starting with https://" rather
 * than "widgets.1.url: …".
 */
export function describeIssue(error: ZodError, doc: CardDoc): string {
  const issue = error.issues[0]
  if (!issue) return 'Something on this card needs fixing.'
  const [section, key] = issue.path

  if (section === 'widgets' && typeof key === 'number') {
    const type = doc.widgets[key]?.type
    const label = type ? WIDGET_LABELS[type] : 'Block'
    return `Block ${key + 1} (${label}): ${issue.message}`
  }
  if (section === 'header' && typeof key === 'string') return `${HEADER_FIELDS[key] ?? 'Profile'}: ${issue.message}`
  if (section === 'theme') return `Style: ${issue.message}`
  if (section === 'meta') return `Settings: ${issue.message}`
  return issue.message
}
