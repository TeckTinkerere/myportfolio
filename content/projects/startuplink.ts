import type { PortfolioProjectInput } from '@/lib/content/schema'

export const startuplink: PortfolioProjectInput = {
  slug: 'startuplink',
  title: 'StartupLink',
  proofVerb: 'BUILT',
  oneLiner:
    'A closed network where students and verified student founders can find each other without the noise of an open platform.',
  shortSummary:
    'A student–startup collaboration platform built around verified founder onboarding and role-based access, so that the people in the network are who they say they are.',
  longSummary:
    'Student founders and students looking for early-stage experience are hard to match. Open platforms make it easy to post but hard to trust; institutional channels are trusted but slow and closed. StartupLink is my attempt at the middle: a small network where founder accounts are verified before they can post, and where what you can see depends on the role you hold.',

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
    'Framed the problem and decided what the first version would deliberately not do.',
    'Built the authentication flow, including the email-domain check that gates founder accounts.',
    'Designed the role model and enforced it in database security rules rather than in the interface.',
    'Built the multi-step onboarding, including persisting partial progress so a dropped session is recoverable.',
    'Built the messaging interface between students and founders.',
    'Designed and implemented the responsive interface.',
  ],

  constraints: [
    'Single developer working around a full-time diploma course.',
    'Trust is the entire product. A platform with unverified founders is worse than no platform, so verification had to work before anything else was worth building.',
    'No budget for paid identity verification, so verification had to be built from signals already available.',
    'No existing user base to validate against — the network is only useful once both sides are present.',
  ],

  outcomes: [
    'A working MVP is deployed and publicly reachable.',
    'Founder verification runs server-side through a cloud function rather than in the client, so the check cannot be bypassed by manipulating the interface.',
    'Role-based access is enforced in Firestore security rules, meaning a compromised or modified client still cannot read data belonging to another role.',
    'Onboarding retains partial progress across sessions.',
  ],

  learnings: [
    'Putting authorisation in security rules rather than in components was the decision that made the rest of the app safe to iterate on quickly.',
    'Verification is a product problem before it is a technical one — deciding what counts as proof of being a founder was harder than implementing the check.',
    'Building both sides of a two-sided network at once was a mistake in sequencing; the student side would have been easier to validate first.',
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
      href: 'https://v0-poly-start-connect.vercel.app/',
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
