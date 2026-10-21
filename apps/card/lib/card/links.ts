import type { ContactKind, QuickAction, SocialNetwork } from './schema'

/**
 * Turning stored values into links. Kept pure so the public page, the
 * editor preview and the vCard all agree on what a phone number means.
 */

/** Digits and a leading plus only: what tel: and wa.me accept. */
export function dialable(phone: string): string {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/[^\d]/g, '')
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

export function contactHref(kind: ContactKind, value: string): string {
  const v = value.trim()
  switch (kind) {
    case 'phone':
      return `tel:${dialable(v)}`
    case 'email':
      return `mailto:${v}`
    case 'whatsapp':
      return `https://wa.me/${dialable(v).replace(/^\+/, '')}`
    case 'telegram':
      return `https://t.me/${v.replace(/^@/, '').replace(/^https?:\/\/t\.me\//i, '')}`
    case 'website':
      return /^https?:\/\//i.test(v) ? v : `https://${v}`
    case 'address':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`
  }
}

/** What a contact row shows when the owner gave no label. */
export function contactDisplay(kind: ContactKind, value: string): string {
  if (kind === 'website') return value.replace(/^https?:\/\//i, '').replace(/\/$/, '')
  if (kind === 'telegram') return value.startsWith('@') ? value : `@${value}`
  return value
}

export const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  other: 'Link',
}

/** A short readable form of a profile URL, e.g. "in/mohamed-aslam-abdul". */
export function socialDisplay(url: string): string {
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/\/$/, '')
    return path.length > 1 ? path.slice(1) : u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export interface QuickActionLink {
  action: QuickAction
  label: string
  href: string | null
}

/** The number WhatsApp actions use: the WhatsApp field, else the phone. */
export function whatsappNumber(header: { phone: string; whatsapp?: string }): string {
  return (header.whatsapp || header.phone).trim()
}

/** A wa.me link, optionally with a message typed in for the sender. */
export function whatsappHref(number: string, message = ''): string {
  const base = contactHref('whatsapp', number)
  return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base
}

/**
 * The message a visitor sends after saving the card. "{name}" becomes the
 * owner's first name. A sensible default when the owner wrote none.
 */
export function followUpMessage(template: string, ownerName: string): string {
  const first = ownerName.trim().split(/\s+/)[0] ?? ''
  const text = template.trim() || 'Hi {name}, nice to meet you! I just saved your contact.'
  return text.replace(/\{name\}/g, first)
}

/**
 * Quick actions that have something to act on. A call button with no phone
 * number is dropped rather than rendered dead. Share has no href: it is
 * handled in the browser.
 */
export function quickActionLinks(
  actions: readonly QuickAction[],
  header: { phone: string; email: string; whatsapp?: string },
): QuickActionLink[] {
  const out: QuickActionLink[] = []
  const wa = whatsappNumber(header)
  for (const action of actions) {
    if (action === 'call' && header.phone) {
      out.push({ action, label: 'Call', href: contactHref('phone', header.phone) })
    } else if (action === 'email' && header.email) {
      out.push({ action, label: 'Email', href: contactHref('email', header.email) })
    } else if (action === 'whatsapp' && wa) {
      out.push({ action, label: 'WhatsApp', href: contactHref('whatsapp', wa) })
    } else if (action === 'share') {
      out.push({ action, label: 'Share', href: null })
    }
  }
  return out
}

/**
 * The iframe URL for a supported video or music link, or null. Only
 * YouTube and Spotify are allowed, through their official embed hosts.
 */
export function embedSrc(url: string): string | null {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')

  if (host === 'youtube.com') {
    const id = u.pathname === '/watch' ? u.searchParams.get('v') : u.pathname.match(/^\/(?:shorts|embed)\/([\w-]{6,})/)?.[1]
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1)
    return /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'open.spotify.com') {
    const m = u.pathname.match(/^\/(?:intl-[a-z-]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/)
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null
  }
  return null
}
