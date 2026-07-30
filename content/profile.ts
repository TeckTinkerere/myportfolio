/**
 * Personal narrative, working principles, timeline and résumé source data.
 *
 * Everything here is drawn from material already present in the previous
 * portfolio. Two deliberate changes:
 *
 * 1. The old /about page led with "Co-Founder & CEO of Local Loco". LocalLoco
 *    is a prototype, and PRD s3.6 rules out an inflated founder biography, so
 *    the title here is co-founder and the work is described by what was
 *    actually built.
 * 2. Skill proficiency percentages are gone entirely (PRD s3.9).
 *
 * The PRD describes an enterprise technology role. No record of it exists in
 * this repository, so it is not asserted here. See CONTENT_TODO.md.
 */

export const principles = [
  {
    title: 'Make the problem concrete',
    body: 'Most stuck projects are stuck because nobody has written down precisely what is wrong. I start by turning a vague complaint into something specific enough to disagree with.',
  },
  {
    title: 'Build the smallest credible version',
    body: 'Small enough to finish, real enough that using it tells you something true. Anything larger is a guess with more code in it.',
  },
  {
    title: 'Communicate clearly and improve from reality',
    body: 'Whether it is a deployment or an event, the first contact with real people is the only honest feedback. I plan for that moment rather than around it.',
  },
] as const

export const bio = [
  'I work across software, automation, web products, community initiatives and technology events. Those look like separate things, but they are the same skill applied in different rooms: take something unclear, give it a structure, and get it in front of people.',
  'Most of what I build starts as a problem someone described badly. A neighbourhood business that cannot get its promotions seen. Students and student founders who cannot find each other. A community that wants to recycle but has no process for it. The work is turning that into something that runs.',
  'I am most useful where a project needs both building and follow-through — where somebody has to make the technical decisions and also make sure the thing actually gets used.',
] as const

export const education = {
  qualification: 'Diploma in Information Technology',
  institution: 'Singapore Polytechnic',
  timeframe: '2023 – present',
  coursework: [
    'Object-oriented programming (Java)',
    'Web development',
    'Database systems (PostgreSQL, MySQL)',
    'Secure coding practices',
    'System analysis and design',
    'Software testing and quality assurance',
  ],
} as const

/** Reverse chronological. Only roles with a recorded timeframe appear. */
export const experience = [
  {
    role: 'Founder and full-stack developer',
    organisation: 'StartupLink',
    timeframe: 'April 2025 – present',
    summary:
      'Building a closed student–startup network with verified founder onboarding and role-based access.',
  },
  {
    role: 'Co-founder and full-stack developer',
    organisation: 'LocalLoco',
    timeframe: 'September 2024 – present',
    summary:
      'Building a hyperlocal business discovery platform with community submission, volunteer moderation and QR-based redemption tracking.',
  },
  {
    role: 'Event Assistant',
    organisation: 'Adecco',
    timeframe: 'April – May 2025',
    summary:
      'Supported polling station setup, overnight watch duty and wheelchair access management for the 2025 Singapore General Election.',
  },
  {
    role: 'Freelance video editor',
    organisation: 'Independent',
    timeframe: 'September 2024 – present',
    summary:
      'Class montages, an exchange-visit farewell video and a leadership camp recap.',
  },
] as const

export const leadership = [
  {
    role: 'Organising committee member',
    organisation: 'LEAP 2026, School of Computing (SOC-CLS)',
    timeframe: '2025 – present',
  },
  {
    role: 'Assistant Quartermaster, main committee',
    organisation: 'SPCyclists',
    timeframe: '2025 – present',
  },
  {
    role: 'ExCo (Events)',
    organisation: 'Freelance Academy, Media Arts and Design',
    timeframe: '2024 – present',
  },
] as const

/**
 * Capability groupings for /about and /resume. Deliberately unranked — no
 * percentages, no self-awarded mastery levels (PRD s3.9). Evidence for each
 * lives in the projects that used it.
 */
export const capabilities = [
  {
    group: 'Building for the web',
    items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
  },
  {
    group: 'Services and data',
    items: ['FastAPI', 'Node.js', 'PostgreSQL', 'PostGIS', 'Supabase', 'Firebase', 'SQL', 'Java', 'Python'],
  },
  {
    group: 'Practice',
    items: [
      'Git and GitHub',
      'Secure coding (OWASP Top 10)',
      'Software testing',
      'System analysis and design',
      'Vercel and Netlify deployment',
    ],
  },
  {
    group: 'Operating and communicating',
    items: [
      'Event facilitation',
      'Volunteer coordination',
      'Workshop support',
      'Product scoping',
      'Written and spoken communication',
    ],
  },
] as const

/**
 * Résumé PDF. No file exists in the repository, so /resume renders a
 * print-styled HTML page and the download control stays hidden rather than
 * pointing at a 404. Set this once a PDF is added to public/resume/.
 */
export const resumePdf: { href: string; updated: string } | null = null

/** Shown on /resume so a reader knows how current the page is. */
export const resumeLastUpdated = '2026-07'
