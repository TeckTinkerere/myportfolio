import type { PortfolioProjectInput } from '@/lib/content/schema'

/**
 * LocalLoco has two live surfaces: this is the consumer app
 * (www.localloco.sg). The business-facing marketing site is a separate,
 * smaller entry — see localloco-business.ts. They used to be one project
 * entry pointing at a throwaway v0 preview URL; split and re-pointed at the
 * real production domains once both went live.
 */
export const locallocoApp: PortfolioProjectInput = {
  slug: 'localloco-app',
  title: 'LocalLoco',
  proofVerb: 'BUILT',
  oneLiner: 'Neighbourhood deal discovery, sourced by residents rather than a sales team.',
  shortSummary:
    'Hyperlocal business discovery. Residents submit deals, volunteers moderate them, and QR redemption tells the business whether a promotion actually got used.',
  longSummary:
    'Small neighbourhood businesses rarely have time to keep listings current on the big platforms, so their promotions stay invisible outside their own shopfront. LocalLoco inverts that: residents submit, volunteers moderate, and QR redemption gives the business a real signal. The hard parts were keeping location queries fast and keeping the moderation queue small enough for a few people to clear.',

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
    'Split a Next.js front end from a FastAPI service so each deploys independently',
    'Modelled and built the location query layer in PostgreSQL',
    'Resident submission flow and the volunteer moderation queue behind it',
    'QR generation and redemption tracking — redemptions, not impressions',
    'Mobile-first responsive interface',
  ],

  constraints: [
    'Content quality depends entirely on volunteers',
    'Almost all real use is on a phone, often on mobile data',
    'Location queries degrade fast if modelled naively',
    'No marketing budget — it has to be useful on first visit',
  ],

  outcomes: [
    'Moved from a throwaway v0 preview to the production domain (www.localloco.sg), with real auth middleware wired up',
    'Location queries served through PostGIS rather than application-side filtering, which is what keeps them viable as data grows',
    'Submission and moderation are separate stages, so unreviewed content is never public',
    'Redemption tracking gives businesses a real signal instead of a vanity metric',
  ],

  learnings: [
    'A community catalogue lives or dies on moderation throughput, not on the submission form',
    'Choosing PostGIS early avoided a painful rewrite once real data existed',
    'I over-invested in the business analytics view before there were enough redemptions to make it meaningful',
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
   * "page load under 2 seconds" and "real-time updates within 500ms". None
   * had a measurement method or source, so they are recorded here as
   * unverified and excluded from rendering by getDisplayableMetrics().
   * See CONTENT_TODO.md.
   */
  metrics: [
    {
      value: '95%',
      label: 'Reduction in spam submissions after moderation workflow',
      verified: false,
      permissionStatus: 'pending',
    },
    { value: '99.5%', label: 'Uptime', verified: false, permissionStatus: 'pending' },
  ],

  evidence: [
    {
      label: 'LocalLoco — the app',
      type: 'live-site',
      href: 'https://www.localloco.sg',
      public: true,
    },
  ],

  coverImage: {
    src: '/images/projects/localloco-app-live.png',
    alt: 'LocalLoco consumer app: "Discover Local Deals, Singapore" with a search bar, currently showing an empty "No deals available yet" state',
    permissionStatus: 'not-required',
  },

  featuredRank: { general: 2, software: 2, websites: 1 },

  seoDescription:
    'LocalLoco: a hyperlocal business discovery platform with community submission, volunteer moderation and QR redemption tracking.',
  lastVerifiedAt: '2026-07',
}
