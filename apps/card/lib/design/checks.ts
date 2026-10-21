import { cardSize, MM_PER_INCH, ptToMm, SAFE } from './dimensions'
import { BINDING_LABELS, elementText, type DesignContext } from './resolve'
import type { DesignDoc, DesignElement } from './schema'

export interface PrintIssue {
  side: 'front' | 'back'
  elementId: string | null
  level: 'warning' | 'error'
  message: string
}

/** Smallest QR side that scans reliably from a held card. */
export const MIN_QR_MM = 14
/** Smallest type size that prints legibly on PVC. */
export const MIN_TEXT_PT = 6
/** Below this, images look soft in print. */
export const MIN_IMAGE_DPI = 250

/**
 * Pre-flight checks, the kind a print shop runs: things that will be cut
 * off, too small to read or scan, or blurry. Shown as the owner designs.
 */
export function printIssues(doc: DesignDoc, ctx: DesignContext): PrintIssue[] {
  const issues: PrintIssue[] = []
  const { w, h } = cardSize(doc.orientation)

  for (const side of ['front', 'back'] as const) {
    for (const el of doc[side].elements) {
      if (el.hidden) continue
      const add = (level: PrintIssue['level'], message: string) => issues.push({ side, elementId: el.id, level, message })
      const label = describe(el, ctx)

      const outside = el.x < SAFE - 0.01 || el.y < SAFE - 0.01 || el.x + el.w > w - SAFE + 0.01 || el.y + el.h > h - SAFE + 0.01
      const decorative = el.type === 'shape' || (el.type === 'image' && el.fit === 'cover')
      if (outside && !decorative) add('warning', `${label} is outside the safe area and may be trimmed.`)

      if (el.type === 'text' && el.size < MIN_TEXT_PT) add('warning', `${label} is ${el.size}pt; under ${MIN_TEXT_PT}pt is hard to read in print.`)
      if (el.type === 'text' && !elementText(el, ctx)) {
        add(
          'warning',
          el.binding
            ? `The ${BINDING_LABELS[el.binding].toLowerCase()} box is empty because your card has no ${BINDING_LABELS[el.binding].toLowerCase()}. Add it on your card, or delete the box.`
            : 'A text box is empty. Type something, or delete it.',
        )
      }

      if (el.type === 'qr' && Math.min(el.w, el.h) < MIN_QR_MM) {
        add('error', `QR code is ${Math.min(el.w, el.h).toFixed(1)}mm; make it at least ${MIN_QR_MM}mm or phones may not scan it.`)
      }
      if (el.type === 'qr' && el.target === 'tag' && !el.tagId) add('error', 'QR code is set to an NFC tag link, but no tag is chosen.')

      if (el.type === 'image' && el.naturalW && el.naturalH) {
        const dpi = Math.min(el.naturalW / (el.w / MM_PER_INCH), el.naturalH / (el.h / MM_PER_INCH))
        if (dpi < MIN_IMAGE_DPI) add('warning', `Image will print at about ${Math.round(dpi)} dpi and may look soft. Use a larger file or make it smaller.`)
      }
    }
  }
  return issues
}

function describe(el: DesignElement, ctx: DesignContext): string {
  if (el.type === 'text') {
    const t = elementText(el, ctx)
    return t ? `“${t.length > 24 ? t.slice(0, 24) + '…' : t}”` : 'A text box'
  }
  return { image: 'An image', qr: 'The QR code', shape: 'A shape', icon: 'An icon' }[el.type]
}

/** Text height estimate for auto-sizing a new text box, in mm. */
export function textBoxHeight(sizePt: number, lineHeight = 1.2, lines = 1): number {
  return ptToMm(sizePt) * lineHeight * lines + 0.6
}
