'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Nothing from the caught error is rendered. A stack trace or internal
 * identifier must never reach a visitor (PRD FR-12); it goes to the server
 * log instead.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-20">
      <div className="max-w-2xl">
        <p className="label-mono text-accent">Error</p>
        <h1 className="mt-4 font-display text-headline font-semibold text-ink">
          Something went wrong on this page.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          The problem has been logged. Try again, and if it keeps happening, please let me
          know what you were doing when it broke.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
