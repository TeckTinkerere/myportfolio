import type { NextRequest } from 'next/server'

import { getAuth } from '@/lib/auth/server'

/**
 * Proxy for the Managed Better Auth API. Sign-up is not routed through
 * here: the login page's server action does it, after checking the invite
 * list, so the public endpoint is closed.
 */
type Ctx = { params: Promise<{ path: string[] }> }

function blocked(path: string[]) {
  return path[0] === 'sign-up'
}

export async function GET(req: NextRequest, ctx: Ctx) {
  return getAuth().handler().GET(req, ctx)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  if (blocked(path)) return Response.json({ error: 'Sign-up is by invite only.' }, { status: 403 })
  return getAuth().handler().POST(req, ctx)
}
