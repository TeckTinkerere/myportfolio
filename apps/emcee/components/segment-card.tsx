import { ArrowDown, Mic, Monitor, StickyNote } from 'lucide-react'

import { formatDuration, type TimedSegment } from '@/lib/running-order'
import { SEGMENT_KIND_LABELS, type SegmentKind } from '@/lib/schema'
import { cn } from '@mohdaslam/ui/cn'

/**
 * One segment of the running order.
 *
 * Laid out for the way it is actually read: at arm's length, on a phone, in
 * a dim room, in a two-second glance between looking back up at an audience.
 * That is why the clock time is the largest thing on the card and sits in
 * its own column, and why the sections below it are labelled and ordered the
 * same way on every card — a host scanning for "what do I say next" should
 * find it in the same place every time, not have to read the card.
 *
 * The tone follows StatusBadge: a segment kind is never carried by colour
 * alone, so each kind has a glyph and a written label as well.
 */
const KIND_MARKERS: Record<SegmentKind, string> = {
  opening: '◉',
  talk: '●',
  panel: '◍',
  demo: '◐',
  performance: '◑',
  award: '◆',
  break: '○',
  admin: '◌',
  closing: '◉',
}

const KIND_TONES: Record<SegmentKind, string> = {
  opening: 'text-accent',
  talk: 'text-ink',
  panel: 'text-ink',
  demo: 'text-ink',
  performance: 'text-ink',
  award: 'text-accent',
  break: 'text-ink-muted',
  admin: 'text-ink-muted',
  closing: 'text-accent',
}

export function SegmentCard({ segment }: { segment: TimedSegment }) {
  const isPause = segment.kind === 'break' || segment.kind === 'admin'

  return (
    <li
      id={segment.id}
      // Clears the sticky clock bar when jumped to from the running order.
      className="scroll-mt-32"
    >
      <article
        className={cn(
          'panel grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 rounded-sm p-4 sm:gap-x-6 sm:p-5',
          isPause && 'border-dashed',
        )}
      >
        <div className="flex flex-col items-start">
          <p className="tnum font-mono text-xl font-semibold leading-none text-ink sm:text-2xl">
            {segment.startsAt}
          </p>
          <p className="label-mono mt-2 text-ink-muted">
            {formatDuration(segment.durationMinutes)}
          </p>
          <p className="label-mono mt-1 text-ink-muted">to {segment.endsAt}</p>
        </div>

        <div className="min-w-0">
          <p className="label-mono inline-flex items-center gap-1.5 text-ink-muted">
            <span aria-hidden className={cn('text-[0.7em] leading-none', KIND_TONES[segment.kind])}>
              {KIND_MARKERS[segment.kind]}
            </span>
            {SEGMENT_KIND_LABELS[segment.kind]}
          </p>

          <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-ink">
            {segment.title}
          </h3>

          {segment.people && segment.people.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {segment.people.map((person) => (
                <li key={person.name} className="text-sm text-ink">
                  <span className="font-semibold">{person.name}</span>
                  {person.pronunciation ? (
                    // Set apart because it is said, not read out as written.
                    <span className="ml-2 font-mono text-xs text-accent">
                      say: {person.pronunciation}
                    </span>
                  ) : null}
                  {person.role || person.organisation ? (
                    <span className="block text-xs text-ink-muted">
                      {[person.role, person.organisation].filter(Boolean).join(' · ')}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {segment.cue ? (
            <p className="mt-3 flex gap-2.5 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink">
              <Mic aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <span>
                <span className="sr-only">Opening line: </span>
                {segment.cue}
              </span>
            </p>
          ) : null}

          {segment.notes && segment.notes.length > 0 ? (
            <Notes icon={<StickyNote aria-hidden className="size-3.5" />} label="Host notes" items={segment.notes} />
          ) : null}

          {segment.techCues && segment.techCues.length > 0 ? (
            <Notes icon={<Monitor aria-hidden className="size-3.5" />} label="Tech" items={segment.techCues} />
          ) : null}

          {segment.handoff ? (
            <p className="mt-4 flex gap-2.5 rounded-sm bg-surface-raised p-3 text-sm leading-relaxed text-ink-muted">
              <ArrowDown aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <span>
                <span className="label-mono block text-ink-muted">Handoff</span>
                <span className="mt-1 block">{segment.handoff}</span>
              </span>
            </p>
          ) : null}
        </div>
      </article>
    </li>
  )
}

function Notes({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode
  label: string
  items: string[]
}) {
  return (
    <div className="mt-4">
      <h4 className="label-mono flex items-center gap-1.5 text-ink-muted">
        {icon}
        {label}
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink-muted" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
