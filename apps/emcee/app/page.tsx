import { Clock, Mail } from 'lucide-react'
import { cn } from '@mohdaslam/ui/cn'
import { StageIllustration } from '@mohdaslam/ui/illustrations'
import { Section, SectionHeader } from '@mohdaslam/ui/section'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Illustration } from '@/components/art'
import { approach, formats, hostedRooms } from '@/content/hosting'
import { bookingHref, emceeConfig } from '@/content/site-config'
import { getPublicRunSheets } from '@/lib/queries'
import { buildRunningOrder, formatDuration } from '@/lib/running-order'

export const metadata: Metadata = {
  title: { absolute: `${emceeConfig.owner} — Host & Emcee` },
  description: emceeConfig.description,
  alternates: { canonical: '/' },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthYear(date: string) {
  const [year, month] = date.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

export default function HomePage() {
  // A room with a confirmed audience leads; the rest run newest first.
  const rooms = [...hostedRooms].sort(
    (a, b) => Number(!!b.audience) - Number(!!a.audience) || b.date.localeCompare(a.date),
  )
  const largest = hostedRooms.find((room) => room.audience)?.audience

  return (
    <>
      <Hero largest={largest} roomCount={hostedRooms.length} />
      <Rooms rooms={rooms} />
      <Approach />
      <RunSheets />
      <Book />
    </>
  )
}

function Hero({ largest, roomCount }: { largest?: string; roomCount: number }) {
  const stats = [
    { value: String(roomCount), label: 'Rooms led' },
    ...(largest ? [{ value: largest, label: 'Largest audience' }] : []),
    { value: String(formats.length), label: 'Formats' },
  ]

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
      <Section className="relative pt-10 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="hero-seq">
            <p className="label-mono text-accent">
              {emceeConfig.descriptor} · {emceeConfig.location}
            </p>
            <h1 className="mt-5 font-display text-display font-semibold text-ink">
              {emceeConfig.headline}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
              Tech meetups, hackathons and workshops.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={bookingHref}
                className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
              >
                <Mail aria-hidden className="size-4" />
                Book me for your event
              </a>
              <a
                href="#rooms"
                className="inline-flex items-center gap-2.5 rounded-sm border border-border-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
              >
                See the rooms
              </a>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="label-mono mt-1 text-ink-muted">{stat.label}</dt>
                  <dd className="tnum font-display text-4xl font-semibold text-accent">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="panel relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/on-stage.jpg"
                alt={`${emceeConfig.owner} speaking at a technology workshop`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover object-top"
              />
            </div>
            <p className="label-mono absolute -bottom-3 left-4 rounded-sm bg-accent px-2.5 py-1.5 text-accent-contrast">
              ● On mic
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Rooms({ rooms }: { rooms: typeof hostedRooms }) {
  return (
    <Section id="rooms" aria-label="Rooms hosted">
      <SectionHeader eyebrow="Rooms" title="Where I’ve been at the front" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <li
            key={room.name}
            // The biggest room leads, twice the width, so the strongest proof
            // is the first thing the eye lands on.
            className={index === 0 ? 'sm:col-span-2' : undefined}
          >
            <article className="panel flex h-full flex-col rounded-sm">
              <div
                className={cn(
                  'relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-surface-raised px-12 py-4',
                  index === 0 && 'sm:aspect-[5/2]',
                )}
              >
                <Illustration art={room.art} className="max-h-full" />
                <span className="label-mono absolute left-3 top-3 rounded-sm border border-border bg-surface px-2 py-1 text-ink-muted">
                  {monthYear(room.date)}
                </span>
                {room.audience ? (
                  <span className="label-mono absolute right-3 top-3 rounded-sm bg-accent px-2 py-1 text-accent-contrast">
                    {room.audience} people
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="label-mono text-accent">{room.role}</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  {room.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{room.organiser}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{room.line}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Approach() {
  return (
    <Section id="approach" aria-label="Approach" className="pt-0">
      <SectionHeader eyebrow="Approach" title="How I run a room" />
      {/* Numbered because it genuinely is a sequence: each step feeds the next. */}
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {approach.map((step, index) => (
          <li key={step.title} className="panel flex flex-col rounded-sm">
            <div className="flex aspect-[3/2] items-center justify-center border-b border-border bg-surface-raised px-8 py-4">
              <Illustration art={step.art} className="max-h-full" />
            </div>
            <div className="p-5">
              <p className="label-mono tnum text-accent">0{index + 1}</p>
              <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function RunSheets() {
  const sheets = getPublicRunSheets()
  if (sheets.length === 0) return null

  return (
    <Section id="run-sheets" aria-label="Run sheets" className="pt-0">
      <SectionHeader
        eyebrow="Run sheets"
        title="The sheet I host from"
        description="Timed running order, host notes and handoffs, readable from a phone mid-show."
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {sheets.map((sheet) => {
          const order = buildRunningOrder(sheet)
          return (
            <li key={sheet.slug}>
              <article className="panel group relative grid h-full overflow-hidden rounded-sm transition-colors hover:border-border-strong sm:grid-cols-[1fr_1.1fr]">
                <div className="flex items-center justify-center border-b border-border bg-surface-raised p-6 sm:border-b-0 sm:border-r">
                  <Illustration
                    art="runsheet"
                    className="max-w-[14rem] transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col p-5">
                  <span className="label-mono text-accent">
                    {sheet.sheetType === 'template' ? 'Template' : 'Event sheet'}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                    <Link href={`/${sheet.slug}`} className="after:absolute after:inset-0">
                      {sheet.title}
                    </Link>
                  </h3>
                  <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-ink-muted">
                    <Clock aria-hidden className="size-3" />
                    <span className="tnum">
                      {order.startsAt} – {order.endsAt} · {formatDuration(order.totalMinutes)} ·{' '}
                      {order.segments.length} segments
                    </span>
                  </p>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Book() {
  return (
    <Section id="book" aria-labelledby="book-heading" className="pt-0">
      <div className="panel grid overflow-hidden rounded-sm lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="label-mono text-accent">Book</p>
          <h2
            id="book-heading"
            className="mt-3 font-display text-headline font-semibold text-ink"
          >
            Need a host?
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Send the date, the audience size and the format.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {formats.map((format) => (
              <li
                key={format.title}
                className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm text-ink"
              >
                <span className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-surface-raised">
                  <Illustration art={format.art} className="w-9" />
                </span>
                {format.title}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={bookingHref}
              className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
            >
              <Mail aria-hidden className="size-4" />
              Email me
            </a>
            <a
              href={emceeConfig.booking.linkedin}
              className="inline-flex items-center gap-2.5 rounded-sm border border-border-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="flex items-end border-t border-border bg-surface-raised px-6 pt-8 lg:border-l lg:border-t-0">
          <StageIllustration />
        </div>
      </div>
    </Section>
  )
}
