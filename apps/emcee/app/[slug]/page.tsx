import { ChevronRight, Megaphone } from 'lucide-react'
import { Section } from '@mohdaslam/ui/section'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LiveClock } from '@/components/live-clock'
import { SegmentCard } from '@/components/segment-card'
import { getPublicRunSheets, getRunSheetBySlug } from '@/lib/queries'
import { buildRunningOrder, formatDuration } from '@/lib/running-order'

/** Only published sheets get a page. A private draft generates nothing. */
export function generateStaticParams() {
  return getPublicRunSheets().map((sheet) => ({ slug: sheet.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sheet = getRunSheetBySlug(slug)
  if (!sheet) return {}

  return {
    title: sheet.title,
    description: sheet.summary,
    alternates: { canonical: `/${sheet.slug}` },
  }
}

export default async function RunSheetPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sheet = getRunSheetBySlug(slug)
  if (!sheet) notFound()

  const order = buildRunningOrder(sheet)

  // Only the four fields the clock needs cross into the client bundle. Host
  // notes, cues and speaker details stay on the server side of this
  // component — a run sheet's most sensitive content has no reason to be
  // serialised into the page just to work out what time it is.
  const clockSegments = order.segments.map(
    ({ id, title, startOffsetMinutes, endOffsetMinutes }) => ({
      id,
      title,
      startOffsetMinutes,
      endOffsetMinutes,
    }),
  )

  return (
    <article>
      <Section className="pb-0">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-xs text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Run sheets
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li aria-current="page" className="text-ink">
              {sheet.title}
            </li>
          </ol>
        </nav>

        <header>
          <p className="label-mono text-accent">
            {sheet.sheetType === 'template' ? 'Template' : 'Event run sheet'}
          </p>
          <h1 className="mt-4 font-display text-headline font-semibold text-ink">
            {sheet.title}
          </h1>
          <p className="prose-measure mt-4 text-lg leading-relaxed text-ink-muted">
            {sheet.summary}
          </p>

          {sheet.organiser || sheet.venue || sheet.date ? (
            <p className="mt-4 text-sm text-ink-muted">
              {[sheet.organiser, sheet.venue, sheet.date].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          {sheet.eventUrl ? (
            <p className="mt-4 text-sm">
              <a
                href={sheet.eventUrl}
                className="text-accent underline-offset-4 hover:underline"
              >
                See the record for this event
              </a>
            </p>
          ) : null}
        </header>
      </Section>

      <Section className="py-8">
        <LiveClock
          segments={clockSegments}
          startsAt={order.startsAt}
          endsAt={order.endsAt}
          totalMinutes={order.totalMinutes}
        />

        {/*
          Call time and doors are not segments — they are what has to have
          happened before the first one. Kept out of the running order so the
          order stays a list of things that occur in front of an audience.
        */}
        {sheet.callTime || sheet.doorsOpen ? (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {sheet.callTime ? (
              <div>
                <dt className="label-mono text-ink-muted">Call time</dt>
                <dd className="tnum mt-1 font-mono text-lg text-ink">{sheet.callTime}</dd>
              </div>
            ) : null}
            {sheet.doorsOpen ? (
              <div>
                <dt className="label-mono text-ink-muted">Doors</dt>
                <dd className="tnum mt-1 font-mono text-lg text-ink">{sheet.doorsOpen}</dd>
              </div>
            ) : null}
            <div>
              <dt className="label-mono text-ink-muted">Total runtime</dt>
              <dd className="tnum mt-1 font-mono text-lg text-ink">
                {formatDuration(order.totalMinutes)}
              </dd>
            </div>
          </dl>
        ) : null}

        {sheet.hostBrief && sheet.hostBrief.length > 0 ? (
          <section aria-labelledby="brief-heading" className="mt-10">
            <h2
              id="brief-heading"
              className="font-display text-title font-semibold text-ink"
            >
              Before you walk on
            </h2>
            <ul className="prose-measure mt-4 flex flex-col gap-3">
              {sheet.hostBrief.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-ink-muted"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Section>

      <Section aria-labelledby="order-heading" className="pt-0">
        <h2 id="order-heading" className="font-display text-title font-semibold text-ink">
          Running order
        </h2>

        {/*
          Jump list. A host mid-show does not scroll looking for a segment —
          they know roughly when it is and want it in one tap. Times are the
          label because that is how the room is being tracked.
        */}
        <nav aria-label="Jump to a segment" className="mt-5">
          <ul className="flex flex-wrap gap-px overflow-hidden rounded-sm border border-border bg-border">
            {order.segments.map((segment) => (
              <li key={segment.id} className="flex-1">
                <a
                  href={`#${segment.id}`}
                  className="label-mono flex h-full min-w-max flex-col items-start gap-0.5 bg-surface px-3 py-2.5 text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                >
                  <span className="tnum text-ink">{segment.startsAt}</span>
                  <span className="max-w-[12ch] truncate">{segment.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ol className="mt-6 flex flex-col gap-4">
          {order.segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} />
          ))}
        </ol>

        <p className="tnum mt-6 text-sm text-ink-muted">
          Ends {order.endsAt} · {formatDuration(order.totalMinutes)} total
        </p>
      </Section>

      {sheet.announcements && sheet.announcements.length > 0 ? (
        <Section aria-labelledby="announcements-heading" className="pt-0">
          <h2
            id="announcements-heading"
            className="font-display text-title font-semibold text-ink"
          >
            Announcements
          </h2>
          <p className="prose-measure mt-3 text-sm leading-relaxed text-ink-muted">
            Things that have to be said out loud at some point in the evening, kept
            together so none of them is the one that gets forgotten.
          </p>

          <ul className="mt-6 flex flex-col gap-4">
            {sheet.announcements.map((announcement) => {
              const target = announcement.segmentId
                ? order.segments.find((segment) => segment.id === announcement.segmentId)
                : undefined

              return (
                <li key={announcement.label} className="panel rounded-sm p-5">
                  <h3 className="label-mono flex items-center gap-2 text-accent">
                    <Megaphone aria-hidden className="size-3.5" />
                    {announcement.label}
                  </h3>
                  <p className="prose-measure mt-3 text-sm leading-relaxed text-ink-muted">
                    {announcement.text}
                  </p>
                  {target ? (
                    <p className="mt-3 text-xs">
                      <a
                        href={`#${target.id}`}
                        className="tnum label-mono text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                      >
                        During {target.startsAt} — {target.title}
                      </a>
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </Section>
      ) : null}
    </article>
  )
}
