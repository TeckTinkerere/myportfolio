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
        'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-accent text-accent-contrast hover:bg-accent/90'
          : 'border border-border text-ink hover:bg-surface-raised',
        className,
      )}
    >
      {children}
      <ArrowRight aria-hidden className="size-4" />
    </Link>
  )
}
