import type { NextRequest } from 'next/server'

import { getAuth } from '@/lib/auth/server'

/**
 * Proxy for the Managed Better Auth API, open only to what this app uses.
 *
 * Sign-in, sign-up and password resets run in server actions (app/login),
 * which add the invite check. This route used to block just the sign-up
 * prefix, which an encoded slash (`sign-up%2Femail`) slipped past, and it
 * left sign-in reachable without the app's checks. It is now an allowlist
 * matched against the decoded, joined path: anything else is a 404.
 */
type Ctx = { params: Promise<{ path: string[] }> }

const ALLOWED: Record<'GET' | 'POST', RegExp[]> = {
  GET: [
    /^get-session$/,
    // Links in auth emails, which then redirect back to /login/reset.
    /^reset-password\/[A-Za-z0-9_-]{8,200}$/,
    /^verify-email$/,
  ],
  POST: [/^sign-out$/],
}

async function allowed(method: 'GET' | 'POST', ctx: Ctx): Promise<boolean> {
  const { path } = await ctx.params
  if (!Array.isArray(path) || path.some((s) => s === '' || s === '.' || s === '..' || /[/\\%]/.test(s))) return false
  const joined = path.join('/')
  return ALLOWED[method].some((re) => re.test(joined))
}

const notFound = () => Response.json({ error: 'Not found.' }, { status: 404 })

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!(await allowed('GET', ctx))) return notFound()
  return getAuth().handler().GET(req, ctx)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!(await allowed('POST', ctx))) return notFound()
  return getAuth().handler().POST(req, ctx)
}
