/**
 * Physical card geometry, in millimetres. CR80 / ISO 7810 ID-1 is the size
 * of every bank card and NFC business card.
 */
export const CARD = { width: 85.6, height: 53.98, cornerRadius: 3.18 } as const

/** Printed past the trim so cutting slightly off never leaves a white edge. */
export const BLEED = 3

/** Keep text and logos inside this margin: cutting can drift by ~1mm. */
export const SAFE = 3

/** Print resolution for exports. 600 dpi keeps small text sharp on PVC. */
export const EXPORT_DPI = 600

export const MM_PER_INCH = 25.4

export type Orientation = 'landscape' | 'portrait'

export function cardSize(orientation: Orientation): { w: number; h: number } {
  return orientation === 'landscape' ? { w: CARD.width, h: CARD.height } : { w: CARD.height, h: CARD.width }
}

/** Points (type size) to millimetres. */
export const ptToMm = (pt: number) => (pt * MM_PER_INCH) / 72

export const mmToPx = (mm: number, dpi: number) => Math.round((mm / MM_PER_INCH) * dpi)
