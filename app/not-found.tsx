import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/section'
import { capabilityRoutes } from '@/content/site-config'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <Section className="max-w-2xl">
      <p className="label-mono text-accent">404</p>
      <h1 className="mt-4 text-headline font-semibold text-ink">
        That page isn’t here.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">
        The site was reorganised, so an older link may have pointed here. These are the
        places worth trying instead.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        <li>
          <Link
            href="/work"
            className="text-base text-accent underline-offset-4 hover:underline"
          >
            All work
          </Link>
        </li>
        {capabilityRoutes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="text-base text-accent underline-offset-4 hover:underline"
            >
              {route.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/contact"
            className="text-base text-accent underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </li>
      </ul>
    </Section>
  )
}
