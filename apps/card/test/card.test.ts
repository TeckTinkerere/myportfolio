import { contrast, readableOn } from '@/lib/card/color'
import { newCard, newWidget } from '@/lib/card/defaults'
import { handleProblem } from '@/lib/card/handles'
import { contactHref, dialable, embedSrc, quickActionLinks, socialDisplay } from '@/lib/card/links'
import { cardSchema, type CardDoc, type WidgetType } from '@/lib/card/schema'
import { sameDoc } from '@/lib/card/stable'
import { newTagId, TAG_PATTERN } from '@/lib/card/tags'
import { buildVCard, escapeValue, foldLine, vcardFilename } from '@/lib/card/vcard'

function card(overrides: Partial<CardDoc['header']> = {}, widgets: CardDoc['widgets'] = []): CardDoc {
  const doc = newCard('Mohamed Aslam')
  return { ...doc, header: { ...doc.header, ...overrides }, widgets }
}

describe('card schema', () => {
  it('fills defaults for a minimal document', () => {
    const doc = cardSchema.parse({ header: { name: 'A B' }, theme: { background: {} }, meta: {} })
    expect(doc.theme.template).toBe('classic')
    expect(doc.meta.noindex).toBe(true)
    expect(doc.header.quickActions).toEqual(['call', 'email', 'share'])
  })

  it('accepts every widget type as created by the editor', () => {
    const types: WidgetType[] = ['heading', 'text', 'contact', 'social', 'link', 'embed', 'booking', 'form']
    for (const t of types) {
      const w = newWidget(t)
      // Editor placeholders for links are deliberately incomplete; fill them.
      if (w.type === 'link' || w.type === 'booking') w.url = 'https://example.com'
      if (w.type === 'embed') w.url = 'https://youtu.be/dQw4w9WgXcQ'
      expect(cardSchema.safeParse(card({}, [w])).success).toBe(true)
    }
  })

  it('rejects non-http links, so javascript: URLs never reach an href', () => {
    const doc = card({}, [{ id: 'a', hidden: false, type: 'link', label: 'x', url: 'javascript:alert(1)' }])
    expect(cardSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects embeds from hosts other than YouTube and Spotify', () => {
    const doc = card({}, [{ id: 'a', hidden: false, type: 'embed', url: 'https://evil.example/embed' }])
    expect(cardSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects duplicate quick actions and bad colours', () => {
    expect(cardSchema.safeParse(card({ quickActions: ['call', 'call'] })).success).toBe(false)
    const doc = card()
    expect(cardSchema.safeParse({ ...doc, theme: { ...doc.theme, accent: 'red' } }).success).toBe(false)
  })
})

describe('handles', () => {
  it.each(['aslam', 'mohamed-aslam', 'a1b', 'x'.repeat(32)])('accepts %s', (h) => {
    expect(handleProblem(h)).toBeNull()
  })

  it.each(['ab', '-aslam', 'aslam-', 'as--lam', 'Aslam!', 'edit', 'admin', 't', 'x'.repeat(33)])('rejects %s', (h) => {
    expect(handleProblem(h)).not.toBeNull()
  })
})

describe('links', () => {
  it('normalises phone numbers for tel: and WhatsApp', () => {
    expect(dialable('+65 9343 0467')).toBe('+6593430467')
    expect(contactHref('phone', '+65 9343 0467')).toBe('tel:+6593430467')
    expect(contactHref('whatsapp', '+65 9343 0467')).toBe('https://wa.me/6593430467')
  })

  it('builds telegram, website and map links', () => {
    expect(contactHref('telegram', '@aslam')).toBe('https://t.me/aslam')
    expect(contactHref('website', 'mohdaslam.dev')).toBe('https://mohdaslam.dev')
    expect(contactHref('address', '1 Raffles Place')).toContain('query=1%20Raffles%20Place')
  })

  it('drops quick actions that have nothing to act on', () => {
    const links = quickActionLinks(['call', 'email', 'share'], { phone: '', email: 'a@b.co' })
    expect(links.map((l) => l.action)).toEqual(['email', 'share'])
  })

  it('maps YouTube and Spotify links to their embed hosts only', () => {
    expect(embedSrc('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(embedSrc('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(embedSrc('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')).toBe(
      'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT',
    )
    expect(embedSrc('https://vimeo.com/123')).toBeNull()
  })

  it('shortens social URLs for display', () => {
    expect(socialDisplay('https://www.linkedin.com/in/mohamed-aslam-abdul/')).toBe('in/mohamed-aslam-abdul')
  })
})

describe('vCard', () => {
  it('escapes special characters per RFC 2426', () => {
    expect(escapeValue('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne')
  })

  it('folds long lines at 75 characters', () => {
    const folded = foldLine('X'.repeat(200))
    for (const line of folded.split('\r\n')) expect(line.length).toBeLessThanOrEqual(75)
    expect(folded.replace(/\r\n /g, '')).toBe('X'.repeat(200))
  })

  it('includes primary and widget contacts without duplicates', () => {
    const doc = card({ phone: '+65 9343 0467', email: 'a@b.co', title: 'CEO', company: 'LocalLoco' }, [
      {
        id: 'c',
        hidden: false,
        type: 'contact',
        items: [
          { kind: 'email', value: 'a@b.co', label: '' },
          { kind: 'whatsapp', value: '+65 9343 0467', label: '' },
          { kind: 'email', value: 'work@b.co', label: '' },
        ],
      },
    ])
    const vcf = buildVCard(doc, 'https://card.mohdaslam.dev/aslam')
    expect(vcf).toMatch(/^BEGIN:VCARD\r\nVERSION:3\.0\r\n/)
    expect(vcf).toContain('N:Aslam;Mohamed;;;')
    expect(vcf).toContain('FN:Mohamed Aslam')
    expect(vcf).toContain('ORG:LocalLoco')
    expect(vcf).toContain('TITLE:CEO')
    expect(vcf.match(/^TEL/gm)).toHaveLength(1)
    expect(vcf.match(/^EMAIL/gm)).toHaveLength(2)
    expect(vcf).toContain('URL:https://card.mohdaslam.dev/aslam')
    expect(vcf.endsWith('END:VCARD\r\n')).toBe(true)
  })

  it('skips hidden widgets', () => {
    const doc = card({}, [
      { id: 'c', hidden: true, type: 'contact', items: [{ kind: 'phone', value: '+1 555', label: '' }] },
    ])
    expect(buildVCard(doc, 'https://x.test/a')).not.toContain('TEL')
  })

  it('makes safe filenames', () => {
    expect(vcardFilename('Mohamed Aslam')).toBe('Mohamed-Aslam.vcf')
    expect(vcardFilename('../../etc')).toBe('etc.vcf')
  })
})

describe('colour', () => {
  it('picks readable text on the accent', () => {
    expect(readableOn('#1d4ed8')).toBe('#ffffff')
    expect(readableOn('#fde68a')).toBe('#0b0b0f')
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })
})

describe('tags', () => {
  it('makes 8-character ids from an unambiguous alphabet', () => {
    for (let i = 0; i < 50; i++) {
      const id = newTagId()
      expect(id).toMatch(TAG_PATTERN)
      expect(id).not.toMatch(/[01ilo]/)
    }
  })
})

describe('stable comparison', () => {
  it('ignores key order, as jsonb does', () => {
    expect(sameDoc({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 })).toBe(true)
    expect(sameDoc({ a: [1, 2] }, { a: [2, 1] })).toBe(false)
  })
})
