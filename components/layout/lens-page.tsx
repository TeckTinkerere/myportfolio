import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { ProjectCard } from '@/components/projects/project-card'
import { getProjectsByLens } from '@/lib/content/queries'
import type { PortfolioLens } from '@/lib/content/schema'

/**
 * One component behind /software, /websites, /events and /community.
 *
 * FR-02: a project is authored once. These routes reorder and reframe the
 * same content objects — they never restate them. Changing a project's
 * status or summary updates every route it appears on.
 */
export function LensPage({
  lens,
  title,
  intro,
  ctaLabel,
  ctaHref,
  emptyState,
  children,
}: {
  lens: PortfolioLens
  title: string
  intro: string
  ctaLabel: string
  ctaHref: string
  emptyState?: React.ReactNode
  children?: React.ReactNode
}) {
  const projects = getProjectsByLens(lens)

  return (
    <>
      <Section className="pb-0">
        <div className="max-w-3xl">
          <h1 className="text-headline font-semibold text-ink">{title}</h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-muted">
            {intro}
          </p>
        </div>
      </Section>

      {children}

      {projects.length > 0 ? (
        <Section aria-labelledby="lens-work-heading">
          <SectionHeader
            eyebrow="Selected work"
            title="Relevant projects"
            description="Ordered by how well each one answers the question this page is about."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      ) : (
        emptyState ?? null
      )}

      <Section className="pt-0">
        <div className="rounded-lg border border-border bg-surface p-8">
          <h2 className="max-w-xl text-title font-semibold text-ink">{ctaLabel}</h2>
          <div className="mt-6">
            <CtaLink href={ctaHref}>Start a conversation</CtaLink>
          </div>
        </div>
      </Section>
    </>
  )
}
