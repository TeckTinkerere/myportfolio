import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Section } from '@/components/layout/section'
import { EVENT_ROLE_LABELS } from '@/content/events'
import { getEventBySlug, getEventsWithDetailPages } from '@/lib/content/queries'
import type { EventRole } from '@/lib/content/schema'

/**
 * Only events with enough verified material get their own page (PRD s7.1).
 * Today that set is empty, so this route generates nothing and any direct
 * hit 404s — which is correct, rather than rendering a near-empty page.
 */
export function generateStaticParams() {
  return getEventsWithDetailPages().map((event) => ({ slug: event.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) return {}

  return {
    title: event.name,
    description: event.summary,
    alternates: { canonical: `/events/${event.slug}` },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event || !event.hasDetailPage) notFound()

  return (
    <article>
      <Section>
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-xs text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li>
              <Link href="/events" className="hover:text-ink">
                Events
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li aria-current="page" className="text-ink">
              {event.name}
            </li>
          </ol>
        </nav>

        <p className="label-mono text-accent">
          {EVENT_ROLE_LABELS[event.role as EventRole]}
        </p>
        <h1 className="mt-4 text-headline font-semibold text-ink">{event.name}</h1>
        <p className="mt-3 text-sm text-ink-muted">
          {event.organiser} · {event.date}
        </p>

        <p className="prose-measure mt-6 text-lg leading-relaxed text-ink-muted">
          {event.summary}
        </p>

        <h2 className="mt-12 text-title font-semibold text-ink">
          What I was responsible for
        </h2>
        <ul className="prose-measure mt-5 flex flex-col gap-3">
          {event.responsibilities.map((item) => (
            <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-muted">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>

        {event.testimonial ? (
          <figure className="prose-measure mt-12 rounded-lg border border-border bg-surface p-6">
            <blockquote className="font-serif text-xl leading-relaxed text-ink">
              “{event.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-ink-muted">
              {event.testimonial.attribution}
            </figcaption>
          </figure>
        ) : null}

        {event.images && event.images.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {event.images.map((image) => (
              <figure key={image.src}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-2 text-xs text-ink-muted">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        {event.publicEventUrl ? (
          <p className="mt-10 text-sm">
            <a
              href={event.publicEventUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent underline-offset-4 hover:underline"
            >
              Public event page
            </a>
          </p>
        ) : null}
      </Section>
    </article>
  )
}
