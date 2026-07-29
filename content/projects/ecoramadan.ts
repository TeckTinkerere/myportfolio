import type { PortfolioProjectInput } from '@/lib/content/schema'

/**
 * Deliberately not a Tier 1 case study yet.
 *
 * The PRD asks for EcoRamadan as a full case study covering the pilot
 * environment, partner roles, ground constraints, verified outcomes and what
 * did not work. The only material that exists in this repository is a single
 * sentence. Writing the rest would mean inventing it, so this ships as an
 * honest compact entry and the missing sections are tracked in
 * CONTENT_TODO.md until Mohamed supplies them.
 *
 * No bottle counts, cap totals, volunteer numbers or partner names appear
 * here, because none of them have been verified (PRD s9.4).
 */
export const ecoramadan: PortfolioProjectInput = {
  slug: 'ecoramadan',
  title: 'EcoRamadan',
  proofVerb: 'LAUNCHED',
  oneLiner:
    'A community recycling initiative built around volunteer coordination and collection logistics.',
  shortSummary:
    'A community-driven recycling initiative I started, coordinating volunteers and collection logistics during Ramadan.',

  lenses: ['general', 'community'],
  status: 'pilot-completed',
  visibility: 'public',
  permissionStatus: 'not-required',

  role: 'Founder and coordinator',
  timeframeLabel: 'Dates to be confirmed',
  location: 'Singapore',
  tier: 2,

  responsibilities: [
    'Started the initiative and defined how collection would actually work on the ground.',
    'Coordinated volunteers and collection logistics.',
  ],

  constraints: [
    'Entirely volunteer-run, with no funded staff.',
    'Collection had to fit around Ramadan timings and the routines of the community it served.',
  ],

  outcomes: [
    'The initiative ran as a community pilot with volunteer coordination and a working collection process.',
  ],

  featuredRank: { general: 3, community: 1 },

  seoDescription:
    'EcoRamadan: a volunteer-run community recycling initiative founded by Mohamed Aslam in Singapore.',
}
