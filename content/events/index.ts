import { parseEvents, type PortfolioEventInput } from '@/lib/content/schema'

/**
 * Event portfolio.
 *
 * This collection is deliberately small. The previous portfolio contained no
 * event records at all, and the PRD's candidate inventory (AI Hackathon SG,
 * Nosana Challenge, Deep Research Agent workshop, AFSG Hackathon, SG Vibe
 * Coding Hackathon, OCBC Kids@Work) has no supporting material anywhere in
 * this repository — no dates, no organiser confirmations, no photographs, no
 * event links.
 *
 * Publishing those from memory would breach PRD s9.3, which requires each
 * entry to state the exact role performed and never to inflate
 * participation or support into hosting. So only the one record with
 * third-party documentation appears below. The rest are listed in
 * CONTENT_TODO.md and will publish as soon as Mohamed supplies the details.
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
    featuredRank: 1,
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
