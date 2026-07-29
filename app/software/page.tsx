import type { Metadata } from 'next'

import { LensPage } from '@/components/layout/lens-page'
import { Section } from '@/components/layout/section'
import { capabilities, education } from '@/content/profile'

export const metadata: Metadata = {
  title: 'Software & Automation',
  description:
    'Automation, web applications, internal tooling and early-stage products built around real operational constraints.',
  alternates: { canonical: '/software' },
}

export default function SoftwarePage() {
  return (
    <LensPage
      lens="software"
      title="Software built for real operational problems."
      intro="I work across automation, web applications, internal tooling, and early-stage products. My strongest work usually involves turning a repetitive or unclear process into something more reliable, observable, and usable."
      ctaLabel="Working on something that needs building properly rather than quickly?"
      ctaHref="/contact?type=technical"
    >
      <Section aria-labelledby="capability-heading" className="pb-0">
        <h2 id="capability-heading" className="text-title font-semibold text-ink">
          What I can work on
        </h2>
        {/* Technologies are listed with the work that used them rather than as
            a logo wall (PRD s9.1). */}
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {capabilities
            .filter((group) => group.group !== 'Operating and communicating')
            .map((group) => (
              <div key={group.group} className="rounded-lg border border-border p-5">
                <dt className="label-mono text-accent">{group.group}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {group.items.join(' · ')}
                </dd>
              </div>
            ))}
        </dl>

        <p className="prose-measure mt-8 text-sm text-ink-muted">
          Currently studying for a {education.qualification} at {education.institution} (
          {education.timeframe}), covering secure coding, database systems, software
          testing, and system analysis and design.
        </p>
      </Section>
    </LensPage>
  )
}
