import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Mohamed Aslam - Portfolio',
  description: 'The portfolio website of Mohamed Aslam, a passionate full-stack developer and tech enthusiast.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
