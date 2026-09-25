import { cn } from '@/lib/utils'

/**
 * The résumé's signature figure: every role, the diploma underneath them,
 * and every published event as a point — on one shared time axis.
 *
 * Everything is positioned from real dates in content/, so the picture
 * cannot claim more than the record does. Bars carry their label inside
 * where there is room; the full list is repeated for assistive tech.
 */

export type TrackBar = {
  label: string
  sublabel: string
  /** YYYY-MM */
  start: string
  /** YYYY-MM, or null for ongoing. */
  end: string | null
}

export type TrackPoint = {
  label: string
  /** YYYY-MM-DD */
  date: string
  highlight?: boolean
}

export type TrackLane =
  | { name: string; kind: 'bars'; tone: 'accent' | 'neutral' | 'study'; bars: TrackBar[] }
  | { name: string; kind: 'points'; points: TrackPoint[] }

function toYear(value: string): number {
  const [year, month = '01', day = '01'] = value.split('-')
  return Number(year) + (Number(month) - 1) / 12 + (Number(day) - 1) / 365
}

export function CareerTrack({ lanes, caption }: { lanes: TrackLane[]; caption: string }) {
  const now = new Date()
  const nowYear = now.getFullYear() + now.getMonth() / 12

  const dates = lanes.flatMap((lane) =>
    lane.kind === 'bars'
      ? lane.bars.flatMap((bar) => [toYear(bar.start), bar.end ? toYear(bar.end) : nowYear])
      : lane.points.map((point) => toYear(point.date)),
  )
  const min = Math.floor(Math.min(...dates))
  const max = Math.max(...dates, nowYear) + 0.15
  const span = max - min
  const pos = (year: number) => ((year - min) / span) * 100

  const years = Array.from({ length: Math.floor(max) - min + 1 }, (_, i) => min + i)

  return (
    <figure>
      {/* Scrolls sideways on a phone rather than squashing four years into 320px. */}
      <div aria-hidden className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="panel min-w-[40rem] rounded-sm p-5">
          <div className="grid grid-cols-[5.5rem_1fr] gap-x-4">
            <div />
            <div className="relative h-6 border-b border-border">
              {years.map((year) => (
                <span
                  key={year}
                  className="label-mono tnum absolute top-0 -translate-x-1/2 text-ink-muted"
                  style={{ left: `${pos(year)}%` }}
                >
                  {year}
                </span>
              ))}
            </div>

            {lanes.map((lane) => (
              <Lane key={lane.name} lane={lane} pos={pos} years={years} nowYear={nowYear} />
            ))}

            <div />
            <div className="relative h-5">
              <span
                className="label-mono absolute top-1 -translate-x-full whitespace-nowrap pr-1.5 text-accent"
                style={{ left: `${pos(nowYear)}%` }}
              >
                Now ▲
              </span>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="label-mono mt-3 text-ink-muted">
        <span className="text-accent sm:hidden">Scroll → · </span>
        {caption}
      </figcaption>

      <ul className="sr-only">
        {lanes.flatMap((lane) =>
          lane.kind === 'bars'
            ? lane.bars.map((bar) => (
                <li key={`${lane.name}-${bar.label}-${bar.sublabel}`}>
                  {lane.name}: {bar.label}, {bar.sublabel}, {bar.start} to {bar.end ?? 'present'}
                </li>
              ))
            : [
                <li key={lane.name}>
                  {lane.name}: {lane.points.length} published, from{' '}
                  {lane.points.map((p) => p.date).sort()[0]} to{' '}
                  {lane.points.map((p) => p.date).sort()[lane.points.length - 1]}
                </li>,
              ],
        )}
      </ul>
    </figure>
  )
}

function Lane({
  lane,
  pos,
  years,
  nowYear,
}: {
  lane: TrackLane
  pos: (year: number) => number
  years: number[]
  nowYear: number
}) {
  const rows = lane.kind === 'bars' ? lane.bars.length : 1

  return (
    <>
      <div className="flex items-center border-b border-border/60 py-3">
        <span className="label-mono text-ink-muted">{lane.name}</span>
      </div>
      <div className="relative border-b border-border/60 py-3">
        {/* Year gridlines and the "now" rule, drawn behind the marks. */}
        {years.map((year) => (
          <span
            key={year}
            className="absolute inset-y-0 w-px bg-border/50"
            style={{ left: `${pos(year)}%` }}
          />
        ))}
        <span
          className="absolute inset-y-0 w-px bg-accent/60"
          style={{ left: `${pos(nowYear)}%` }}
        />

        {lane.kind === 'bars' ? (
          <div className="relative flex flex-col gap-1.5" style={{ minHeight: rows * 30 }}>
            {lane.bars.map((bar) => {
              const start = toYear(bar.start)
              const end = bar.end ? toYear(bar.end) : nowYear
              const left = pos(start)
              const width = Math.max(pos(end) - left, 1.2)
              // A bar too short to hold its label carries it alongside instead.
              const outside = width < 16
              return (
                <div key={`${bar.label}-${bar.sublabel}`} className="relative h-7">
                  <div
                    className={cn(
                      'absolute flex h-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-sm px-2.5 text-xs',
                      lane.tone === 'accent' &&
                        'bg-accent/20 text-ink ring-1 ring-inset ring-accent/70',
                      lane.tone === 'neutral' &&
                        'bg-surface-raised text-ink ring-1 ring-inset ring-border-strong/60',
                      lane.tone === 'study' &&
                        'bg-[repeating-linear-gradient(135deg,hsl(var(--surface-raised))_0_6px,transparent_6px_12px)] text-ink ring-1 ring-inset ring-border-strong/60',
                      !bar.end && 'rounded-r-none',
                    )}
                    style={{ left: `${left}%`, width: `${width}%`, minWidth: '0.75rem' }}
                    title={`${bar.label} · ${bar.sublabel}`}
                  >
                    {outside ? null : (
                      <>
                        <span className="font-medium">{bar.label}</span>
                        <span className="text-ink-muted">{bar.sublabel}</span>
                      </>
                    )}
                  </div>
                  {outside ? (
                    <span
                      className="absolute top-1/2 flex -translate-y-1/2 gap-2 whitespace-nowrap pl-2 text-xs"
                      style={{ left: `calc(${left + width}% + 0.75rem)` }}
                    >
                      <span className="font-medium text-ink">{bar.label}</span>
                      <span className="text-ink-muted">{bar.sublabel}</span>
                    </span>
                  ) : null}
                  {/* An ongoing role runs off into an arrowhead at "now". */}
                  {!bar.end ? (
                    <span
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 border-y-[14px] border-l-[8px] border-y-transparent',
                        lane.tone === 'accent' ? 'border-l-accent/70' : 'border-l-border-strong/60',
                      )}
                      style={{ left: `${pos(end)}%` }}
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="relative h-7">
            {lane.points.map((point) => (
              <span
                key={`${point.label}-${point.date}`}
                title={`${point.label} · ${point.date}`}
                className={cn(
                  'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px]',
                  point.highlight
                    ? 'bg-accent ring-2 ring-accent/30'
                    : 'bg-surface ring-1 ring-inset ring-border-strong',
                )}
                style={{ left: `${pos(toYear(point.date))}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
