import type { MetadataRoute } from 'next'

import { siteConfig } from '@/content/site-config'
import { getEventsWithDetailPages, getPublicProjects } from '@/lib/content/queries'

/**
 * Only published content is listed. Because the sitemap is built from the
 * same query layer as the pages, an item with a pending permission can never
 * be advertised here (PRD s20.2).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/work', priority: 0.9 },
    { path: '/software', priority: 0.8 },
    { path: '/websites', priority: 0.8 },
    { path: '/events', priority: 0.8 },
    { path: '/community', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/resume', priority: 0.6 },
    { path: '/contact', priority: 0.6 },
    { path: '/privacy', priority: 0.3 },
  ]

  const now = new Date()

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      priority: route.priority,
    })),
    ...getPublicProjects().map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: now,
      priority: project.tier === 1 ? 0.8 : 0.5,
    })),
    ...getEventsWithDetailPages().map((event) => ({
      url: `${base}/events/${event.slug}`,
      lastModified: now,
      priority: 0.5,
    })),
  ]
}
