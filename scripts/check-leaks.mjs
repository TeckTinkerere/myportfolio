#!/usr/bin/env node
/**
 * Content-safety gate. Run after `npm run build`.
 *
 * Confirms that nothing unpublished, unverified or secret reached an artifact
 * a visitor can actually receive.
 *
 * Scope is deliberate: client bundles under .next/static, plus the
 * prerendered .html / .rsc / .body files under .next/server/app. Server-side
 * .js modules and .next/cache are excluded — they are never sent to a
 * browser, and they legitimately contain `process.env.BREVO_API_KEY` (the
 * name, read at runtime) and the unpublished case-study scaffold.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const FORBIDDEN = [
  // The password that gated the old visionary wall, and shipped in the bundle.
  'thefutureinnov',
  // The unpublished enterprise automation scaffold.
  'PENDING VERIFICATION',
  'Automation Reliability in a Restricted',
  'enterprise-automation-reliability',
  // Metrics that were never verified.
  '99.5%',
  'reducing spam',
  '100% email verification',
  // Secrets.
  'BREVO_API_KEY',
  // Repository links that 404.
  'github.com/mohamedaslam/',
]

const PRERENDERED = new Set(['.html', '.rsc', '.body'])

function walk(dir, filter, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, filter, out)
    else if (filter(full)) out.push(full)
  }
  return out
}

const files = [
  ...walk('.next/static', () => true),
  ...walk('.next/server/app', (f) => PRERENDERED.has(f.slice(f.lastIndexOf('.')))),
]

if (files.length === 0) {
  console.error('No build output found. Run `npm run build` first.')
  process.exit(1)
}

const hits = new Map()
for (const file of files) {
  const contents = readFileSync(file, 'utf8')
  for (const term of FORBIDDEN) {
    if (contents.includes(term)) {
      if (!hits.has(term)) hits.set(term, [])
      hits.get(term).push(file)
    }
  }
}

console.log(`Scanned ${files.length} client-visible files.\n`)
for (const term of FORBIDDEN) {
  const found = hits.get(term)
  console.log(`  ${found ? 'FAIL' : 'PASS'}  ${term}`)
  if (found) for (const file of found.slice(0, 3)) console.log(`          ${file}`)
}

if (hits.size > 0) {
  console.error(`\n${hits.size} forbidden term(s) reached client-visible output.`)
  process.exit(1)
}
console.log('\nAll clear.')
