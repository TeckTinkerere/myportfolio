/**
 * Single source of truth for identity, navigation and contact details.
 *
 * Before this file existed the same facts were hardcoded in five places and
 * disagreed with each other: two different GitHub handles, two different
 * emails, two copyright years and three different live URLs. Nothing else in
 * the codebase should restate any of these values.
 */

export const siteConfig = {
  /** Public brand name. Used everywhere except the resume. */
  name: 'Mohamed Aslam',
  /** Formal name. Resume and legal contexts only. */
  legalName: 'Mohamed Aslam Abdul Gafoor',
  monogram: 'MA',

  /**
   * One identity across the site, matching the résumé headline. Events and
   * community work are still published, but as evidence of communication,
   * not as a second job title.
   */
  descriptor: 'Software Engineering Student',
  headline: 'I build software that keeps working, and shows you when it doesn’t.',
  positioning:
    'I’m Mohamed Aslam, an IT student at Singapore Polytechnic, interning at OCBC on automation reliability and observability. I also build developer tooling and full-stack products, and teach at AI build workshops.',
  valueProposition:
    'Most of my work comes back to one question: does this system actually work, and how would anyone know? Logging, evaluation sets and written limitations are how I answer it.',

  /**
   * What I am doing now and who I would like to hear from. Rendered in one
   * place on the homepage and nowhere else — edit here, not in a component.
   * Keep it dated in spirit: it is the line most likely to go stale.
   */
  status:
    'Automation & tooling intern at OCBC while finishing my Diploma in IT at Singapore Polytechnic.',
  openTo:
    'People working on developer tooling, automation or AI systems, and anyone heading into computing at university.',

  location: 'Singapore',
  locale: 'en-SG',

  /**
   * Canonical origin — the apex, which is the primary domain in the PRD.
   *
   * NOTE: in production this fallback is not what runs. The Vercel project
   * sets NEXT_PUBLIC_SITE_URL, which wins. Changing the value here has no
   * effect on the deployed site.
   *
   * That matters because Vercel currently serves www and 308-redirects the
   * apex to it, so every canonical points at a URL that redirects. The fix
   * is one setting, not a code change: make the apex the primary domain in
   * Vercel → Domains, so the served host matches this value. (Or set
   * NEXT_PUBLIC_SITE_URL to the www host — but then the apex, which is the
   * name on the CV, is the one that redirects.)
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohdaslam.dev',

  /**
   * The emcee run-sheet site, deployed separately from apps/emcee.
   *
   * It used to be /emcee on this site. Those paths still resolve — see the
   * permanent redirects in next.config.mjs — so anything already shared
   * keeps working. Set NEXT_PUBLIC_EMCEE_URL on the Vercel project if the
   * host ever changes; the redirects read the same value.
   */
  emceeUrl: process.env.NEXT_PUBLIC_EMCEE_URL ?? 'https://emcee.mohdaslam.dev',

  contact: {
    email: 'aslam040607@gmail.com',
    github: 'https://github.com/TeckTinkerere',
    linkedin: 'https://www.linkedin.com/in/mohamed-aslam-abdul',
  },
} as const

/** Task-oriented, not audience-oriented (PRD s7.3). */
export const primaryNav = [
  { href: '/work', label: 'Work' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Résumé' },
] as const

/** The four permanent contextual entry points (PRD s7.4). */
export const capabilityRoutes = [
  {
    href: '/software',
    label: 'Software & Automation',
    lens: 'software',
    /** Short line for the illustrated homepage tiles. */
    tagline: 'Tools and automation that hold up.',
    description:
      'Reliable tools, operational automation, and product systems built around real constraints.',
  },
  {
    href: '/websites',
    label: 'Websites & Products',
    lens: 'websites',
    tagline: 'Sites and first products, live fast.',
    description:
      'Clear, responsive websites and early-stage digital products designed to become usable quickly.',
  },
  {
    href: '/events',
    label: 'Events & Facilitation',
    lens: 'events',
    tagline: 'Hosting, workshops, hackathons.',
    description:
      'Technology events, workshops, and hackathons kept clear, energetic, and human.',
  },
  {
    href: '/community',
    label: 'Community Initiatives',
    lens: 'community',
    tagline: 'Ideas turned into pilots.',
    description:
      'Ideas turned into structured pilots through partnerships, coordination, and ground execution.',
  },
] as const

export const footerLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Résumé' },
  { href: '/privacy', label: 'Privacy' },
] as const
