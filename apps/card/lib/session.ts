import 'server-only'

import { redirect } from 'next/navigation'

import { getAuth } from './auth/server'
import { getMembership } from './data'

export interface Member {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

/**
 * The signed-in user, if their account redeemed an invite.
 *
 * Anyone can create an account directly against the auth server, with any
 * email and no verification, so neither a session nor an email on the
 * invite list proves anything. Membership is an invite bound to this
 * account's id (see app/login/actions.ts), and every page and action that
 * reads or writes data goes through here.
 */
export async function getMember(): Promise<Member | null> {
  const { data } = await getAuth().getSession()
  const user = data?.user
  if (!user?.id || !user.email) return null
  const membership = await getMembership(user.id)
  if (!membership) return null
  return { id: user.id, email: user.email, name: user.name ?? '', isAdmin: membership.is_admin }
}

export async function requireMember(): Promise<Member> {
  const member = await getMember()
  if (!member) redirect('/login?denied=1')
  return member
}

export async function requireAdmin(): Promise<Member> {
  const member = await requireMember()
  if (!member.isAdmin) redirect('/edit')
  return member
}
