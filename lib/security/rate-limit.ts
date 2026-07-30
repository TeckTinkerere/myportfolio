import 'server-only'

/**
 * In-memory fixed-window rate limit.
 *
 * Deliberately simple. It is per-instance, so it does not hold across a
 * scaled-out deployment — for a personal contact form that is an acceptable
 * trade against adding a Redis dependency. Fluid Compute reuses instances,
 * so in practice most repeat traffic from one source hits the same counter.
 *
 * If the form ever gets abused at volume, replace this with a durable store
 * rather than tuning the numbers.
 */
type Entry = { count: number; expiresAt: number }

const buckets = new Map<string, Entry>()

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || entry.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + WINDOW_MS })
    pruneExpired(now)
    return { allowed: true, retryAfterMs: 0 }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: entry.expiresAt - now }
  }

  entry.count += 1
  return { allowed: true, retryAfterMs: 0 }
}

/** Keeps the map from growing without bound on a long-lived instance. */
function pruneExpired(now: number) {
  if (buckets.size < 500) return
  for (const [key, entry] of buckets) {
    if (entry.expiresAt <= now) buckets.delete(key)
  }
}
