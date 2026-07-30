import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site-config'

export const alt = `${siteConfig.name} — ${siteConfig.descriptor}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Social card. The mark is inlined as a data URI because Satori resolves
 * <img> at render time and cannot reach a relative path — and an absolute
 * URL would fail while the deployment that serves it is still building.
 */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/brand/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#06070a',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={64} height={64} alt="" />
          <div style={{ color: '#a5adb5', fontSize: 21, letterSpacing: '0.18em' }}>
            SINGAPORE · TECHNOLOGY · PRODUCTS · EVENTS
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#f3f0e8',
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            maxWidth: 960,
          }}
        >
          {siteConfig.headline}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <div style={{ color: '#f4b942', fontSize: 30, fontWeight: 600 }}>
            {siteConfig.name}
          </div>
          <div style={{ color: '#a5adb5', fontSize: 26 }}>{siteConfig.descriptor}</div>
        </div>
      </div>
    ),
    size,
  )
}
