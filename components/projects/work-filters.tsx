import Link from 'next/link'

import { cn } from '@/lib/utils'

/**
 * Filters are links, not buttons with client state.
 *
 * The server does the filtering from searchParams, which means: real
 * shareable URLs, full keyboard support for free, and it still works with
 * JavaScript disabled. Next's soft navigation means no full reload, so
 * FR-03 is satisfied without shipping any filter JS at all.
 */
export type FilterOption = { value: string; label: string }

export function WorkFilters({
  options,
  active,
  basePath,
  paramName = 'filter',
  label,
}: {
  options: FilterOption[]
  active: string
  basePath: string
  paramName?: string
  label: string
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === active
          const href =
            option.value === 'all' ? basePath : `${basePath}?${paramName}=${option.value}`

          return (
            <li key={option.value}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                scroll={false}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-border text-ink-muted hover:border-accent/50 hover:text-ink',
                )}
              >
                {/* Active state is not carried by colour alone (PRD s10.1). */}
                {isActive ? (
                  <span aria-hidden className="text-[0.7em] leading-none">
                    ●
                  </span>
                ) : null}
                {option.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
