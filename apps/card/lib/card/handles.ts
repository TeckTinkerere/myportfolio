/**
 * Handles are the public path of a card: card.mohdaslam.dev/<handle>.
 *
 * The database check constraint enforces the same pattern; this module
 * gives the editor a readable reason before a round trip, and blocks the
 * paths the app itself uses.
 */

export const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/

/** Paths that are routes of this app, or that would confuse a reader. */
export const RESERVED_HANDLES = new Set([
  'admin',
  'api',
  'app',
  'auth',
  'card',
  'cards',
  'edit',
  'favicon',
  'help',
  'login',
  'logout',
  'new',
  'p',
  'privacy',
  'robots',
  'settings',
  'signin',
  'signup',
  'sitemap',
  'static',
  'support',
  't',
  'terms',
  'www',
  '_next',
])

export function normaliseHandle(raw: string): string {
  return raw.trim().toLowerCase()
}

/** Null when the handle is usable; otherwise why it is not. */
export function handleProblem(raw: string): string | null {
  const handle = normaliseHandle(raw)
  if (handle.length < 3) return 'Use at least 3 characters.'
  if (handle.length > 32) return 'Use at most 32 characters.'
  if (!HANDLE_PATTERN.test(handle)) {
    return 'Use lowercase letters, numbers and hyphens, not at the start or end.'
  }
  if (handle.includes('--')) return 'Avoid two hyphens in a row.'
  if (RESERVED_HANDLES.has(handle)) return 'That name is reserved.'
  return null
}
