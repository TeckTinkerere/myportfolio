/**
 * The hosting record, as this site tells it.
 *
 * A subset of Mohamed's own event log — only the events where he was at the
 * front of the room (hosting, emceeing, instructing, facilitating). Pure
 * operations support is left out: it is real work, but it is not what
 * someone booking a host is asking about.
 *
 * Kept as its own copy rather than imported from the portfolio. The two
 * sites deploy separately, and each fact here was taken from the same log,
 * so nothing is stated that the log does not support.
 */

export type ArtKey = 'mic' | 'hackathon' | 'network' | 'workshop' | 'community'

export type HostedRoom = {
  name: string
  organiser: string
  date: string
  role: string
  line: string
  audience?: string
  art: ArtKey
}

export const hostedRooms: HostedRoom[] = [
  {
    name: 'Agent Forge: Build Production AI Systems',
    organiser: 'AI Builders',
    date: '2026-06-13',
    role: 'Host / Emcee',
    line: 'Hosted the whole programme. My largest room so far.',
    audience: '~150',
    art: 'mic',
  },
  {
    name: 'Daytona HackSprint Singapore',
    organiser: 'NUS StartIT × AI Builders',
    date: '2026-07-18',
    role: 'Host, co-organiser',
    line: 'Ran it from the first lesson to the winners. Improvised an elevator-pitch round while the results were being prepared.',
    art: 'hackathon',
  },
  {
    name: 'Agent Forge: Build OpenClaw AI Assistant',
    organiser: 'AI Builders',
    date: '2026-03-28',
    role: 'Emcee, co-organiser',
    line: 'Emceed and co-ran the day: venue setup, event chat, and helping people with the tech.',
    art: 'network',
  },
  {
    name: 'Builders Challenge Singapore Workshop',
    organiser: 'Nosana',
    date: '2026-04-02',
    role: 'Sole instructor',
    line: 'Two hours at the front, including a live AI-assisted agent build.',
    art: 'workshop',
  },
  {
    name: 'AI for Good (Youth)',
    organiser: 'AI Singapore',
    date: '2025-04-15',
    role: 'Student facilitator',
    line: 'Guided youth teams through AI projects. Placed 3rd for leadership and facilitation.',
    art: 'community',
  },
]

/** How a booking runs, start to finish. Four steps, each one a picture. */
export const approach = [
  { title: 'Brief', body: 'Audience, tone, must-says, and whose names are hard to pronounce.', art: 'conversation' },
  { title: 'Run sheet', body: 'Every segment timed. Every handoff scripted.', art: 'runsheet' },
  { title: 'Live', body: 'Keep the energy up and the clock honest.', art: 'mic' },
  { title: 'Recover', body: 'When something slips, the room shouldn’t notice.', art: 'hackathon' },
] as const

/** Formats with a hosted event behind them, not a wish list. */
export const formats = [
  { title: 'Tech meetups', art: 'mic' },
  { title: 'Hackathons', art: 'hackathon' },
  { title: 'Workshops', art: 'workshop' },
] as const
