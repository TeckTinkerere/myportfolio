'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { capabilityRoutes, primaryNav, siteConfig } from '@/content/site-config'

/**
 * The only navigation JS on the page. Radix Dialog handles focus trapping,
 * escape-to-close, scroll locking and the aria wiring.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // A soft navigation does not unmount the sheet, so close it explicitly.
  useEffect(() => setOpen(false), [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="grid size-9 place-items-center rounded-md border border-border text-ink transition-colors hover:bg-surface-raised md:hidden"
        aria-label="Open menu"
      >
        <Menu aria-hidden className="size-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-xs border-border bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="text-sm font-semibold text-ink">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="mt-6">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-base text-ink transition-colors hover:bg-surface-raised"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="label-mono mt-7 px-3 text-ink-muted">Capabilities</p>
          <ul className="mt-2 flex flex-col gap-1">
            {capabilityRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="block rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 border-t border-border px-3 pt-6">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
