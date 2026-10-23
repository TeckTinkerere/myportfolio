const isDev = process.env.NODE_ENV !== 'production'

/**
 * Content-Security-Policy. Public cards are static (ISR), so per-request
 * script nonces are not possible and Next's inline bootstrap scripts need
 * 'unsafe-inline'. What the policy still buys: no plugins, no <base>
 * hijacking, no framing, forms post only here, and images, frames and
 * network calls limited to the hosts below. Fonts are self-hosted by
 * next/font; card images come from the Neon bucket; embeds are YouTube
 * (no-cookie) and Spotify only, matching lib/card/links.ts.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.aws.neon.tech https://i.ytimg.com",
  "font-src 'self' data:",
  `connect-src 'self' data: blob:${isDev ? ' ws: wss:' : ''}`,
  'frame-src https://www.youtube-nocookie.com https://open.spotify.com',
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Shared workspace packages ship TypeScript source, not build output.
  transpilePackages: ['@mohdaslam/ui'],

  // Same stance as the other apps: type errors fail the build.
  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    // Image uploads go through a server action. The editor downsizes images
    // in the browser first, so 3 MB is headroom, not an invitation.
    serverActions: { bodySizeLimit: '3mb' },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Uploaded photos, banners and logos live in the Neon Object Storage
    // bucket. lib/storage.ts refuses any image URL outside that bucket, so
    // this is the only remote host a card can show.
    // YouTube thumbnails stand in for the player until a visitor taps play.
    remotePatterns: [
      { protocol: 'https', hostname: '**.aws.neon.tech' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
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
