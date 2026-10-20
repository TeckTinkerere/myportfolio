import type { CardDoc } from './schema'

/**
 * vCard 3.0 for the Save Contact button.
 *
 * 3.0 rather than 4.0 because iOS Contacts and most Android contact apps
 * handle it most consistently, including an inline base64 PHOTO.
 */

/** Escape a text value per RFC 2426 s4. */
export function escapeValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** Fold lines longer than 75 octets, as the spec requires. */
export function foldLine(line: string): string {
  if (line.length <= 75) return line
  const parts: string[] = [line.slice(0, 75)]
  for (let i = 75; i < line.length; i += 74) parts.push(' ' + line.slice(i, i + 74))
  return parts.join('\r\n')
}

export interface VCardPhoto {
  base64: string
  type: 'JPEG' | 'PNG' | 'WEBP' | 'GIF'
}

export function buildVCard(doc: CardDoc, cardUrl: string, photo?: VCardPhoto): string {
  const h = doc.header
  const [first, ...rest] = h.name.trim().split(/\s+/)
  const last = rest.join(' ')

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']
  lines.push(`N:${escapeValue(last)};${escapeValue(first ?? '')};;;`)
  lines.push(`FN:${escapeValue(h.name)}`)
  if (h.company) lines.push(`ORG:${escapeValue(h.company)}`)
  if (h.title) lines.push(`TITLE:${escapeValue(h.title)}`)

  // Primary details first, then anything listed in contact widgets, with
  // duplicates removed so the same number is not saved twice.
  const seen = new Set<string>()
  const add = (key: string, line: string) => {
    const k = key.toLowerCase().replace(/[^\w@+.]/g, '')
    if (seen.has(k)) return
    seen.add(k)
    lines.push(line)
  }

  if (h.phone) add(`tel:${h.phone}`, `TEL;TYPE=CELL:${escapeValue(h.phone)}`)
  if (h.email) add(`email:${h.email}`, `EMAIL;TYPE=INTERNET:${escapeValue(h.email)}`)
  if (h.website) add(`url:${h.website}`, `URL:${escapeValue(h.website)}`)
  if (h.address) add(`adr:${h.address}`, `ADR;TYPE=WORK:;;${escapeValue(h.address)};;;;`)

  for (const w of doc.widgets) {
    if (w.hidden) continue
    if (w.type === 'contact') {
      for (const item of w.items) {
        const v = item.value
        if (item.kind === 'phone' || item.kind === 'whatsapp') add(`tel:${v}`, `TEL;TYPE=CELL:${escapeValue(v)}`)
        else if (item.kind === 'email') add(`email:${v}`, `EMAIL;TYPE=INTERNET:${escapeValue(v)}`)
        else if (item.kind === 'website') add(`url:${v}`, `URL:${escapeValue(v)}`)
        else if (item.kind === 'address') add(`adr:${v}`, `ADR;TYPE=WORK:;;${escapeValue(v)};;;;`)
      }
    }
    if (w.type === 'social') {
      for (const item of w.items) add(`url:${item.url}`, `URL:${escapeValue(item.url)}`)
    }
  }

  add(`url:${cardUrl}`, `URL:${escapeValue(cardUrl)}`)
  if (photo) lines.push(`PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.base64}`)
  lines.push('END:VCARD')

  return lines.map(foldLine).join('\r\n') + '\r\n'
}

/** A safe download filename, e.g. "Mohamed-Aslam.vcf". */
export function vcardFilename(name: string): string {
  const base = name.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return `${base || 'contact'}.vcf`
}
