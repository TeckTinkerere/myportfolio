import 'server-only'

/**
 * Environment variables are read when first used, never at import time, so
 * `next build` and the tests run without secrets. A missing variable fails
 * the request that needs it, with its name in the error.
 */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}. See apps/card/.env.example.`)
  return value
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined
}

/** Public origin of the app, no trailing slash. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://card.mohdaslam.dev').replace(/\/$/, '')
}
