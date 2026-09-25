import { Section } from '@mohdaslam/ui/section'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Section className="max-w-2xl">
      <p className="label-mono text-accent">404</p>
      <h1 className="mt-4 font-display text-headline font-semibold text-ink">
        Nothing on this page.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">
        It may have been unpublished, or the link has a typo in it.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-base text-accent underline-offset-4 hover:underline">
          Back to the start
        </Link>
      </p>
    </Section>
  )
}
