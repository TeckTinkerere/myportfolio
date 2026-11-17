import { Tilt } from '@mohdaslam/ui/tilt'
import { formatDuration, type RunningOrder } from '@/lib/running-order'
import type { RunSheetSegment } from '@/lib/schema'

/**
 * A run sheet as a clock face: one arc per segment, as long as the segment
 * runs, in programme order from twelve o'clock.
 *
 * It is drawn from the same computed running order as the sheet itself, so
 * it cannot show a programme that the sheet does not describe — re-cut a
 * segment and its arc changes with it.
 *
 * The depth is real, not drawn: three flat layers (scale, arcs, readout)
 * stacked along Z inside a tilted plane. Server-rendered SVG and CSS only;
 * the one client-side part is the Tilt wrapper leaning toward the pointer.
 */

/** Tone by what the host is doing, not by segment type one-for-one. */
const KIND_STROKE: Record<RunSheetSegment['kind'], string> = {
  opening: 'stroke-accent',
  closing: 'stroke-accent',
  award: 'stroke-accent',
  talk: 'stroke-ink',
  panel: 'stroke-ink',
  demo: 'stroke-success',
  performance: 'stroke-success',
  break: 'stroke-ink-muted',
  admin: 'stroke-ink-muted',
}

const SIZE = 200
const CENTRE = SIZE / 2
const RADIUS = 78
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Gap between arcs, in the same units as the circumference. */
const GAP = 5

export function RunDial({ order, className }: { order: RunningOrder; className?: string }) {
  const total = order.totalMinutes || 1

  return (
    <Tilt className={className} baseX={38} max={9} perspective={700}>
      <div
        role="img"
        aria-label={`Running order: ${order.segments.length} segments from ${order.startsAt} to ${order.endsAt}, ${formatDuration(order.totalMinutes)} in total.`}
        className="relative aspect-square w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Layer 0 — the scale: a tick every five minutes of the programme. */}
        <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0">
          <circle
            cx={CENTRE}
            cy={CENTRE}
            r={RADIUS + 16}
            className="fill-surface stroke-border"
            strokeWidth={1}
          />
          {Array.from({ length: Math.floor(total / 5) }, (_, index) => {
            const angle = ((index * 5) / total) * 360
            return (
              <line
                key={index}
                x1={CENTRE}
                y1={CENTRE - RADIUS - 13}
                x2={CENTRE}
                y2={CENTRE - RADIUS - (index % 3 === 0 ? 7 : 10)}
                transform={`rotate(${angle} ${CENTRE} ${CENTRE})`}
                className="stroke-ink-muted"
                strokeWidth={1}
                opacity={0.6}
              />
            )
          })}
        </svg>

        {/* Layer 1 — the programme, lifted off the scale. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          style={{ transform: 'translateZ(14px)' }}
        >
          <g transform={`rotate(-90 ${CENTRE} ${CENTRE})`}>
            {order.segments.map((segment) => {
              const length = (segment.durationMinutes / total) * CIRCUMFERENCE
              const offset = (segment.startOffsetMinutes / total) * CIRCUMFERENCE
              const drawn = Math.max(1, length - GAP)
              return (
                <circle
                  key={segment.id}
                  cx={CENTRE}
                  cy={CENTRE}
                  r={RADIUS}
                  fill="none"
                  strokeWidth={9}
                  strokeDasharray={`${drawn} ${CIRCUMFERENCE - drawn}`}
                  strokeDashoffset={-offset}
                  className={KIND_STROKE[segment.kind]}
                />
              )
            })}
          </g>
        </svg>

        {/* The hand. Decorative: it sweeps the dial, it does not tell the time. */}
        <div
          aria-hidden
          className="dial-hand absolute inset-0"
          style={{ transform: 'translateZ(20px)' }}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="dial-hand-sweep h-full w-full">
            <line
              x1={CENTRE}
              y1={CENTRE - 54}
              x2={CENTRE}
              y2={CENTRE - RADIUS - 6}
              className="stroke-accent"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Layer 2 — the readout, nearest the viewer. */}
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'translateZ(28px)' }}
        >
          <span className="tnum font-display text-xl font-semibold text-ink">
            {formatDuration(order.totalMinutes)}
          </span>
          <span className="label-mono tnum mt-1 text-ink-muted">
            {order.startsAt}–{order.endsAt}
          </span>
        </div>
      </div>
    </Tilt>
  )
}
