import type { MetadataRoute } from 'next'

import { emceeConfig } from '@/content/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${emceeConfig.url}/sitemap.xml`,
  }
}
