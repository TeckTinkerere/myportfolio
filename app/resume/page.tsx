import { Printer } from 'lucide-react'
import type { Metadata } from 'next'

import { Section } from '@/components/layout/section'
import {
  capabilities,
  education,
  experience,
  leadership,
  resumeLastUpdated,
  resumePdf,
} from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import { getRecognition } from '@/lib/content/queries'

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Résumé for ${siteConfig.legalName} — technology builder based in Singapore.`,
  alternates: { canonical: '/resume' },
}

export default function ResumePage() {
  const placements = getRecognition().filter((item) => item.placement)

  return (
    <Section className="max-w-4xl">
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {/* The one place the full legal name is appropriate (PRD FR-08). */}
            <h1 className="text-headline font-semibold text-ink">
              {siteConfig.legalName}
            </h1>
            <p className="mt-2 text-base text-ink-muted">{siteConfig.descriptor}</p>
          </div>

          <div className="flex flex-col items-start gap-3 print-hidden">
            {/*
              No PDF exists in the repository. Rather than link to a 404, the
              page is print-styled so it can be saved as PDF today, and the
              download control appears automatically once resumePdf is set in
              content/profile.ts. See CONTENT_TODO.md.
            */}
            {resumePdf ? (
              <a
                href={resumePdf.href}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast"
              >
                Download PDF
              </a>
            ) : null}
            <p className="inline-flex items-center gap-2 text-xs text-ink-muted">
              <Printer aria-hidden className="size-3.5" />
              Print this page to save a PDF
            </p>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <li>{siteConfig.location}</li>
          <li>
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ink">
              {siteConfig.contact.email}
            </a>
          </li>
          <li>
            <a
              href={siteConfig.contact.github}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink"
            >
              github.com/TeckTinkerere
            </a>
          </li>
          <li>
            <a
              href={siteConfig.contact.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink"
            >
              LinkedIn
            </a>
          </li>
        </ul>

        <p className="mt-4 text-xs text-ink-muted">
          Last updated {resumeLastUpdated}
        </p>
      </header>

      <ResumeSection title="Experience">
        <ol className="flex flex-col gap-6">
          {experience.map((item) => (
            <li key={`${item.organisation}-${item.role}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-base font-semibold text-ink">{item.role}</h3>
                <p className="label-mono text-ink-muted">{item.timeframe}</p>
              </div>
              <p className="mt-0.5 text-sm text-accent">{item.organisation}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.summary}
              </p>
            </li>
          ))}
        </ol>
      </ResumeSection>

      <ResumeSection title="Education">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="text-base font-semibold text-ink">{education.qualification}</h3>
          <p className="label-mono text-ink-muted">{education.timeframe}</p>
        </div>
        <p className="mt-0.5 text-sm text-accent">{education.institution}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {education.coursework.join(' · ')}
        </p>
      </ResumeSection>

      <ResumeSection title="Selected recognition">
        <ul className="flex flex-col gap-3">
          {placements.map((item) => (
            <li key={item.slug} className="text-sm">
              <span className="font-medium text-ink">{item.placement}</span>
              <span className="text-ink-muted">
                {' '}
                — {item.title}, {item.issuer} ({item.date.slice(0, 4)})
              </span>
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Committees and community roles">
        <ul className="flex flex-col gap-3">
          {leadership.map((role) => (
            <li key={role.organisation} className="text-sm">
              <span className="font-medium text-ink">{role.role}</span>
              <span className="text-ink-muted">
                {' '}
                — {role.organisation} ({role.timeframe})
              </span>
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Capabilities">
        <dl className="flex flex-col gap-4">
          {capabilities.map((group) => (
            <div key={group.group}>
              <dt className="label-mono text-ink-muted">{group.group}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>
    </Section>
  )
}

function ResumeSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border py-8 last:border-b-0">
      <h2 className="label-mono mb-5 text-accent">{title}</h2>
      {children}
    </section>
  )
}
