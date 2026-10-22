/**
 * Strict "is this object inside that prefix" check. A plain startsWith let
 * `<bucket>/../other` or `<bucket>/%2e%2e/other` through, which resolve
 * outside the bucket. Keys this app writes are `<uuid>/<uuid>/<name>.<ext>`,
 * so anything unusual (dot segments, encoding, query, credentials) fails.
 */
export function isUrlInBase(url: string, base: string): boolean {
  if (typeof url !== 'string' || url.length > 500) return false
  let parsed: URL
  let baseUrl: URL
  try {
    parsed = new URL(url)
    baseUrl = new URL(base)
  } catch {
    return false
  }
  if (parsed.protocol !== 'https:' || parsed.origin !== baseUrl.origin) return false
  if (parsed.username || parsed.password || parsed.search || parsed.hash) return false
  // The parser resolves dot segments, so compare the original text too.
  if (!url.startsWith(base) || parsed.href !== url) return false
  const key = parsed.pathname.slice(baseUrl.pathname.length)
  return parsed.pathname.startsWith(baseUrl.pathname) && /^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.[a-z0-9]{2,5}$/.test(key)
}
