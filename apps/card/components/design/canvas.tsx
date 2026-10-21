'use client'

import { useState, type PointerEvent as ReactPointerEvent } from 'react'

import { BLEED, CARD, cardSize, SAFE } from '@/lib/design/dimensions'
import type { DesignContext } from '@/lib/design/resolve'
import type { DesignDoc, DesignElement, DesignSide } from '@/lib/design/schema'

import { SideSvg } from './side-svg'

type Handle = 'nw' | 'ne' | 'sw' | 'se'

interface Drag {
  kind: 'move' | Handle
  id: string
  startX: number
  startY: number
  orig: DesignElement
}

/** Snap distance, in millimetres. */
const SNAP = 1.2

/**
 * The editing surface for one side: the rendered card, print guides, and a
 * selection box with resize handles. Geometry is millimetres throughout;
 * `scale` converts to screen pixels.
 */
export function DesignCanvas({
  doc,
  side,
  ctx,
  scale,
  selectedId,
  showGuides,
  onSelect,
  onChange,
  onCommit,
}: {
  doc: DesignDoc
  side: DesignSide
  ctx: DesignContext
  scale: number
  selectedId: string | null
  showGuides: boolean
  onSelect: (id: string | null) => void
  /** Live update during a drag (not added to undo history). */
  onChange: (el: DesignElement) => void
  /** Drag finished: record one undo step from `before`. */
  onCommit: (before: DesignElement) => void
}) {
  const { w, h } = cardSize(doc.orientation)
  // State, not a ref: pointer moves always arrive after the render that
  // follows pointerdown, so the drag is visible by then.
  const [drag, setDrag] = useState<Drag | null>(null)
  const [snapLines, setSnapLines] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] })
  const selected = side.elements.find((e) => e.id === selectedId) ?? null

  const fullW = (w + BLEED * 2) * scale
  const fullH = (h + BLEED * 2) * scale
  const toPx = (mm: number) => (mm + BLEED) * scale

  function start(e: ReactPointerEvent, kind: Drag['kind'], el: DesignElement) {
    if (el.locked) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ kind, id: el.id, startX: e.clientX, startY: e.clientY, orig: el })
  }

  function onPointerDownSurface(e: ReactPointerEvent<HTMLDivElement>) {
    const target = (e.target as Element).closest('[data-element-id]')
    const id = target?.getAttribute('data-element-id') ?? null
    const el = side.elements.find((x) => x.id === id)
    onSelect(el ? el.id : null)
    if (el) start(e, 'move', el)
  }

  function onPointerMove(e: ReactPointerEvent) {
    const d = drag
    if (!d) return
    const dx = (e.clientX - d.startX) / scale
    const dy = (e.clientY - d.startY) / scale
    const o = d.orig
    let next: DesignElement

    if (d.kind === 'move') {
      let x = o.x + dx
      let y = o.y + dy
      const lines = { x: [] as number[], y: [] as number[] }
      if (!e.altKey) {
        // Snap left edge, centre or right edge to card centre and safe lines.
        const targetsX = [SAFE, w / 2, w - SAFE]
        const targetsY = [SAFE, h / 2, h - SAFE]
        const snapAxis = (pos: number, size: number, targets: number[], out: number[]) => {
          for (const t of targets) {
            for (const [edge, off] of [[pos, 0], [pos + size / 2, size / 2], [pos + size, size]] as const) {
              if (Math.abs(edge - t) < SNAP) {
                out.push(t)
                return t - off
              }
            }
          }
          return pos
        }
        x = snapAxis(x, o.w, targetsX, lines.x)
        y = snapAxis(y, o.h, targetsY, lines.y)
      }
      setSnapLines(lines)
      next = { ...o, x: round(x), y: round(y) }
    } else {
      const keepRatio = e.shiftKey || o.type === 'qr' || o.type === 'icon' || o.type === 'image'
      let nx = o.x
      let ny = o.y
      let nw = o.w + (d.kind.includes('e') ? dx : -dx)
      let nh = o.h + (d.kind.includes('s') ? dy : -dy)
      if (keepRatio) {
        const ratio = o.w / o.h
        if (Math.abs(nw - o.w) / o.w > Math.abs(nh - o.h) / o.h) nh = nw / ratio
        else nw = nh * ratio
      }
      nw = Math.max(1, nw)
      nh = Math.max(o.type === 'shape' ? 0.2 : 1, nh)
      if (d.kind.includes('w')) nx = o.x + o.w - nw
      if (d.kind.includes('n')) ny = o.y + o.h - nh
      next = { ...o, x: round(nx), y: round(ny), w: round(nw), h: round(nh) }
    }
    onChange(next)
  }

  function onPointerUp() {
    const d = drag
    setDrag(null)
    setSnapLines({ x: [], y: [] })
    if (d) onCommit(d.orig)
  }

  return (
    <div
      className="relative touch-none select-none"
      style={{ width: fullW, height: fullH }}
      onPointerDown={onPointerDownSurface}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <SideSvg side={side} doc={doc} ctx={ctx} mode={doc.material === 'pvc' ? 'color' : 'engrave-preview'} className="h-full w-full" />

      {/* Guides: dim the bleed, outline the trim (rounded, as cut), dash the safe area. */}
      <svg className="pointer-events-none absolute inset-0" width={fullW} height={fullH} viewBox={`${-BLEED} ${-BLEED} ${w + BLEED * 2} ${h + BLEED * 2}`}>
        <defs>
          <mask id="trim-mask">
            <rect x={-BLEED} y={-BLEED} width={w + BLEED * 2} height={h + BLEED * 2} fill="white" />
            <rect x={0} y={0} width={w} height={h} rx={CARD.cornerRadius} fill="black" />
          </mask>
        </defs>
        <rect
          x={-BLEED}
          y={-BLEED}
          width={w + BLEED * 2}
          height={h + BLEED * 2}
          fill={showGuides ? 'rgba(255,255,255,0.55)' : 'hsl(var(--background))'}
          mask="url(#trim-mask)"
        />
        {showGuides && (
          <>
            <rect x={0} y={0} width={w} height={h} rx={CARD.cornerRadius} fill="none" stroke="#e11d48" strokeWidth={0.2} />
            <rect x={SAFE} y={SAFE} width={w - SAFE * 2} height={h - SAFE * 2} fill="none" stroke="#2563eb" strokeWidth={0.15} strokeDasharray="0.8 0.6" />
          </>
        )}
        {snapLines.x.map((x) => (
          <line key={`x${x}`} x1={x} x2={x} y1={-BLEED} y2={h + BLEED} stroke="#db2777" strokeWidth={0.15} />
        ))}
        {snapLines.y.map((y) => (
          <line key={`y${y}`} y1={y} y2={y} x1={-BLEED} x2={w + BLEED} stroke="#db2777" strokeWidth={0.15} />
        ))}
      </svg>

      {/* Selection box and handles, in screen pixels. */}
      {selected && !selected.hidden && (
        <div
          className="pointer-events-none absolute border border-[#2563eb]"
          style={{
            left: toPx(selected.x),
            top: toPx(selected.y),
            width: selected.w * scale,
            height: selected.h * scale,
            transform: selected.rotation ? `rotate(${selected.rotation}deg)` : undefined,
          }}
        >
          {!selected.locked &&
            (['nw', 'ne', 'sw', 'se'] as const).map((hd) => (
              <span
                key={hd}
                onPointerDown={(e) => start(e, hd, selected)}
                className="pointer-events-auto absolute h-3 w-3 rounded-sm border border-[#2563eb] bg-white"
                style={{
                  left: hd.includes('w') ? -6 : undefined,
                  right: hd.includes('e') ? -6 : undefined,
                  top: hd.includes('n') ? -6 : undefined,
                  bottom: hd.includes('s') ? -6 : undefined,
                  cursor: hd === 'nw' || hd === 'se' ? 'nwse-resize' : 'nesw-resize',
                }}
              />
            ))}
        </div>
      )}
    </div>
  )
}

const round = (n: number) => Math.round(n * 10) / 10
