import { z } from 'zod'

import { embedSrc } from './links'

/**
 * The card document: everything a public card shows, as one JSON value.
 *
 * A profile stores two of these (draft and published). The editor, the
 * server actions and the public page all parse through this schema, so a
 * document that renders is a document that validated. Limits are generous
 * for a business card and tight enough that nobody can turn one into a
 * file host.
 */

export const CONTACT_KINDS = [
  'phone',
  'email',
  'whatsapp',
  'telegram',
  'website',
  'address',
] as const
export type ContactKind = (typeof CONTACT_KINDS)[number]

export const SOCIAL_NETWORKS = [
  'linkedin',
  'github',
  'instagram',
  'x',
  'tiktok',
  'youtube',
  'facebook',
  'other',
] as const
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]

export const QUICK_ACTIONS = ['call', 'email', 'whatsapp', 'share'] as const
export type QuickAction = (typeof QUICK_ACTIONS)[number]

export const TEMPLATES = ['classic', 'cover', 'split', 'minimal'] as const
// 'system' uses the phone's own font: nothing to download, and it covers
// Tamil, Chinese, Arabic and other scripts the web fonts do not.
export const FONTS = ['system', 'sans', 'serif', 'rounded'] as const
export const BUTTON_STYLES = ['rounded', 'pill', 'square'] as const
export const BACKGROUND_STYLES = ['gradient', 'solid', 'image'] as const
export const ROW_STYLES = ['soft', 'solid', 'outline'] as const
export const AVATAR_SHAPES = ['circle', 'rounded', 'square'] as const
export const ALIGNMENTS = ['center', 'left'] as const
export const TEXT_SIZES = ['normal', 'large'] as const
export const LANGUAGES = ['en', 'ms', 'ta', 'zh'] as const
export const AFTER_SAVE = ['none', 'whatsapp'] as const

const text = (max: number) => z.string().trim().max(max)

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .url('Enter a full link, starting with https://')
  .refine((u) => /^https?:\/\//i.test(u), 'Links must start with http:// or https://')

/** An optional link: either a valid http(s) URL or empty. */
const optionalUrl = z.union([httpUrl, z.literal('')]).default('')

const hex = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i, 'Use a 6-digit hex colour like #1d4ed8')

const widgetBase = {
  id: z.string().min(1).max(40),
  hidden: z.boolean().default(false),
}

const headingWidget = z.object({
  ...widgetBase,
  type: z.literal('heading'),
  text: text(80).min(1, 'Heading text is required'),
})

const textWidget = z.object({
  ...widgetBase,
  type: z.literal('text'),
  body: text(1000).min(1, 'Text is required'),
})

const contactWidget = z.object({
  ...widgetBase,
  type: z.literal('contact'),
  items: z
    .array(
      z.object({
        kind: z.enum(CONTACT_KINDS),
        value: text(200).min(1, 'Value is required'),
        label: text(60).default(''),
      }),
    )
    .max(10),
})

const socialWidget = z.object({
  ...widgetBase,
  type: z.literal('social'),
  items: z
    .array(
      z.object({
        network: z.enum(SOCIAL_NETWORKS),
        url: httpUrl,
        label: text(60).default(''),
      }),
    )
    .max(12),
})

const linkWidget = z.object({
  ...widgetBase,
  type: z.literal('link'),
  label: text(60).min(1, 'Label is required'),
  url: httpUrl,
})

const embedWidget = z.object({
  ...widgetBase,
  type: z.literal('embed'),
  url: httpUrl.refine((u) => embedSrc(u) !== null, 'Use a YouTube or Spotify link'),
})

const bookingWidget = z.object({
  ...widgetBase,
  type: z.literal('booking'),
  label: text(60).min(1, 'Label is required'),
  url: httpUrl,
})

const formWidget = z.object({
  ...widgetBase,
  type: z.literal('form'),
  buttonLabel: text(60).min(1, 'Button label is required'),
  title: text(80).default(''),
  // Name and email are always asked. These are the optional extras.
  fields: z.object({
    designation: z.boolean().default(true),
    company: z.boolean().default(true),
    mobile: z.boolean().default(true),
    message: z.boolean().default(true),
  }),
})

export const widgetSchema = z.discriminatedUnion('type', [
  headingWidget,
  textWidget,
  contactWidget,
  socialWidget,
  linkWidget,
  embedWidget,
  bookingWidget,
  formWidget,
])
export type Widget = z.infer<typeof widgetSchema>
export type WidgetType = Widget['type']
export type WidgetOf<T extends WidgetType> = Extract<Widget, { type: T }>

export const cardSchema = z.object({
  version: z.literal(1).default(1),
  header: z.object({
    name: text(80).min(1, 'Name is required'),
    pronouns: text(30).default(''),
    title: text(80).default(''),
    company: text(80).default(''),
    photo: optionalUrl,
    banner: optionalUrl,
    logo: optionalUrl,
    // The primary contact details. They feed the quick-action row and the
    // vCard, so they live here rather than in a widget.
    phone: text(40).default(''),
    email: z.union([z.string().trim().email('Enter a valid email'), z.literal('')]).default(''),
    website: optionalUrl,
    address: text(200).default(''),
    // A separate WhatsApp number, for people whose WhatsApp is not their
    // main phone. Empty means "use phone".
    whatsapp: text(40).default(''),
    quickActions: z
      .array(z.enum(QUICK_ACTIONS))
      .max(4)
      .default(['call', 'email', 'share'])
      .refine((a) => new Set(a).size === a.length, 'Each quick action can appear once'),
    // Empty means the built-in "Save contact". Stored empty so the editor
    // shows it as a placeholder, not as text to delete before typing.
    saveLabel: text(40).default(''),
    // What the Save contact button offers once the contact is saved.
    afterSave: z.enum(AFTER_SAVE).default('none'),
    whatsappMessage: text(300).default(''),
  }),
  theme: z.object({
    template: z.enum(TEMPLATES).default('classic'),
    // Bright enough to stand out on the default dark-blue background.
    accent: hex.default('#3b82f6'),
    background: z.object({
      style: z.enum(BACKGROUND_STYLES).default('gradient'),
      from: hex.default('#0f172a'),
      to: hex.default('#1e3a8a'),
      angle: z.number().int().min(0).max(360).default(165),
      image: optionalUrl,
      // How much the image is dimmed (or lightened, for dark text) so text
      // stays readable on top of it.
      overlay: z.number().int().min(0).max(90).default(45),
    }),
    text: z.enum(['light', 'dark']).default('light'),
    buttons: z.enum(BUTTON_STYLES).default('rounded'),
    rows: z.enum(ROW_STYLES).default('soft'),
    avatar: z.enum(AVATAR_SHAPES).default('circle'),
    align: z.enum(ALIGNMENTS).default('center'),
    textSize: z.enum(TEXT_SIZES).default('normal'),
    font: z.enum(FONTS).default('sans'),
  }),
  meta: z.object({
    title: text(70).default(''),
    description: text(160).default(''),
    // Off search engines unless the owner opts in.
    noindex: z.boolean().default(true),
    // Language of the card's text, for screen readers and correct fonts.
    lang: z.enum(LANGUAGES).default('en'),
  }),
  widgets: z.array(widgetSchema).max(40).default([]),
})

export type CardDoc = z.infer<typeof cardSchema>
export type CardInput = z.input<typeof cardSchema>

/** Every image field on a card, for checks that apply to all of them. */
export function cardImages(doc: CardDoc): string[] {
  return [doc.header.photo, doc.header.banner, doc.header.logo, doc.theme.background.image].filter(Boolean)
}

/** A readable one-line summary of the first validation problem. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Invalid card'
  const where = issue.path.length ? `${issue.path.join('.')}: ` : ''
  return `${where}${issue.message}`
}
