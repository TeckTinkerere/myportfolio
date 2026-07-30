import { getPublicEvents, getPublicEvidence, getPublicProjects } from '@/lib/content/queries'
import { capabilityRoutes, footerLinks, primaryNav } from '@/content/site-config'

/**
 * Internal link integrity. The previous site shipped a dead #projects
 * anchor and a nav entry pointing at a route that had been renamed, so this
 * checks that every link the content and config generate resolves to a route
 * that actually exists.
 */
const STATIC_ROUTES = new Set([
  '/',
  '/work',
  '/software',
  '/websites',
  '/events',
  '/community',
  '/about',
  '/contact',
  '/resume',
  '/privacy',
])

describe('internal links', () => {
  const projectRoutes = new Set(getPublicProjects().map((p) => `/work/${p.slug}`))

  it('points every nav item at a real route', () => {
    for (const item of primaryNav) {
      expect(STATIC_ROUTES.has(item.href)).toBe(true)
    }
  })

  it('points every capability card at a real route', () => {
    for (const route of capabilityRoutes) {
      expect(STATIC_ROUTES.has(route.href)).toBe(true)
    }
  })

  it('points every footer link at a real route', () => {
    for (const link of footerLinks) {
      expect(STATIC_ROUTES.has(link.href)).toBe(true)
    }
  })

  it('generates a case study route for every published project', () => {
    for (const project of getPublicProjects()) {
      expect(projectRoutes.has(`/work/${project.slug}`)).toBe(true)
    }
  })

  it('uses absolute https URLs for all published external evidence', () => {
    for (const project of getPublicProjects()) {
      for (const link of getPublicEvidence(project)) {
        expect(link.href.startsWith('https://')).toBe(true)
      }
    }
    for (const event of getPublicEvents()) {
      if (event.publicEventUrl) {
        expect(event.publicEventUrl.startsWith('https://')).toBe(true)
      }
    }
  })

  /**
   * The old data linked repositories under a GitHub namespace that is not
   * the owner's; both returned 404. Nothing should reintroduce them.
   */
  it('does not link the GitHub namespace that 404s', () => {
    for (const project of getPublicProjects()) {
      for (const link of project.evidence ?? []) {
        expect(link.href).not.toContain('github.com/mohamedaslam/')
      }
    }
  })
})
