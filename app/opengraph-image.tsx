import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site-config'

export const alt = `${siteConfig.name} — ${siteConfig.descriptor}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Default social card. Typography only — there is no approved brand
 * photograph cleared for social distribution.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0d0f',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 10,
              border: '1px solid #2b3239',
              color: '#f4b942',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {siteConfig.monogram}
          </div>
          <div style={{ color: '#a5adb5', fontSize: 22, letterSpacing: '0.16em' }}>
            SINGAPORE · TECHNOLOGY · PRODUCTS · EVENTS
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#f3f0e8',
            fontSize: 68,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 940,
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
