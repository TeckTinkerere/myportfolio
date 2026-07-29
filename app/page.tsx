import Link from 'next/link'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { ProjectCard } from '@/components/projects/project-card'
import { PersonSchema } from '@/components/seo/person-schema'
import { principles } from '@/content/profile'
import { placements } from '@/content/recognition'
import { capabilityRoutes, siteConfig } from '@/content/site-config'
import { getFeaturedProjects } from '@/lib/content/queries'

export default function HomePage() {
  const featured = getFeaturedProjects('general', 4)

  return (
    <>
      <PersonSchema />
      <Hero />
      <Capabilities />
      <SelectedWork projects={featured} />
      <Recognition />
      <WorkingStyle />
      <FinalCta />
    </>
  )
}

function Hero() {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="max-w-4xl">
        <p className="label-mono text-accent">
          Singapore · Technology · Products · Events
        </p>

        <h1 className="mt-6 text-display font-semibold text-ink">
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

        {/* Single source: content/site-config.ts. Never restated elsewhere. */}
        <p className="mt-9 max-w-xl border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-ink-muted">
          {siteConfig.status}
        </p>
      </div>
    </Section>
  )
}

function Capabilities() {
  return (
    <Section aria-labelledby="capabilities-heading" className="pt-0">
      <h2 id="capabilities-heading" className="sr-only">
        What I work on
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {capabilityRoutes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/60"
            >
              <h3 className="text-sm font-semibold text-ink">{route.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {route.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function SelectedWork({
  projects,
}: {
  projects: ReturnType<typeof getFeaturedProjects>
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
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            View all work
          </Link>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  )
}

/**
 * PRD s8.6 requires an evidence strip only where metrics are verified. No
 * metric in the content set currently passes verification, so this renders
 * the qualitative fallback: dated, attributable third-party results.
 */
function Recognition() {
  if (placements.length === 0) return null

  return (
    <Section aria-labelledby="recognition-heading" className="pt-0">
      <div className="rounded-lg border border-border bg-surface-raised p-6 sm:p-8">
        <h2 id="recognition-heading" className="label-mono text-ink-muted">
          Recognised by
        </h2>
        <ul className="mt-5 grid gap-5 sm:grid-cols-3">
          {placements.map((item) => (
            <li key={item.slug}>
              <p className="text-sm font-semibold text-accent">{item.placement}</p>
              <p className="mt-1 text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {item.issuer} · {item.date.slice(0, 4)}
              </p>
            </li>
          ))}
        </ul>
      </div>
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
      <ol className="grid gap-5 sm:grid-cols-3">
        {principles.map((principle, index) => (
          <li key={principle.title} className="rounded-lg border border-border p-5">
            <span className="label-mono text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-base font-semibold text-ink">{principle.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {principle.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function FinalCta() {
  return (
    <Section aria-labelledby="cta-heading">
      <div className="rounded-lg border border-border bg-surface p-8 sm:p-12">
        <h2
          id="cta-heading"
          className="max-w-2xl font-serif text-headline text-ink"
        >
          Have a technical problem, website, event, or community idea worth moving
          forward?
        </h2>
        <div className="mt-7">
          <CtaLink href="/contact">Discuss an opportunity</CtaLink>
        </div>
      </div>
    </Section>
  )
}
