import { STATUS_LABELS } from '@/lib/content/public-view'
import type { ProjectStatus } from '@/lib/content/schema'
import { cn } from '@/lib/utils'

/**
 * Status must stay distinguishable without colour (PRD s10.2, s18), so each
 * state carries a shape marker as well as a tint. A concept must never be
 * mistakable for something that is live.
 */
const MARKERS: Record<ProjectStatus, string> = {
  live: '●',
  'pilot-completed': '◍',
  'in-development': '◐',
  prototype: '◑',
  archived: '○',
  concept: '◌',
  confidential: '◆',
}

const TONES: Record<ProjectStatus, string> = {
  live: 'text-success',
  'pilot-completed': 'text-success',
  'in-development': 'text-accent',
  prototype: 'text-accent',
  archived: 'text-ink-muted',
  concept: 'text-ink-muted',
  confidential: 'text-ink-muted',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'label-mono inline-flex items-center gap-1.5 text-ink-muted',
        className,
      )}
    >
      <span aria-hidden className={cn('text-[0.7em] leading-none', TONES[status])}>
        {MARKERS[status]}
      </span>
      {STATUS_LABELS[status]}
    </span>
  )
}
