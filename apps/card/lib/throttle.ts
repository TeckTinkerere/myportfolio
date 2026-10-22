import 'server-only'

import { createHmac } from 'node:crypto'

import { headers } from 'next/headers'

import { countAttempts, pruneAttempts, recordAttempts } from './data'
import { requireEnv } from './env'

/**
 * Attempt limits for auth forms, stored in auth_attempts as keyed hashes
 * (HMAC with LEAD_HASH_SALT), never as raw emails or IPs.
 */

export interface ThrottleRule {
  scope: string
  subject: string
  max: number
  windowMinutes: number
}

/**
 * The visitor's IP. On Vercel, x-forwarded-for is set by the platform
 * (a client-supplied value is overwritten), and its first entry is the
 * client. Elsewhere it falls back to one shared bucket, which fails closed.
 */
export async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || 'unknown'
}

function keyOf(rule: ThrottleRule): string {
  return createHmac('sha256', requireEnv('LEAD_HASH_SALT')).update(`${rule.scope}:${rule.subject}`).digest('hex')
}

/** True when any rule has already reached its limit. */
export async function isThrottled(rules: ThrottleRule[]): Promise<boolean> {
  const counts = await Promise.all(rules.map((r) => countAttempts(keyOf(r), r.windowMinutes)))
  return rules.some((r, i) => counts[i] >= r.max)
}

/** Counts one attempt against every rule. */
export async function recordAttempt(rules: ThrottleRule[]): Promise<void> {
  await recordAttempts(rules.map(keyOf))
  // Cheap housekeeping: about one write in fifty drops day-old rows.
  if (Math.random() < 0.02) await pruneAttempts()
}
