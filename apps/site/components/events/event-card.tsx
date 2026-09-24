import Link from 'next/link'

import { ROLE_ART } from '@/components/illustrations/art'
import { EVENT_ROLE_VERBS } from '@/content/events'
import type { EventRole, PortfolioEvent } from '@/lib/content/schema'

/**
 * Mirrors ProjectCard so an event sits in the same grid without reading as a
 * different kind of object. The verb reflects the role actually performed —
 * previously hardcoded to "Facilitated" regardless of which role the
 * featured event evidenced, which was accurate only while the site's one
 * published event happened to be a facilitation role.
 *
 * Events have no screenshots, so the cover slot carries the illustration for
 * the role performed — same 16:9 frame, so the grid stays even.
 */
export function EventCard({ event }: { event: PortfolioEvent }) {
  const Art = ROLE_ART[event.role as EventRole]

  return (
    <article className="panel group relative flex h-full flex-col rounded-sm transition-colors hover:border-border-strong">
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-surface-raised px-12 py-4">
        <Art className="max-h-full transition-transform duration-500 group-hover:scale-[1.04]" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-accent">
            {EVENT_ROLE_VERBS[event.role as EventRole]}
          </span>
          <span className="label-mono tnum text-ink-muted">{event.date.slice(0, 4)}</span>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold text-ink">
          <Link href="/events" className="after:absolute after:inset-0">
            {event.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{event.summary}</p>

        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-ink-muted">
          <div>
            <dt className="sr-only">Role</dt>
            {/* roleLabel is the exact, full description — never the primary
                role alone, so a multi-role event isn't understated here. */}
            <dd>{event.roleLabel}</dd>
          </div>
          <div>
            <dt className="sr-only">Organiser</dt>
            <dd>{event.organiser}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
