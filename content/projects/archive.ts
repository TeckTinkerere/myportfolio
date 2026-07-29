import type { PortfolioProjectInput } from '@/lib/content/schema'

/**
 * Tier 2 — compact archive entries.
 *
 * PRD s10.3: publish only items that add a distinct kind of proof, not every
 * idea that was ever started. The previous portfolio listed 28 projects, of
 * which roughly half were unbuilt concepts with no evidence. Those are not
 * published here.
 *
 * timeframeLabel avoids inventing dates. Where a date is not recorded
 * anywhere, the label states the kind of work instead of guessing a year.
 * See CONTENT_TODO.md.
 */
export const archiveProjects: PortfolioProjectInput[] = [
  {
    slug: 'recenter',
    title: 'Recenter',
    proofVerb: 'BUILT',
    oneLiner:
      'A mindfulness app with a guided meditation timer and a journal that works offline.',
    shortSummary:
      'A React application pairing a guided meditation timer with a private journal held in local storage, so entries stay on the device and work without a connection.',
    lenses: ['software', 'websites'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Frontend developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the meditation timer and its audio handling.',
      'Implemented journaling against the Local Storage API so entries never leave the device.',
      'Built the responsive interface.',
    ],
    constraints: [
      'No backend, so anything persistent had to survive in the browser alone.',
    ],
    outcomes: ['Deployed and publicly reachable.'],
    technologies: ['React', 'JavaScript', 'CSS'],
    evidence: [
      {
        label: 'Recenter live demo',
        type: 'live-site',
        href: 'https://v0-recenter.vercel.app/',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/Recenter.png',
      alt: 'Recenter meditation timer and journal interface',
      permissionStatus: 'not-required',
    },
  },
  {
    slug: 'kreatorsnest',
    title: 'KreatorsNest',
    proofVerb: 'BUILT',
    oneLiner: 'A curated resource hub for freelancers and creators.',
    shortSummary:
      'A static resource hub collecting learning material for freelancers and creators, built without a framework and deployed on Netlify.',
    lenses: ['websites'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Frontend developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Structured the resource categories and site navigation.',
      'Built the site in plain HTML, CSS and JavaScript.',
    ],
    constraints: ['Static hosting only — no server-side logic available.'],
    outcomes: ['Deployed and publicly reachable.'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Netlify'],
    evidence: [
      {
        label: 'KreatorsNest live site',
        type: 'live-site',
        href: 'https://kreatorsnest.netlify.app/',
        public: true,
      },
    ],
  },
  {
    slug: 'connectsphere',
    title: 'ConnectSphere',
    proofVerb: 'BUILT',
    oneLiner:
      'Event networking where attendees are matched rather than left to find each other.',
    shortSummary:
      'An event networking platform pairing attendee matching with QR-based check-in, so introductions happen on purpose instead of by chance.',
    lenses: ['software', 'events', 'websites'],
    status: 'in-development',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'In development',
    responsibilities: [
      'Designed the attendee matching approach.',
      'Built QR-based check-in and authentication.',
    ],
    constraints: [
      'Matching quality depends on attendee data that most events collect only minimally.',
    ],
    outcomes: ['In active development; not yet publicly deployed.'],
    technologies: ['Next.js', 'Supabase'],
  },
  {
    slug: 'connectspm',
    title: 'ConnectSPM',
    proofVerb: 'BUILT',
    oneLiner: 'A student networking platform, currently being reworked.',
    shortSummary:
      'A student networking platform built on Next.js and Supabase, currently undergoing feature and performance rework.',
    lenses: ['software', 'websites', 'community'],
    status: 'in-development',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'In development',
    responsibilities: ['Built the platform and is currently reworking it.'],
    constraints: ['Rework is ongoing alongside other commitments.'],
    outcomes: ['In active development; not yet publicly deployed.'],
    technologies: ['Next.js', 'Supabase'],
  },
  {
    slug: 'devmegle',
    title: 'DevMegle',
    proofVerb: 'BUILT',
    oneLiner: 'A developer networking site built end to end in 24 hours.',
    shortSummary:
      'A hackathon build: a site pairing developers for short technical conversations, designed and shipped inside a 24-hour window.',
    lenses: ['software', 'events'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    organisation: 'Cursor Hackathon',
    timeframeLabel: '24-hour hackathon build',
    responsibilities: [
      'Scoped what could realistically ship in 24 hours and cut the rest.',
      'Built the site front to back within the window.',
    ],
    constraints: [
      'A hard 24-hour deadline, which set the scope more than anything else did.',
    ],
    outcomes: ['Completed and demonstrated within the hackathon window.'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    slug: 'trustlens',
    title: 'TrustLens',
    proofVerb: 'BUILT',
    oneLiner:
      'A browser extension that flags questionable content while you read.',
    shortSummary:
      'A partially implemented Chrome extension analysing page content in real time to surface likely misinformation.',
    lenses: ['software'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the content-analysis pass against the Chrome extension APIs.',
    ],
    constraints: [
      'Judging credibility automatically is a hard problem, and the accuracy needed to be useful was beyond what the approach could reach.',
    ],
    outcomes: [
      'Partially implemented and stopped — the classification quality was not good enough to be trustworthy, which is the one thing this kind of tool cannot get wrong.',
    ],
    technologies: ['JavaScript', 'Chrome Extension APIs'],
  },
  {
    slug: 'eventuresg',
    title: 'EventureSG',
    proofVerb: 'BUILT',
    oneLiner: 'A Telegram bot for finding local events.',
    shortSummary:
      'A Python Telegram bot for event discovery and notifications, completed locally but never deployed.',
    lenses: ['software', 'events'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: ['Built the bot and its notification handling.'],
    constraints: ['Never deployed beyond local development.'],
    outcomes: ['Working locally; not deployed.'],
    technologies: ['Python', 'Telegram Bot API'],
  },
  {
    slug: 'devomegle',
    title: 'DevOmegle',
    proofVerb: 'BUILT',
    oneLiner: 'Peer-to-peer video pairing for developers.',
    shortSummary:
      'A concept for random peer-to-peer technical conversations between developers over WebRTC. Paused before completion.',
    lenses: ['software'],
    status: 'concept',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: ['Prototyped the peer connection flow.'],
    constraints: ['Paused before a working end-to-end version existed.'],
    outcomes: ['Not completed. Listed as a concept rather than a build.'],
    technologies: ['Node.js', 'WebRTC'],
  },
  {
    slug: 'cydists-website',
    title: 'CyDists CCA Website',
    proofVerb: 'BUILT',
    oneLiner: 'The website for my polytechnic cybersecurity CCA.',
    shortSummary:
      'A website built for the CyDists co-curricular group at Singapore Polytechnic.',
    lenses: ['websites', 'community'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    organisation: 'Singapore Polytechnic',
    timeframeLabel: 'Co-curricular activity',
    responsibilities: ['Built and maintained the CCA website.'],
    constraints: ['Built alongside coursework, for an audience of members.'],
    outcomes: ['Delivered for the CCA.'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    slug: 'mini-library-system',
    title: 'Mini Library System',
    proofVerb: 'BUILT',
    oneLiner: 'A Java library management system built for coursework.',
    shortSummary:
      'An object-oriented library management system in Java with file-based persistence, built for a Singapore Polytechnic module.',
    lenses: ['software'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Backend developer',
    organisation: 'Singapore Polytechnic',
    timeframeLabel: 'Singapore Polytechnic coursework',
    responsibilities: [
      'Designed the class model and implemented the borrowing and returning logic.',
      'Implemented file-based persistence.',
    ],
    constraints: ['Restricted to the language and libraries the module allowed.'],
    outcomes: ['Completed and submitted as coursework.'],
    technologies: ['Java', 'Object-oriented programming', 'File I/O'],
  },
  {
    slug: 'online-shopping-system',
    title: 'Online Shopping System',
    proofVerb: 'BUILT',
    oneLiner:
      'A coursework database system built on stored procedures rather than application-side queries.',
    shortSummary:
      'A PostgreSQL-backed shopping system where the CRUD paths run through stored procedures, built for a Singapore Polytechnic module.',
    lenses: ['software'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    organisation: 'Singapore Polytechnic',
    timeframeLabel: 'Singapore Polytechnic coursework',
    responsibilities: [
      'Designed the schema and wrote the stored procedures behind each operation.',
    ],
    constraints: ['Module required the logic to sit in the database layer.'],
    outcomes: ['Completed and submitted as coursework.'],
    technologies: ['PostgreSQL', 'SQL', 'Stored procedures'],
  },
  {
    slug: 'secure-coding-analysis',
    title: 'Secure Coding Vulnerability Analysis',
    proofVerb: 'IMPROVED',
    oneLiner: 'Finding and writing up real vulnerabilities in a codebase.',
    shortSummary:
      'A vulnerability assessment exercise against the OWASP Top 10, covering identification, exploitation and remediation write-up.',
    lenses: ['software'],
    status: 'archived',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Security analyst',
    organisation: 'Singapore Polytechnic',
    timeframeLabel: 'Singapore Polytechnic coursework',
    responsibilities: [
      'Assessed a codebase against the OWASP Top 10.',
      'Documented each finding with its impact and a proposed remediation.',
    ],
    constraints: ['Scoped to the module brief.'],
    outcomes: ['Completed and submitted as coursework.'],
    technologies: ['OWASP Top 10', 'Web security', 'Vulnerability assessment'],
  },
]
