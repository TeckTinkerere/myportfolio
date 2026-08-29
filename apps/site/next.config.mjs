/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shared workspace packages ship TypeScript source, not build output.
  transpilePackages: ['@mohdaslam/ui', '@mohdaslam/content-rules'],

  // Errors must fail the build. The previous config suppressed both, which is
  // why a broken type reference in all-projects.tsx shipped to production.
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // The emcee run sheets are their own deployment now. Anything already
    // shared pointing at /emcee keeps working, and there is exactly one
    // canonical home for a run sheet rather than two copies competing.
    const emcee = process.env.NEXT_PUBLIC_EMCEE_URL ?? 'https://emcee.mohdaslam.dev'

    // The old information architecture. These paths have been shared, so they
    // resolve permanently to their nearest equivalent rather than 404ing.
    return [
      { source: '/emcee', destination: emcee, permanent: true },
      { source: '/emcee/:slug', destination: `${emcee}/:slug`, permanent: true },
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/all-projects', destination: '/work', permanent: true },
      { source: '/skills', destination: '/about', permanent: true },
      { source: '/hall-of-fame', destination: '/about', permanent: true },
      { source: '/visionary-wall', destination: '/work', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
