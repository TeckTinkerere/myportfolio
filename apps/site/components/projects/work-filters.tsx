import Link from 'next/link'

import { cn } from '@/lib/utils'

/**
 * Filters are links, not buttons with client state.
 *
 * The server filters from searchParams, which gives real shareable URLs,
 * keyboard support for free, and correct behaviour with JavaScript disabled.
 * Next's soft navigation still avoids a full reload, so nothing is lost by
 * shipping no filter JavaScript at all.
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
      <ul className="flex flex-wrap gap-px overflow-hidden rounded-sm border border-border bg-border">
        {options.map((option) => {
          const isActive = option.value === active
          const href =
            option.value === 'all' ? basePath : `${basePath}?${paramName}=${option.value}`

          return (
            <li key={option.value} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                scroll={false}
                className={cn(
                  'label-mono flex h-full items-center justify-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-center transition-colors',
                  isActive
                    ? 'bg-accent text-accent-contrast'
                    : 'bg-surface text-ink-muted hover:bg-surface-raised hover:text-ink',
                )}
              >
                {/* The active state is never carried by colour alone. */}
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
