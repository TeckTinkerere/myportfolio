import Link from 'next/link'

import { Wordmark } from '@/components/brand/wordmark'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { primaryNav } from '@/content/site-config'

/**
 * Server component. Only the mobile drawer and the theme control ship JS.
 * Desktop navigation stays visible rather than hiding behind an icon
 * (PRD s8.1).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
