import { cn } from '@/lib/utils'

/**
 * Data diagrams.
 *
 * Three rules these all follow:
 *
 * 1. A diagram REPLACES the prose it visualises. One sitting beside the same
 *    text is decoration, not information.
 * 2. Built in HTML/CSS, not SVG, so they reflow properly at 360px instead of
 *    scaling a fixed canvas down to unreadable.
 * 3. The visual layer is aria-hidden and a real semantic list sits underneath
 *    it. Screen readers get structure; sighted readers get the picture. State
 *    is never carried by colour alone — every mark also has a glyph and a
 *    written label.
 *
 * No categorical palette is introduced here. The only colours are the
 * reserved status colours already used across the site.
 */

export function Figure({
  caption,
  children,
  className,
}: {
  caption: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn('my-8', className)}>
      {children}
      <figcaption className="label-mono mt-4 text-ink-muted">{caption}</figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Process flow — an ordered sequence. /websites                       */
/* ------------------------------------------------------------------ */

export function ProcessFlow({
  steps,
  caption,
}: {
  steps: ReadonlyArray<{ step: string; body: string }>
  caption: string
}) {
  return (
    <Figure caption={caption}>
      {/* Visual layer */}
      <ol aria-hidden className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-5">
        {steps.map((phase, index) => (
          <li key={phase.step} className="relative flex flex-col bg-surface p-4">
            <div className="flex items-center gap-2">
              <span className="label-mono tnum text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < steps.length - 1 ? (
                <span className="h-px flex-1 bg-border" />
              ) : null}
              {index < steps.length - 1 ? (
                <span className="text-[0.6rem] leading-none text-accent">▸</span>
              ) : null}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink">{phase.step}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{phase.body}</p>
          </li>
        ))}
      </ol>

      {/* Structure for assistive tech */}
      <ol className="sr-only">
        {steps.map((phase, index) => (
          <li key={phase.step}>
            Step {index + 1}: {phase.step}. {phase.body}
          </li>
        ))}
      </ol>
    </Figure>
  )
}

/* ------------------------------------------------------------------ */
/* Role ladder — identity plus state. /events                          */
/* ------------------------------------------------------------------ */

export type LadderRung = {
  label: string
  /** How many published records evidence this role. */
  count: number
  note?: string
}

export function RoleLadder({ rungs, caption }: { rungs: LadderRung[]; caption: string }) {
  const max = Math.max(1, ...rungs.map((r) => r.count))

  return (
    <Figure caption={caption}>
      <div
        aria-hidden
        className="flex flex-col gap-px overflow-hidden rounded-sm border border-border bg-border"
      >
        {rungs.map((rung) => {
          const evidenced = rung.count > 0
          return (
            <div key={rung.label} className="flex items-center gap-4 bg-surface px-4 py-3">
              {/* Glyph carries the state, so colour is never doing it alone. */}
              <span
                className={cn(
                  'text-[0.7em] leading-none',
                  evidenced ? 'text-success' : 'text-ink-muted',
                )}
              >
                {evidenced ? '●' : '◌'}
              </span>

              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-sm',
                  evidenced ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {rung.label}
              </span>

              {/* Magnitude bar. Recessive, and always paired with the count. */}
              <span className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-surface-raised sm:block">
                <span
                  className={cn('block h-full', evidenced ? 'bg-success' : 'bg-transparent')}
                  style={{ width: `${(rung.count / max) * 100}%` }}
                />
              </span>

              <span className="label-mono tnum w-28 shrink-0 text-right text-ink-muted">
                {evidenced
                  ? `${rung.count} published`
                  : (rung.note ?? 'Pending verification')}
              </span>
            </div>
          )
        })}
      </div>

      <ul className="sr-only">
        {rungs.map((rung) => (
          <li key={rung.label}>
            {rung.label}:{' '}
            {rung.count > 0
              ? `${rung.count} published record${rung.count === 1 ? '' : 's'}`
              : (rung.note ?? 'no published records yet, pending verification')}
          </li>
        ))}
      </ul>
    </Figure>
  )
}

/* ------------------------------------------------------------------ */
/* Case spine — problem to outcome. /work/[slug]                       */
/* ------------------------------------------------------------------ */

export type SpineStage = {
  label: string
  items: readonly string[]
}

export function CaseSpine({ stages, caption }: { stages: SpineStage[]; caption: string }) {
  const populated = stages.filter((stage) => stage.items.length > 0)
  if (populated.length < 2) return null

  return (
    <Figure caption={caption}>
      <ol
        aria-hidden
        className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-4"
      >
        {populated.map((stage, index) => (
          <li key={stage.label} className="flex flex-col bg-surface p-4">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <span className="label-mono text-accent">{stage.label}</span>
              <span className="label-mono tnum text-ink-muted">
                {String(index + 1)}/{populated.length}
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {stage.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-xs leading-relaxed text-ink-muted"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/70" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="sr-only">
        {populated.map((stage) => (
          <div key={stage.label}>
            <h3>{stage.label}</h3>
            <ul>
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------------ */
/* Timeline — duration on a shared axis. /about                        */
/* ------------------------------------------------------------------ */

export type TimelineTrack = {
  label: string
  sublabel: string
  start: string
  end: string | null
  ongoing?: boolean
  accent?: boolean
}

/** YYYY-MM to a fractional year, so bars can be positioned proportionally. */
function toYear(value: string): number {
  const [year, month = '01'] = value.split('-')
  return Number(year) + (Number(month) - 1) / 12
}

export function Timeline({
  tracks,
  caption,
}: {
  tracks: TimelineTrack[]
  caption: string
}) {
  const now = new Date()
  const nowYear = now.getFullYear() + now.getMonth() / 12

  const starts = tracks.map((t) => toYear(t.start))
  const ends = tracks.map((t) => (t.end ? toYear(t.end) : nowYear))
  const min = Math.floor(Math.min(...starts))
  const max = Math.ceil(Math.max(...ends, nowYear))
  const span = Math.max(1, max - min)

  const years = Array.from({ length: span + 1 }, (_, i) => min + i)

  return (
    <Figure caption={caption}>
      <div aria-hidden className="rounded-sm border border-border bg-surface p-4 sm:p-5">
        {/* Recessive axis: year ticks only, no grid box. */}
        <div className="relative mb-3 h-4 border-b border-border">
          {years.map((year) => (
            <span
              key={year}
              className="label-mono tnum absolute top-0 -translate-x-1/2 text-ink-muted"
              style={{ left: `${((year - min) / span) * 100}%` }}
            >
              {year}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          {tracks.map((track) => {
            const start = toYear(track.start)
            const end = track.end ? toYear(track.end) : nowYear
            const left = ((start - min) / span) * 100
            const width = Math.max(1.5, ((end - start) / span) * 100)

            return (
              <div key={`${track.label}-${track.sublabel}`}>
                <div className="relative h-6">
                  <div
                    className={cn(
                      'absolute flex h-full items-center rounded-sm px-2',
                      track.accent
                        ? 'bg-accent/25 ring-1 ring-inset ring-accent/60'
                        : 'bg-surface-raised ring-1 ring-inset ring-border',
                    )}
                    style={{ left: `${left}%`, width: `${width}%`, minWidth: '2.5rem' }}
                  >
                    {/* Ongoing work is marked with a glyph, not just colour. */}
                    {track.ongoing ? (
                      <span className="text-[0.6rem] leading-none text-accent">▸</span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-1 text-xs text-ink">
                  <span className="font-medium">{track.label}</span>
                  <span className="text-ink-muted"> · {track.sublabel}</span>
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <ul className="sr-only">
        {tracks.map((track) => (
          <li key={`${track.label}-${track.sublabel}`}>
            {track.label}, {track.sublabel}: {track.start} to {track.end ?? 'present'}
          </li>
        ))}
      </ul>
    </Figure>
  )
}
