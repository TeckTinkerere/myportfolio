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
      'A wellness app for a two-minute reset: guided breathing, reflection, or creative flow.',
    shortSummary:
      'A Next.js app offering three short wellness modes — guided breathing, reflective journaling, and creative expression — with ambient audio, running entirely in the browser.',
    lenses: ['software', 'websites'],
    status: 'live',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Frontend developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the guided breathing, reflection and creative-flow modes.',
      'Built the ambient audio handling.',
      'Implemented journaling against the Local Storage API so entries never leave the device.',
      'Built the responsive interface.',
    ],
    constraints: [
      'No backend, so anything persistent had to survive in the browser alone.',
    ],
    outcomes: [
      'Rebuilt on Next.js and moved to a production domain (recenter.mohdaslam.dev).',
      'Grew from a single timer-and-journal tool into three distinct wellness modes.',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    evidence: [
      {
        label: 'Recenter live site',
        type: 'live-site',
        href: 'https://recenter.mohdaslam.dev',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/Recenter.png',
      alt: 'Recenter landing screen offering three modes: Breathe, Reflect, and Create',
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
    // Captured by scripts/refresh-project-screenshots.ts from the live site
    // rather than hand-uploaded — see README's "Project screenshots" section.
    coverImage: {
      src: '/images/projects/kreatorsnest-live.png',
      alt: 'KreatorsNest landing page: "Crafting tools & knowledge for the modern creative", with a sidebar and a guided-or-explore browsing choice',
      permissionStatus: 'not-required',
    },
  },
  {
    /**
     * Formerly two separate placeholder entries: an unevidenced
     * "ConnectSphere" concept (attendee matching, QR check-in) and
     * "ConnectSPM", a student networking platform "currently being
     * reworked". The rework became this — a live event-networking product
     * with sponsor ROI reporting, tiered pricing, and a real account-
     * creation flow at connectsp.mohdaslam.dev. Merged into one entry
     * rather than kept as two, since publishing both would describe the
     * same product twice at different stages of the same idea.
     */
    slug: 'connectsphere',
    title: 'ConnectSphere',
    proofVerb: 'BUILT',
    oneLiner: 'Event networking with a sponsor-facing ROI report, not just a chat room.',
    shortSummary:
      'A QR-accessible networking room for event attendees, with connection tracking and an exportable sponsor report — built for organizers who need to show sponsors more than a headcount.',
    lenses: ['software', 'events', 'websites'],
    status: 'live',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the QR-accessible event room and attendee discovery flow.',
      'Built one-tap connection tracking and the sponsor ROI export.',
      'Built role-based onboarding for attendees versus organizers.',
      'Built the tiered pricing and account system.',
    ],
    constraints: [
      'Sponsor-facing reporting only has something to show once organizers actually get attendees into a room, so early adoption matters more than the reporting features themselves.',
    ],
    outcomes: [
      'Live product with working account creation, attendee/organizer role selection, and tiered pricing (free, $149 per event Pro, custom Enterprise).',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    evidence: [
      {
        label: 'ConnectSphere live site',
        type: 'live-site',
        href: 'https://connectsp.mohdaslam.dev',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/connectsphere-live.png',
      alt: 'ConnectSphere landing page hero: "Prove Your Event Created Real Connections"',
      permissionStatus: 'not-required',
    },
    lastVerifiedAt: '2026-07',
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
  {
    slug: 'localloco-business',
    title: 'LocalLoco for Business',
    proofVerb: 'BUILT',
    oneLiner: 'The merchant-facing side of LocalLoco: why to join, and how.',
    shortSummary:
      'A marketing and merchant-onboarding site for LocalLoco, pitching local businesses on joining the platform, separate from the consumer app itself.',
    lenses: ['websites'],
    status: 'live',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Full-stack developer and co-founder',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the merchant-facing landing page and value proposition.',
      'Built the business sign-up and pricing pathway.',
    ],
    constraints: [
      'Has to make the case to a business owner who has never heard of LocalLoco, separately from the consumer app.',
    ],
    outcomes: ['Deployed and publicly reachable at a dedicated domain.'],
    /**
     * The live page claims specific traction numbers (businesses joined,
     * deals posted, community members) and shows named merchant
     * testimonials. Neither is published here: www.localloco.sg — the
     * actual consumer app — currently shows no live deals, which
     * contradicts the marketing page's numbers closely enough that they
     * cannot be treated as verified. See CONTENT_TODO.md.
     */
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    evidence: [
      {
        label: 'LocalLoco for Business',
        type: 'live-site',
        href: 'https://info.localloco.sg',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/localloco-business-live.png',
      alt: 'LocalLoco for Business landing page: "Bringing Local Businesses & Communities Together — One Deal at a Time"',
      permissionStatus: 'not-required',
    },
    lastVerifiedAt: '2026-07',
  },
  {
    slug: 'livnow',
    title: 'Liv&Now',
    proofVerb: 'BUILT',
    oneLiner: 'A streetwear storefront for a premium Indian oversized-fit brand.',
    shortSummary:
      'An e-commerce storefront for Liv&Now, a streetwear brand manufactured in Tiruppur — a browsable product catalogue with collections, pricing and a custom-order path.',
    lenses: ['websites'],
    status: 'live',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the product catalogue and collection browsing.',
      'Built the storefront pages and site search.',
    ],
    constraints: [
      'A brand storefront has to read as a real retail experience, not a template.',
    ],
    outcomes: ['Live storefront with a working, browsable product catalogue.'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    evidence: [
      {
        label: 'Liv&Now live site',
        type: 'live-site',
        href: 'https://livnow.mohdaslam.dev',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/livnow-live.png',
      alt: 'Liv&Now homepage hero: "Streetwear Engineered", Spring Summer 2026',
      permissionStatus: 'not-required',
    },
    lastVerifiedAt: '2026-07',
  },
  {
    slug: 'future-tainment',
    title: 'Future-tainment',
    proofVerb: 'BUILT',
    oneLiner: 'An AI content-creation tool for scripts, voice, and video.',
    shortSummary:
      'An AI-powered content creation platform — script writing, environment design, voice generation and video creation — built around a credit-based usage system.',
    lenses: ['software', 'websites'],
    /**
     * The live deployment shows "Firebase Not Configured" and offers a
     * demo-mode fallback with simulated data — direct evidence the backend
     * is not wired up in production, not an inference.
     */
    status: 'prototype',
    visibility: 'public',
    permissionStatus: 'not-required',
    role: 'Developer',
    timeframeLabel: 'Personal project',
    responsibilities: [
      'Built the script generation tool and its credit-based usage system.',
      'Built the demo-mode fallback for exploring the product without live authentication.',
    ],
    constraints: ['Production authentication (Firebase) is not yet configured.'],
    outcomes: ['Full UI and demo-mode flow deployed and explorable without an account.'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    evidence: [
      {
        label: 'Future-tainment live site',
        type: 'live-site',
        href: 'https://future-tainment.mohdaslam.dev',
        public: true,
      },
    ],
    coverImage: {
      src: '/images/projects/future-tainment-live.png',
      alt: 'Future-tainment script generator interface with a script type selector and generated-script panel',
      permissionStatus: 'not-required',
    },
    lastVerifiedAt: '2026-07',
  },
]
