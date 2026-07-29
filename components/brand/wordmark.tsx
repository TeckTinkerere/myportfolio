import Link from 'next/link'

import { siteConfig } from '@/content/site-config'
import { cn } from '@/lib/utils'

/**
 * Text wordmark with a compact monogram tile. Deliberately typographic —
 * the PRD rules out an elaborate startup-style logo symbol (s15.2).
 */
export function Wordmark({
  className,
  showDescriptor = false,
}: {
  className?: string
  showDescriptor?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-surface-raised font-mono text-xs font-semibold tracking-tight text-ink transition-colors group-hover:border-accent"
      >
        {siteConfig.monogram}
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-ink">
          {siteConfig.name}
        </span>
        {showDescriptor ? (
          <span className="mt-1 text-xs text-ink-muted">{siteConfig.descriptor}</span>
        ) : null}
      </span>
    </Link>
  )
}
