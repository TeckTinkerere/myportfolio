import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@mohdaslam/ui/theme-provider'
import { ThemeToggle } from '@mohdaslam/ui/theme-toggle'
import { cn } from '@mohdaslam/ui/cn'
import type { Metadata, Viewport } from 'next'
import { Archivo, Geist, IBM_Plex_Mono } from 'next/font/google'
import Link from 'next/link'

import { bookingHref, emceeConfig } from '@/content/site-config'

import './globals.css'

/*
  The same three faces as the portfolio, declared here rather than imported
  from the shared package. next/font has to be called from the app for the
  compiler to pick it up and self-host the files, and each app is entitled to
  its own weights — this one uses no display weight the portfolio does not.
*/
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const NAV = [
  { href: '/#rooms', label: 'Rooms' },
  { href: '/#approach', label: 'Approach' },
  { href: '/#run-sheets', label: 'Run sheets' },
] as const

export const metadata: Metadata = {
  metadataBase: new URL(emceeConfig.url),
  title: {
    default: `${emceeConfig.owner} — Host & Emcee`,
    template: `%s | ${emceeConfig.name}`,
  },
  description: emceeConfig.description,
  authors: [{ name: emceeConfig.owner, url: emceeConfig.url }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: emceeConfig.url,
    siteName: emceeConfig.name,
    title: `${emceeConfig.owner} — Host & Emcee`,
    description: emceeConfig.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#06070a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-SG"
      suppressHydrationWarning
      className={cn(sans.variable, mono.variable, display.variable)}
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-contrast"
          >
            Skip to content
          </a>

          <div className="flex min-h-dvh flex-col">
            {/*
              Section links are anchors on the one-page home, so from a run
              sheet they route back to it. Book is the only filled control in
              the chrome — it is the one thing this site asks a visitor to do.
            */}
            <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <div className="container flex h-16 items-center justify-between gap-4">
                <Link
                  href="/"
                  className="label-mono text-ink transition-colors hover:text-accent"
                >
                  {emceeConfig.name}
                </Link>
                <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="hidden rounded-sm px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink md:inline-block"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <a
                    href={bookingHref}
                    className="ml-1 rounded-sm bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
                  >
                    Book
                  </a>
                  <ThemeToggle />
                </nav>
              </div>
            </header>

            <main id="main" className="flex-1">
              {children}
            </main>

            <footer className="border-t border-border">
              <div className="container flex flex-wrap items-center justify-between gap-4 py-8 text-xs text-ink-muted">
                <p>
                  {emceeConfig.owner} — {emceeConfig.descriptor} · {emceeConfig.location}
                </p>
                <div className="flex gap-5">
                  <a
                    href={`mailto:${emceeConfig.booking.email}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    Email
                  </a>
                  <a
                    href={emceeConfig.booking.linkedin}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
