import Link from 'next/link'

import { EVENT_ROLE_LABELS } from '@/content/events'
import type { EventRole, PortfolioEvent } from '@/lib/content/schema'

/**
 * Mirrors ProjectCard so an event can sit in the same grid without looking
 * like a different kind of object. The proof verb reflects the role actually
 * performed rather than a generic label.
 */
export function EventCard({ event }: { event: PortfolioEvent }) {
  return (
    <article className="group relative flex flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/60">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono text-accent">FACILITATED</span>
        <span className="label-mono text-ink-muted">{event.date.slice(0, 4)}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
        <Link href="/events" className="after:absolute after:inset-0">
          {event.name}
        </Link>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{event.summary}</p>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-ink-muted">
        <div>
          <dt className="sr-only">Role</dt>
          <dd>{EVENT_ROLE_LABELS[event.role as EventRole]}</dd>
        </div>
        <div>
          <dt className="sr-only">Organiser</dt>
          <dd>{event.organiser}</dd>
        </div>
      </dl>
    </article>
  )
}
