#!/usr/bin/env -S node --import tsx
/**
 * Refreshes project cover images from each project's own live URL.
 *
 *   npx tsx scripts/refresh-project-screenshots.ts [slug ...]
 *
 * Reads the real content model — the same getPublicProjects() the site
 * itself uses — so the URL list can never drift from what's actually
 * published. Nothing is guessed: a project is only screenshotted if it
 * carries a `public: true` evidence link of type 'live-site'.
 *
 * This is a maintenance tool, not app code. It runs locally (or in CI on a
 * schedule) and writes static PNGs; the site keeps serving fast, reliable,
 * static images with zero runtime dependency on this script or on any
 * third-party screenshot service. Re-run it whenever a project's live site
 * changes enough to be worth a new cover image.
 *
 * Where a project already has a coverImage, its exact path is overwritten,
 * so no content file needs to change. Where a project has a live-site link
 * but no coverImage yet, a new file is written and the path printed — add
 * the `coverImage` field yourself, because the alt text needs a human
 * description, not a generated one.
 */
import { mkdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import sharp from 'sharp'
import { chromium } from 'playwright'

import { getPublicProjects } from '../lib/content/queries'

const VIEWPORT = { width: 1280, height: 800 }
const NAV_TIMEOUT_MS = 20_000
/** Lets client-rendered demos (React/Next SPAs) finish their first paint. */
const SETTLE_MS = 1500

/** Windows resolve() yields backslashes; normalise before any string split. */
function toPosix(path: string): string {
  return path.replace(/\\/g, '/')
}

type Target = {
  slug: string
  title: string
  url: string
  outPath: string
  isNewFile: boolean
}

function resolveTargets(onlySlugs: string[]): Target[] {
  const projects = getPublicProjects()
  const filtered = onlySlugs.length
    ? projects.filter((p) => onlySlugs.includes(p.slug))
    : projects

  const targets: Target[] = []
  for (const project of filtered) {
    const liveLink = (project.evidence ?? []).find(
      (link) => link.type === 'live-site' && link.public,
    )
    if (!liveLink) continue

    // coverImage.src is web-root-relative (served from public/), not
    // repo-root-relative — resolving it directly against cwd would (and
    // did, before this fix) write outside public/ and never actually
    // reach the site.
    const outPath = project.coverImage
      ? resolve('public', project.coverImage.src.replace(/^\//, ''))
      : resolve(`public/images/projects/${project.slug}-live.png`)

    targets.push({
      slug: project.slug,
      title: project.title,
      url: liveLink.href,
      outPath,
      isNewFile: !project.coverImage,
    })
  }
  return targets
}

/**
 * Text of a button to dismiss before capturing, for a project whose fresh
 * page load shows an interstitial rather than the product itself. Added
 * for future-tainment: every cold load shows a "Firebase Not Configured"
 * gate (the production auth genuinely isn't wired up — see its content
 * entry), and a screenshot of that gate makes a real product look broken.
 * Click-through is best-effort — if the button isn't found, the raw page
 * is still captured rather than failing the whole run.
 */
const DISMISS_BEFORE_CAPTURE: Partial<Record<string, string>> = {
  'future-tainment': 'Continue in Demo Mode',
}

async function screenshot(browser: import('playwright').Browser, target: Target) {
  const page = await browser.newPage({ viewport: VIEWPORT })
  try {
    await page.goto(target.url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS })
    await page.waitForTimeout(SETTLE_MS)

    const dismissText = DISMISS_BEFORE_CAPTURE[target.slug]
    if (dismissText) {
      try {
        await page.getByText(dismissText, { exact: true }).click({ timeout: 4_000 })
        await page.waitForTimeout(SETTLE_MS)
      } catch {
        // Button not present this run — capture whatever the page shows
        // rather than aborting.
      }
    }

    const raw = await page.screenshot({ type: 'png' })

    mkdirSync(dirname(target.outPath), { recursive: true })
    // Palette quantisation: a raw viewport screenshot is a few MB; a project
    // card renders it at a few hundred px wide, so lossless full colour buys
    // nothing visible. Mirrors scripts/build-brand-assets.mjs.
    await sharp(raw)
      .resize(1280, 720, { fit: 'cover', position: 'top' })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(target.outPath)

    return { ok: true as const, bytes: statSync(target.outPath).size }
  } finally {
    await page.close()
  }
}

async function main() {
  const onlySlugs = process.argv.slice(2)
  const targets = resolveTargets(onlySlugs)

  if (targets.length === 0) {
    console.log(
      onlySlugs.length
        ? `No published project matched: ${onlySlugs.join(', ')}`
        : 'No published project has a public live-site evidence link.',
    )
    return
  }

  console.log(`Screenshotting ${targets.length} project(s)...\n`)
  const browser = await chromium.launch()
  const results: Array<{ target: Target; ok: boolean; detail: string }> = []

  for (const target of targets) {
    process.stdout.write(`  ${target.slug.padEnd(24)} ${target.url}\n`)
    try {
      const result = await screenshot(browser, target)
      const relative = toPosix(target.outPath).replace(toPosix(process.cwd()) + '/', '')
      results.push({
        target,
        ok: true,
        detail: `${(result.bytes / 1024).toFixed(1)} kB -> ${relative}`,
      })
    } catch (error) {
      // One dead preview URL should not abort the run for every other
      // project — v0.dev-style preview deployments are the least stable
      // link on the site.
      results.push({
        target,
        ok: false,
        detail: error instanceof Error ? error.message.split('\n')[0] : String(error),
      })
    }
  }

  await browser.close()

  console.log('\nResults:')
  for (const { target, ok, detail } of results) {
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${target.slug.padEnd(24)} ${detail}`)
  }

  const newFiles = results.filter((r) => r.ok && r.target.isNewFile)
  if (newFiles.length > 0) {
    console.log(
      `\n${newFiles.length} project(s) had no coverImage and got a new file. ` +
        `Add a coverImage field pointing at it (with real alt text) in the project's content file:`,
    )
    for (const { target } of newFiles) {
      const webPath = toPosix(target.outPath).split('/public/')[1]
      console.log(`  ${target.slug}: /${webPath}`)
    }
  }

  const failures = results.filter((r) => !r.ok)
  if (failures.length > 0) {
    console.log(`\n${failures.length} project(s) failed and kept their existing image.`)
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
