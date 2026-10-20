import Link from 'next/link'

import { signOut } from '@/app/login/actions'
import type { Member } from '@/lib/session'

/** Top bar for the signed-in pages: editor, inbox, admin. */
export function Chrome({ member, children }: { member: Member; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/edit" className="label-mono text-ink transition-colors hover:text-accent">
            Cards
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {member.isAdmin && (
              <Link href="/admin" className="text-ink-muted hover:text-ink">
                Admin
              </Link>
            )}
            <span className="hidden text-ink-muted sm:inline">{member.email}</span>
            <form action={signOut}>
              <button className="text-ink-muted hover:text-ink">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
