'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Replaces a hand-rolled localStorage context that only understood
 * light|dark. next-themes adds OS-preference following and injects a
 * blocking script that sets the class before first paint, which is what
 * removes the flash of incorrect theme (PRD FR-11).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
