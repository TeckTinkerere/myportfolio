import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Reads the JSON files Keystatic writes under content/data/.
 *
 * Keystatic's on-disk shape differs from the Zod schema in a few ways, so
 * every record goes through normalise() before parsing:
 *   - empty optional fields are stored as "" or null      -> dropped
 *   - optional objects are { discriminant, value }        -> value or dropped
 *   - objects whose fields are all empty (featuredRank)   -> dropped
 *
 * Server-only: uses fs. Every importer is a server component, route or test.
 */

export const DATA_DIR = join(process.cwd(), 'content/data')

export function normalise(value: unknown): unknown {
  if (value === null || value === '') return undefined
  if (Array.isArray(value)) {
    return value.map(normalise).filter((item) => item !== undefined)
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    // A disabled toggle is saved as { discriminant: false } with no value key.
    if (typeof record.discriminant === 'boolean' && Object.keys(record).every((k) => k === 'discriminant' || k === 'value')) {
      return record.discriminant ? normalise(record.value) : undefined
    }
    const out: Record<string, unknown> = {}
    for (const [key, raw] of Object.entries(record)) {
      const next = normalise(raw)
      if (next !== undefined) out[key] = next
    }
    return Object.keys(out).length > 0 ? out : undefined
  }
  return value
}

export function readJson(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'))
}

/** Every entry in a collection folder, with its slug taken from the filename. */
export function readCollection(folder: string): Array<Record<string, unknown> & { slug: string }> {
  return readdirSync(join(DATA_DIR, folder))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => ({
      ...(normalise(readJson(join(folder, name))) as Record<string, unknown>),
      slug: name.replace(/\.json$/, ''),
    }))
}
