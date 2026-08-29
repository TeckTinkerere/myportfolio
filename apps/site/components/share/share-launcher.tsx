'use client'

import { Share2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * The share button, and nothing else, until it is pressed.
 *
 * /work renders seventeen of these. Bundling the dialog with them put 20 kB
 * of Radix and QR encoding into the first load of every page that shows a
 * project card — the homepage and all four capability routes included — for
 * a control most visitors never touch. So the dialog is split out and
 * fetched on the first press, the same bargain components/three makes with
 * three.js: the page stays cheap, and the cost lands only on the person who
 * asked for the feature.
 *
 * `mounted` latches on. Once the chunk has been fetched, the dialog stays in
 * the tree and simply closes, so a second press is instant and Radix keeps
 * its own focus and animation state across opens.
 */
const ShareDialog = dynamic(
  () => import('@/components/share/share-dialog').then((mod) => mod.ShareDialog),
  { ssr: false },
)

export function ShareLauncher({
  title,
  shareUrl,
  canonicalPath,
  variant = 'button',
  className,
}: {
  title: string
  shareUrl: string
  canonicalPath: string
  variant?: 'button' | 'icon'
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          variant === 'button'
            ? 'label-mono border border-border-strong px-3.5 py-2.5 text-ink hover:bg-surface-raised'
            : 'size-9 text-ink-muted hover:bg-surface-raised hover:text-ink',
          className,
        )}
        aria-label={variant === 'icon' ? `Share ${title}` : undefined}
      >
        <Share2 aria-hidden className="size-4 shrink-0" />
        {variant === 'button' ? 'Share' : null}
      </button>

      {mounted ? (
        <ShareDialog
          title={title}
          shareUrl={shareUrl}
          canonicalPath={canonicalPath}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  )
}
