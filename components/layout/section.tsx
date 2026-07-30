import { cn } from '@/lib/utils'

export function Section({
  children,
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section className={cn('container py-16 sm:py-20', className)} {...props}>
      {children}
    </section>
  )
}

/**
 * Section heading with an optional eyebrow and trailing link. Keeps heading
 * levels explicit at the call site so pages can maintain a valid outline
 * (PRD s18) rather than inheriting whatever this component assumes.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  as?: 'h1' | 'h2' | 'h3'
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="label-mono mb-3 flex items-center gap-2.5 text-accent">
            {/* Short rule ties the eyebrow into the console grid. */}
            <span aria-hidden className="h-px w-6 bg-accent/60" />
            {eyebrow}
          </p>
        ) : null}
        <Heading className="font-display text-title font-semibold text-ink">
          {title}
        </Heading>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
