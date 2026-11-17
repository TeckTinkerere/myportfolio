'use client'

import { useRef } from 'react'

import { cn } from './cn'

/**
 * A plane in 3D space that leans toward the pointer.
 *
 * Pure CSS transforms: no WebGL, no library, no animation loop. The handler
 * writes two custom properties and the browser does the rest, so this costs
 * nothing until someone moves a mouse over it. Children can sit at different
 * depths with `translateZ` — the inner element preserves 3D — which is what
 * turns a tilt into actual parallax rather than a skewed picture.
 *
 * `baseX` / `baseZ` set a resting angle, for things that should look
 * three-dimensional before anyone touches them.
 *
 * Mouse only, and not at all under reduced motion: a touch drag is a scroll,
 * and the content is complete without the effect.
 */
export function Tilt({
  children,
  className,
  innerClassName,
  max = 7,
  baseX = 0,
  baseZ = 0,
  perspective = 900,
}: {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  /** Maximum lean toward the pointer, in degrees. */
  max?: number
  baseX?: number
  baseZ?: number
  perspective?: number
}) {
  const inner = useRef<HTMLDivElement>(null)

  const lean = (x: number, y: number) => {
    inner.current?.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`)
    inner.current?.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`)
  }

  return (
    <div
      className={className}
      style={{ perspective }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rect = event.currentTarget.getBoundingClientRect()
        lean(
          ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        )
      }}
      onPointerLeave={() => lean(0, 0)}
    >
      <div
        ref={inner}
        className={cn('transition-transform duration-200 ease-out', innerClassName)}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(calc(${baseX}deg + var(--tilt-x, 0deg))) rotateY(var(--tilt-y, 0deg)) rotateZ(${baseZ}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
