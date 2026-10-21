import { z } from 'zod'

/**
 * A printed card design: front and back, each a background plus a stack of
 * elements positioned in millimetres from the trimmed card's top-left
 * corner. Millimetres, not pixels, so the same document renders on screen at
 * any zoom and exports at print resolution without drift.
 */

const hex = z.string().regex(/^#[0-9a-f]{6}$/i)
const mm = z.number().min(-20).max(120)
// Down to 0.1mm: hairline rules and dividers are common on cards.
const size = z.number().min(0.1).max(120)

export const DESIGN_FONTS = ['sans', 'serif', 'rounded', 'mono', 'display'] as const
export type DesignFont = (typeof DESIGN_FONTS)[number]

/** Card fields a text element can follow, so the print stays current. */
export const BINDINGS = ['name', 'title', 'company', 'phone', 'email', 'website', 'handleUrl'] as const
export type Binding = (typeof BINDINGS)[number]

export const ICONS = ['nfc', 'phone', 'mail', 'globe', 'pin', 'linkedin', 'instagram', 'whatsapp'] as const
export type IconName = (typeof ICONS)[number]

const base = {
  id: z.string().min(1).max(40),
  x: mm,
  y: mm,
  w: size,
  h: size,
  rotation: z.number().min(-180).max(180).default(0),
  hidden: z.boolean().default(false),
  locked: z.boolean().default(false),
}

const textElement = z.object({
  ...base,
  type: z.literal('text'),
  text: z.string().max(200).default(''),
  binding: z.enum(BINDINGS).nullable().default(null),
  font: z.enum(DESIGN_FONTS).default('sans'),
  size: z.number().min(4).max(72).default(9), // points
  weight: z.union([z.literal(400), z.literal(500), z.literal(600), z.literal(700)]).default(400),
  italic: z.boolean().default(false),
  uppercase: z.boolean().default(false),
  letterSpacing: z.number().min(-0.1).max(0.5).default(0), // em
  lineHeight: z.number().min(0.8).max(2).default(1.2),
  align: z.enum(['left', 'center', 'right']).default('left'),
  color: hex.default('#111111'),
})

const imageElement = z.object({
  ...base,
  type: z.literal('image'),
  src: z.string().url().max(500),
  fit: z.enum(['contain', 'cover']).default('contain'),
  radius: z.number().min(0).max(30).default(0),
  opacity: z.number().min(0.1).max(1).default(1),
  // Pixel size of the upload, to warn when it will print soft.
  naturalW: z.number().int().positive().optional(),
  naturalH: z.number().int().positive().optional(),
})

const qrElement = z.object({
  ...base,
  type: z.literal('qr'),
  // 'tag' encodes an NFC tag link (re-pointable later); 'card' the card URL.
  target: z.enum(['tag', 'card', 'custom']).default('card'),
  tagId: z.string().regex(/^[a-z0-9]{8}$/).nullable().default(null),
  url: z.string().max(300).default(''),
  color: hex.default('#111111'),
  background: hex.nullable().default(null),
})

const shapeElement = z.object({
  ...base,
  type: z.literal('shape'),
  shape: z.enum(['rect', 'ellipse', 'line']).default('rect'),
  fill: hex.nullable().default('#111111'),
  stroke: hex.nullable().default(null),
  strokeWidth: z.number().min(0).max(5).default(0.3), // mm
  radius: z.number().min(0).max(30).default(0),
  opacity: z.number().min(0.05).max(1).default(1),
})

const iconElement = z.object({
  ...base,
  type: z.literal('icon'),
  icon: z.enum(ICONS).default('nfc'),
  color: hex.default('#111111'),
})

export const elementSchema = z.discriminatedUnion('type', [textElement, imageElement, qrElement, shapeElement, iconElement])
export type DesignElement = z.infer<typeof elementSchema>
export type ElementType = DesignElement['type']
export type ElementOf<T extends ElementType> = Extract<DesignElement, { type: T }>

const sideSchema = z.object({
  background: z.object({
    kind: z.enum(['solid', 'gradient', 'image']).default('solid'),
    color: hex.default('#ffffff'),
    color2: hex.default('#e5e7eb'),
    angle: z.number().int().min(0).max(360).default(135),
    image: z.string().max(500).default(''),
  }),
  elements: z.array(elementSchema).max(60).default([]),
})
export type DesignSide = z.infer<typeof sideSchema>

export const MATERIALS = ['pvc', 'metal-black', 'metal-silver', 'wood'] as const
export type Material = (typeof MATERIALS)[number]

export const designSchema = z.object({
  version: z.literal(1).default(1),
  orientation: z.enum(['landscape', 'portrait']).default('landscape'),
  // PVC prints full colour. Metal and wood are laser-engraved: one colour,
  // and the editor previews and exports them that way.
  material: z.enum(MATERIALS).default('pvc'),
  front: sideSchema,
  back: sideSchema,
})
export type DesignDoc = z.infer<typeof designSchema>

export function isEngraved(material: Material): boolean {
  return material !== 'pvc'
}
