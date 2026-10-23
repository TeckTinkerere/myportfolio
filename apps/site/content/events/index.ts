import { readCollection } from '@/lib/content/data-files'
import { parseEvents } from '@/lib/content/schema'

/**
 * Event portfolio.
 *
 * Entries live as JSON in content/data/events/ and are edited through
 * Keystatic (/keystatic); the filename is the slug. `role` is the primary
 * role, used for filtering, the role ladder, and the card's proof verb. Any
 * additional roles genuinely performed at the same event go in
 * `secondaryRoles`, so a multi-hat event credits every role it evidences
 * without collapsing them into one inflated label (PRD s9.3).
 *
 * `roleLabel` is the full, exact description shown on the event list and
 * detail page.
 */
export const events = parseEvents(readCollection('events'))

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
