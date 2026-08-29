'use client'

import { useEffect, useState } from 'react'

import { formatDuration, segmentAtMinute, toMinutes } from '@/lib/running-order'

/**
 * The sticky bar at the top of a run sheet: what is on now, and how long is
 * left of it.
 *
 * This is the one piece of the emcee area that has to be client-side — the
 * page is statically generated, so the server has no idea what time it is
 * when someone opens it. It is kept as small as that implies: no timers on
 * the cards, no per-segment highlighting, no scroll tracking. One string
 * that changes every fifteen seconds, and a link to the segment it names.
 *
 * The first render matches the server exactly (the programme's own start and
 * end times), and the live reading replaces it after mount. Nothing shifts,
 * and the bar is still useful with JavaScript off — it just stops moving.
 *
 * Time is compared as a wall clock, not a timestamp. A run sheet is a
 * schedule for a day, and the phone in the host's hand is already set to the
 * room's timezone; converting through one would add a field to get wrong
 * without changing the answer.
 */
export type ClockSegment = {
  id: string
  title: string
  startOffsetMinutes: number
  endOffsetMinutes: number
}

export function LiveClock({
  segments,
  startsAt,
  endsAt,
  totalMinutes,
}: {
  segments: ClockSegment[]
  startsAt: string
  endsAt: string
  totalMinutes: number
}) {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null)

  useEffect(() => {
    const read = () => {
      const now = new Date()
      setNowMinutes(now.getHours() * 60 + now.getMinutes())
    }
    read()
    const timer = setInterval(read, 15_000)
    return () => clearInterval(timer)
  }, [])

  const offsetNow = nowMinutes === null ? null : nowMinutes - toMinutes(startsAt)
  const current =
    nowMinutes === null ? null : segmentAtMinute(segments, startsAt, nowMinutes)

  return (
    // top-16 clears the site header, which is itself sticky at h-16; z stays
    // below the header's so the two never fight over the same strip.
    <div className="sticky top-16 z-30 -mx-5 border-b border-border-strong bg-background/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {current ? (
          <>
            <span className="label-mono text-accent">Now</span>
            <a
              href={`#${current.id}`}
              className="min-w-0 flex-1 truncate text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              {current.title}
            </a>
            <span className="tnum label-mono shrink-0 text-ink-muted">
              {/* Floors at one minute: "0 min left" reads as over, and the
                  segment is not over until the next one starts. */}
              {formatDuration(Math.max(1, current.endOffsetMinutes - offsetNow!))} left
            </span>
          </>
        ) : (
          <>
            <span className="label-mono text-ink-muted">Programme</span>
            <span className="tnum flex-1 text-sm font-semibold text-ink">
              {startsAt} – {endsAt}
            </span>
            <span className="label-mono shrink-0 text-ink-muted">
              {formatDuration(totalMinutes)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
