/**
 * Personal narrative, principles, timeline and résumé source data.
 *
 * Written as points rather than prose: the substance is unchanged, the word
 * count is roughly half. Each page keeps one human sentence at the top —
 * a fully bulleted biography reads like a spec sheet.
 *
 * Experience entries carry real `start`/`end` dates, not just display
 * strings, because the /about timeline positions bars from them. `end: null`
 * means ongoing.
 */

export const principles = [
  {
    title: 'Make the problem concrete',
    body: 'Most stuck projects are stuck because nobody wrote down precisely what is wrong.',
  },
  {
    title: 'Build the smallest credible version',
    body: 'Small enough to finish, real enough that using it tells you something true.',
  },
  {
    title: 'Improve from reality',
    body: 'First contact with real people is the only honest feedback. Plan for it.',
  },
] as const

/** One human opener, then the facts. */
export const bioOpener =
  'I take unclear problems, give them a structure, and get them in front of people.'

export const bioPoints = [
  'Software, automation, web products, community initiatives, technology events — one skill, different rooms.',
  'Most of it starts as a badly described problem: a shop nobody can find, students and founders who never meet, a community with no process.',
  'Most useful where a project needs both the technical decisions and the follow-through.',
] as const

export const education = {
  qualification: 'Diploma in Information Technology',
  institution: 'Singapore Polytechnic',
  timeframe: '2023 – present',
  start: '2023-04',
  end: null,
  coursework: [
    'Object-oriented programming (Java)',
    'Web development',
    'Database systems (PostgreSQL, MySQL)',
    'Secure coding practices',
    'System analysis and design',
    'Software testing and quality assurance',
  ],
} as const

export type ExperienceEntry = {
  role: string
  organisation: string
  timeframe: string
  /** YYYY-MM. Drives the timeline. */
  start: string
  /** null means ongoing. */
  end: string | null
  summary: string
  kind: 'build' | 'operate'
}

/** Reverse chronological. Only roles with a recorded timeframe appear. */
export const experience: ExperienceEntry[] = [
  {
    role: 'Founder, full-stack developer',
    organisation: 'StartupLink',
    timeframe: 'Apr 2025 – present',
    start: '2025-04',
    end: null,
    summary: 'Closed student–founder network. Verified onboarding, role-based access.',
    kind: 'build',
  },
  {
    role: 'Co-founder, full-stack developer',
    organisation: 'LocalLoco',
    timeframe: 'Sep 2024 – present',
    start: '2024-09',
    end: null,
    summary: 'Hyperlocal discovery. Community submission, volunteer moderation, QR redemption.',
    kind: 'build',
  },
  {
    role: 'Event Assistant',
    organisation: 'Adecco',
    timeframe: 'Apr – May 2025',
    start: '2025-04',
    end: '2025-05',
    summary: 'Singapore General Election 2025: polling setup, overnight watch, wheelchair access.',
    kind: 'operate',
  },
  {
    role: 'Freelance video editor',
    organisation: 'Independent',
    timeframe: 'Sep 2024 – present',
    start: '2024-09',
    end: null,
    summary: 'Class montages, exchange farewell film, leadership camp recap.',
    kind: 'operate',
  },
]

export const leadership = [
  {
    role: 'Organising committee',
    organisation: 'LEAP 2026, School of Computing',
    timeframe: '2025 – present',
  },
  {
    role: 'Assistant Quartermaster',
    organisation: 'SPCyclists main committee',
    timeframe: '2025 – present',
  },
  {
    role: 'ExCo (Events)',
    organisation: 'Freelance Academy, Media Arts and Design',
    timeframe: '2024 – present',
  },
] as const

/**
 * Capability groupings. Deliberately unranked — no percentages, no
 * self-awarded mastery levels. Evidence lives in the projects that used them.
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
 * Résumé PDF. No file exists yet, so /resume renders a print-styled page and
 * the download control stays hidden rather than pointing at a 404. Set this
 * once a PDF is added to public/resume/.
 */
export const resumePdf: { href: string; updated: string } | null = null

export const resumeLastUpdated = '2026-07'
