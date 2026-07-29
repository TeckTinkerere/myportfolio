#!/usr/bin/env node
/**
 * Generates every brand asset from a single master file.
 *
 *   node scripts/build-brand-assets.mjs [path-to-master.png]
 *
 * The master must be a square PNG with a genuine alpha channel — the mark
 * has to sit on both the near-black dark theme and the warm light theme, so
 * anything with a baked-in background is unusable for site chrome.
 *
 * The master is cropped to the bounding box of its *opaque* pixels rather
 * than trimmed on colour. That removes the generator watermark and the soft
 * drop shadow, both of which are low-alpha and outside the mark itself, and
 * it guarantees the mark is optically centred at every size.
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const DEFAULT_MASTER = 'assets/brand/logo-master.png'
const master = resolve(process.argv[2] ?? DEFAULT_MASTER)

if (!existsSync(master)) {
  console.error(`Master not found: ${master}`)
  process.exit(1)
}

/** Alpha above which a pixel counts as part of the mark, not shadow. */
const OPAQUE = 160
/** Breathing room around the mark, as a fraction of its longest side. */
const PADDING = 0.06

async function opaqueBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = -1, maxY = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * channels + 3] >= OPAQUE) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < 0) throw new Error('Master has no opaque pixels — is it really transparent?')
  return { minX, minY, maxX, maxY, width, height }
}

async function main() {
  const b = await opaqueBounds(master)
  const markW = b.maxX - b.minX + 1
  const markH = b.maxY - b.minY + 1
  const pad = Math.round(Math.max(markW, markH) * PADDING)

  // Square canvas centred on the mark, clamped to the source bounds.
  const side = Math.max(markW, markH) + pad * 2
  const cx = b.minX + markW / 2
  const cy = b.minY + markH / 2
  const left = Math.max(0, Math.round(cx - side / 2))
  const top = Math.max(0, Math.round(cy - side / 2))
  const size = Math.min(side, b.width - left, b.height - top)

  console.log(`Master ${b.width}x${b.height}`)
  console.log(`Mark bounds ${markW}x${markH} at (${b.minX},${b.minY})`)
  console.log(`Cropping ${size}x${size} at (${left},${top})\n`)

  const square = () =>
    sharp(master).extract({ left, top, width: size, height: size })

  /**
   * The mark is a photographic brushed-metal render, so a full-colour PNG of
   * it is large. Palette quantisation cuts that by roughly 80% with no
   * visible loss at these sizes — the gradients are smooth and narrow-gamut.
   *
   * Files under app/ are served byte-for-byte by Next's icon convention, so
   * they are kept small deliberately. Files under public/ that go through
   * next/image are re-encoded to AVIF/WebP on the way out, so their source
   * size matters less.
   */
  const outputs = [
    // Next.js file conventions — these become <link rel="icon"> automatically.
    // 128 is ample: browsers render this at 16–32px.
    ['app/icon.png', 128, { palette: true, quality: 90 }],
    ['app/apple-icon.png', 180, { palette: true, quality: 92 }],
    // Site chrome, social cards, and transactional email. Email cannot use
    // relative paths, so these are served from stable public URLs.
    ['public/images/brand/logo.png', 512, { palette: true, quality: 95 }],
    ['public/images/brand/logo-email.png', 128, { palette: true, quality: 92 }],
  ]

  const { statSync } = await import('node:fs')

  for (const [out, px, encode] of outputs) {
    const path = resolve(out)
    mkdirSync(dirname(path), { recursive: true })
    await square()
      .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, effort: 10, ...encode })
      .toFile(path)
    console.log(
      `  ${out.padEnd(38)} ${String(px).padStart(3)}px  ${(statSync(path).size / 1024).toFixed(1)} kB`,
    )
  }

  console.log('\nDone.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
