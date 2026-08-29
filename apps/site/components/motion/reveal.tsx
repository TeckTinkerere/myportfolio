'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Reveals its children once, when they first scroll into view.
 *
 * Deliberately minimal: no library, no scroll listener, one
 * IntersectionObserver that disconnects after firing. Elements never
 * re-animate on the way back up, which is the thing that makes scroll
 * animation feel cheap.
 *
 * The visual states live in globals.css inside a
 * `prefers-reduced-motion: no-preference` block, so a reduced-motion visitor
 * gets the content at full opacity with no transition — the observer still
 * runs and sets the attribute, it just has no styling attached.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  /** Stagger within a group, in milliseconds. Keep under ~200. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.dataset.reveal = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}
