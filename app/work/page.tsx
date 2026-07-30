import type { Metadata } from 'next'

import { Section, SectionHeader } from '@/components/layout/section'
import { ProjectCard } from '@/components/projects/project-card'
import { WorkFilters, type FilterOption } from '@/components/projects/work-filters'
import { getPublicProjects } from '@/lib/content/queries'
import type { PortfolioProject } from '@/lib/content/schema'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Software, websites, events and community initiatives built by Mohamed Aslam, with the role and status stated for each.',
  alternates: { canonical: '/work' },
}

const FILTERS: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'software', label: 'Software & Automation' },
  { value: 'websites', label: 'Websites & Products' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'experiments', label: 'Experiments' },
]

function applyFilter(projects: PortfolioProject[], filter: string) {
  if (filter === 'all') return projects
  if (filter === 'experiments') {
    return projects.filter(
      (project) => project.status === 'concept' || project.status === 'prototype',
    )
  }
  return projects.filter((project) =>
    project.lenses.includes(filter as PortfolioProject['lenses'][number]),
  )
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter: rawFilter } = await searchParams
  const filter = FILTERS.some((f) => f.value === rawFilter) ? rawFilter! : 'all'

  const all = getPublicProjects()
  const visible = applyFilter(all, filter)
  const activeLabel = FILTERS.find((f) => f.value === filter)!.label

  return (
    <Section>
      <SectionHeader
        as="h1"
        eyebrow="Archive"
        title="Everything I can show you"
        description="Each item states what I did and where it got to. Concepts are labelled as concepts."
      />

      <WorkFilters
        options={FILTERS}
        active={filter}
        basePath="/work"
        label="Filter work by category"
      />

      {/* Announced for assistive tech when the filtered set changes. */}
      <p aria-live="polite" className="mt-6 text-sm text-ink-muted">
        {visible.length} {visible.length === 1 ? 'item' : 'items'}
        {filter === 'all' ? '' : ` in ${activeLabel}`}
      </p>

      {visible.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-sm border border-border bg-surface p-6 text-sm text-ink-muted">
          Nothing published under this filter yet.
        </p>
      )}
    </Section>
  )
}
