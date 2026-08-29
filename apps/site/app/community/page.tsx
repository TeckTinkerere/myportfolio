import type { Metadata } from 'next'

import { LensPage } from '@/components/layout/lens-page'
import { Section } from '@/components/layout/section'
import { leadership } from '@/content/profile'

export const metadata: Metadata = {
  title: 'Community Initiatives',
  description:
    'Community and sustainability initiatives turned into structured, measurable action.',
  alternates: { canonical: '/community' },
}

export default function CommunityPage() {
  return (
    <LensPage
      lens="community"
      title="Community ideas turned into structured, measurable action."
      intro="Initiatives where good intentions need planning, partnerships and ground execution to become real. Coordination is usually the hard part, not the idea."
      ctaLabel="Working on an initiative that needs someone to make it run?"
      ctaHref="/contact?type=community"
    >
      <Section aria-labelledby="leadership-heading" className="pb-0">
        <h2 id="leadership-heading" className="font-display text-title font-semibold text-ink">
          Current commitments
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {leadership.map((role) => (
            <li key={role.organisation} className="rounded-sm border border-border p-5">
              <p className="text-sm font-semibold text-ink">{role.role}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{role.organisation}</p>
              <p className="label-mono mt-3 text-ink-muted">{role.timeframe}</p>
            </li>
          ))}
        </ul>
      </Section>
    </LensPage>
  )
}
