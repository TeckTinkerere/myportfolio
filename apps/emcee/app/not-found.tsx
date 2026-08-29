import { Section } from '@mohdaslam/ui/section'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Run sheet not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Section className="max-w-2xl">
      <p className="label-mono text-accent">404</p>
      <h1 className="mt-4 font-display text-headline font-semibold text-ink">
        No run sheet here.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">
        A sheet that has been unpublished, or a link with a typo in it. The published
        sheets are all listed on the index.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-base text-accent underline-offset-4 hover:underline">
          All run sheets
        </Link>
      </p>
    </Section>
  )
}
