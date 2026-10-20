import { cn } from '@mohdaslam/ui/cn'
import type { Metadata } from 'next'
import { Archivo, Fraunces, Geist, IBM_Plex_Mono, Nunito } from 'next/font/google'

import './globals.css'

/*
  Chrome fonts match the other apps. The three card fonts are what a card
  owner can pick in the theme panel; only the sans face is preloaded, since
  most cards use it.
*/
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap', preload: false })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap', preload: false })
const cardSans = Geist({ subsets: ['latin'], variable: '--font-card-sans', display: 'swap' })
const cardSerif = Fraunces({ subsets: ['latin'], variable: '--font-card-serif', display: 'swap', preload: false })
const cardRounded = Nunito({ subsets: ['latin'], variable: '--font-card-rounded', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://card.mohdaslam.dev'),
  title: { default: 'Cards', template: '%s' },
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-SG"
      className={cn(
        sans.variable,
        display.variable,
        mono.variable,
        cardSans.variable,
        cardSerif.variable,
        cardRounded.variable,
      )}
    >
      <body className="min-h-dvh bg-background font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
