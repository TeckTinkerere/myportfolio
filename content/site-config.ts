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

  descriptor: 'Technology Builder & Community Operator',
  headline: 'I build useful systems and bring people together.',
  positioning:
    'I’m Mohamed Aslam, a Singapore-based technology builder working across software, automation, web products, community initiatives, and technology events.',
  valueProposition:
    'My work sits at the intersection of technology, execution, and communication. I enjoy taking unclear problems, structuring them, and turning them into something people can actually use, operate, or participate in.',

  /**
   * Availability line. Rendered in one place on the homepage and nowhere
   * else — edit here, not in a component.
   */
  status:
    'Currently studying Information Technology at Singapore Polytechnic. Open to selected website or product projects and weekend event-hosting opportunities.',

  location: 'Singapore',
  locale: 'en-SG',

  /**
   * Canonical origin. Must match the host that actually serves the site,
   * or every canonical URL points at something that immediately redirects.
   *
   * Vercel currently has www as the primary domain and 308-redirects the
   * apex to it, so this is www. If you make the apex primary in Vercel →
   * Domains (which matches the PRD's stated primary domain and is the
   * tidier end state), change this back to https://mohdaslam.dev in the
   * same sitting — the two settings have to agree.
   *
   * NEXT_PUBLIC_SITE_URL overrides it so preview deployments emit their own
   * origin rather than claiming to be production.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mohdaslam.dev',

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
    description:
      'Reliable tools, operational automation, and product systems built around real constraints.',
  },
  {
    href: '/websites',
    label: 'Websites & Products',
    lens: 'websites',
    description:
      'Clear, responsive websites and early-stage digital products designed to become usable quickly.',
  },
  {
    href: '/events',
    label: 'Events & Facilitation',
    lens: 'events',
    description:
      'Technology events, workshops, and hackathons kept clear, energetic, and human.',
  },
  {
    href: '/community',
    label: 'Community Initiatives',
    lens: 'community',
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
