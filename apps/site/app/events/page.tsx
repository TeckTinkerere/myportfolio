import { StageIllustration } from '@mohdaslam/ui/illustrations'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ROLE_ART } from '@/components/illustrations/art'
import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { WorkFilters, type FilterOption } from '@/components/projects/work-filters'
import { RoleLadder } from '@/components/system/diagram'
import { EVENT_ROLE_LABELS } from '@/content/events'
import { siteConfig } from '@/content/site-config'
import { getPublicEvents } from '@/lib/content/queries'
import type { EventRole, PortfolioEvent } from '@/lib/content/schema'

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

const hasRole = (event: PortfolioEvent, role: string) =>
  event.role === role || event.secondaryRoles?.includes(role as EventRole)

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role: rawRole } = await searchParams
  const role = ROLE_FILTERS.some((f) => f.value === rawRole) ? rawRole! : 'all'

  const all = getPublicEvents()
  // Matches primary or secondary role, consistent with the ladder count below
  // and with getEventsByRole() — a multi-hat event should surface under
  // every role it filters by, not just the one chosen as primary.
  const visible = role === 'all' ? all : all.filter((event) => hasRole(event, role))

  // Every figure is counted from the published record, never typed in.
  const largestAudience = all.find((event) => event.verifiedAudienceSize)?.verifiedAudienceSize
  const stats = [
    { value: String(all.length), label: 'Events' },
    { value: String(all.filter((e) => hasRole(e, 'host-emcee')).length), label: 'Hosted' },
    { value: String(new Set(all.map((e) => e.organiser)).size), label: 'Organisers' },
    ...(largestAudience ? [{ value: largestAudience, label: 'Largest room' }] : []),
  ]

  return (
    <>
      <Section className="pb-0">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="label-mono text-accent">Events · Workshops · Hackathons</p>
            <h1 className="mt-4 font-display text-headline font-semibold text-ink">
              Technology events that stay clear, energetic, and human.
            </h1>
            <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-muted">
              Every entry names the exact role I played.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse bg-surface p-4">
                  <dt className="label-mono mt-1 text-ink-muted">{stat.label}</dt>
                  <dd className="tnum font-display text-3xl font-semibold text-accent">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm border border-border bg-surface-raised">
            <Image
              src="/images/events/facilitating.jpg"
              alt={`${siteConfig.name} speaking at a technology workshop`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 24rem"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Section>

      <Section aria-label="Event record">
        <SectionHeader eyebrow="Event record" title="What I have actually done" />

        {/*
          The ladder counts a role wherever it appears, primary or secondary
          — matching the filter logic below — so a multi-hat event credits
          every role it genuinely evidences.
        */}
        <RoleLadder
          caption="Roles across the record, primary and secondary."
          rungs={Object.entries(EVENT_ROLE_LABELS).map(([value, label]) => ({
            label,
            count: all.filter((event) => hasRole(event, value)).length,
          }))}
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
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event) => (
              <li key={event.slug}>
                <EventTile event={event} />
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
        <p className="mt-8 text-sm text-ink-muted">
          More events are still being verified.{' '}
          <Link
            href="/contact?type=event"
            className="text-accent underline-offset-4 hover:underline"
          >
            Need someone for a date?
          </Link>
        </p>
      </Section>

      {/*
        The hosting craft, next to the hosting record. It is a separate site
        now, so this is a plain anchor rather than a <Link> — there is no
        client-side route to prefetch across an origin.
      */}
      <Section className="pt-0">
        <a
          href={siteConfig.emceeUrl}
          className="panel group grid overflow-hidden rounded-sm transition-colors hover:border-border-strong sm:grid-cols-[1fr_1.2fr]"
        >
          <div className="flex flex-col justify-center p-8">
            <p className="label-mono text-accent">Host &amp; emcee</p>
            <h2 className="mt-3 font-display text-title font-semibold text-ink">
              See how I run a room
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              My hosting site: rooms, approach and run sheets.
            </p>
            <span className="label-mono mt-6 text-accent">Visit the emcee site →</span>
          </div>
          <div className="border-t border-border bg-surface-raised p-6 sm:border-l sm:border-t-0">
            <StageIllustration className="transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
        </a>
      </Section>

      <Section className="pt-0">
        <div className="rounded-sm border border-border bg-surface p-8">
          <h2 className="max-w-xl text-title font-semibold text-ink">
            Need a host, facilitator, instructor or hackathon crew?
          </h2>
          <div className="mt-6">
            <CtaLink href="/contact?type=event">Discuss an event</CtaLink>
          </div>
        </div>
      </Section>
    </>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * One event as a picture first: the role's illustration, a date stamp, the
 * name. The full role label and responsibilities stay on the page — folded
 * into a disclosure rather than removed, so nothing is hidden from search
 * or from anyone who wants the detail.
 */
function EventTile({ event }: { event: PortfolioEvent }) {
  const Art = ROLE_ART[event.role as EventRole]
  const [year, month, day] = event.date.split('-')

  return (
    <article className="panel flex h-full flex-col rounded-sm">
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-surface-raised px-12 py-4">
        <Art className="max-h-full" />
        <time
          dateTime={event.date}
          className="absolute left-3 top-3 flex flex-col items-center rounded-sm border border-border bg-surface px-2.5 py-1.5 leading-none"
        >
          <span className="tnum font-display text-lg font-semibold text-ink">
            {Number(day)}
          </span>
          <span className="label-mono mt-1 text-ink-muted">
            {MONTHS[Number(month) - 1]} {year?.slice(2)}
          </span>
        </time>
        {event.verifiedAudienceSize ? (
          <span className="label-mono absolute right-3 top-3 rounded-sm bg-accent px-2 py-1 text-accent-contrast">
            {event.verifiedAudienceSize} people
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label-mono text-accent">{EVENT_ROLE_LABELS[event.role as EventRole]}</p>
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-ink">
          {event.name}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{event.organiser}</p>

        {event.secondaryRoles?.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Also">
            {event.secondaryRoles.map((secondary) => (
              <li
                key={secondary}
                className="rounded-full border border-border px-2 py-0.5 text-[0.7rem] text-ink-muted"
              >
                {EVENT_ROLE_LABELS[secondary]}
              </li>
            ))}
          </ul>
        ) : null}

        <div aria-hidden className="min-h-4 flex-1" />
        <details className="group border-t border-border pt-3">
          <summary className="label-mono flex cursor-pointer list-none items-center justify-between text-ink-muted hover:text-ink [&::-webkit-details-marker]:hidden">
            What I did
            <span aria-hidden className="transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink">{event.summary}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {event.responsibilities.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </article>
  )
}
