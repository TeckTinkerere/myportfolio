import { Clock } from 'lucide-react'
import { Section, SectionHeader } from '@mohdaslam/ui/section'
import type { Metadata } from 'next'
import Link from 'next/link'

import { emceeConfig } from '@/content/site-config'
import { getPublicRunSheets } from '@/lib/queries'
import { buildRunningOrder, formatDuration } from '@/lib/running-order'

export const metadata: Metadata = {
  title: 'Run sheets',
  description: emceeConfig.description,
  alternates: { canonical: '/' },
}

export default function RunSheetIndexPage() {
  const sheets = getPublicRunSheets()

  return (
    <>
      <Section className="pb-0">
        <div className="max-w-3xl">
          <p className="label-mono text-accent">Hosting</p>
          <h1 className="mt-4 font-display text-headline font-semibold text-ink">
            The sheet I am actually holding.
          </h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-muted">
            A run sheet is not a programme. A programme tells an audience what is
            happening; a run sheet tells the person at the front what to say, how long
            they have, and how to get from one thing to the next. These are built to be
            read at arm’s length, on a phone, between looking back up at a room.
          </p>
        </div>
      </Section>

      <Section aria-labelledby="sheets-heading">
        <SectionHeader
          eyebrow="Run sheets"
          title="Published sheets"
          description="Sheets still being agreed with an organiser are private and have no page here."
        />
        <h2 id="sheets-heading" className="sr-only">
          Published run sheets
        </h2>

        {sheets.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2">
            {sheets.map((sheet) => {
              const order = buildRunningOrder(sheet)
              return (
                <li key={sheet.slug}>
                  <article className="panel group relative flex h-full flex-col rounded-sm p-5 transition-colors hover:border-border-strong">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="label-mono text-accent">
                        {sheet.sheetType === 'template' ? 'Template' : 'Event sheet'}
                      </span>
                      {sheet.date ? (
                        <span className="tnum text-xs text-ink-muted">{sheet.date}</span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                      <Link href={`/${sheet.slug}`} className="after:absolute after:inset-0">
                        {sheet.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {sheet.summary}
                    </p>

                    <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-ink-muted">
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">Runtime</dt>
                        <Clock aria-hidden className="size-3" />
                        <dd className="tnum">
                          {order.startsAt} – {order.endsAt} ·{' '}
                          {formatDuration(order.totalMinutes)}
                        </dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Segments</dt>
                        <dd className="tnum">
                          {order.segments.length}{' '}
                          {order.segments.length === 1 ? 'segment' : 'segments'}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-sm border border-border bg-surface p-6 text-sm text-ink-muted">
            No run sheets are published yet.
          </p>
        )}
      </Section>

      <Section className="pt-0">
        <div className="rounded-sm border border-border bg-surface p-8">
          <h2 className="max-w-xl text-title font-semibold text-ink">
            Looking for the events themselves?
          </h2>
          <p className="prose-measure mt-3 text-sm text-ink-muted">
            The record of what {emceeConfig.owner} has hosted, facilitated and supported
            — with the exact role stated for each — lives on the portfolio.
          </p>
          <div className="mt-6">
            <a
              href={`${emceeConfig.portfolioUrl}/events`}
              className="inline-flex items-center gap-2.5 rounded-sm border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
            >
              Event record
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
