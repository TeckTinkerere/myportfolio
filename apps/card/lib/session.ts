import 'server-only'

import { redirect } from 'next/navigation'

import { getAuth } from './auth/server'
import { getInvite } from './data'

export interface Member {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

/**
 * The signed-in user, if they are on the invite list.
 *
 * Anyone can create an account directly against the auth server, so a
 * session alone proves nothing. Membership is the session plus an invite,
 * and every page and action that reads or writes data goes through here.
 */
export async function getMember(): Promise<Member | null> {
  const { data } = await getAuth().getSession()
  const user = data?.user
  if (!user?.email) return null
  const invite = await getInvite(user.email)
  if (!invite) return null
  return { id: user.id, email: user.email, name: user.name ?? '', isAdmin: invite.is_admin }
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
