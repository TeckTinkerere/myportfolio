import 'server-only'

import { projects } from '@/content/projects'
import { events } from '@/content/events'
import { recognition } from '@/content/recognition'
import type {
  EventRole,
  PortfolioEvent,
  PortfolioLens,
  PortfolioProject,
  Recognition,
  VerifiedMetric,
} from '@/lib/content/schema'

/**
 * The publication boundary.
 *
 * `import 'server-only'` means any client component that reaches for this
 * module fails the build instead of silently bundling the full content set.
 * Route pages call these functions and hand components only what should be
 * public — see lib/content/public-view.ts for the narrowing step.
 *
 * Confidentiality is enforced here, once, rather than at each call site.
 */

/** Visible to anyone. Sanitised pages are public pages with detail withheld. */
function isPublished(item: { visibility: string; permissionStatus: string }): boolean {
  const visibleKind = item.visibility === 'public' || item.visibility === 'sanitised'
  const permitted =
    item.permissionStatus === 'approved' || item.permissionStatus === 'not-required'
  return visibleKind && permitted
}

export function getPublicProjects(): PortfolioProject[] {
  return projects.filter(isPublished)
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return getPublicProjects().find((project) => project.slug === slug)
}

/**
 * Ordering for a capability route. Items carrying an explicit rank for this
 * lens come first, then the rest by status weight so live work outranks
 * concepts.
 */
export function getProjectsByLens(lens: PortfolioLens): PortfolioProject[] {
  return getPublicProjects()
    .filter((project) => project.lenses.includes(lens))
    .sort((a, b) => {
      const rankA = a.featuredRank?.[lens] ?? Number.POSITIVE_INFINITY
      const rankB = b.featuredRank?.[lens] ?? Number.POSITIVE_INFINITY
      if (rankA !== rankB) return rankA - rankB
      return statusWeight(a) - statusWeight(b)
    })
}

export function getFeaturedProjects(lens: PortfolioLens, limit?: number) {
  const ranked = getPublicProjects()
    .filter((project) => project.featuredRank?.[lens] !== undefined)
    .sort((a, b) => a.featuredRank![lens]! - b.featuredRank![lens]!)
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked
}

export function getCaseStudies(): PortfolioProject[] {
  return getPublicProjects().filter((project) => project.tier === 1)
}

const STATUS_ORDER: Record<PortfolioProject['status'], number> = {
  live: 0,
  'pilot-completed': 1,
  'in-development': 2,
  prototype: 3,
  archived: 4,
  concept: 5,
  confidential: 6,
}

function statusWeight(project: PortfolioProject): number {
  return STATUS_ORDER[project.status]
}

export function getPublicEvents(): PortfolioEvent[] {
  return events.filter(isPublished).sort((a, b) => b.date.localeCompare(a.date))
}

export function getEventBySlug(slug: string): PortfolioEvent | undefined {
  return getPublicEvents().find((event) => event.slug === slug)
}

export function getEventsByRole(role: EventRole): PortfolioEvent[] {
  return getPublicEvents().filter((event) => event.role === role)
}

/** Only events with enough verified material get a dedicated page. */
export function getEventsWithDetailPages(): PortfolioEvent[] {
  return getPublicEvents().filter((event) => event.hasDetailPage)
}

export function getRecognition(): Recognition[] {
  return recognition
    .filter(
      (item) =>
        item.permissionStatus === 'approved' || item.permissionStatus === 'not-required',
    )
    .sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * PRD s8.6: a metric may only be rendered when it is verified and cleared.
 * Components never touch project.metrics directly — they call this, so an
 * unverified claim has no path to the page.
 */
export function getDisplayableMetrics(project: PortfolioProject): VerifiedMetric[] {
  return (project.metrics ?? []).filter(
    (metric) =>
      metric.verified &&
      (metric.permissionStatus === 'approved' ||
        metric.permissionStatus === 'not-required'),
  )
}

/** Evidence links that are safe to expose on a public page (PRD s11.9). */
export function getPublicEvidence(project: PortfolioProject) {
  return (project.evidence ?? []).filter((link) => link.public)
}

/**
 * Related work by shared lens, then shared technology — never by popularity
 * (PRD s11.10).
 */
export function getRelatedProjects(project: PortfolioProject, limit = 2) {
  const tech = new Set(project.technologies ?? [])
  return getPublicProjects()
    .filter((candidate) => candidate.slug !== project.slug)
    .map((candidate) => {
      const sharedLenses = candidate.lenses.filter((lens) =>
        project.lenses.includes(lens),
      ).length
      const sharedTech = (candidate.technologies ?? []).filter((t) => tech.has(t)).length
      return { candidate, score: sharedLenses * 2 + sharedTech }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || statusWeight(a.candidate) - statusWeight(b.candidate))
    .slice(0, limit)
    .map((entry) => entry.candidate)
}
