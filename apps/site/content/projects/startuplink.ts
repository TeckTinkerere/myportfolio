import type { PortfolioProjectInput } from '@/lib/content/schema'

export const startuplink: PortfolioProjectInput = {
  slug: 'startuplink',
  title: 'StartupLink',
  proofVerb: 'BUILT',
  oneLiner:
    'A closed network where students and verified student founders can find each other.',
  shortSummary:
    'Student–startup collaboration platform. Founder accounts are verified before they can post, and what you can see depends on the role you hold.',
  longSummary:
    'Student founders and students wanting early-stage experience are hard to match. Open platforms make posting easy but trust hard; institutional channels are trusted but slow and closed. StartupLink is the middle: a small network where founders are verified first, and access follows role.',

  lenses: ['general', 'software', 'websites', 'community'],
  status: 'in-development',
  visibility: 'public',
  permissionStatus: 'not-required',

  role: 'Founder and full-stack developer — sole developer',
  timeframeLabel: 'April 2025 – present',
  startDate: '2025-04',
  teamSize: 1,
  location: 'Singapore',
  tier: 1,

  responsibilities: [
    'Framed the problem; decided what v1 would deliberately not do',
    'Built the auth flow, including the email-domain check gating founders',
    'Enforced the role model in database security rules, not the interface',
    'Multi-step onboarding with partial progress persisted across sessions',
    'Student–founder messaging interface',
    'Responsive interface design and implementation',
  ],

  constraints: [
    'Sole developer, around a full-time diploma',
    'Trust is the product — verification had to work before anything else was worth building',
    'No budget for paid identity verification',
    'No user base to validate against; a two-sided network needs both sides',
  ],

  outcomes: [
    'Working MVP deployed and publicly reachable',
    'Founder verification runs server-side in a cloud function, so it cannot be bypassed from the client',
    'Role access enforced in Firestore rules — a modified client still cannot read another role’s data',
    'Onboarding survives a dropped session',
  ],

  learnings: [
    'Authorisation in security rules rather than components is what made fast iteration safe',
    'Verification was a product problem before a technical one — defining proof of founder status was the hard part',
    'Building both sides of the network at once was the wrong sequence; the student side was easier to validate first',
  ],

  technologies: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Firebase Authentication',
    'Cloud Firestore',
    'Firebase Cloud Functions',
    'SWR',
  ],

  evidence: [
    {
      label: 'StartupLink live MVP',
      type: 'live-site',
      href: 'https://startuplink.mohdaslam.dev',
      public: true,
    },
  ],

  coverImage: {
    src: '/images/projects/startuplinkmvp.png',
    alt: 'StartupLink interface showing the founder and student onboarding flow',
    permissionStatus: 'not-required',
  },

  featuredRank: { general: 1, software: 1, websites: 2, community: 3 },

  seoDescription:
    'StartupLink: a student–startup collaboration platform with verified founder onboarding and role-based access control, built by Mohamed Aslam.',
  lastVerifiedAt: '2026-07',
}
