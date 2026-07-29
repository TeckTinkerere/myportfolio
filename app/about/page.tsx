import type { Metadata } from 'next'
import Image from 'next/image'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import {
  bio,
  capabilities,
  education,
  experience,
  leadership,
  principles,
} from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import { getRecognition } from '@/lib/content/queries'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Singapore-based technology builder working across software, automation, web products, community initiatives and technology events.`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const recognition = getRecognition()

  return (
    <>
      <Section className="pb-0">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <h1 className="text-headline font-semibold text-ink">
              {siteConfig.descriptor}
            </h1>
            <div className="prose-measure mt-6">
              {bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface-raised lg:sticky lg:top-24">
            <Image
              src="/images/profile/portrait.jpg"
              alt={`${siteConfig.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="principles-heading">
        <SectionHeader eyebrow="How I work" title="Three things I hold to" />
        <ol className="grid gap-5 sm:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title} className="rounded-lg border border-border p-5">
              <span className="label-mono text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {principle.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="experience-heading" className="pt-0">
        <SectionHeader eyebrow="Timeline" title="What I have been doing" />
        <ol className="flex flex-col">
          {experience.map((item) => (
            <li
              key={`${item.organisation}-${item.role}`}
              className="grid gap-2 border-t border-border py-6 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <p className="label-mono pt-1 text-ink-muted">{item.timeframe}</p>
              <div>
                <h3 className="text-base font-semibold text-ink">{item.role}</h3>
                <p className="mt-0.5 text-sm text-accent">{item.organisation}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="education-heading" className="pt-0">
        <SectionHeader eyebrow="Education" title={education.qualification} />
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm font-medium text-ink">{education.institution}</p>
          <p className="label-mono mt-1 text-ink-muted">{education.timeframe}</p>
          <h3 className="label-mono mt-6 text-ink-muted">Relevant coursework</h3>
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
      </Section>

      <Section aria-labelledby="leadership-heading" className="pt-0">
        <SectionHeader eyebrow="Also" title="Committees and community roles" />
        <ul className="grid gap-4 sm:grid-cols-3">
          {leadership.map((role) => (
            <li key={role.organisation} className="rounded-lg border border-border p-5">
              <p className="text-sm font-semibold text-ink">{role.role}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{role.organisation}</p>
              <p className="label-mono mt-3 text-ink-muted">{role.timeframe}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="capabilities-heading" className="pt-0">
        <SectionHeader
          eyebrow="Capabilities"
          title="What I work with"
          description="Listed, not ranked. Where each of these was actually used is visible in the work."
        />
        <dl className="grid gap-6 sm:grid-cols-2">
          {capabilities.map((group) => (
            <div key={group.group} className="rounded-lg border border-border p-5">
              <dt className="label-mono text-accent">{group.group}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-muted">
                {group.items.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/*
        Not in the PRD, but dated third-party evidence is exactly what PRD
        s3.4 asks every claim to be backed by. Competitive placements are
        marked; course completions are not, so an attendance certificate is
        never presented as an award.
      */}
      <Section aria-labelledby="recognition-heading" id="recognition" className="pt-0">
        <SectionHeader
          eyebrow="Recognition"
          title="Awards and certifications"
          description="Issued by third parties, on the dates shown."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recognition.map((item) => (
            <li key={item.slug} className="rounded-lg border border-border bg-surface p-5">
              {item.placement ? (
                <p className="label-mono text-accent">{item.placement}</p>
              ) : (
                <p className="label-mono text-ink-muted">Certification</p>
              )}
              <h3 className="mt-2.5 text-sm font-semibold leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-ink-muted">
                {item.issuer} · {item.date}
              </p>
              {item.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <div className="rounded-lg border border-border bg-surface p-8">
          <h2 className="text-title font-semibold text-ink">
            Want to talk about something specific?
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink href="/contact">Get in touch</CtaLink>
            <CtaLink href="/resume" variant="secondary">
              Read the résumé
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  )
}
