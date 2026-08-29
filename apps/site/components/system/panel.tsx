import { cn } from '@/lib/utils'

/**
 * A console panel: bordered surface with corner ticks and an optional
 * designation label in the top rail.
 *
 * The label is a real name, not a serial number. Section numbering was
 * considered and cut — the page's sections are not a sequence, so numbering
 * them would be decoration pretending to be information. The one place
 * numbers survive is the working-style list, which genuinely is a sequence.
 */
export function Panel({
  designation,
  meta,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  designation?: string
  meta?: React.ReactNode
}) {
  return (
    <div className={cn('panel rounded-sm', className)} {...props}>
      {designation ? (
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
          <span className="label-mono text-ink-muted">{designation}</span>
          {meta ? <span className="label-mono tnum text-ink-muted">{meta}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

/**
 * Decorative backdrop grid. Sparse and masked so it fades out quickly — a
 * full ruling would tip the page into broadsheet, which is the opposite of
 * the intent.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 grid-backdrop opacity-60',
        className,
      )}
    />
  )
}
