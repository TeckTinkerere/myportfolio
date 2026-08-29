import { runSheets } from '@/content'
import { getPublicRunSheets, getRunSheetBySlug } from '@/lib/queries'
import {
  buildRunningOrder,
  formatClock,
  formatDuration,
  segmentAtMinute,
  toMinutes,
} from '@/lib/running-order'
import { runSheetSchema } from '@/lib/schema'

/**
 * Two things a run sheet must never get wrong: the clock, and who it is
 * allowed to name in public. Everything below is one of those two.
 */

const baseSheet = {
  slug: 'example',
  title: 'Example',
  sheetType: 'template' as const,
  summary: 'A sheet.',
  startTime: '19:00',
  segments: [
    { id: 'welcome', title: 'Welcome', kind: 'opening' as const, durationMinutes: 5 },
  ],
  visibility: 'public' as const,
  permissionStatus: 'not-required' as const,
}

describe('run sheet schema', () => {
  it('accepts the minimal valid sheet', () => {
    expect(runSheetSchema.safeParse(baseSheet).success).toBe(true)
  })

  it('rejects a sheet with no segments', () => {
    expect(runSheetSchema.safeParse({ ...baseSheet, segments: [] }).success).toBe(false)
  })

  it('rejects duplicate segment ids, which would break the anchors', () => {
    const result = runSheetSchema.safeParse({
      ...baseSheet,
      segments: [...baseSheet.segments, { ...baseSheet.segments[0], title: 'Again' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an announcement pinned to a segment that is not on the sheet', () => {
    const result = runSheetSchema.safeParse({
      ...baseSheet,
      announcements: [{ label: 'Sponsors', text: 'Thank them.', segmentId: 'nonexistent' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a 12-hour or malformed clock time', () => {
    for (const startTime of ['7:00pm', '25:00', '19:60', '1900', '']) {
      expect(runSheetSchema.safeParse({ ...baseSheet, startTime }).success).toBe(false)
    }
  })

  it('requires an event sheet to carry its date', () => {
    expect(
      runSheetSchema.safeParse({ ...baseSheet, sheetType: 'event' }).success,
    ).toBe(false)
    expect(
      runSheetSchema.safeParse({ ...baseSheet, sheetType: 'event', date: '2026-03-14' })
        .success,
    ).toBe(true)
  })

  it('refuses to tie a template to a single event', () => {
    expect(
      runSheetSchema.safeParse({
        ...baseSheet,
        eventUrl: 'https://mohdaslam.dev/events/some-event',
      }).success,
    ).toBe(false)
  })

  it('will not publish a sheet naming a person on "not-required" permission', () => {
    const namesSomeone = {
      ...baseSheet,
      segments: [
        {
          ...baseSheet.segments[0],
          people: [{ name: 'A Speaker', role: 'Keynote' }],
        },
      ],
    }

    // `not-required` asserts nobody had to be asked, which cannot be true of
    // a named third party — same rule the testimonial schema applies.
    expect(runSheetSchema.safeParse(namesSomeone).success).toBe(false)
    expect(
      runSheetSchema.safeParse({ ...namesSomeone, permissionStatus: 'approved' }).success,
    ).toBe(true)
    // A private sheet may name whoever it needs to: it reaches no page.
    expect(
      runSheetSchema.safeParse({ ...namesSomeone, visibility: 'private' }).success,
    ).toBe(true)
  })
})

describe('the running order', () => {
  it('derives every clock time from the start time and the durations', () => {
    const order = buildRunningOrder(
      runSheetSchema.parse({
        ...baseSheet,
        startTime: '18:30',
        segments: [
          { id: 'a', title: 'A', kind: 'opening', durationMinutes: 30 },
          { id: 'b', title: 'B', kind: 'talk', durationMinutes: 45 },
          { id: 'c', title: 'C', kind: 'closing', durationMinutes: 15 },
        ],
      }),
    )

    expect(order.segments.map((s) => s.startsAt)).toEqual(['18:30', '19:00', '19:45'])
    expect(order.segments.map((s) => s.endsAt)).toEqual(['19:00', '19:45', '20:00'])
    expect(order.endsAt).toBe('20:00')
    expect(order.totalMinutes).toBe(90)
  })

  it('moves everything below a segment when its duration changes', () => {
    // The whole reason clock times are computed rather than authored.
    const sheet = runSheetSchema.parse({
      ...baseSheet,
      startTime: '19:00',
      segments: [
        { id: 'a', title: 'A', kind: 'opening', durationMinutes: 10 },
        { id: 'b', title: 'B', kind: 'talk', durationMinutes: 30 },
      ],
    })
    const recut = runSheetSchema.parse({
      ...sheet,
      segments: [{ ...sheet.segments[0], durationMinutes: 20 }, sheet.segments[1]],
    })

    expect(buildRunningOrder(sheet).segments[1].startsAt).toBe('19:10')
    expect(buildRunningOrder(recut).segments[1].startsAt).toBe('19:20')
  })

  it('wraps past midnight instead of printing an impossible hour', () => {
    const order = buildRunningOrder(
      runSheetSchema.parse({
        ...baseSheet,
        startTime: '23:30',
        segments: [{ id: 'a', title: 'A', kind: 'closing', durationMinutes: 60 }],
      }),
    )
    expect(order.endsAt).toBe('00:30')
  })

  it('leaves no gap or overlap between consecutive segments', () => {
    for (const sheet of getPublicRunSheets()) {
      const { segments } = buildRunningOrder(sheet)
      for (let i = 1; i < segments.length; i += 1) {
        expect(segments[i].startOffsetMinutes).toBe(segments[i - 1].endOffsetMinutes)
      }
    }
  })
})

describe('clock helpers', () => {
  it('round-trips a wall clock time', () => {
    for (const clock of ['00:00', '09:05', '18:30', '23:59']) {
      expect(formatClock(toMinutes(clock))).toBe(clock)
    }
  })

  it('reads runtimes the way a host says them', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(60)).toBe('1 hr')
    expect(formatDuration(135)).toBe('2 hr 15 min')
  })
})

describe('segmentAtMinute', () => {
  const order = buildRunningOrder(
    runSheetSchema.parse({
      ...baseSheet,
      startTime: '19:00',
      segments: [
        { id: 'a', title: 'A', kind: 'opening', durationMinutes: 30 },
        { id: 'b', title: 'B', kind: 'talk', durationMinutes: 30 },
      ],
    }),
  )

  it('names the segment a moment falls inside', () => {
    expect(segmentAtMinute(order.segments, order.startsAt, toMinutes('19:15'))?.id).toBe('a')
    expect(segmentAtMinute(order.segments, order.startsAt, toMinutes('19:45'))?.id).toBe('b')
  })

  it('hands a boundary minute to the segment starting, not the one ending', () => {
    expect(segmentAtMinute(order.segments, order.startsAt, toMinutes('19:30'))?.id).toBe('b')
  })

  it('returns null before the programme starts and after it ends', () => {
    expect(segmentAtMinute(order.segments, order.startsAt, toMinutes('18:00'))).toBeNull()
    expect(segmentAtMinute(order.segments, order.startsAt, toMinutes('20:00'))).toBeNull()
  })
})

describe('the published run sheets', () => {
  it('publishes only sheets that clear the shared publication boundary', () => {
    for (const sheet of getPublicRunSheets()) {
      expect(['public', 'sanitised']).toContain(sheet.visibility)
      expect(['approved', 'not-required']).toContain(sheet.permissionStatus)
    }
  })

  it('does not resolve a private sheet by slug', () => {
    for (const sheet of runSheets) {
      const reachable = Boolean(getRunSheetBySlug(sheet.slug))
      const publishable =
        (sheet.visibility === 'public' || sheet.visibility === 'sanitised') &&
        (sheet.permissionStatus === 'approved' || sheet.permissionStatus === 'not-required')
      expect(reachable).toBe(publishable)
    }
  })

  it('names nobody on a sheet published under "not-required"', () => {
    for (const sheet of getPublicRunSheets()) {
      if (sheet.permissionStatus !== 'not-required') continue
      for (const segment of sheet.segments) {
        expect(segment.people ?? []).toHaveLength(0)
      }
    }
  })
})
