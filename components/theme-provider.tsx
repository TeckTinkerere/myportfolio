"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
})

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: "light" | "dark"
  storageKey?: string
}

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "theme" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeContextProps["theme"]>(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as "light" | "dark" | null
      return storedTheme || defaultTheme
    } catch (e) {
      return defaultTheme
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, theme)
      const root = window.document.documentElement
      if (theme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }, [theme, storageKey])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
