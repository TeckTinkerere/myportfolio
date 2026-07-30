import { ArrowUpRight, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Section } from '@/components/layout/section'
import { CaseSpine } from '@/components/system/diagram'
import { ProjectCard } from '@/components/projects/project-card'
import { StatusBadge } from '@/components/projects/status-badge'
import { siteConfig } from '@/content/site-config'
import {
  getDisplayableMetrics,
  getProjectBySlug,
  getPublicEvidence,
  getPublicProjects,
  getRelatedProjects,
} from '@/lib/content/queries'
import { STATUS_LABELS } from '@/lib/content/public-view'

/** Only published projects get a page — private and pending items are absent. */
export function generateStaticParams() {
  return getPublicProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const title = project.seoTitle ?? `${project.title} case study`
  const description = project.seoDescription ?? project.shortSummary

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `/work/${project.slug}`,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const metrics = getDisplayableMetrics(project)
  const evidence = getPublicEvidence(project)
  const related = getRelatedProjects(project)

  return (
    <article>
      <Section className="pb-0">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-xs text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li>
              <Link href="/work" className="hover:text-ink">
                Work
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li aria-current="page" className="text-ink">
              {project.title}
            </li>
          </ol>
        </nav>

        <header>
          <div className="flex flex-wrap items-center gap-4">
            <span className="label-mono text-accent">{project.proofVerb}</span>
            <StatusBadge status={project.status} />
          </div>

          <h1 className="mt-4 font-display text-headline font-semibold text-ink">{project.title}</h1>
          <p className="prose-measure mt-4 text-lg leading-relaxed text-ink-muted">
            {project.oneLiner}
          </p>
        </header>

        {project.confidentialityNote ? (
          <p className="prose-measure mt-8 rounded-sm border border-accent/40 bg-surface-raised p-4 text-sm leading-relaxed text-ink-muted">
            {project.confidentialityNote}
          </p>
        ) : null}

        {project.coverImage ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm border border-border bg-surface-raised">
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        ) : null}
      </Section>

      {/* PRD s11.2 — the facts, before the narrative. */}
      <Section aria-labelledby="snapshot-heading" className="pb-0">
        <h2 id="snapshot-heading" className="sr-only">
          Snapshot
        </h2>
        <dl className="grid gap-x-8 gap-y-6 rounded-sm border border-border bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="My role" value={project.role} />
          <Fact label="Timeframe" value={project.timeframeLabel} />
          <Fact label="Status" value={STATUS_LABELS[project.status]} />
          {project.organisation ? (
            <Fact label="Organisation" value={project.organisation} />
          ) : project.teamSize ? (
            <Fact label="Team size" value={String(project.teamSize)} />
          ) : project.location ? (
            <Fact label="Location" value={project.location} />
          ) : null}
        </dl>
      </Section>

      <Section aria-labelledby="challenge-heading">
        <h2 id="challenge-heading" className="font-display text-title font-semibold text-ink">
          The problem
        </h2>
        <div className="prose-measure mt-4">
          <p>{project.longSummary ?? project.shortSummary}</p>
        </div>
      </Section>

      {/*
        The spine replaces four stacked list sections — what I owned,
        constraints, outcome, reflection — with one scannable view of the
        whole arc. The lists are still there for assistive tech, inside the
        diagram component.
      */}
      <Section aria-labelledby="spine-heading" className="pt-0">
        <h2 id="spine-heading" className="sr-only">
          How the project ran
        </h2>
        <CaseSpine
          caption="What I owned, what constrained it, and where it got to."
          stages={[
            { label: 'I owned', items: project.responsibilities },
            { label: 'Constraints', items: project.constraints },
            { label: 'Outcome', items: project.outcomes },
            { label: 'Learned', items: project.learnings ?? [] },
          ]}
        />
      </Section>

      {metrics.length > 0 ? (
        <Section aria-labelledby="metrics-heading" className="pt-0">
          <h2 id="metrics-heading" className="sr-only">
            Verified metrics
          </h2>
          <dl className="grid gap-5 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-sm border border-border p-5">
                <dt className="text-sm text-ink-muted">{metric.label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-ink">{metric.value}</dd>
                {metric.publicSourceUrl ? (
                  <a
                    href={metric.publicSourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    Source
                    <ArrowUpRight aria-hidden className="size-3" />
                  </a>
                ) : null}
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {project.technologies && project.technologies.length > 0 ? (
        <Section aria-labelledby="tech-heading" className="pt-0">
          <h2 id="tech-heading" className="label-mono text-ink-muted">
            Built with
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {evidence.length > 0 ? (
        <Section aria-labelledby="evidence-heading" className="pt-0">
          <h2 id="evidence-heading" className="font-display text-title font-semibold text-ink">
            Evidence
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {evidence.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-sm text-ink hover:text-accent"
                >
                  <span className="label-mono text-ink-muted">{link.type}</span>
                  <span className="underline-offset-4 group-hover:underline">
                    {link.label}
                  </span>
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section aria-labelledby="related-heading" className="pt-0">
          <h2 id="related-heading" className="font-display text-title font-semibold text-ink">
            Related work
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-mono text-ink-muted">{label}</dt>
      <dd className="mt-1.5 text-sm text-ink">{value}</dd>
    </div>
  )
}

