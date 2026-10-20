'use client'

import { useState, type ReactNode } from 'react'

/** Native share sheet where there is one; otherwise copy the link. */
export function ShareButton({
  url,
  title,
  className,
  disabled,
  children,
}: {
  url: string
  title: string
  className?: string
  disabled?: boolean
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)

  async function share() {
    if (disabled) return
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // Dismissed, or blocked: fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <button type="button" onClick={share} className={className} aria-live="polite">
      {children}
      {copied && (
        <span className="fixed bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1.5 text-xs text-white">
          Link copied
        </span>
      )}
    </button>
  )
}
