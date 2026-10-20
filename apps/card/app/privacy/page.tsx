import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  robots: { index: true, follow: true },
}

/**
 * Plain-language privacy notice. Written for Singapore's PDPA: what is
 * collected, why, who sees it, how long it is kept, and how to have it
 * removed. Keep it in step with what the code actually does.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <p className="label-mono text-ink-muted">card.mohdaslam.dev</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Privacy notice</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated 19 October 2026</p>

      <div className="mt-8 space-y-6 leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        <p>
          This site hosts digital business cards for Mohamed Aslam and a small group of invited friends. It is run
          by Mohamed Aslam as a personal project, not a commercial service.
        </p>

        <h2>If you view a card</h2>
        <p>
          Viewing a card or saving its contact does not create an account and sets no tracking cookies. The hosting
          provider (Vercel) keeps standard server logs, such as IP address and browser type, for security and
          reliability.
        </p>

        <h2>If you send your details through a card&rsquo;s contact form</h2>
        <ul>
          <li>
            <strong>What:</strong> the fields you fill in (name and email, and any of designation, company, mobile
            and message the card asks for), the consent statement you ticked, and the time.
          </li>
          <li>
            <strong>Why:</strong> so the owner of that card can contact you. Nothing else.
          </li>
          <li>
            <strong>Who sees it:</strong> only the owner of the card you sent it through. It is not shared with
            other card owners, sold, or used for marketing.
          </li>
          <li>
            <strong>Spam protection:</strong> a one-way hash of your IP address and browser, salted and changed
            daily, is stored to limit repeated submissions. Your IP address itself is not stored.
          </li>
          <li>
            <strong>How long:</strong> until the card owner deletes it, or the card is deleted.
          </li>
        </ul>

        <h2>If you have a card here</h2>
        <p>
          Your email, name, password hash (held by the authentication provider) and your card content are stored to
          run the service. You can download everything for a card, or delete a card and all contact-form
          submissions to it, from the editor at any time.
        </p>

        <h2>Where data is kept</h2>
        <p>
          The database, file storage and authentication run on Neon (AWS Singapore region). The site is served by
          Vercel. Emails, such as password resets and contact-form notifications to card owners, are sent through
          Brevo. Data is encrypted in transit.
        </p>

        <h2>Your rights and contact</h2>
        <p>
          To ask what is held about you, correct it, or have it deleted, email{' '}
          <a href="mailto:mohamedaslam.of@gmail.com" className="text-accent underline-offset-4 hover:underline">
            mohamedaslam.of@gmail.com
          </a>
          . Requests are handled within 30 days.
        </p>
      </div>

      <p className="mt-12 text-sm">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Back
        </Link>
      </p>
    </main>
  )
}
