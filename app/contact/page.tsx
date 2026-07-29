import { Mail } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/contact-form'
import { Section } from '@/components/layout/section'
import { siteConfig } from '@/content/site-config'
import { ENQUIRY_TYPES, type EnquiryType } from '@/lib/validation/contact'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name} about technical work, a website or product, an event, or a community partnership.`,
  alternates: { canonical: '/contact' },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  // Capability pages link here with ?type=…, so the form opens on the right
  // enquiry (PRD FR-06).
  const defaultType: EnquiryType =
    type && type in ENQUIRY_TYPES ? (type as EnquiryType) : 'technical'

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <h1 className="text-headline font-semibold text-ink">Get in touch</h1>
          <p className="prose-measure mt-4 text-base leading-relaxed text-ink-muted">
            Tell me what you are trying to do. The more concrete you can be, the more
            useful my reply will be.
          </p>

          <div className="mt-10">
            <ContactForm defaultType={defaultType} />
          </div>
        </div>

        <aside className="flex flex-col gap-6 lg:pt-20">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-ink">Prefer email?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              The form is a convenience, not a requirement.
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-accent underline-offset-4 hover:underline"
            >
              <Mail aria-hidden className="size-4" />
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h2 className="text-sm font-semibold text-ink">What happens next</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              I read everything and usually reply within a day or two. If it is a website
              or event enquiry, I will come back with questions before any numbers.
            </p>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h2 className="text-sm font-semibold text-ink">Your information</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              What you send is used only so I can reply. No mailing list, no sharing, and
              nothing quoted publicly without asking you first.
            </p>
            <Link
              href="/privacy"
              className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
            >
              Privacy notice
            </Link>
          </div>
        </aside>
      </div>
    </Section>
  )
}
