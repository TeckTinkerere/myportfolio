'use client'

import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { BLEED, cardSize, EXPORT_DPI, mmToPx } from '@/lib/design/dimensions'
import { buildPdf } from '@/lib/design/pdf'
import type { DesignContext } from '@/lib/design/resolve'
import { DESIGN_FONTS, type DesignDoc, type DesignFont, type DesignSide } from '@/lib/design/schema'

import { EDITOR_FONTS, SideSvg, type RenderMode } from './side-svg'

/**
 * Exports run in the browser. A side is rendered to an SVG string with its
 * fonts and images inlined (an SVG drawn as an image cannot fetch anything),
 * then rasterised at 600 dpi or saved as vector.
 */

const unquote = (s: string) => s.trim().replace(/^['"]|['"]$/g, '')

/** The real font-family stacks behind the CSS variables the editor uses. */
function resolvedFonts(): Record<DesignFont, string> {
  const root = getComputedStyle(document.documentElement)
  const out = {} as Record<DesignFont, string>
  for (const f of DESIGN_FONTS) {
    const varName = EDITOR_FONTS[f].match(/var\((--[\w-]+)\)/)?.[1]
    const value = varName ? root.getPropertyValue(varName).trim() : ''
    out[f] = value ? `${value}, ${EDITOR_FONTS[f].split('),')[1] ?? 'sans-serif'}` : EDITOR_FONTS[f]
  }
  return out
}

async function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

/** @font-face rules for the families a design uses, with files inlined. */
async function fontFaceCss(families: Set<string>): Promise<string> {
  const rules: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let cssRules: CSSRuleList
    try {
      cssRules = sheet.cssRules
    } catch {
      continue // cross-origin sheet
    }
    for (const rule of Array.from(cssRules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue
      const family = unquote(rule.style.getPropertyValue('font-family'))
      if (!families.has(family)) continue
      let css = rule.cssText
      const urls = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1])
      for (const url of urls) {
        try {
          const res = await fetch(new URL(url, sheet.href ?? location.href))
          css = css.replace(url, await toDataUrl(await res.blob()))
        } catch {
          // A missing face falls back to a system font rather than failing the export.
        }
      }
      rules.push(css)
    }
  }
  return rules.join('\n')
}

/** Every image URL in a design, fetched same-origin through the image optimiser. */
async function inlineImages(doc: DesignDoc): Promise<Map<string, string>> {
  const srcs = new Set<string>()
  for (const s of [doc.front, doc.back]) {
    if (s.background.kind === 'image' && s.background.image) srcs.add(s.background.image)
    for (const e of s.elements) if (e.type === 'image') srcs.add(e.src)
  }
  const map = new Map<string, string>()
  await Promise.all(
    [...srcs].map(async (src) => {
      // The storage bucket sends no CORS headers; Next's optimiser is same-origin.
      const res = await fetch(`/_next/image?url=${encodeURIComponent(src)}&w=3840&q=95`)
      if (res.ok) map.set(src, await toDataUrl(await res.blob()))
    }),
  )
  return map
}

interface Prepared {
  fonts: Record<DesignFont, string>
  fontCss: string
  images: Map<string, string>
}

async function prepare(doc: DesignDoc): Promise<Prepared> {
  await document.fonts.ready
  const fonts = resolvedFonts()
  const used = new Set<string>()
  for (const s of [doc.front, doc.back]) {
    for (const e of s.elements) {
      if (e.type === 'text' && !e.hidden) fonts[e.font].split(',').forEach((f) => used.add(unquote(f)))
    }
  }
  const [fontCss, images] = await Promise.all([fontFaceCss(used), inlineImages(doc)])
  return { fonts, fontCss, images }
}

/** Render one side to a standalone SVG string. */
function sideToSvg(
  side: DesignSide,
  doc: DesignDoc,
  ctx: DesignContext,
  prepared: Prepared,
  mode: RenderMode,
  withBleed: boolean,
  pixel?: { w: number; h: number },
): string {
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;left:-10000px;top:0;'
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    flushSync(() =>
      root.render(
        createElement(SideSvg, {
          side,
          doc,
          ctx,
          mode,
          withBleed,
          fonts: prepared.fonts,
          imageHref: (src: string) => prepared.images.get(src) ?? src,
          pixelWidth: pixel?.w,
          pixelHeight: pixel?.h,
        }),
      ),
    )
    const svg = host.querySelector('svg')
    if (!svg) throw new Error('Render failed')
    const markup = new XMLSerializer().serializeToString(svg)
    // Fonts go in a <style> right after the opening tag.
    return markup.replace(/<svg([^>]*)>/, `<svg$1><style>${prepared.fontCss}</style>`)
  } finally {
    root.unmount()
    host.remove()
  }
}

async function rasterise(svg: string, w: number, h: number, type: 'image/png' | 'image/jpeg'): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.decoding = 'sync'
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const g = canvas.getContext('2d')
    if (!g) throw new Error('Canvas unavailable')
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    g.drawImage(img, 0, 0, w, h)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), type, 0.95),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function printPixels(doc: DesignDoc) {
  const { w, h } = cardSize(doc.orientation)
  return { w: mmToPx(w + BLEED * 2, EXPORT_DPI), h: mmToPx(h + BLEED * 2, EXPORT_DPI), trimW: w, trimH: h }
}

const modeFor = (doc: DesignDoc): RenderMode => (doc.material === 'pvc' ? 'color' : 'engrave-export')

/** Two-page print PDF (front, back) at 600 dpi with bleed and trim boxes. */
export async function exportPdf(doc: DesignDoc, ctx: DesignContext, name: string, cropMarks: boolean) {
  const prepared = await prepare(doc)
  const px = printPixels(doc)
  const pages = []
  for (const side of [doc.front, doc.back]) {
    const svg = sideToSvg(side, doc, ctx, prepared, modeFor(doc), true, { w: px.w, h: px.h })
    const jpeg = new Uint8Array(await (await rasterise(svg, px.w, px.h, 'image/jpeg')).arrayBuffer())
    pages.push({ jpeg, pixelWidth: px.w, pixelHeight: px.h })
  }
  const pdf = buildPdf(pages, { trimWidthMm: px.trimW, trimHeightMm: px.trimH, bleedMm: BLEED, cropMarks, title: name })
  download(new Blob([pdf as BlobPart], { type: 'application/pdf' }), `${name}-print.pdf`)
}

/** One 600 dpi PNG per side, with bleed. */
export async function exportPng(doc: DesignDoc, ctx: DesignContext, name: string) {
  const prepared = await prepare(doc)
  const px = printPixels(doc)
  for (const [label, side] of [['front', doc.front], ['back', doc.back]] as const) {
    const svg = sideToSvg(side, doc, ctx, prepared, modeFor(doc), true, { w: px.w, h: px.h })
    download(await rasterise(svg, px.w, px.h, 'image/png'), `${name}-${label}.png`)
  }
}

/** Vector SVG per side, trimmed size, for laser engravers or designers. */
export async function exportSvg(doc: DesignDoc, ctx: DesignContext, name: string) {
  const prepared = await prepare(doc)
  const { w, h } = cardSize(doc.orientation)
  for (const [label, side] of [['front', doc.front], ['back', doc.back]] as const) {
    const svg = sideToSvg(side, doc, ctx, prepared, modeFor(doc), false)
      .replace(/<svg /, `<svg width="${w}mm" height="${h}mm" `)
    download(new Blob([svg], { type: 'image/svg+xml' }), `${name}-${label}.svg`)
  }
}
