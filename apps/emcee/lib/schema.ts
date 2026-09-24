import { z } from 'zod'

import {
  isoDateSchema,
  permissionStatusSchema,
  visibilitySchema,
} from '@mohdaslam/content-rules'

/**
 * Run sheets — the document an emcee actually holds while running a room.
 *
 * This is a separate model from PortfolioEvent on purpose. A PortfolioEvent
 * is a record of work already done, written for someone assessing it. A run
 * sheet is an operating document for a room that has not happened yet,
 * written for the person at the front of it. They answer different questions
 * and change at different times, so they are kept apart and joined by an
 * optional `eventUrl` rather than merged into one over-loaded type.
 *
 * The two things this schema refuses to let an author get wrong:
 *
 * 1. Clock times are never written down. Each segment declares only how long
 *    it runs, and the running order is computed from the sheet's start time
 *    — see lib/running-order.ts. Hand-written clock times are the classic
 *    run-sheet failure: one segment is re-cut, and every time below it is
 *    quietly wrong for the rest of the show.
 * 2. A published sheet that names a person needs approved permission, not
 *    merely `not-required`. Speaker names, affiliations and pronunciation
 *    notes are personal data about third parties, and the rule for
 *    third-party material is already that someone has to have said yes.
 */

export const segmentKindSchema = z.enum([
  'opening',
  'talk',
  'panel',
  'demo',
  'performance',
  'award',
  'break',
  'admin',
  'closing',
])

/** 24-hour wall clock. The only time format anywhere in this module. */
const clockTime = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour HH:MM time, e.g. 14:05')

export const segmentPersonSchema = z.object({
  name: z.string().min(1),
  /** What they are doing here — "Keynote speaker", "Judge", "Guest of honour". */
  role: z.string().min(1).optional(),
  organisation: z.string().min(1).optional(),
  /**
   * Written out the way it should be said. Getting a name wrong from the
   * front of a room is the mistake an audience remembers, so it earns a
   * field rather than living in a note.
   */
  pronunciation: z.string().min(1).optional(),
})

export const runSheetSegmentSchema = z.object({
  /** Stable within the sheet: it is the anchor the running order links to. */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Segment ids are lowercase and hyphenated'),
  title: z.string().min(1),
  kind: segmentKindSchema,
  durationMinutes: z.number().int().positive().max(600),

  people: z.array(segmentPersonSchema).optional(),

  /**
   * The one line that opens the segment. Deliberately a single string and
   * not a script: a host reading paragraphs off a phone stops looking at the
   * room, which is the whole job.
   */
  cue: z.string().min(1).optional(),
  /** Reminders for the host — housekeeping, things to watch, things to skip. */
  notes: z.array(z.string().min(1)).optional(),
  /** Anything owed to the AV desk: slides, mics, lights, music. */
  techCues: z.array(z.string().min(1)).optional(),
  /**
   * How this segment ends and the next one begins. Transitions are where a
   * room loses its energy, so they are authored rather than improvised.
   */
  handoff: z.string().min(1).optional(),
})

export const runSheetAnnouncementSchema = z.object({
  label: z.string().min(1),
  text: z.string().min(1),
  /** Optional anchor to the segment it should be read during or after. */
  segmentId: z.string().optional(),
})

export const runSheetSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),

    /**
     * A template is a reusable shape for a kind of room. An event sheet is
     * a specific date. Distinguishing them stops a template being read as a
     * claim that a particular event happened.
     */
    sheetType: z.enum(['template', 'event']),
    /**
     * Link back to the event's record on the portfolio, where one is
     * published. An absolute URL rather than a slug: this app has no copy of
     * the event records, so it cannot check that a slug resolves to
     * something published, and a link it cannot verify is one it should not
     * be constructing. The author pastes a URL they have actually opened.
     *
     * Not rendered: this site stands on its own and does not send visitors
     * back to the portfolio. Kept as a record of where the event lives.
     */
    eventUrl: z.string().url().optional(),

    summary: z.string().min(1),
    organiser: z.string().min(1).optional(),
    date: isoDateSchema.optional(),
    venue: z.string().min(1).optional(),

    /** When the host needs to be in the room, if that differs from doors. */
    callTime: clockTime.optional(),
    doorsOpen: clockTime.optional(),
    /** The running order is computed forward from here. */
    startTime: clockTime,

    /** Read once before walking on. Kept short enough to actually be read. */
    hostBrief: z.array(z.string().min(1)).optional(),

    segments: z.array(runSheetSegmentSchema).min(1, 'A run sheet needs at least one segment'),
    announcements: z.array(runSheetAnnouncementSchema).optional(),

    visibility: visibilitySchema,
    permissionStatus: permissionStatusSchema,
  })
  .refine(
    (sheet) => new Set(sheet.segments.map((s) => s.id)).size === sheet.segments.length,
    { message: 'Segment ids must be unique within a run sheet', path: ['segments'] },
  )
  // An announcement pinned to a segment that does not exist would silently
  // never be shown.
  .refine(
    (sheet) => {
      const ids = new Set(sheet.segments.map((s) => s.id))
      return (sheet.announcements ?? []).every((a) => !a.segmentId || ids.has(a.segmentId))
    },
    { message: 'An announcement references a segment id that is not on this sheet', path: ['announcements'] },
  )
  // A sheet for a real event has to say which one.
  .refine((sheet) => sheet.sheetType !== 'event' || Boolean(sheet.date), {
    message: 'An event run sheet must carry the date it is for',
    path: ['date'],
  })
  .refine((sheet) => sheet.sheetType === 'event' || !sheet.eventUrl, {
    message: 'A template is not tied to one event, so it cannot carry an eventUrl',
    path: ['eventUrl'],
  })
  // Mirrors the testimonial rule the portfolio applies to quotes: third-party
  // material reaches a public page only once someone has actually approved
  // it. `not-required` is not an approval, it is an assertion that nobody
  // needed to be asked — which cannot be true of a named person.
  .refine(
    (sheet) => {
      const publishes = sheet.visibility === 'public' || sheet.visibility === 'sanitised'
      const namesPeople = sheet.segments.some((s) => (s.people?.length ?? 0) > 0)
      return !publishes || !namesPeople || sheet.permissionStatus === 'approved'
    },
    {
      message:
        'A published run sheet that names speakers or performers needs an approved permission status',
      path: ['permissionStatus'],
    },
  )

export function parseRunSheets(input: unknown[]): RunSheet[] {
  const parsed = input.map((raw, index) => {
    const result = runSheetSchema.safeParse(raw)
    if (!result.success) {
      const name = (raw as { slug?: string })?.slug ?? `index ${index}`
      throw new Error(
        `Content error in run sheet "${name}":\n${result.error.issues
          .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
          .join('\n')}`,
      )
    }
    return result.data
  })

  const seen = new Set<string>()
  for (const sheet of parsed) {
    if (seen.has(sheet.slug)) {
      throw new Error(`Content error: duplicate run sheet slug: ${sheet.slug}`)
    }
    seen.add(sheet.slug)
  }

  return parsed
}

export type SegmentKind = z.infer<typeof segmentKindSchema>
export type SegmentPerson = z.infer<typeof segmentPersonSchema>
export type RunSheetSegment = z.infer<typeof runSheetSegmentSchema>
export type RunSheetAnnouncement = z.infer<typeof runSheetAnnouncementSchema>
export type RunSheet = z.infer<typeof runSheetSchema>
export type RunSheetInput = z.input<typeof runSheetSchema>

export const SEGMENT_KIND_LABELS: Record<SegmentKind, string> = {
  opening: 'Opening',
  talk: 'Talk',
  panel: 'Panel',
  demo: 'Demo',
  performance: 'Performance',
  award: 'Award',
  break: 'Break',
  admin: 'Housekeeping',
  closing: 'Closing',
}
