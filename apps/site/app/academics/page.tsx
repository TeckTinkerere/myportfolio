import { ArrowUpRight, Compass, GraduationCap, Sigma } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { CommitteeList } from '@/components/profile/profile-blocks'
import { GridBackdrop, Panel } from '@/components/system/panel'
import { academics, education } from '@/content/profile'
import { siteConfig } from '@/content/site-config'

export const metadata: Metadata = {
  title: 'Academics',
  description: `Academic record at ${education.institution} and why I want to study computing at university: building systems that work, and being able to show that they do. ${siteConfig.name}.`,
  alternates: { canonical: '/academics' },
}

/**
 * Written for a university admissions reader: the record first, then the
 * argument, then the evidence behind it. Every result-bearing block renders
 * only once its facts exist in content/data/profile.json.
 */
export default function AcademicsPage() {
  const record = [
    { label: 'Qualification', value: education.qualification },
    { label: 'Institution', value: education.institution },
    { label: 'Period', value: education.timeframe },
    { label: 'Expected graduation', value: academics.expectedGraduation },
    {
      label: 'Cumulative GPA',
      value: academics.gpa
        ? `${academics.gpa} / ${academics.gpaScale}${academics.gpaAsOf ? ` (${academics.gpaAsOf})` : ''}`
        : '',
    },
    { label: "Director's List", value: academics.directorsList.join(', ') },
    { label: 'Certificates', value: academics.certificates.join(', ') },
  ].filter((row) => row.value)

  const hasResults = academics.notableModules.length > 0 || academics.mathematics.length > 0

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <Section className="relative pb-14 pt-10 sm:pt-14">
          <div className="hero-seq max-w-3xl">
            <p className="label-mono text-accent">Academics · Computing</p>
            <h1 className="mt-4 font-display text-display font-semibold text-ink">
              Why computing
            </h1>
            {academics.whyComputing[0] ? (
              <p className="mt-6 text-xl leading-relaxed text-ink">{academics.whyComputing[0]}</p>
            ) : null}
            {academics.plans ? (
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{academics.plans}</p>
            ) : null}
          </div>
        </Section>
      </div>

      <Section aria-label="Academic record" className="pb-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader eyebrow="Record" title="Academic record" />
            <Panel designation="Diploma">
              <div className="flex gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border-strong/60 bg-surface-raised text-accent">
                  <GraduationCap aria-hidden className="size-5" />
                </span>
                <dl className="grid flex-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {record.map((row) => (
                    <div key={row.label}>
                      <dt className="label-mono text-ink-muted">{row.label}</dt>
                      <dd className="tnum mt-1 text-sm text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {academics.semesterGpas.length > 0 ? (
                <div className="border-t border-border p-5">
                  <h3 className="label-mono text-ink-muted">GPA by semester</h3>
                  <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {academics.semesterGpas.map((semester) => (
                      <li key={semester.term} className="border-l-2 border-accent/50 pl-3">
                        <p className="tnum font-display text-xl font-semibold text-ink">
                          {semester.gpa}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">{semester.term}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              <div className="border-t border-border p-5">
                <h3 className="label-mono text-ink-muted">
                  Coursework
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {education.coursework.map((course) => (
                    <li
                      key={course}
                      className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          </div>

          {hasResults ? (
            <div>
              <SectionHeader eyebrow="Results" title="Selected modules" />
              <div className="flex flex-col gap-4">
                {academics.notableModules.length > 0 ? (
                  <ResultTable
                    label="Computing"
                    icon={<GraduationCap aria-hidden className="size-4" />}
                    rows={academics.notableModules}
                  />
                ) : null}
                {academics.mathematics.length > 0 ? (
                  <ResultTable
                    label="Mathematics"
                    icon={<Sigma aria-hidden className="size-4" />}
                    rows={academics.mathematics}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      {academics.whyComputing.length > 1 ? (
        <Section aria-label="Why computing" className="pb-0">
          <SectionHeader eyebrow="The argument" title="What I want a degree for" />
          <div className="prose-measure flex flex-col gap-4 text-base leading-relaxed text-ink-muted">
            {academics.whyComputing.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {academics.thread.length > 0 ? (
        <Section aria-label="Evidence" className="pb-0">
          <SectionHeader
            eyebrow="Evidence"
            title="The same question, four times"
            description="Each one links to the work itself."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {academics.thread.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="panel group flex h-full flex-col rounded-sm p-5 transition-colors hover:border-border-strong"
                >
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  <span className="label-mono mt-auto flex items-center gap-1.5 pt-4 text-accent">
                    See the evidence
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {academics.interests.length > 0 ? (
        <Section aria-label="Interests" className="pb-0">
          <SectionHeader eyebrow="Next" title="What I want to study" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {academics.interests.map((item) => (
              <li key={item.area} className="panel flex gap-4 rounded-sm p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-accent">
                  <Compass aria-hidden className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.area}</h3>
                  {item.why ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.why}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section aria-label="Beyond the classroom" className="pb-0">
        <SectionHeader
          eyebrow="Beyond the classroom"
          title="Committees and teaching"
          description="Leadership roles at Singapore Polytechnic, plus the workshops and hackathons I teach at."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <CommitteeList />
          <div className="flex flex-col gap-3">
            <CtaLink href="/events" variant="secondary" className="self-start">
              Events, workshops and hackathons
            </CtaLink>
            <CtaLink href="/about#recognition" variant="secondary" className="self-start">
              Awards and recognition
            </CtaLink>
          </div>
        </div>
      </Section>

      <Section>
        <Panel designation="Next step">
          <div className="p-8 sm:p-10">
            <h2 className="font-display text-headline font-semibold text-ink">
              The full picture is on the résumé.
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href="/resume">Read the résumé</CtaLink>
              <CtaLink href="/contact" variant="secondary">
                Get in touch
              </CtaLink>
            </div>
          </div>
        </Panel>
      </Section>
    </>
  )
}

function ResultTable({
  label,
  icon,
  rows,
}: {
  label: string
  icon: React.ReactNode
  rows: { name: string; grade: string; note?: string }[]
}) {
  return (
    <Panel designation={label}>
      <h3 className="sr-only">{label} modules</h3>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.name} className="flex items-start gap-3 p-4">
            <span className="mt-0.5 text-accent">{icon}</span>
            <div className="flex-1">
              <p className="text-sm text-ink">{row.name}</p>
              {row.note ? (
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{row.note}</p>
              ) : null}
            </div>
            <span className="label-mono tnum text-accent">{row.grade}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
