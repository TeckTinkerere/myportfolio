/** @type {import('next').NextConfig} */
const nextConfig = {
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
    remotePatterns: [{ protocol: 'https', hostname: '**.aws.neon.tech' }],
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
