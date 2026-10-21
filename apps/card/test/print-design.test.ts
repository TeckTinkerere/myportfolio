/**
 * @jest-environment node
 */
import { printIssues } from '@/lib/design/checks'
import { BLEED, cardSize, EXPORT_DPI, mmToPx } from '@/lib/design/dimensions'
import { buildPdf } from '@/lib/design/pdf'
import { elementText, qrValue, type DesignContext } from '@/lib/design/resolve'
import { designSchema, type DesignDoc } from '@/lib/design/schema'
import { applyTemplate, defaultDesign, TEMPLATES } from '@/lib/design/templates'

const ctx: DesignContext = {
  card: { name: 'Mohamed Aslam', title: 'Chief Executive Officer', company: 'LocalLoco', phone: '+65 9343 0467', email: 'a@b.co', website: 'https://mohdaslam.dev' },
  cardUrl: 'https://card.mohdaslam.dev/aslam',
  siteUrl: 'https://card.mohdaslam.dev',
}

describe('templates', () => {
  it.each(TEMPLATES.map((t) => [t.name, t]))('%s builds a valid design', (_name, t) => {
    const doc = applyTemplate(t)
    expect(designSchema.safeParse(doc).success).toBe(true)
    expect(doc.front.elements.length + doc.back.elements.length).toBeGreaterThan(2)
  })

  it.each(TEMPLATES.map((t) => [t.name, t]))('%s passes the print check with real card details', (_name, t) => {
    expect(printIssues(applyTemplate(t), ctx)).toEqual([])
  })

  it('gives every element a unique id', () => {
    const doc = defaultDesign()
    const ids = [...doc.front.elements, ...doc.back.elements].map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('bound text and QR', () => {
  it('follows the card and falls back to the element text', () => {
    const doc = defaultDesign()
    const name = doc.front.elements.find((e) => e.type === 'text' && e.binding === 'name')
    expect(name && name.type === 'text' && elementText(name, ctx)).toBe('Mohamed Aslam')
    const url = { ...(name as Extract<typeof name, { type: 'text' }>), binding: 'handleUrl' as const }
    expect(elementText(url, ctx)).toBe('card.mohdaslam.dev/aslam')
  })

  it('encodes the tag link when a tag is chosen, else the card link', () => {
    const doc = defaultDesign()
    const qr = doc.back.elements.find((e) => e.type === 'qr')
    if (!qr || qr.type !== 'qr') throw new Error('no qr')
    expect(qrValue(qr, ctx)).toBe('https://card.mohdaslam.dev/aslam')
    expect(qrValue({ ...qr, target: 'tag', tagId: 'k7m2x9qa' }, ctx)).toBe('https://card.mohdaslam.dev/t/k7m2x9qa')
    expect(qrValue({ ...qr, target: 'custom', url: 'javascript:alert(1)' }, ctx)).toBe('https://card.mohdaslam.dev/aslam')
  })
})

describe('print check', () => {
  const withElement = (patch: Record<string, unknown>): DesignDoc => {
    const doc = defaultDesign()
    doc.back.elements = doc.back.elements.map((e) => (e.type === (patch.type ?? e.type) ? ({ ...e, ...patch } as typeof e) : e))
    return doc
  }

  it('flags a QR code too small to scan', () => {
    const issues = printIssues(withElement({ type: 'qr', w: 10, h: 10 }), ctx)
    expect(issues.some((i) => i.level === 'error' && /QR code is 10\.0mm/.test(i.message))).toBe(true)
  })

  it('flags text in the trim zone and tiny type', () => {
    const doc = defaultDesign()
    const t = doc.back.elements.find((e) => e.type === 'text')!
    Object.assign(t, { x: 0.5, size: 5 })
    const messages = printIssues(doc, ctx).map((i) => i.message).join(' ')
    expect(messages).toMatch(/outside the safe area/)
    expect(messages).toMatch(/5pt/)
  })

  it('explains an empty linked box in terms of the card field', () => {
    const issues = printIssues(applyTemplate(TEMPLATES.find((t) => t.id === 'aurora')!), { ...ctx, card: { ...ctx.card, company: '' } })
    expect(issues.map((i) => i.message)).toContain(
      'The company box is empty because your card has no company. Add it on your card, or delete the box.',
    )
  })

  it('flags an image that will print soft', () => {
    const doc = defaultDesign()
    doc.front.elements.push({
      id: 'img', type: 'image', src: 'https://x.aws.neon.tech/b/logo.webp', fit: 'contain', radius: 0, opacity: 1,
      x: 10, y: 10, w: 40, h: 20, rotation: 0, hidden: false, locked: false, naturalW: 200, naturalH: 100,
    })
    expect(printIssues(doc, ctx).some((i) => /dpi/.test(i.message))).toBe(true)
  })
})

describe('print PDF', () => {
  // The smallest valid JPEG-like payload; the writer only embeds the bytes.
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
  const { w, h } = cardSize('landscape')

  it('writes a two-page PDF with trim and bleed boxes and a valid xref', () => {
    const px = { w: mmToPx(w + BLEED * 2, EXPORT_DPI), h: mmToPx(h + BLEED * 2, EXPORT_DPI) }
    const pdf = buildPdf(
      [
        { jpeg, pixelWidth: px.w, pixelHeight: px.h },
        { jpeg, pixelWidth: px.w, pixelHeight: px.h },
      ],
      { trimWidthMm: w, trimHeightMm: h, bleedMm: BLEED, cropMarks: true },
    )
    const text = Buffer.from(pdf).toString('latin1')
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true)
    expect(text).toContain('/Count 2')
    expect(text.match(/\/TrimBox/g)).toHaveLength(2)
    expect(text).toContain('/Filter /DCTDecode')

    // Every xref offset must point at the start of its object.
    const xrefAt = Number(text.match(/startxref\n(\d+)/)![1])
    const entries = text.slice(xrefAt).split('\n').slice(3).filter((l) => / n $/.test(l))
    entries.forEach((line, i) => {
      const offset = Number(line.slice(0, 10))
      expect(text.slice(offset, offset + 12)).toMatch(new RegExp(`^${i + 1} 0 obj`))
    })
  })

  it('sizes the page to trim plus bleed when crop marks are off', () => {
    const pdf = Buffer.from(buildPdf([{ jpeg, pixelWidth: 10, pixelHeight: 10 }], { trimWidthMm: w, trimHeightMm: h, bleedMm: BLEED, cropMarks: false })).toString('latin1')
    const media = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/)!
    expect(Number(media[1])).toBeCloseTo(((w + BLEED * 2) * 72) / 25.4, 1)
    expect(Number(media[2])).toBeCloseTo(((h + BLEED * 2) * 72) / 25.4, 1)
  })
})
