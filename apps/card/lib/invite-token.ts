import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * One-time invite links. The admin shares /login?invite=<token> with the
 * person themself; only the token's SHA-256 is stored, so a database read
 * does not reveal a usable link.
 */

export const INVITE_TTL_DAYS = 7

/** 32 random bytes, base64url: 43 characters. */
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

export function newInviteToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashInviteToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export function isInviteTokenShape(token: string): boolean {
  return TOKEN_PATTERN.test(token)
}

/** Constant-time check of a presented token against the stored hash. */
export function inviteTokenMatches(token: string, storedHash: string | null): boolean {
  if (!storedHash || !isInviteTokenShape(token)) return false
  const presented = Buffer.from(hashInviteToken(token), 'hex')
  const stored = Buffer.from(storedHash, 'hex')
  return presented.length === stored.length && timingSafeEqual(presented, stored)
}

export function inviteExpiry(now = new Date()): Date {
  return new Date(now.getTime() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000)
}
