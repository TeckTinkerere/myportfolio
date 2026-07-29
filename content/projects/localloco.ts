import type { PortfolioProjectInput } from '@/lib/content/schema'

export const localloco: PortfolioProjectInput = {
  slug: 'localloco',
  title: 'LocalLoco',
  proofVerb: 'BUILT',
  oneLiner:
    'Neighbourhood deal discovery, where the listings come from residents rather than from a sales team.',
  shortSummary:
    'A hyperlocal business discovery platform. Residents submit neighbourhood deals, volunteers moderate them, and businesses can see whether a promotion actually got used.',
  longSummary:
    'Small neighbourhood businesses rarely have the time or budget to keep listings current on the big platforms, so their promotions stay invisible outside their own shopfront. LocalLoco inverts that: residents submit what they find, a volunteer moderation layer keeps the quality usable, and QR-based redemption gives the business a way to tell whether the promotion did anything. The hard parts were location queries that stay fast, and a moderation workflow that a handful of volunteers can actually keep up with.',

  lenses: ['general', 'software', 'websites'],
  status: 'prototype',
  visibility: 'public',
  permissionStatus: 'not-required',

  role: 'Full-stack developer and co-founder',
  timeframeLabel: 'September 2024 – present',
  startDate: '2024-09',
  location: 'Singapore',
  tier: 1,

  responsibilities: [
    'Designed the split between a Next.js front end and a FastAPI service so the two could be deployed and changed independently.',
    'Modelled and implemented the location-based query layer in PostgreSQL.',
    'Built the resident submission flow and the volunteer moderation queue behind it.',
    'Implemented QR generation and redemption tracking so a business can see redemptions rather than impressions.',
    'Built the mobile-first responsive interface.',
  ],

  constraints: [
    'Content quality depends entirely on volunteers, so the moderation queue had to stay small enough for a few people to clear.',
    'Almost all real usage is on a phone, often on mobile data, which set the performance budget.',
    'Location queries over a growing dataset degrade quickly if modelled naively.',
    'No marketing budget — the product has to be useful on first visit or the visit is wasted.',
  ],

  outcomes: [
    'A working prototype is deployed and publicly reachable.',
    'Location queries are served through PostGIS rather than application-side distance filtering, which is what keeps them viable as the dataset grows.',
    'Submission and moderation are separate stages, so unreviewed resident content is never publicly visible.',
    'Redemption tracking gives participating businesses a usable signal instead of a vanity metric.',
  ],

  learnings: [
    'A community-sourced catalogue lives or dies on moderation throughput, not on how good the submission form is.',
    'Choosing PostGIS early avoided a rewrite that would have been painful once real data existed.',
    'I over-invested in the business analytics view before there were enough redemptions to make it meaningful.',
  ],

  technologies: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'FastAPI',
    'PostgreSQL',
    'PostGIS',
    'Supabase',
  ],

  /**
   * The previous portfolio published "reduced spam by 95%", "99.5% uptime",
   * "page load under 2 seconds" and "real-time updates within 500ms". None of
   * them had a measurement method or a source, so they are recorded here as
   * unverified and are excluded from rendering by getDisplayableMetrics().
   * See CONTENT_TODO.md.
   */
  metrics: [
    {
      value: '95%',
      label: 'Reduction in spam submissions after moderation workflow',
      verified: false,
      permissionStatus: 'pending',
    },
    {
      value: '99.5%',
      label: 'Uptime',
      verified: false,
      permissionStatus: 'pending',
    },
  ],

  evidence: [
    {
      label: 'LocalLoco live prototype',
      type: 'live-site',
      href: 'https://v0-local-loco-website.vercel.app/',
      public: true,
    },
  ],

  coverImage: {
    src: '/images/projects/locallocomvp.png',
    alt: 'LocalLoco interface showing neighbourhood deals listed by location',
    permissionStatus: 'not-required',
  },

  featuredRank: { general: 2, software: 2, websites: 1 },

  seoDescription:
    'LocalLoco: a hyperlocal business discovery platform with community submission, volunteer moderation and QR redemption tracking.',
  lastVerifiedAt: '2026-07',
}
