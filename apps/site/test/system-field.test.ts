import { systemFieldConfig } from '@/components/three/system-field.config'
import { projects } from '@/content/projects'
import { getPublicProjects } from '@/lib/content/queries'
import { buildSystemField } from '@/lib/content/system-field'

/**
 * The hero's 3D field is data-bound, and its node data (including project
 * titles) is serialised into the RSC payload so a client component can render
 * it. That makes it a publication surface, not decoration — so it is held to
 * the same boundary as every page.
 */
describe('system field', () => {
  const field = buildSystemField()

  it('renders exactly the published project set', () => {
    expect(field.nodes).toHaveLength(getPublicProjects().length)
  })

  it('never includes an unpublished or permission-pending project', () => {
    const published = new Set(getPublicProjects().map((p) => p.slug))
    for (const node of field.nodes) {
      expect(published.has(node.id)).toBe(true)
    }

    const withheld = projects.filter(
      (p) => p.permissionStatus === 'pending' || p.permissionStatus === 'prohibited',
    )
    expect(withheld.length).toBeGreaterThan(0) // guard: the fixture still exists
    for (const project of withheld) {
      expect(field.nodes.some((n) => n.id === project.slug)).toBe(false)
    }
  })

  it('is deterministic, so the SSR fallback and the WebGL scene agree', () => {
    const again = buildSystemField()
    expect(again.nodes.map((n) => n.position)).toEqual(field.nodes.map((n) => n.position))
    expect(again.links).toEqual(field.links)
  })

  it('places every node on a finite position within the configured shell', () => {
    for (const node of field.nodes) {
      const distance = Math.hypot(...node.position)
      expect(Number.isFinite(distance)).toBe(true)
      // Radius varies by design between 0.82 and 1.12 of the base, so the
      // field reads as a shell with depth rather than a perfect sphere.
      // These bounds are tight on purpose: they caught a signed-shift bug
      // that let nodes fall inside the shell.
      expect(distance).toBeGreaterThanOrEqual(systemFieldConfig.radius * 0.82)
      expect(distance).toBeLessThanOrEqual(systemFieldConfig.radius * 1.12)
    }
  })

  it('only links pairs that genuinely share disciplines', () => {
    const published = getPublicProjects()
    for (const [a, b] of field.links) {
      const shared = published[a].lenses.filter((lens) =>
        published[b].lenses.includes(lens),
      ).length
      expect(shared).toBeGreaterThanOrEqual(systemFieldConfig.linkAtSharedLenses)
    }
  })

  it('has a colour for every status the content can produce', () => {
    for (const project of getPublicProjects()) {
      expect(systemFieldConfig.statusColors[project.status]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
