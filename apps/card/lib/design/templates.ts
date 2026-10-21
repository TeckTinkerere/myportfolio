import { BLEED, CARD, cardSize, type Orientation } from './dimensions'
import { designSchema, type DesignDoc, type DesignElement, type DesignSide, type Material } from './schema'

/**
 * Starting points for a printed card. Original layouts written for this app;
 * none is modelled on another product's templates. Text elements are bound
 * to the digital card, so a template fills itself in with the owner's
 * details and stays in step when they change.
 */

let counter = 0
export function elementId(): string {
  counter = (counter + 1) % 1_000_000
  return `${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

type TextInit = Partial<Extract<DesignElement, { type: 'text' }>> & Pick<DesignElement, 'x' | 'y' | 'w' | 'h'>

const text = (o: TextInit): DesignElement => ({
  id: elementId(), rotation: 0, hidden: false, locked: false, type: 'text', text: '', binding: null, font: 'sans', size: 9,
  weight: 400, italic: false, uppercase: false, letterSpacing: 0, lineHeight: 1.2, align: 'left', color: '#111111', ...o,
})

const qr = (o: Partial<Extract<DesignElement, { type: 'qr' }>> & Pick<DesignElement, 'x' | 'y' | 'w' | 'h'>): DesignElement => ({
  id: elementId(), rotation: 0, hidden: false, locked: false, type: 'qr', target: 'card', tagId: null, url: '', color: '#111111', background: null, ...o,
})

const shape = (o: Partial<Extract<DesignElement, { type: 'shape' }>> & Pick<DesignElement, 'x' | 'y' | 'w' | 'h'>): DesignElement => ({
  id: elementId(), rotation: 0, hidden: false, locked: false, type: 'shape', shape: 'rect', fill: '#111111', stroke: null, strokeWidth: 0.3, radius: 0, opacity: 1, ...o,
})

const icon = (o: Partial<Extract<DesignElement, { type: 'icon' }>> & Pick<DesignElement, 'x' | 'y' | 'w' | 'h'>): DesignElement => ({
  id: elementId(), rotation: 0, hidden: false, locked: false, type: 'icon', icon: 'nfc', color: '#111111', ...o,
})

const solid = (color: string, elements: DesignElement[]): DesignSide => ({
  background: { kind: 'solid', color, color2: color, angle: 135, image: '' },
  elements,
})

const gradient = (color: string, color2: string, angle: number, elements: DesignElement[]): DesignSide => ({
  background: { kind: 'gradient', color, color2, angle, image: '' },
  elements,
})

/** A contact block: rows of icon + bound text, from (x, y) downwards. */
function contactRows(x: number, y: number, w: number, color: string, iconColor = color): DesignElement[] {
  const rows: [Extract<DesignElement, { type: 'icon' }>['icon'], 'phone' | 'email' | 'handleUrl'][] = [
    ['phone', 'phone'],
    ['mail', 'email'],
    ['globe', 'handleUrl'],
  ]
  return rows.flatMap(([ic, binding], i) => [
    icon({ x, y: y + i * 5.2, w: 3, h: 3, icon: ic, color: iconColor }),
    text({ x: x + 4.6, y: y - 0.6 + i * 5.2, w: w - 4.6, h: 4, binding, size: 7, color }),
  ])
}

export interface Template {
  id: string
  name: string
  description: string
  orientation: Orientation
  material: Material
  build(): Pick<DesignDoc, 'front' | 'back'>
}

const L = cardSize('landscape')
const P = cardSize('portrait')

export const TEMPLATES: Template[] = [
  {
    id: 'ink',
    name: 'Ink',
    description: 'Dark front with your name; clean back with details and QR.',
    orientation: 'landscape',
    material: 'pvc',
    build: () => ({
      front: solid('#111827', [
        text({ x: 6, y: 20, w: L.w - 12, h: 9, binding: 'name', size: 18, weight: 600, align: 'center', color: '#ffffff' }),
        text({ x: 6, y: 30, w: L.w - 12, h: 5, binding: 'title', size: 8, align: 'center', color: '#9ca3af', uppercase: true, letterSpacing: 0.15 }),
        icon({ x: L.w - 10, y: L.h - 10, w: 5, h: 5, icon: 'nfc', color: '#6b7280' }),
      ]),
      back: solid('#ffffff', [
        text({ x: 6, y: 7, w: 50, h: 6, binding: 'name', size: 11, weight: 600 }),
        text({ x: 6, y: 13, w: 50, h: 4.5, binding: 'title', size: 7.5, color: '#4b5563' }),
        ...contactRows(6, 26, 50, '#111827', '#6b7280'),
        qr({ x: L.w - 30, y: (L.h - 24) / 2, w: 24, h: 24 }),
      ]),
    }),
  },
  {
    id: 'accent-bar',
    name: 'Accent bar',
    description: 'A bold colour bar beside your name. Easy to make yours.',
    orientation: 'landscape',
    material: 'pvc',
    build: () => ({
      front: solid('#fafaf9', [
        shape({ x: -BLEED, y: -BLEED, w: 14 + BLEED, h: L.h + BLEED * 2, fill: '#2563eb' }),
        text({ x: 20, y: L.h - 19, w: L.w - 26, h: 8, binding: 'name', size: 15, weight: 700 }),
        text({ x: 20, y: L.h - 11, w: L.w - 26, h: 4.5, binding: 'company', size: 8, color: '#2563eb', weight: 600 }),
      ]),
      back: solid('#2563eb', [
        qr({ x: (L.w - 26) / 2, y: 6, w: 26, h: 26, color: '#111827', background: '#ffffff' }),
        text({ x: 6, y: 36, w: L.w - 12, h: 4.5, text: 'Tap or scan to save my contact', size: 7.5, align: 'center', color: '#ffffff' }),
        text({ x: 6, y: 42, w: L.w - 12, h: 4.5, binding: 'handleUrl', size: 7, align: 'center', color: '#bfdbfe' }),
      ]),
    }),
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Vivid gradient front, calm dark back.',
    orientation: 'landscape',
    material: 'pvc',
    build: () => ({
      front: gradient('#4f46e5', '#db2777', 135, [
        text({ x: 6, y: 6, w: 50, h: 5, binding: 'company', size: 8, weight: 600, color: '#ffffff', uppercase: true, letterSpacing: 0.2 }),
        text({ x: 6, y: L.h - 18, w: L.w - 12, h: 8, binding: 'name', size: 16, weight: 700, color: '#ffffff' }),
        text({ x: 6, y: L.h - 10, w: L.w - 12, h: 4.5, binding: 'title', size: 8, color: '#fce7f3' }),
      ]),
      back: solid('#0f172a', [
        ...contactRows(6, 10, 48, '#e2e8f0', '#a5b4fc'),
        qr({ x: L.w - 29, y: (L.h - 23) / 2, w: 23, h: 23, color: '#0f172a', background: '#ffffff' }),
        icon({ x: 6, y: L.h - 10, w: 5, h: 5, icon: 'nfc', color: '#a5b4fc' }),
      ]),
    }),
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Two-tone front with your name on the seam.',
    orientation: 'landscape',
    material: 'pvc',
    build: () => ({
      front: solid('#f5f5f4', [
        shape({ x: -BLEED, y: -BLEED, w: L.w + BLEED * 2, h: 30 + BLEED, fill: '#14532d' }),
        text({ x: 6, y: 20, w: L.w - 12, h: 9, binding: 'name', size: 16, weight: 700, color: '#ffffff' }),
        text({ x: 6, y: 34, w: L.w - 12, h: 4.5, binding: 'title', size: 8, color: '#14532d', weight: 600 }),
        text({ x: 6, y: 40, w: L.w - 12, h: 4.5, binding: 'company', size: 7.5, color: '#57534e' }),
      ]),
      back: solid('#14532d', [
        ...contactRows(6, 10, 48, '#ecfdf5', '#86efac'),
        qr({ x: L.w - 29, y: (L.h - 23) / 2, w: 23, h: 23, color: '#14532d', background: '#ffffff' }),
      ]),
    }),
  },
  {
    id: 'portrait',
    name: 'Portrait',
    description: 'Vertical card: name up top, big QR below.',
    orientation: 'portrait',
    material: 'pvc',
    build: () => ({
      front: solid('#ffffff', [
        shape({ x: (P.w - 18) / 2, y: 9, w: 18, h: 18, shape: 'ellipse', fill: '#e0e7ff' }),
        icon({ x: (P.w - 8) / 2, y: 14, w: 8, h: 8, icon: 'nfc', color: '#4338ca' }),
        text({ x: 4, y: 34, w: P.w - 8, h: 7, binding: 'name', size: 12, weight: 700, align: 'center' }),
        text({ x: 4, y: 41, w: P.w - 8, h: 4.5, binding: 'title', size: 7, align: 'center', color: '#4b5563' }),
        text({ x: 4, y: 46, w: P.w - 8, h: 4.5, binding: 'company', size: 7, align: 'center', color: '#4338ca', weight: 600 }),
        text({ x: 4, y: P.h - 12, w: P.w - 8, h: 4, text: 'Tap to connect', size: 6.5, align: 'center', color: '#6b7280' }),
      ]),
      back: solid('#4338ca', [
        qr({ x: (P.w - 34) / 2, y: 18, w: 34, h: 34, color: '#1e1b4b', background: '#ffffff' }),
        text({ x: 4, y: 57, w: P.w - 8, h: 4.5, binding: 'handleUrl', size: 6.5, align: 'center', color: '#e0e7ff' }),
      ]),
    }),
  },
  {
    id: 'engraved',
    name: 'Engraved',
    description: 'Single-colour layout made for metal or wood engraving.',
    orientation: 'landscape',
    material: 'metal-black',
    build: () => ({
      front: solid('#111111', [
        text({ x: 6, y: 21, w: L.w - 12, h: 8, binding: 'name', size: 15, weight: 600, align: 'center', color: '#ffffff', letterSpacing: 0.05 }),
        shape({ x: (L.w - 20) / 2, y: 31, w: 20, h: 0.4, fill: '#ffffff' }),
        text({ x: 6, y: 33.5, w: L.w - 12, h: 4.5, binding: 'title', size: 7, align: 'center', color: '#ffffff', uppercase: true, letterSpacing: 0.2 }),
      ]),
      back: solid('#111111', [
        qr({ x: 7, y: (L.h - 24) / 2, w: 24, h: 24, color: '#ffffff' }),
        text({ x: 36, y: 18, w: L.w - 42, h: 5, text: 'Tap or scan', size: 9, weight: 600, color: '#ffffff' }),
        text({ x: 36, y: 25, w: L.w - 42, h: 4.5, binding: 'handleUrl', size: 7, color: '#ffffff' }),
        icon({ x: 36, y: 32, w: 5, h: 5, icon: 'nfc', color: '#ffffff' }),
      ]),
    }),
  },
]

export function applyTemplate(t: Template): DesignDoc {
  return designSchema.parse({ version: 1, orientation: t.orientation, material: t.material, ...t.build() })
}

/** The design a card starts with before the owner picks anything. */
export function defaultDesign(): DesignDoc {
  return applyTemplate(TEMPLATES[0])
}

export { CARD }
