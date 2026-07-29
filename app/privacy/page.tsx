import type { Metadata } from 'next'

import { Section } from '@/components/layout/section'
import { siteConfig } from '@/content/site-config'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What this site collects when you contact me, why, and how long it is kept.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="font-display text-headline font-semibold text-ink">Privacy</h1>
      <p className="mt-4 text-sm text-ink-muted">
        Plain language, because a privacy notice nobody reads protects nobody.
      </p>

      <div className="prose-measure mt-10 flex flex-col gap-8">
        <section>
          <h2 className="font-display text-title font-semibold text-ink">What this site collects</h2>
          <p className="mt-3">
            Nothing at all, unless you use the contact form. There are no advertising
            trackers, no third-party analytics scripts and no cookies used to identify
            you. Your theme preference is stored in your own browser and never sent
            anywhere.
          </p>
        </section>

        <section>
          <h2 className="font-display text-title font-semibold text-ink">If you use the contact form</h2>
          <p className="mt-3">
            The form collects your name, your email address, the type of enquiry, your
            message, and — depending on the enquiry type — optional details such as a
            target date, rough scope or audience size. Organisation is optional.
          </p>
          <p className="mt-3">
            That information is used for one purpose: so I can reply to you. It is sent to
            my own inbox through an email delivery provider. It is not stored in a
            database on this site, not added to a mailing list, and not shared with anyone
            else.
          </p>
        </section>

        <section>
          <h2 className="font-display text-title font-semibold text-ink">How long I keep it</h2>
          <p className="mt-3">
            Your message stays in my inbox for as long as the conversation is useful, and
            is deleted once it is not. If you would like me to delete an enquiry sooner,
            email me and I will.
          </p>
        </section>

        <section>
          <h2 className="font-display text-title font-semibold text-ink">Testimonials and quoting</h2>
          <p className="mt-3">
            I will not quote anything you send me publicly — on this site or anywhere else
            — without asking you first and getting a clear yes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-title font-semibold text-ink">Spam protection</h2>
          <p className="mt-3">
            The form uses a hidden field that humans never see and a basic rate limit per
            network address. No CAPTCHA, no behavioural profiling, no third-party bot
            scoring.
          </p>
        </section>

        <section>
          <h2 className="font-display text-title font-semibold text-ink">Getting in touch about this</h2>
          <p className="mt-3">
            Questions about any of the above, or a request to delete something, go to{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </Section>
  )
}
