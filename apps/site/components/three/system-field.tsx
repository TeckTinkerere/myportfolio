'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import type { SystemFieldData } from '@/lib/content/system-field'

/**
 * Decides whether the WebGL field loads at all, and mounts it over the
 * server-rendered SVG that is already on screen.
 *
 * three.js is ~160 kB. It is dynamically imported with ssr:false and only
 * after mount, so it is never in the initial bundle, never blocks first
 * paint, and cannot affect LCP. If it never loads — no WebGL, a slow
 * connection, JavaScript off — the SVG underneath simply remains, showing
 * the same data.
 */
const SystemFieldCanvas = dynamic(
  () => import('@/components/three/system-field-canvas'),
  { ssr: false },
)

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

export function SystemField({ data }: { data: SystemFieldData }) {
  const [ready, setReady] = useState(false)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    if (!supportsWebGL()) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAnimate(!query.matches)
    sync()
    query.addEventListener('change', sync)

    // Saving data or running on very limited hardware: the SVG is enough.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    if (connection?.saveData) return () => query.removeEventListener('change', sync)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return () => query.removeEventListener('change', sync)
    }

    setReady(true)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (!ready) return null

  return (
    <div className="absolute inset-0 animate-rise-in [animation-duration:700ms]">
      <SystemFieldCanvas data={data} animate={animate} />
    </div>
  )
}
