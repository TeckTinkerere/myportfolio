import type { Metadata } from 'next'

import { LensPage } from '@/components/layout/lens-page'
import { Section } from '@/components/layout/section'
import { ProcessFlow } from '@/components/system/diagram'

export const metadata: Metadata = {
  title: 'Websites & Web Products',
  description:
    'Clear, responsive websites and early-stage web products for small teams, student initiatives and community organisations.',
  alternates: { canonical: '/websites' },
}

const SERVICES = [
  'Landing and informational sites',
  'Community and event sites',
  'Early-stage MVP interfaces',
  'Redesign and information architecture',
  'Responsive frontend build',
  'Light full-stack features',
]

const PROCESS = [
  { step: 'Clarify', body: 'What it is for, and who for.' },
  { step: 'Agree', body: 'Scope, content, owners, deadline — in writing.' },
  { step: 'Structure', body: 'Information architecture and visual direction.' },
  { step: 'Build', body: 'Responsive implementation.' },
  { step: 'Hand over', body: 'Review, test, and you can run it without me.' },
]

const YOU_PROVIDE = [
  'A goal, even a rough one',
  'Copy, or the raw material for it',
  'Logos, photos, existing brand assets',
  'One person who can decide',
]

const NOT_INCLUDED = [
  'Ongoing copywriting',
  'Maintenance retainers',
  'Large e-commerce or complex payments',
  'Anything needing a team',
]

export default function WebsitesPage() {
  return (
    <LensPage
      lens="websites"
      title="Practical websites and web products built around a clear goal."
      intro="I help early-stage teams, student initiatives and community organisations turn an idea into a clear, responsive website or a usable first product. I work alone — not an agency, and the scope reflects that."
      ctaLabel="Have a website or first product in mind?"
      ctaHref="/contact?type=website"
    >
      <Section className="pb-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-title font-semibold text-ink">What I can help with</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {SERVICES.map((service) => (
                <li key={service} className="flex gap-3 text-sm text-ink-muted">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-title font-semibold text-ink">
              What I need from you
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {YOU_PROVIDE.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-muted">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-title font-semibold text-ink">
              What I do not take on
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-muted">
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-border" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="process-heading" className="pb-0">
        <h2 id="process-heading" className="font-display text-title font-semibold text-ink">
          How a project runs
        </h2>
        <ProcessFlow
          steps={PROCESS}
          caption="Five stages. Scope is agreed in writing at stage two, before anything is built."
        />
        {/* No fixed prices in v1 — scope first, then a quote. */}
        <p className="prose-measure text-sm text-ink-muted">
          No fixed price list: the useful number depends on scope. Tell me what you are
          trying to do and I will come back with a scoped estimate.
        </p>
      </Section>
    </LensPage>
  )
}
