import type { Metadata } from 'next'

import { Section } from '@/components/layout/section'
import { Panel } from '@/components/system/panel'
import { siteConfig } from '@/content/site-config'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What this site collects when you contact me, why, and how long it is kept.',
  alternates: { canonical: '/privacy' },
}

/** What the site does and does not collect, as a scannable ledger. */
const COLLECTION = [
  { item: 'Advertising or analytics trackers', state: 'no', detail: 'None on any page' },
  { item: 'Identifying cookies', state: 'no', detail: 'None' },
  { item: 'Theme preference', state: 'local', detail: 'Stored in your browser, never sent' },
  { item: 'Contact form submission', state: 'yes', detail: 'Only if you send one' },
] as const

const FORM_FIELDS = [
  { field: 'Name, email, enquiry type, message', need: 'Required' },
  { field: 'Organisation', need: 'Optional' },
  { field: 'Target date, scope, budget', need: 'Optional — website enquiries' },
  { field: 'Event date, location, audience, role', need: 'Optional — event enquiries' },
] as const

const HANDLING = [
  ['Purpose', 'So I can reply to you. Nothing else.'],
  ['Where it goes', 'My inbox, via an email delivery provider'],
  ['Stored in a database?', 'No'],
  ['Added to a mailing list?', 'No'],
  ['Shared with anyone?', 'No'],
  ['Quoted publicly?', 'Never without asking you first'],
  ['Retention', 'Kept while the conversation is useful, then deleted'],
  ['Spam protection', 'Hidden field plus a rate limit. No CAPTCHA, no bot scoring'],
] as const

const STATE_MARK = {
  no: { glyph: '○', tone: 'text-ink-muted', label: 'Not collected' },
  local: { glyph: '◐', tone: 'text-accent', label: 'Device only' },
  yes: { glyph: '●', tone: 'text-success', label: 'Collected' },
} as const

export default function PrivacyPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="font-display text-headline font-semibold text-ink">Privacy</h1>
      <p className="mt-4 text-base text-ink-muted">
        Plain language, because a privacy notice nobody reads protects nobody.
      </p>

      <Panel designation="What this site collects" className="mt-10">
        <ul className="flex flex-col">
          {COLLECTION.map(({ item, state, detail }) => {
            const mark = STATE_MARK[state]
            return (
              <li
                key={item}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-5 py-3 last:border-b-0"
              >
                {/* Glyph and written state, so colour is never doing it alone. */}
                <span aria-hidden className={`text-[0.7em] leading-none ${mark.tone}`}>
                  {mark.glyph}
                </span>
                <span className="min-w-0 flex-1 text-sm text-ink">{item}</span>
                <span className="label-mono text-ink-muted">
                  <span className="sr-only">{mark.label}: </span>
                  {detail}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel designation="If you use the contact form" className="mt-6">
        <dl className="flex flex-col">
          {FORM_FIELDS.map(({ field, need }) => (
            <div
              key={field}
              className="flex flex-wrap items-baseline gap-x-3 border-b border-border px-5 py-3 last:border-b-0"
            >
              <dt className="min-w-0 flex-1 text-sm text-ink">{field}</dt>
              <dd className="label-mono text-ink-muted">{need}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel designation="How it is handled" className="mt-6">
        <dl className="flex flex-col">
          {HANDLING.map(([question, answer]) => (
            <div
              key={question}
              className="grid gap-1 border-b border-border px-5 py-3 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:gap-4"
            >
              <dt className="label-mono pt-0.5 text-ink-muted">{question}</dt>
              <dd className="text-sm text-ink">{answer}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <p className="mt-8 text-sm text-ink-muted">
        Questions, or a request to delete something —{' '}
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {siteConfig.contact.email}
        </a>
        .
      </p>
    </Section>
  )
}
