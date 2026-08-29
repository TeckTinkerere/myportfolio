import { parseEvents, type PortfolioEventInput } from '@/lib/content/schema'

/**
 * Event portfolio.
 *
 * Twelve records spanning January–July 2026, supplied directly by Mohamed
 * from his own event log. `role` is the first-listed code from his own
 * classification for that event — used for filtering, the role ladder, and
 * the card's proof verb. Any additional roles genuinely performed at the
 * same event go in `secondaryRoles`, so a multi-hat event credits every role
 * it evidences without collapsing them into one inflated label (PRD s9.3).
 *
 * `roleLabel` is the full, exact description — the thing actually shown on
 * the event list and detail page — so nothing is hidden behind the primary
 * role chosen for filtering purposes.
 *
 * Organiser names are inferred from the event name and description, not
 * given as a separate field in the source. See CONTENT_TODO.md for the ones
 * worth double-checking.
 */
const eventList: PortfolioEventInput[] = [
  {
    slug: 'ai-for-good-youth-student-facilitator',
    name: 'AI for Good (Youth) — Student Facilitator Programme',
    organiser: 'AI Singapore',
    date: '2025-04-15',
    role: 'facilitator-teaching-assistant',
    roleLabel: 'Student Facilitator',
    summary:
      'Facilitated youth participants working on AI-for-social-good projects, and placed third in the programme for leadership and facilitation.',
    responsibilities: [
      'Facilitated youth participants through AI-driven social impact project work.',
      'Supported participants who were new to the tooling without taking the work over from them.',
    ],
    audienceType: 'Youth participants new to AI',
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'agent-forge-agentic-ai-apps-with-momen',
    name: 'Agent Forge: Build Agentic AI Apps with Momen',
    organiser: 'AI Builders',
    date: '2026-01-11',
    role: 'facilitator-teaching-assistant',
    roleLabel: 'Facilitator / Teaching Assistant',
    summary: 'Supported participants during a hands-on agentic AI build session.',
    responsibilities: [
      'Assisted participants during the hackathon and its technical activities.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'deep-research-ai-agent-workshop',
    name: 'Build and Deploy a Deep Research AI Agent',
    organiser: 'AI Builders',
    date: '2026-01-15',
    role: 'facilitator-teaching-assistant',
    secondaryRoles: ['event-operations-support'],
    roleLabel: 'Facilitator / Teaching Assistant, Event Operations Support',
    summary:
      'Coordinated participant logistics end to end and supported the technical instructor on the day.',
    responsibilities: [
      'Wrote the Luma event listing and created the WhatsApp group for participants.',
      'Coordinated participants travelling to the venue.',
      'Helped participants who could not keep up with the instructor.',
      'Handled registration.',
      'Assisted with food distribution.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'agentfield-day-autonomous-backend-hackathon',
    name: 'agentfield Day: Autonomous Backend AI Hackathon',
    organiser: 'AI Builders',
    date: '2026-02-07',
    role: 'facilitator-teaching-assistant',
    roleLabel: 'Facilitator / Teaching Assistant',
    summary: 'Supported participants through a backend-focused autonomous-agent hackathon.',
    responsibilities: ['Supported participants during the technical hackathon.'],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'agent-forge-openclaw-ai-assistant',
    name: 'Agent Forge: Build OpenClaw AI Assistant',
    organiser: 'AI Builders',
    date: '2026-03-28',
    role: 'host-emcee',
    secondaryRoles: ['co-host-organiser', 'facilitator-teaching-assistant', 'event-operations-support'],
    roleLabel: 'Host / Emcee, Co-host / Organiser, Facilitator / Teaching Assistant, Event Operations Support',
    summary:
      'Emceed and co-organised the session — from venue setup and materials through to hosting and technical support on the day.',
    responsibilities: [
      'Emceed the event and managed participant communications and the event chat.',
      'Helped prepare technical setup material.',
      'Set up the venue.',
      'Bought and transported the event banners.',
      'Arranged the buffet.',
      'Organised participants and provided technical assistance.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'singapore-ai-founders-vip-dinner-2026-03',
    name: 'Singapore AI Founders VIP Dinner',
    organiser: 'Singapore AI Founders',
    date: '2026-03-30',
    role: 'event-operations-support',
    roleLabel: 'Event Operations Support',
    summary: 'Supported operations for a founder networking dinner, start to close.',
    responsibilities: [
      'Supported photography and buffet setup.',
      'Handled banners and background music for networking.',
      'Helped close and clear the venue.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'builders-challenge-singapore-workshop',
    name: 'Builders Challenge Singapore Workshop',
    organiser: 'Nosana',
    date: '2026-04-02',
    role: 'workshop-instructor',
    secondaryRoles: ['event-operations-support'],
    roleLabel: 'Workshop Instructor, Event Operations Support',
    summary:
      'Sole instructor for a two-hour session on the Nosana Builders Challenge, including a live AI-assisted agent build.',
    responsibilities: [
      'Served as the sole instructor for approximately two hours.',
      'Adapted the teaching slides.',
      'Performed a live AI-assisted agent build.',
      'Guided participants through Nosana GPU servers.',
      'Explained the Nosana Builders Challenge.',
      'Managed the overall workshop session.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'medo-singapore-vibe-coding-hackathon',
    name: 'MeDo Singapore Vibe Coding Hackathon',
    organiser: 'MeDo Singapore',
    date: '2026-04-18',
    role: 'event-operations-support',
    roleLabel: 'Event Operations Support',
    summary: 'Supported the delivery of a vibe-coding hackathon.',
    responsibilities: ['Supported the delivery of the hackathon.'],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'singapore-ai-founders-vip-dinner-2026-05',
    name: 'Singapore AI Founders VIP Dinner',
    organiser: 'Singapore AI Founders',
    date: '2026-05-12',
    role: 'event-operations-support',
    roleLabel: 'Event Operations Support',
    summary: 'Supported operations for a founder networking dinner, start to close.',
    responsibilities: [
      'Supported photography and buffet organisation.',
      'Handled banners and background music.',
      'Helped with venue closure and general floor operations.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'ai-founders-vip-dinner-google-singapore',
    name: 'AI Founders VIP Dinner at Google Singapore',
    organiser: 'Singapore AI Founders',
    date: '2026-05-21',
    role: 'event-operations-support',
    roleLabel: 'Event Operations Support',
    summary: 'Supported operations for a founder networking dinner hosted at Google Singapore.',
    responsibilities: [
      'Supported dinner setup and photography.',
      'Handled banners and background music.',
      'Assisted attendees where required and stayed until the venue was cleared.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'agent-forge-production-ai-systems',
    name: 'Agent Forge: Build Production AI Systems',
    organiser: 'AI Builders',
    date: '2026-06-13',
    role: 'host-emcee',
    roleLabel: 'Host / Emcee',
    summary: 'Hosted the programme in front of the largest confirmed live audience to date.',
    responsibilities: [
      'Hosted the programme in front of approximately 150 physical attendees.',
    ],
    verifiedAudienceSize: '~150',
    visibility: 'public',
    permissionStatus: 'not-required',
    featuredRank: 1,
    hasDetailPage: false,
  },
  {
    slug: 'daytona-hacksprint-singapore',
    name: 'Daytona HackSprint Singapore',
    organiser: 'NUS StartIT',
    date: '2026-07-18',
    role: 'host-emcee',
    secondaryRoles: ['co-host-organiser', 'facilitator-teaching-assistant', 'event-operations-support'],
    roleLabel: 'Host / Emcee, Co-host / Organiser, Facilitator / Teaching Assistant, Event Operations Support',
    summary:
      'Represented AI Builders at a hackathon run with NUS StartIT, leading the programme from teaching through to the results segment.',
    responsibilities: [
      'Represented AI Builders and coordinated directly with NUS StartIT.',
      'Led the programme end to end.',
      'Taught participants to use Daytona, Oxylabs and Nosana.',
      'Prepared the main and winner presentation slides.',
      'Transported four event banners.',
      'Organised lunch for participants.',
      'Coordinated submissions and finalist sequencing.',
      'Handled participant setup issues.',
      'Improvised an elevator-pitch segment while results were being prepared.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
  {
    slug: 'ai-for-everyday-work',
    name: 'AI For Everyday Work',
    organiser: 'AI Builders',
    date: '2026-07-21',
    role: 'event-operations-support',
    roleLabel: 'Event Operations Support',
    summary: 'Owned registration and floor support for a public AI-in-the-workplace session.',
    responsibilities: [
      'Managed registration and access checks.',
      'Supported the panel setup.',
      'Distributed goodies to audience members asking questions.',
      'Made the final venue-closure announcement.',
    ],
    visibility: 'public',
    permissionStatus: 'not-required',
    hasDetailPage: false,
  },
]

export const events = parseEvents(eventList)

/** Role filters for /events (PRD s9.3). */
export const EVENT_ROLE_LABELS = {
  'host-emcee': 'Host / Emcee',
  'co-host-organiser': 'Co-host / Organiser',
  'workshop-instructor': 'Workshop Instructor',
  'facilitator-teaching-assistant': 'Facilitator / Teaching Assistant',
  'event-operations-support': 'Event Operations Support',
} as const

/**
 * Proof verb per role, drawn from the PRD's approved verb list (s3.8) so
 * event cards read consistently with project cards. event-operations-support
 * maps to OPERATED rather than a verb of its own — none of the approved
 * verbs name operations support directly, and OPERATED is the closest fit
 * to "took responsibility for execution and delivery" (PRD Pillar B).
 */
export const EVENT_ROLE_VERBS = {
  'host-emcee': 'HOSTED',
  'co-host-organiser': 'ORGANISED',
  'workshop-instructor': 'FACILITATED',
  'facilitator-teaching-assistant': 'FACILITATED',
  'event-operations-support': 'OPERATED',
} as const
