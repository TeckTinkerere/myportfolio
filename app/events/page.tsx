import type { Metadata } from 'next'
import Link from 'next/link'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { WorkFilters, type FilterOption } from '@/components/projects/work-filters'
import { EVENT_ROLE_LABELS } from '@/content/events'
import { getPublicEvents } from '@/lib/content/queries'
import type { EventRole } from '@/lib/content/schema'

export const metadata: Metadata = {
  title: 'Event Hosting & Facilitation',
  description:
    'Technology events, workshops and hackathons — with the exact role performed stated for each.',
  alternates: { canonical: '/events' },
}

const ROLE_FILTERS: FilterOption[] = [
  { value: 'all', label: 'All roles' },
  ...Object.entries(EVENT_ROLE_LABELS).map(([value, label]) => ({ value, label })),
]

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role: rawRole } = await searchParams
  const role = ROLE_FILTERS.some((f) => f.value === rawRole) ? rawRole! : 'all'

  const all = getPublicEvents()
  const visible = role === 'all' ? all : all.filter((event) => event.role === role)

  return (
    <>
      <Section className="pb-0">
        <div className="max-w-3xl">
          <h1 className="font-display text-headline font-semibold text-ink">
            Technology events that stay clear, energetic, and human.
          </h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-muted">
            I facilitate and support technology events — hackathons, workshops and
            community programmes. Every entry below states the exact role I performed,
            because supporting an event and hosting one are not the same job.
          </p>
        </div>
      </Section>

      <Section aria-labelledby="events-heading">
        <SectionHeader
          eyebrow="Event record"
          title="What I have actually done"
          description="Filter by the role performed."
        />

        <WorkFilters
          options={ROLE_FILTERS}
          active={role}
          basePath="/events"
          paramName="role"
          label="Filter events by role"
        />

        <p aria-live="polite" className="mt-6 text-sm text-ink-muted">
          {visible.length} {visible.length === 1 ? 'event' : 'events'}
        </p>

        {visible.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-4">
            {visible.map((event) => (
              <li
                key={event.slug}
                className="rounded-sm border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="label-mono text-accent">
                    {EVENT_ROLE_LABELS[event.role as EventRole]}
                  </span>
                  <span className="text-xs text-ink-muted">{event.date}</span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-ink">{event.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{event.organiser}</p>
                <p className="prose-measure mt-3 text-sm leading-relaxed text-ink-muted">
                  {event.summary}
                </p>

                <h4 className="label-mono mt-5 text-ink-muted">I was responsible for</h4>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {event.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-ink-muted">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {event.verifiedAudienceSize ? (
                  <p className="mt-4 text-xs text-ink-muted">
                    Audience: {event.verifiedAudienceSize}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-sm border border-border bg-surface p-6 text-sm text-ink-muted">
            No events published under this role yet.
          </p>
        )}

        {/*
          An honest statement of incompleteness rather than padding the page.
          PRD s27.6: a missing fact never becomes invented copy.
        */}
        <div className="mt-8 rounded-sm border border-dashed border-border p-6">
          <h3 className="text-sm font-semibold text-ink">
            More event work is being verified
          </h3>
          <p className="prose-measure mt-2 text-sm leading-relaxed text-ink-muted">
            I have hosted, co-hosted and supported more events than are listed here. They
            are not published yet because I would rather confirm each date, organiser and
            exact role than round them up from memory. This page will grow as each one is
            confirmed.
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Looking for someone for a specific date?{' '}
            <Link
              href="/contact?type=event"
              className="text-accent underline-offset-4 hover:underline"
            >
              Tell me about the event
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-sm border border-border bg-surface p-8">
          <h2 className="max-w-xl text-title font-semibold text-ink">
            Need a host, facilitator, workshop instructor or hackathon support?
          </h2>
          <p className="prose-measure mt-3 text-sm text-ink-muted">
            Tell me the date, the audience and the role you need filled.
          </p>
          <div className="mt-6">
            <CtaLink href="/contact?type=event">Discuss an event</CtaLink>
          </div>
        </div>
      </Section>
    </>
  )
}
