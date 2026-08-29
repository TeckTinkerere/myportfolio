'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpRight, Check, Copy, Share2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import { renderQrSvg } from '@/lib/share/qr'
import { cn } from '@/lib/utils'

/**
 * The share surface for one published project.
 *
 * This module is never part of a page's initial JavaScript. ShareLauncher
 * loads it on the first press of a share button, which is what lets the QR
 * encoder live in here rather than being run at build time and shipped as
 * markup on every card.
 *
 * The link is rendered into a readonly input rather than a paragraph. The
 * copy button uses the clipboard API where it is available, but a readonly
 * input can always be tapped, selected and copied by hand, so the flow still
 * ends with the person holding the link when the clipboard is refused —
 * which it is on insecure origins and inside some in-app browsers.
 */
export type ShareDialogProps = {
  title: string
  /** Absolute short link, e.g. https://mohdaslam.dev/p/k3f9qa */
  shareUrl: string
  /** Canonical path on this site, so "open the page" is a soft navigation. */
  canonicalPath: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({
  title,
  shareUrl,
  canonicalPath,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [canUseSystemShare, setCanUseSystemShare] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const qrSvg = useMemo(
    () => renderQrSvg(shareUrl, `QR code linking to ${title}`).svg,
    [shareUrl, title],
  )

  // Read after mount only. navigator.share exists on phones and on few
  // desktops, so deciding during render would mismatch the server HTML.
  useEffect(() => {
    setCanUseSystemShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  async function copyLink() {
    // Select whichever path succeeds: if the clipboard write is refused, the
    // link is at least sitting selected and ready to be copied by hand.
    inputRef.current?.select()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      // Left selected. The person can still copy it.
    }
  }

  async function systemShare() {
    try {
      await navigator.share({ title, url: shareUrl })
    } catch {
      // Dismissing the OS share sheet rejects. Nothing to report.
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setCopied(false)
        onOpenChange(next)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        {/*
          A bottom sheet on phones, a centred panel from sm up — not the same
          layout scaled down. On a phone the controls belong within thumb
          reach at the bottom of the screen, and the sheet scrolls rather
          than the QR being shrunk to make everything fit above the fold.
        */}
        <Dialog.Content
          className={cn(
            'fixed z-50 flex max-h-[92dvh] flex-col overflow-y-auto border-border-strong bg-background',
            'inset-x-0 bottom-0 rounded-t-lg border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
            /*
              Centred from sm up with inset-0 + m-auto against a fixed width
              and a fit height — not with -translate-x-1/2. tailwindcss-animate
              writes its own `transform` for the whole enter animation, which
              silently wins over a translate utility and leaves the panel a
              half-width down and right of centre, hanging off the bottom of
              short viewports. Positioning that owes nothing to transform
              cannot be overwritten by an animation.
            */
            'sm:inset-0 sm:m-auto sm:h-fit sm:w-[26rem] sm:rounded-lg sm:border sm:p-6',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="label-mono text-accent">Share</p>
              <Dialog.Title className="mt-2 font-display text-lg font-semibold text-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                A short link to the published case study. It shows what the page
                already shows anyone.
              </Dialog.Description>
            </div>

            <Dialog.Close
              className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close share dialog"
            >
              <X aria-hidden className="size-4" />
            </Dialog.Close>
          </div>

          {/*
            White in both themes, with the QR's own four-module quiet zone
            sitting inside this padding. See lib/share/qr.ts — the polarity
            and the margin are scan requirements, not styling.
          */}
          <div className="mt-6 self-center rounded-sm border border-border bg-white p-3">
            <div
              className="w-[min(58vw,15rem)] max-w-full sm:w-56 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          <label htmlFor="share-link" className="label-mono mt-6 block text-ink-muted">
            Short link
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="share-link"
              ref={inputRef}
              readOnly
              value={shareUrl}
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 rounded-sm border border-border-strong bg-surface px-3 py-2.5 font-mono text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={copyLink}
              className="label-mono inline-flex shrink-0 items-center gap-2 rounded-sm bg-accent px-3.5 py-2.5 text-accent-contrast transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {copied ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Copy aria-hidden className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Announced, rather than the icon swap being the only signal. */}
          <p aria-live="polite" className="mt-2 min-h-5 text-xs text-ink-muted">
            {copied ? 'Link copied to the clipboard.' : ''}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {canUseSystemShare ? (
              <button
                type="button"
                onClick={systemShare}
                className="label-mono inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-border-strong px-3.5 py-2.5 text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Share2 aria-hidden className="size-4" />
                Share via…
              </button>
            ) : null}

            <Dialog.Close asChild>
              <Link
                href={canonicalPath}
                className="label-mono inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-border-strong px-3.5 py-2.5 text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open the page
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
