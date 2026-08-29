import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export function CtaLink({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-accent text-accent-contrast hover:bg-accent/90'
          : 'border border-border-strong text-ink hover:bg-surface-raised',
        className,
      )}
    >
      {children}
      {/* Nudges on hover — the only decorative motion on a control. */}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  )
}
