import type { RunSheet, RunSheetSegment } from '@/lib/schema'

/**
 * Turns authored durations into the clock an emcee reads.
 *
 * Nothing here touches the content set or the publication boundary, so it is
 * deliberately not server-only: the same functions format times in the
 * server-rendered running order and in the client-side live clock, and one
 * implementation means the two can never disagree about when a segment ends.
 *
 * A sheet declares one start time and a duration per segment. Every clock
 * time on the page is derived from those, which is what makes a re-cut
 * segment safe — change one duration and the whole order moves with it,
 * instead of leaving eight hand-typed times quietly wrong.
 */

const MINUTES_PER_DAY = 24 * 60

export type TimedSegment = RunSheetSegment & {
  /** Minutes from the sheet's start time. */
  startOffsetMinutes: number
  endOffsetMinutes: number
  /** Wall clock, HH:MM. */
  startsAt: string
  endsAt: string
}

export type RunningOrder = {
  segments: TimedSegment[]
  startsAt: string
  endsAt: string
  totalMinutes: number
}

export function toMinutes(clock: string): number {
  const [hours, minutes] = clock.split(':').map(Number)
  return hours * 60 + minutes
}

/** Wraps past midnight rather than printing 25:30 for a late finish. */
export function formatClock(minutes: number): string {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const hours = Math.floor(wrapped / 60)
  const mins = wrapped % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/** Human runtime: "45 min", "1 hr", "2 hr 15 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}

export function buildRunningOrder(sheet: RunSheet): RunningOrder {
  const start = toMinutes(sheet.startTime)

  let cursor = 0
  const segments = sheet.segments.map((segment) => {
    const startOffsetMinutes = cursor
    cursor += segment.durationMinutes
    return {
      ...segment,
      startOffsetMinutes,
      endOffsetMinutes: cursor,
      startsAt: formatClock(start + startOffsetMinutes),
      endsAt: formatClock(start + cursor),
    }
  })

  return {
    segments,
    startsAt: sheet.startTime,
    endsAt: formatClock(start + cursor),
    totalMinutes: cursor,
  }
}

/**
 * Which segment a given wall-clock minute falls in, or null before the first
 * and after the last. Used by the live clock; kept here so "what is on now"
 * is answered by the same arithmetic that laid the order out.
 *
 * Generic over the segment shape so the client-side clock can pass the
 * three fields it actually needs rather than the whole sheet — host notes
 * have no business being serialised into a page just to work out the time.
 */
export function segmentAtMinute<
  T extends { startOffsetMinutes: number; endOffsetMinutes: number },
>(segments: readonly T[], startsAt: string, wallClockMinutes: number): T | null {
  const offset = wallClockMinutes - toMinutes(startsAt)
  return (
    segments.find(
      (segment) =>
        offset >= segment.startOffsetMinutes && offset < segment.endOffsetMinutes,
    ) ?? null
  )
}
