import type { NextRequest } from 'next/server'

import { getAuth } from '@/lib/auth/server'

/**
 * Next 16's request proxy (formerly middleware). Bounces signed-out
 * visitors away from the editor and admin before any page code runs. Pages
 * still check membership themselves; this is the first gate, not the only.
 */
export default function proxy(req: NextRequest) {
  return getAuth().middleware({ loginUrl: '/login' })(req)
}

export const config = {
  matcher: ['/edit/:path*', '/admin/:path*'],
}
