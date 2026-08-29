import type { MetadataRoute } from 'next'

import { emceeConfig } from '@/content/site-config'
import { getPublicRunSheets } from '@/lib/queries'

/**
 * Built from the same query layer as the pages, so a private sheet can never
 * be advertised here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: emceeConfig.url, lastModified: now, priority: 1 },
    ...getPublicRunSheets().map((sheet) => ({
      url: `${emceeConfig.url}/${sheet.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ]
}
