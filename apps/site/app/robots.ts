import type { MetadataRoute } from 'next'

import { siteConfig } from '@/content/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Server actions and any future gated route are never useful to crawl.
      disallow: ['/api/', '/access/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
