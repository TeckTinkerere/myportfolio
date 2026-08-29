import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@mohdaslam/ui/theme-provider'
import { ThemeToggle } from '@mohdaslam/ui/theme-toggle'
import { cn } from '@mohdaslam/ui/cn'
import type { Metadata, Viewport } from 'next'
import { Archivo, Geist, IBM_Plex_Mono } from 'next/font/google'
import Link from 'next/link'

import { emceeConfig } from '@/content/site-config'

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

export const metadata: Metadata = {
  metadataBase: new URL(emceeConfig.url),
  title: {
    default: `${emceeConfig.name} — ${emceeConfig.owner}`,
    template: `%s | ${emceeConfig.name}`,
  },
  description: emceeConfig.description,
  authors: [{ name: emceeConfig.owner, url: emceeConfig.portfolioUrl }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: emceeConfig.url,
    siteName: emceeConfig.name,
    title: `${emceeConfig.name} — ${emceeConfig.owner}`,
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
              Chrome is deliberately thinner than the portfolio's. There is
              one section here, and a host mid-show should not be navigating
              — the header is a way back to the list and nothing else.
            */}
            <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <div className="container flex h-16 items-center justify-between gap-4">
                <Link
                  href="/"
                  className="label-mono text-ink transition-colors hover:text-accent"
                >
                  {emceeConfig.name}
                </Link>
                <ThemeToggle />
              </div>
            </header>

            <main id="main" className="flex-1">
              {children}
            </main>

            <footer className="border-t border-border">
              <div className="container flex flex-wrap items-center justify-between gap-4 py-8 text-xs text-ink-muted">
                <p>
                  {emceeConfig.descriptor} — {emceeConfig.owner}
                </p>
                <a
                  href={emceeConfig.portfolioUrl}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  mohdaslam.dev
                </a>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
