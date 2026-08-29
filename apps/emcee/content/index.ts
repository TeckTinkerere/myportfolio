import { techMeetupTemplate } from '@/content/runsheets/tech-meetup-template'
import { parseRunSheets } from '@/lib/schema'

/**
 * Every run sheet, validated at module scope.
 *
 * Same mechanism as content/projects/index.ts: parseRunSheets throws on any
 * schema violation, the emcee routes import this module, so the throw
 * happens during static generation and fails `next build` with the offending
 * slug and field named.
 *
 * Adding a sheet for a real event: copy the template, set
 * `sheetType: 'event'` with the date, point `eventSlug` at the matching
 * record in content/events, and leave `visibility: 'private'` until the
 * organiser has seen what the page says. There is no login on this site, so
 * publishing a sheet publishes the host notes on it.
 */
export const runSheets = parseRunSheets([techMeetupTemplate])
