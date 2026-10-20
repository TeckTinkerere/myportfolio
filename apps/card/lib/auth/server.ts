import 'server-only'

import { createNeonAuth } from '@neondatabase/auth/next/server'

import { requireEnv } from '../env'

/**
 * Managed Better Auth (Neon Auth). Created lazily so a build without
 * secrets does not throw at import time.
 */
let instance: ReturnType<typeof createNeonAuth> | undefined

export function getAuth() {
  instance ??= createNeonAuth({
    baseUrl: requireEnv('NEON_AUTH_BASE_URL'),
    cookies: {
      secret: requireEnv('NEON_AUTH_COOKIE_SECRET'),
      // Lax so following a link to /edit from an email or chat app still
      // carries the session. Strict would bounce people to the login page.
      sameSite: 'lax',
    },
  })
  return instance
}
