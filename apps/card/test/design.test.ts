import { newCard } from '@/lib/card/defaults'
import { themeWarnings } from '@/lib/card/contrast'
import { followUpMessage, quickActionLinks, whatsappHref, whatsappNumber } from '@/lib/card/links'
import { cardSchema } from '@/lib/card/schema'
import { buildVCard } from '@/lib/card/vcard'

describe('older cards', () => {
  it('still parse, and pick up defaults for every new option', () => {
    // Shaped like a card published before these options existed.
    const old = {
      version: 1,
      header: { name: 'Mohamed Aslam', phone: '+65 9343 0467', quickActions: ['call', 'email', 'share'] },
      theme: { template: 'classic', accent: '#3b82f6', background: { from: '#0f172a', to: '#1e3a8a' }, text: 'light', buttons: 'rounded', font: 'sans' },
      meta: { title: '', description: '', noindex: true },
      widgets: [],
    }
    const doc = cardSchema.parse(old)
    expect(doc.theme.background.style).toBe('gradient')
    expect(doc.theme.rows).toBe('soft')
    expect(doc.theme.font).toBe('sans')
    expect(doc.header.afterSave).toBe('none')
    expect(doc.header.saveLabel).toBe('Save contact')
    expect(doc.meta.lang).toBe('en')
  })

  it('new cards default to the phone font, which downloads nothing', () => {
    expect(newCard('A B').theme.font).toBe('system')
  })
})

describe('WhatsApp follow-up', () => {
  it('uses the WhatsApp number when set, else the phone', () => {
    expect(whatsappNumber({ phone: '+65 1111 1111', whatsapp: '' })).toBe('+65 1111 1111')
    expect(whatsappNumber({ phone: '+65 1111 1111', whatsapp: '+60 12 345 6789' })).toBe('+60 12 345 6789')
  })

  it('builds a wa.me link with the message typed in', () => {
    expect(whatsappHref('+65 9343 0467', 'Hi Aslam & co')).toBe('https://wa.me/6593430467?text=Hi%20Aslam%20%26%20co')
    expect(whatsappHref('+65 9343 0467')).toBe('https://wa.me/6593430467')
  })

  it('fills {name} with the first name, with a default message', () => {
    expect(followUpMessage('Hey {name}!', 'Mohamed Aslam')).toBe('Hey Mohamed!')
    expect(followUpMessage('', 'Mohamed Aslam')).toContain('Hi Mohamed')
  })

  it('points the WhatsApp quick action at the WhatsApp number', () => {
    const [link] = quickActionLinks(['whatsapp'], { phone: '+65 1', email: '', whatsapp: '+60 2' })
    expect(link.href).toBe('https://wa.me/602')
  })

  it('saves a separate WhatsApp number into the contact too', () => {
    const doc = newCard('Mohamed Aslam')
    doc.header.phone = '+65 9343 0467'
    doc.header.whatsapp = '+60 12 345 6789'
    expect(buildVCard(doc, 'https://x.test/a').match(/^TEL/gm)).toHaveLength(2)
  })
})

describe('readability warnings', () => {
  const theme = () => newCard('A').theme

  it('passes the default dark theme', () => {
    expect(themeWarnings(theme())).toEqual([])
  })

  it('flags light text on a light background', () => {
    const t = theme()
    t.background = { ...t.background, from: '#f5f5f5', to: '#ffffff' }
    expect(themeWarnings(t).some((w) => w.includes('contrast'))).toBe(true)
  })

  it('flags a photo background with too little overlay', () => {
    const t = theme()
    t.background = { ...t.background, style: 'image', image: 'https://x.aws.neon.tech/b/p.webp', overlay: 10 }
    expect(themeWarnings(t)[0]).toMatch(/overlay/)
  })

  it('flags an accent whose label would be hard to read', () => {
    const t = theme()
    // Mid grey: neither white nor dark text reaches 4.5:1 on it.
    t.accent = '#777777'
    expect(themeWarnings(t).some((w) => w.includes('Save contact label'))).toBe(true)
  })
})
