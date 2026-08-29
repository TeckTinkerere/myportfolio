import type { PortfolioProject } from '@/lib/content/schema'

/**
 * Narrows a project to the fields a client component is allowed to receive.
 *
 * Server components can render the full object directly — nothing crosses
 * into the bundle. But anything passed as a prop into a `'use client'`
 * component is serialised into the RSC payload and is therefore public.
 * Filter through here first: it drops responsibilities, constraints,
 * learnings, confidentiality notes, metrics and evidence, none of which a
 * filter or card needs.
 */
export type PublicProjectSummary = {
  slug: string
  title: string
  proofVerb: string
  oneLiner: string
  role: string
  status: PortfolioProject['status']
  lenses: PortfolioProject['lenses']
  timeframeLabel: string
  tier: 1 | 2
  coverImage?: { src: string; alt: string }
}

export function toPublicSummary(project: PortfolioProject): PublicProjectSummary {
  return {
    slug: project.slug,
    title: project.title,
    proofVerb: project.proofVerb,
    oneLiner: project.oneLiner,
    role: project.role,
    status: project.status,
    lenses: project.lenses,
    timeframeLabel: project.timeframeLabel,
    tier: project.tier,
    coverImage: project.coverImage
      ? { src: project.coverImage.src, alt: project.coverImage.alt }
      : undefined,
  }
}

export const STATUS_LABELS: Record<PortfolioProject['status'], string> = {
  live: 'Live',
  'pilot-completed': 'Pilot completed',
  prototype: 'Prototype',
  'in-development': 'In development',
  archived: 'Archived',
  concept: 'Concept',
  confidential: 'Confidential',
}
