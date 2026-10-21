/**
 * A minimal print PDF writer: one full-bleed JPEG per page, with proper
 * TrimBox and BleedBox and optional crop marks. Enough for a print shop or
 * card printer, without pulling a 30 MB PDF library into the app.
 */

const PT_PER_MM = 72 / 25.4

export interface PdfPage {
  /** JPEG bytes of the artwork including bleed. */
  jpeg: Uint8Array
  pixelWidth: number
  pixelHeight: number
}

export interface PdfOptions {
  trimWidthMm: number
  trimHeightMm: number
  bleedMm: number
  /** Adds a margin with crop marks at the trim corners. */
  cropMarks: boolean
  title?: string
}

const MARK_MARGIN_MM = 8
const MARK_LENGTH_MM = 5
const MARK_OFFSET_MM = 1 // gap between trim line and mark, past the bleed

const fmt = (n: number) => (Math.round(n * 1000) / 1000).toString()

export function buildPdf(pages: PdfPage[], o: PdfOptions): Uint8Array {
  const enc = new TextEncoder()
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0

  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? enc.encode(part) : part
    chunks.push(bytes)
    length += bytes.length
  }
  const object = (id: number, body: string | Uint8Array[]) => {
    offsets[id] = length
    push(`${id} 0 obj\n`)
    if (typeof body === 'string') push(body)
    else body.forEach(push)
    push('\nendobj\n')
  }

  const margin = o.cropMarks ? MARK_MARGIN_MM : 0
  const artW = o.trimWidthMm + o.bleedMm * 2
  const artH = o.trimHeightMm + o.bleedMm * 2
  const pageW = (artW + margin * 2) * PT_PER_MM
  const pageH = (artH + margin * 2) * PT_PER_MM
  const bleedBox = [margin, margin, margin + artW, margin + artH].map((v) => fmt(v * PT_PER_MM))
  const trimBox = [margin + o.bleedMm, margin + o.bleedMm, margin + o.bleedMm + o.trimWidthMm, margin + o.bleedMm + o.trimHeightMm].map((v) =>
    fmt(v * PT_PER_MM),
  )

  // Header. The second line's high bytes mark the file as binary.
  push('%PDF-1.4\n%âãÏÓ\n')

  const pageIds = pages.map((_, i) => 4 + i * 3)
  object(1, `<< /Type /Catalog /Pages 2 0 R >>`)
  object(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`)
  object(3, `<< /Title (${(o.title ?? 'Card').replace(/[()\\]/g, '')}) /Producer (card.mohdaslam.dev) >>`)

  pages.forEach((page, i) => {
    const pageId = pageIds[i]
    const contentId = pageId + 1
    const imageId = pageId + 2

    let content = `q ${fmt(artW * PT_PER_MM)} 0 0 ${fmt(artH * PT_PER_MM)} ${fmt(margin * PT_PER_MM)} ${fmt(margin * PT_PER_MM)} cm /Im0 Do Q\n`
    if (o.cropMarks) content += cropMarks(margin, o)

    object(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(pageW)} ${fmt(pageH)}] /BleedBox [${bleedBox.join(' ')}] /TrimBox [${trimBox.join(' ')}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
    object(contentId, `<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`)
    object(imageId, [
      enc.encode(
        `<< /Type /XObject /Subtype /Image /Width ${page.pixelWidth} /Height ${page.pixelHeight} /ColorSpace /DeviceRGB ` +
          `/BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`,
      ),
      page.jpeg,
      enc.encode('\nendstream'),
    ])
  })

  const count = 4 + pages.length * 3
  const xref = length
  push(`xref\n0 ${count}\n0000000000 65535 f \n`)
  for (let id = 1; id < count; id++) push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${count} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`)

  const out = new Uint8Array(length)
  let at = 0
  for (const c of chunks) {
    out.set(c, at)
    at += c.length
  }
  return out
}

/** Thin registration-black lines at each trim corner, outside the bleed. */
function cropMarks(margin: number, o: PdfOptions): string {
  const left = margin + o.bleedMm
  const bottom = margin + o.bleedMm
  const right = left + o.trimWidthMm
  const top = bottom + o.trimHeightMm
  const gap = o.bleedMm + MARK_OFFSET_MM
  const len = MARK_LENGTH_MM
  const lines: [number, number, number, number][] = []
  for (const x of [left, right]) {
    for (const y of [bottom, top]) {
      const dx = x === left ? -1 : 1
      const dy = y === bottom ? -1 : 1
      lines.push([x + dx * gap, y, x + dx * (gap + len), y]) // horizontal
      lines.push([x, y + dy * gap, x, y + dy * (gap + len)]) // vertical
    }
  }
  const p = (v: number) => fmt(v * PT_PER_MM)
  return `q 0.25 w 0 0 0 1 K\n${lines.map(([a, b, c, d]) => `${p(a)} ${p(b)} m ${p(c)} ${p(d)} l S`).join('\n')}\nQ\n`
}
