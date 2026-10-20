/**
 * JSON with object keys sorted. Postgres jsonb does not keep key order, so
 * comparing a draft read back from the database with one built in the
 * browser needs a canonical form.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  )
}

export function sameDoc(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b)
}
