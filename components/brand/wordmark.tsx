import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/content/site-config'
import { cn } from '@/lib/utils'

/**
 * The brand mark: an MA monogram in brushed champagne metal.
 *
 * The source is a transparent PNG, which is what lets the same asset sit on
 * both the near-black dark theme and the warm light theme. The alternative
 * supplied asset had a linen background baked in and would have read as a
 * white sticker on the dark theme.
 *
 * `priority` is set because this is in the header on every route — it would
 * otherwise be lazy-loaded and pop in after first paint.
 */
export function Wordmark({
  className,
  showDescriptor = false,
  size = 30,
}: {
  className?: string
  showDescriptor?: boolean
  size?: number
}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <Image
        src="/images/brand/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        // Decorative: the accessible name is on the link, so announcing the
        // image as well would just repeat it.
        aria-hidden
        className="brand-mark shrink-0 transition-opacity group-hover:opacity-85"
      />
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

/** The mark on its own, for contexts that already name the brand. */
export function BrandMark({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Image
      src="/images/brand/logo.png"
      alt={`${siteConfig.name} monogram`}
      width={size}
      height={size}
      className={cn('brand-mark shrink-0', className)}
    />
  )
}
