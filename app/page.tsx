import Link from 'next/link'

import { EventCard } from '@/components/events/event-card'
import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/motion/reveal'
import { ProjectCard } from '@/components/projects/project-card'
import { PersonSchema } from '@/components/seo/person-schema'
import { GridBackdrop, Panel } from '@/components/system/panel'
import { SystemField } from '@/components/three/system-field'
import { SystemFieldStatic } from '@/components/three/system-field-static'
import { principles } from '@/content/profile'
import { placements } from '@/content/recognition'
import { capabilityRoutes, siteConfig } from '@/content/site-config'
import { getFeaturedProjects, getPublicEvents, getPublicProjects } from '@/lib/content/queries'
import { buildSystemField } from '@/lib/content/system-field'
import { STATUS_LABELS } from '@/lib/content/public-view'

export default function HomePage() {
  // Three projects plus the strongest event record, so the four featured
  // slots span a product, a platform, a community initiative and
  // facilitation rather than four of the same thing.
  const featured = getFeaturedProjects('general', 3)
  const featuredEvent = getPublicEvents()[0]
  const field = buildSystemField()

  return (
    <>
      <PersonSchema />
      <Hero field={field} />
      <Capabilities />
      <SelectedWork projects={featured} event={featuredEvent} />
      <Recognition />
      <WorkingStyle />
      <FinalCta />
    </>
  )
}

function Hero({ field }: { field: ReturnType<typeof buildSystemField> }) {
  const projects = getPublicProjects()

  // Live status readout, counted from the same data the field is drawn from.
  const counts = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.status] = (acc[project.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="relative overflow-hidden">
      <GridBackdrop />

      <Section className="relative pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <div className="hero-seq">
            <p className="label-mono text-accent">
              Singapore · Technology · Products · Events
            </p>

            <h1 className="mt-6 font-display text-display font-semibold text-ink">
              {siteConfig.headline}
            </h1>

            <p className="prose-measure mt-6 text-lg leading-relaxed text-ink-muted">
              {siteConfig.positioning}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="/work">Explore selected work</CtaLink>
              <CtaLink href="/contact" variant="secondary">
                Discuss an opportunity
              </CtaLink>
            </div>

            {/* Single source: content/site-config.ts. Never restated. */}
            <div className="mt-10 max-w-xl border-l-2 border-accent/50 pl-4">
              <p className="label-mono text-accent">Status</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {siteConfig.status}
              </p>
            </div>
          </div>

          {/*
            The signature element. Every node is one published project, placed
            by discipline and coloured by its real status — so it cannot drift
            from the truth, and it updates itself when the content does.
          */}
          <div className="relative order-first lg:order-none">
            <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
              <SystemFieldStatic data={field} />
              <SystemField data={field} />
            </div>

            <Panel
              designation="Published work"
              meta={`${projects.length} items`}
              className="mx-auto mt-4 max-w-[26rem]"
            >
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 sm:grid-cols-3">
                {Object.entries(counts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => (
                    <div key={status} className="flex items-baseline gap-2">
                      <dt className="label-mono truncate text-ink-muted">
                        {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                      </dt>
                      <dd className="label-mono tnum ml-auto text-ink">{count}</dd>
                    </div>
                  ))}
              </dl>
            </Panel>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Capabilities() {
  return (
    <Section aria-labelledby="capabilities-heading" className="pt-4">
      <h2 id="capabilities-heading" className="sr-only">
        What I work on
      </h2>
      <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {capabilityRoutes.map((route, index) => (
          <li key={route.href}>
            <Reveal delay={index * 60}>
              <Link
                href={route.href}
                className="group flex h-full flex-col bg-surface p-5 transition-colors hover:bg-surface-raised"
              >
                <span className="label-mono text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Open
                </span>
                <h3 className="mt-3 text-sm font-semibold text-ink">{route.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {route.description}
                </p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function SelectedWork({
  projects,
  event,
}: {
  projects: ReturnType<typeof getFeaturedProjects>
  event?: ReturnType<typeof getPublicEvents>[number]
}) {
  return (
    <Section aria-labelledby="work-heading">
      <SectionHeader
        eyebrow="Selected work"
        title="Things I built, ran, or helped happen"
        description="Four pieces of work that show the range: a product, a platform, a community initiative and facilitation."
        action={
          <Link
            href="/work"
            className="label-mono text-accent underline-offset-4 hover:underline"
          >
            View all work →
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 70}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
        {event ? (
          <Reveal delay={projects.length * 70}>
            <EventCard event={event} />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

/**
 * The evidence strip renders qualitative proof, not metrics: no metric in
 * the content set currently passes verification, and an unsourced number is
 * worse than none.
 */
function Recognition() {
  if (placements.length === 0) return null

  return (
    <Section aria-labelledby="recognition-heading" className="pt-0">
      <Panel designation="Third-party recognition" meta="Verified">
        <h2 id="recognition-heading" className="sr-only">
          Recognition
        </h2>
        <ul className="grid gap-px bg-border sm:grid-cols-3">
          {placements.map((item) => (
            <li key={item.slug} className="bg-surface p-5">
              <p className="font-display text-2xl font-semibold text-accent">
                {item.placement}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">
                {item.title}
              </p>
              <p className="label-mono tnum mt-2 text-ink-muted">
                {item.issuer} · {item.date.slice(0, 4)}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </Section>
  )
}

function WorkingStyle() {
  return (
    <Section aria-labelledby="style-heading">
      <SectionHeader
        eyebrow="How I work"
        title="Useful where a project needs both building and follow-through"
        description="I can move between technical implementation, product decisions, operations and communication without losing sight of the people using the result."
      />
      {/* Numbered because this genuinely is a sequence — each step depends on
          the one before it. Nothing else on the page is numbered. */}
      <ol className="grid gap-4 sm:grid-cols-3">
        {principles.map((principle, index) => (
          <Reveal as="li" key={principle.title} delay={index * 70}>
            <Panel className="h-full" designation={`Step ${index + 1}`}>
              <div className="p-5">
                <h3 className="text-base font-semibold text-ink">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {principle.body}
                </p>
              </div>
            </Panel>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

function FinalCta() {
  return (
    <Section aria-labelledby="cta-heading">
      <Panel designation="Get in touch" className="relative overflow-hidden">
        <div className="p-8 sm:p-12">
          <h2
            id="cta-heading"
            className="max-w-2xl font-display text-headline font-semibold text-ink"
          >
            Have a technical problem, website, event, or community idea worth moving
            forward?
          </h2>
          <div className="mt-8">
            <CtaLink href="/contact">Discuss an opportunity</CtaLink>
          </div>
        </div>
      </Panel>
    </Section>
  )
}
