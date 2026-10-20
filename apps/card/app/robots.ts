import type { MetadataRoute } from 'next'

/** Cards opt in to indexing one by one (meta.noindex); the app never does. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: ['/edit', '/admin', '/login', '/api', '/t/'] },
  }
}
