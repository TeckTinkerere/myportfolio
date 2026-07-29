import type { Metadata } from 'next'

import { LensPage } from '@/components/layout/lens-page'
import { Section } from '@/components/layout/section'

export const metadata: Metadata = {
  title: 'Websites & Web Products',
  description:
    'Clear, responsive websites and early-stage web products for small teams, student initiatives and community organisations.',
  alternates: { canonical: '/websites' },
}

const SERVICES = [
  'Landing and informational websites',
  'Community or event websites',
  'Early-stage MVP interfaces',
  'Website redesign and information-architecture improvement',
  'Responsive frontend implementation',
  'Basic full-stack features where the scope suits it',
]

const PROCESS = [
  { step: 'Clarify', body: 'What the site is for, and who it is actually for.' },
  {
    step: 'Agree',
    body: 'Scope, content, who supplies what, and the deadline — in writing.',
  },
  { step: 'Structure', body: 'Information architecture and visual direction.' },
  { step: 'Build', body: 'Responsive implementation.' },
  { step: 'Hand over', body: 'Review, test, and make sure you can run it without me.' },
]

const YOU_PROVIDE = [
  'A clear goal for the site, even a rough one.',
  'Your copy, or the raw material for it.',
  'Logos, photographs and any brand assets you already have.',
  'One person who can make decisions and give feedback.',
]

const NOT_INCLUDED = [
  'Ongoing content writing or copywriting as a service.',
  'Long-term maintenance retainers.',
  'Large e-commerce builds or complex payment integrations.',
  'Anything needing a team — I work alone, and I would rather say so than overpromise.',
]

export default function WebsitesPage() {
  return (
    <LensPage
      lens="websites"
      title="Practical websites and web products built around a clear goal."
      intro="I help early-stage teams, student initiatives, and community organisations turn an idea into a clear, responsive website or usable first product. I work on my own — this is not an agency, and the scope I take on reflects that."
      ctaLabel="Have a website or first product in mind?"
      ctaHref="/contact?type=website"
    >
      <Section className="pb-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-title font-semibold text-ink">What I can help with</h2>
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
            <h2 className="text-title font-semibold text-ink">
              What I would need from you
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
        <h2 id="process-heading" className="text-title font-semibold text-ink">
          How a project runs
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((phase, index) => (
            <li key={phase.step} className="rounded-lg border border-border p-4">
              <span className="label-mono text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{phase.step}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {phase.body}
              </p>
            </li>
          ))}
        </ol>
        {/* PRD s9.2: no fixed prices in v1 — scope first, then a quote. */}
        <p className="prose-measure mt-6 text-sm text-ink-muted">
          I do not publish fixed prices, because the useful number depends on scope. Tell
          me what you are trying to do and I will come back with a scoped estimate.
        </p>
      </Section>
    </LensPage>
  )
}
