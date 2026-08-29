import 'server-only'

import { createHash } from 'node:crypto'

import { siteConfig } from '@/content/site-config'
import { getPublicProjects } from '@/lib/content/queries'

/**
 * Short share links: /p/<code> → /work/<slug>.
 *
 * There is no database here, so a stored share token would mean inventing
 * persistence for a site that deliberately has none. Instead the code is
 * *derived* from the slug: same slug, same code, forever, on every machine
 * and every deploy, with nothing to migrate and nothing to keep in sync.
 *
 * What the code is not: it is not a capability. Everything /p/<code>
 * resolves to is already public at /work/<slug> — the code is a shorter way
 * to say a public URL out loud or put one on a badge, not a way to reach
 * something private. Access control stays where it already is, in
 * getPublicProjects(); an unpublished project simply has no code, no route
 * and no entry in the map below.
 *
 * That is also why the derivation is hashed rather than the slug truncated.
 * Not for secrecy — for stability. A truncated slug changes shape whenever a
 * title is reworded; a hash of the slug does not.
 */

/**
 * Namespaces the hash so these codes can never collide with a code derived
 * elsewhere for another purpose. Changing this value changes every link that
 * has ever been shared, so it is a constant, not configuration.
 */
const NAMESPACE = 'mohdaslam.dev/p/v1'

/**
 * Crockford-style base32: no i, l, o or u. Drops the glyphs that are hard to
 * tell apart from a digit at a glance — l against 1, o against 0 — and drops
 * the one vowel that lets a random code turn into an accidental word.
 */
const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz'

const DEFAULT_LENGTH = 6
const MAX_LENGTH = 24

/** Deterministic and side-effect free. Exported so tests can pin the contract. */
export function deriveCode(slug: string, length = DEFAULT_LENGTH): string {
  const digest = createHash('sha256').update(`${NAMESPACE}:${slug}`).digest()
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[digest[i % digest.length] % ALPHABET.length]
  }
  return code
}

/**
 * Every published project's code, built once per process.
 *
 * Slugs are walked in sorted order and a colliding slug lengthens its own
 * code rather than every code lengthening together. That ordering is what
 * makes an already-shared link survive a new project being added: inserting
 * a slug never reverses the relative order of two slugs already present, so
 * an earlier slug keeps the code it was first assigned. At six characters
 * over this alphabet the collision branch is vanishingly unlikely to ever
 * run — it exists so that if it does, it resolves silently instead of one
 * project shadowing another.
 */
function buildCodeMap(): ReadonlyMap<string, string> {
  const slugs = getPublicProjects()
    .map((project) => project.slug)
    .sort()

  const bySlug = new Map<string, string>()
  const used = new Set<string>()

  for (const slug of slugs) {
    let length = DEFAULT_LENGTH
    let code = deriveCode(slug, length)
    while (used.has(code) && length < MAX_LENGTH) {
      length += 1
      code = deriveCode(slug, length)
    }
    if (used.has(code)) {
      throw new Error(`Share code collision could not be resolved for "${slug}"`)
    }
    used.add(code)
    bySlug.set(slug, code)
  }

  return bySlug
}

let cachedBySlug: ReadonlyMap<string, string> | undefined
let cachedByCode: ReadonlyMap<string, string> | undefined

function codesBySlug(): ReadonlyMap<string, string> {
  cachedBySlug ??= buildCodeMap()
  return cachedBySlug
}

function codesByCode(): ReadonlyMap<string, string> {
  if (!cachedByCode) {
    const inverted = new Map<string, string>()
    for (const [slug, code] of codesBySlug()) inverted.set(code, slug)
    cachedByCode = inverted
  }
  return cachedByCode
}

/** Every published project's short code — for generateStaticParams and tests. */
export function getShareCodes(): ReadonlyMap<string, string> {
  return codesBySlug()
}

/** Undefined for an unpublished project, which is the point. */
export function getShareCode(slug: string): string | undefined {
  return codesBySlug().get(slug)
}

/**
 * Undefined for an unknown code, so the route can 404 cleanly.
 *
 * Casing is normalised here, but note that /p/[code] prerenders the
 * lowercase codes only and sets dynamicParams = false, so an uppercased URL
 * is refused by the router before it reaches this function. That is the
 * accepted trade for keeping every short link static: the paths people
 * actually arrive by — a scanned QR, a pasted link, the system share sheet —
 * are exact, and a typo of any other kind would miss regardless.
 */
export function resolveShareCode(code: string): string | undefined {
  return codesByCode().get(code.toLowerCase())
}

export function getSharePath(slug: string): string | undefined {
  const code = getShareCode(slug)
  return code ? `/p/${code}` : undefined
}

/**
 * The absolute link a person actually copies or scans. Built from
 * siteConfig.url so it follows NEXT_PUBLIC_SITE_URL in production rather
 * than hardcoding a host Vercel may not be serving.
 */
export function getShareUrl(slug: string): string | undefined {
  const path = getSharePath(slug)
  return path ? `${siteConfig.url.replace(/\/$/, '')}${path}` : undefined
}
