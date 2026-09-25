'use client'

import { Printer } from 'lucide-react'

/**
 * The only client code on /resume. The page is print-styled, so "save as
 * PDF" is the browser's own print dialog — this just opens it.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-sm border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
    >
      <Printer aria-hidden className="size-4" />
      Save as PDF
    </button>
  )
}
