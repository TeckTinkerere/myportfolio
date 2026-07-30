import { z } from 'zod'

/**
 * Content schema. The PRD's TypeScript interfaces (s14) are the source of
 * truth for shape; expressing them as Zod means the runtime guarantees and
 * the compile-time types cannot drift apart.
 *
 * These schemas are parsed at module scope in content/projects/index.ts and
 * content/events/index.ts. A parse failure therefore throws during static
 * generation and fails `next build` — which is what makes the PRD s14.2
 * rules enforceable rather than aspirational. Unlike a type error, this
 * cannot be silenced by a next.config flag.
 */

export const portfolioLensSchema = z.enum([
  'general',
  'software',
  'websites',
  'events',
  'community',
])

export const projectStatusSchema = z.enum([
  'live',
  'pilot-completed',
  'prototype',
  'in-development',
  'archived',
  'concept',
  'confidential',
])

export const visibilitySchema = z.enum(['public', 'sanitised', 'gated', 'private'])

export const permissionStatusSchema = z.enum([
  'not-required',
  'approved',
  'pending',
  'prohibited',
])

export const evidenceTypeSchema = z.enum([
  'live-site',
  'demo',
  'repository',
  'event-page',
  'media',
  'partner-reference',
  'testimonial',
  'document',
])

export const evidenceLinkSchema = z.object({
  label: z.string().min(1, 'Evidence links need a descriptive label (FR-09)'),
  type: evidenceTypeSchema,
  href: z.string().url(),
  public: z.boolean(),
})

export const verifiedMetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  verified: z.boolean(),
  permissionStatus: permissionStatusSchema,
  publicSourceUrl: z.string().url().optional(),
})
  // PRD s8.6: a metric may only be displayed when it is verified AND carries
  // evidence. Anything claiming verification without a source is a authoring
  // mistake, so it fails the build rather than rendering an unsourced number.
  .refine(
    (metric) => !metric.verified || Boolean(metric.publicSourceUrl),
    { message: 'A metric marked verified must carry a publicSourceUrl', path: ['publicSourceUrl'] },
  )

/**
 * Images carry their own alt text. The PRD types coverImage as a bare
 * string, but PRD s14.2 requires the build to fail when a public image has
 * no alternative text — which a bare string cannot express. Modelling it as
 * an object is the smaller deviation.
 */
export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, 'Public images require alternative text (PRD s14.2)'),
  caption: z.string().optional(),
  permissionStatus: permissionStatusSchema,
})

const isoDate = z.string().regex(/^\d{4}(-\d{2}){0,2}$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD')

/**
 * Partial<Record<PortfolioLens, number>>. Written out rather than derived
 * from z.record, which in Zod 3 makes every key required.
 */
/**
 * Whether an item will actually reach a public page. Must stay in step with
 * isPublished() in lib/content/queries.ts — that function is the runtime
 * gate, this predicate decides which authoring rules apply.
 */
function willPublish(item: { visibility: string; permissionStatus: string }): boolean {
  return (
    (item.visibility === 'public' || item.visibility === 'sanitised') &&
    (item.permissionStatus === 'approved' || item.permissionStatus === 'not-required')
  )
}

const rank = z.number().int().positive()
const featuredRankSchema = z
  .object({
    general: rank,
    software: rank,
    websites: rank,
    events: rank,
    community: rank,
  })
  .partial()

export const portfolioProjectSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slugs must be lowercase and hyphenated'),
    title: z.string().min(1),
    /** Uppercase action label: BUILT, AUTOMATED, HOSTED… (PRD s3.8). */
    proofVerb: z.string().regex(/^[A-Z]+$/, 'Proof verbs are a single uppercase word'),
    oneLiner: z.string().min(1).max(160),
    shortSummary: z.string().min(1),
    longSummary: z.string().optional(),

    lenses: z.array(portfolioLensSchema).min(1),
    status: projectStatusSchema,
    visibility: visibilitySchema,
    permissionStatus: permissionStatusSchema,

    role: z.string().min(1),
    organisation: z.string().optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    timeframeLabel: z.string().min(1),
    teamSize: z.number().int().positive().optional(),
    location: z.string().optional(),

    responsibilities: z.array(z.string().min(1)),
    constraints: z.array(z.string().min(1)),
    outcomes: z.array(z.string().min(1)),
    learnings: z.array(z.string().min(1)).optional(),
    technologies: z.array(z.string().min(1)).optional(),
    metrics: z.array(verifiedMetricSchema).optional(),
    evidence: z.array(evidenceLinkSchema).optional(),

    coverImage: imageSchema.optional(),
    gallery: z.array(imageSchema).optional(),

    featuredRank: featuredRankSchema.optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    confidentialityNote: z.string().optional(),
    lastVerifiedAt: isoDate.optional(),

    /**
     * Tier 1 items get a full case-study page (PRD s10.3). Tier 2 render as
     * archive cards. Not in the PRD's interface, but the PRD's own tiering
     * needs somewhere to live.
     */
    tier: z.union([z.literal(1), z.literal(2)]).default(2),
  })
  // PRD s14.2 — a case study must actually say what happened.
  //
  // Scoped to items that will actually be published. An unpublished draft
  // legitimately has no outcomes yet; the rule exists to stop an empty case
  // study reaching a page, not to stop one being drafted.
  .refine((p) => !willPublish(p) || p.tier !== 1 || p.outcomes.length > 0, {
    message: 'A published Tier 1 case study must record at least one outcome',
    path: ['outcomes'],
  })
  .refine((p) => !willPublish(p) || p.tier !== 1 || Boolean(p.longSummary), {
    message: 'A published Tier 1 case study must have a longSummary',
    path: ['longSummary'],
  })
  // PRD s14.2 — a featured item must state role and status. Both are
  // required above, so this guards against an empty-ish role slipping in.
  .refine((p) => !p.featuredRank || p.role.trim().length > 1, {
    message: 'Featured items must name the role performed',
    path: ['role'],
  })
  // PRD s13.3 — a sanitised item must explain what was withheld.
  .refine((p) => p.visibility !== 'sanitised' || Boolean(p.confidentialityNote), {
    message: 'Sanitised items require a confidentialityNote',
    path: ['confidentialityNote'],
  })
  // PRD s13.3.6 — nothing with unresolved permission may claim public
  // visibility. Authors must mark it sanitised, gated or private instead.
  .refine(
    (p) =>
      p.visibility !== 'public' ||
      p.permissionStatus === 'approved' ||
      p.permissionStatus === 'not-required',
    {
      message:
        'A public item cannot have a pending or prohibited permission status. Mark it sanitised or private until permission is resolved.',
      path: ['permissionStatus'],
    },
  )
  // A public page must not reference an asset that has not been cleared.
  .refine(
    (p) => {
      if (p.visibility === 'private' || p.visibility === 'gated') return true
      const images = [...(p.coverImage ? [p.coverImage] : []), ...(p.gallery ?? [])]
      return images.every(
        (img) =>
          img.permissionStatus === 'approved' || img.permissionStatus === 'not-required',
      )
    },
    {
      message: 'A publicly visible item references an image without cleared permission',
      path: ['gallery'],
    },
  )

export const eventRoleSchema = z.enum([
  'host-emcee',
  'co-host-organiser',
  'workshop-instructor',
  'facilitator-teaching-assistant',
  'event-operations-support',
])

export const portfolioEventSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1),
    organiser: z.string().min(1),
    date: isoDate,
    role: eventRoleSchema,
    /**
     * Some events genuinely involve more than one distinct role in the same
     * sitting — emceeing and also handling ops, say. `role` drives filtering,
     * the ladder count and the card's proof verb; `secondaryRoles` credits
     * the rest without inflating any single label into the others.
     */
    secondaryRoles: z.array(eventRoleSchema).optional(),
    roleLabel: z.string().min(1),
    summary: z.string().min(1),
    responsibilities: z.array(z.string().min(1)).min(1),
    audienceType: z.string().optional(),
    /** Only ever set when the number has actually been confirmed (PRD s9.3). */
    verifiedAudienceSize: z.string().optional(),
    publicEventUrl: z.string().url().optional(),
    testimonial: z
      .object({
        quote: z.string().min(1),
        attribution: z.string().min(1),
        permissionStatus: permissionStatusSchema,
      })
      .optional(),
    images: z.array(imageSchema).optional(),
    visibility: visibilitySchema,
    permissionStatus: permissionStatusSchema,
    featuredRank: z.number().int().positive().optional(),
    /** Set only where there is enough material for a dedicated page. */
    hasDetailPage: z.boolean().default(false),
  })
  .refine(
    (e) =>
      e.visibility !== 'public' ||
      e.permissionStatus === 'approved' ||
      e.permissionStatus === 'not-required',
    {
      message: 'A public event cannot have a pending or prohibited permission status',
      path: ['permissionStatus'],
    },
  )
  // PRD s8.7 / s9.3 — an unapproved testimonial must never reach a page.
  .refine(
    (e) =>
      !e.testimonial ||
      e.testimonial.permissionStatus === 'approved' ||
      e.testimonial.permissionStatus === 'not-required',
    {
      message: 'Testimonials require written permission before publication',
      path: ['testimonial'],
    },
  )
  .refine((e) => !e.secondaryRoles?.includes(e.role), {
    message: 'secondaryRoles must not repeat the primary role',
    path: ['secondaryRoles'],
  })

export const recognitionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: isoDate,
  /** Set only for competitive results, never for attendance certificates. */
  placement: z.string().optional(),
  summary: z.string().optional(),
  image: imageSchema.optional(),
  evidenceUrl: z.string().url().optional(),
  permissionStatus: permissionStatusSchema,
})

/**
 * Collection-level rules. Duplicate slugs are the dangerous one: two items
 * sharing a slug means one silently shadows the other at /work/[slug].
 */
function assertUniqueSlugs(items: ReadonlyArray<{ slug: string }>, label: string) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const item of items) {
    if (seen.has(item.slug)) duplicates.add(item.slug)
    seen.add(item.slug)
  }
  if (duplicates.size > 0) {
    throw new Error(
      `Content error: duplicate ${label} slug(s): ${[...duplicates].join(', ')}`,
    )
  }
}

export function parseProjects(input: unknown[]): PortfolioProject[] {
  const parsed = input.map((raw, index) => {
    const result = portfolioProjectSchema.safeParse(raw)
    if (!result.success) {
      const name =
        (raw as { slug?: string; title?: string })?.slug ??
        (raw as { title?: string })?.title ??
        `index ${index}`
      throw new Error(
        `Content error in project "${name}":\n${formatIssues(result.error)}`,
      )
    }
    return result.data
  })
  assertUniqueSlugs(parsed, 'project')
  return parsed
}

export function parseEvents(input: unknown[]): PortfolioEvent[] {
  const parsed = input.map((raw, index) => {
    const result = portfolioEventSchema.safeParse(raw)
    if (!result.success) {
      const name = (raw as { slug?: string })?.slug ?? `index ${index}`
      throw new Error(`Content error in event "${name}":\n${formatIssues(result.error)}`)
    }
    return result.data
  })
  assertUniqueSlugs(parsed, 'event')
  return parsed
}

export function parseRecognition(input: unknown[]): Recognition[] {
  const parsed = input.map((raw, index) => {
    const result = recognitionSchema.safeParse(raw)
    if (!result.success) {
      const name = (raw as { slug?: string })?.slug ?? `index ${index}`
      throw new Error(
        `Content error in recognition "${name}":\n${formatIssues(result.error)}`,
      )
    }
    return result.data
  })
  assertUniqueSlugs(parsed, 'recognition')
  return parsed
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')
}

export type PortfolioLens = z.infer<typeof portfolioLensSchema>
export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type Visibility = z.infer<typeof visibilitySchema>
export type PermissionStatus = z.infer<typeof permissionStatusSchema>
export type EvidenceType = z.infer<typeof evidenceTypeSchema>
export type EvidenceLink = z.infer<typeof evidenceLinkSchema>
export type VerifiedMetric = z.infer<typeof verifiedMetricSchema>
export type PortfolioImage = z.infer<typeof imageSchema>
export type PortfolioProject = z.infer<typeof portfolioProjectSchema>
export type EventRole = z.infer<typeof eventRoleSchema>
export type PortfolioEvent = z.infer<typeof portfolioEventSchema>
export type Recognition = z.infer<typeof recognitionSchema>

/** Input types accept the pre-default shape so content files stay terse. */
export type PortfolioProjectInput = z.input<typeof portfolioProjectSchema>
export type PortfolioEventInput = z.input<typeof portfolioEventSchema>
export type RecognitionInput = z.input<typeof recognitionSchema>
