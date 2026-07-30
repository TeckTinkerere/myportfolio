import { events } from '@/content/events'
import { projects } from '@/content/projects'
import { recognition } from '@/content/recognition'
import {
  getDisplayableMetrics,
  getPublicEvents,
  getPublicEvidence,
  getPublicProjects,
} from '@/lib/content/queries'
import { portfolioProjectSchema } from '@/lib/content/schema'
import { toPublicSummary } from '@/lib/content/public-view'

/**
 * These tests encode the PRD s14.2 failure rules. The schema already throws
 * at module scope during a build; this suite asserts the same guarantees in
 * CI and, more importantly, proves the publication boundary actually holds.
 */

describe('content parses', () => {
  it('loads every collection without throwing', () => {
    expect(projects.length).toBeGreaterThan(0)
    expect(events.length).toBeGreaterThan(0)
    expect(recognition.length).toBeGreaterThan(0)
  })

  it('has no duplicate project slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('publication boundary', () => {
  it('never exposes an item whose permission is pending or prohibited', () => {
    for (const project of getPublicProjects()) {
      expect(['approved', 'not-required']).toContain(project.permissionStatus)
    }
    for (const event of getPublicEvents()) {
      expect(['approved', 'not-required']).toContain(event.permissionStatus)
    }
  })

  it('never exposes private or gated visibility', () => {
    for (const project of getPublicProjects()) {
      expect(['public', 'sanitised']).toContain(project.visibility)
    }
  })

  it('withholds the pending enterprise automation case study', () => {
    const slug = 'enterprise-automation-reliability'
    // Authored in the repository...
    expect(projects.some((p) => p.slug === slug)).toBe(true)
    // ...but not published anywhere.
    expect(getPublicProjects().some((p) => p.slug === slug)).toBe(false)
  })

  it('drops confidential fields when narrowing for client components', () => {
    const project = getPublicProjects()[0]
    const summary = toPublicSummary(project) as Record<string, unknown>
    for (const field of [
      'responsibilities',
      'constraints',
      'learnings',
      'metrics',
      'evidence',
      'confidentialityNote',
      'longSummary',
    ]) {
      expect(summary[field]).toBeUndefined()
    }
  })
})

describe('evidence and metrics', () => {
  it('only ever renders metrics that are verified and cleared', () => {
    for (const project of getPublicProjects()) {
      for (const metric of getDisplayableMetrics(project)) {
        expect(metric.verified).toBe(true)
        expect(['approved', 'not-required']).toContain(metric.permissionStatus)
      }
    }
  })

  it('excludes the unverified LocalLoco metrics inherited from the old site', () => {
    const localloco = getPublicProjects().find((p) => p.slug === 'localloco')!
    expect(localloco.metrics?.length).toBeGreaterThan(0)
    expect(getDisplayableMetrics(localloco)).toHaveLength(0)
  })

  it('only exposes evidence links marked public, each with a label', () => {
    for (const project of getPublicProjects()) {
      for (const link of getPublicEvidence(project)) {
        expect(link.public).toBe(true)
        expect(link.label.length).toBeGreaterThan(0)
        expect(link.href).toMatch(/^https?:\/\//)
      }
    }
  })
})

describe('accessibility and completeness of published content', () => {
  it('gives every published image alternative text', () => {
    for (const project of getPublicProjects()) {
      const images = [
        ...(project.coverImage ? [project.coverImage] : []),
        ...(project.gallery ?? []),
      ]
      for (const image of images) {
        expect(image.alt.trim().length).toBeGreaterThan(0)
      }
    }
    for (const item of recognition) {
      if (item.image) expect(item.image.alt.trim().length).toBeGreaterThan(0)
    }
  })

  it('gives every featured item a role and a status', () => {
    for (const project of getPublicProjects().filter((p) => p.featuredRank)) {
      expect(project.role.trim().length).toBeGreaterThan(1)
      expect(project.status).toBeTruthy()
    }
  })

  it('gives every case study a summary and at least one outcome', () => {
    for (const study of getPublicProjects().filter((p) => p.tier === 1)) {
      expect(study.longSummary?.trim().length ?? 0).toBeGreaterThan(0)
      expect(study.outcomes.length).toBeGreaterThan(0)
    }
  })

  it('states the exact role performed for every published event', () => {
    for (const event of getPublicEvents()) {
      expect(event.roleLabel.trim().length).toBeGreaterThan(0)
      expect(event.responsibilities.length).toBeGreaterThan(0)
    }
  })
})

describe('schema rejects invalid content', () => {
  const valid = {
    slug: 'example',
    title: 'Example',
    proofVerb: 'BUILT',
    oneLiner: 'A one-line summary.',
    shortSummary: 'A short summary.',
    lenses: ['software'],
    status: 'live',
    visibility: 'public',
    permissionStatus: 'approved',
    role: 'Developer',
    timeframeLabel: '2025',
    responsibilities: [],
    constraints: [],
    outcomes: ['Shipped.'],
  }

  it('accepts a well-formed project', () => {
    expect(portfolioProjectSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a public item with a pending permission', () => {
    const result = portfolioProjectSchema.safeParse({
      ...valid,
      permissionStatus: 'pending',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an image without alternative text', () => {
    const result = portfolioProjectSchema.safeParse({
      ...valid,
      coverImage: { src: '/a.png', alt: '', permissionStatus: 'approved' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects a metric claiming verification without a source', () => {
    const result = portfolioProjectSchema.safeParse({
      ...valid,
      metrics: [
        { value: '99%', label: 'Uptime', verified: true, permissionStatus: 'approved' },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a tier 1 case study with no outcomes', () => {
    const result = portfolioProjectSchema.safeParse({
      ...valid,
      tier: 1,
      longSummary: 'Long.',
      outcomes: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a sanitised item with no confidentiality note', () => {
    const result = portfolioProjectSchema.safeParse({
      ...valid,
      visibility: 'sanitised',
    })
    expect(result.success).toBe(false)
  })
})
