import type { CardDoc } from '../card/schema'

import type { Binding, DesignElement } from './schema'

/** What the design needs from the digital card. */
export interface DesignContext {
  card: Pick<CardDoc['header'], 'name' | 'title' | 'company' | 'phone' | 'email' | 'website'>
  /** Absolute URL of the public card, e.g. https://card.mohdaslam.dev/aslam */
  cardUrl: string
  /** Origin for tag links, e.g. https://card.mohdaslam.dev */
  siteUrl: string
}

export const BINDING_LABELS: Record<Binding, string> = {
  name: 'Name',
  title: 'Title',
  company: 'Company',
  phone: 'Phone',
  email: 'Email',
  website: 'Website',
  handleUrl: 'Card link',
}

const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export function bindingValue(binding: Binding, ctx: DesignContext): string {
  if (binding === 'handleUrl') return bare(ctx.cardUrl)
  if (binding === 'website') return bare(ctx.card.website)
  return ctx.card[binding]
}

/** The text an element actually shows: its binding if set, else its own text. */
export function elementText(el: Extract<DesignElement, { type: 'text' }>, ctx: DesignContext): string {
  const raw = el.binding ? bindingValue(el.binding, ctx) || el.text : el.text
  return el.uppercase ? raw.toUpperCase() : raw
}

/** The URL a QR element encodes. */
export function qrValue(el: Extract<DesignElement, { type: 'qr' }>, ctx: DesignContext): string {
  if (el.target === 'tag' && el.tagId) return `${ctx.siteUrl}/t/${el.tagId}`
  if (el.target === 'custom' && /^https?:\/\//i.test(el.url)) return el.url
  return ctx.cardUrl
}
