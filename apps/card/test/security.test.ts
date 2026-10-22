/**
 * @jest-environment node
 */
import { hashInviteToken, inviteExpiry, inviteTokenMatches, isInviteTokenShape, newInviteToken } from '@/lib/invite-token'

describe('invite links', () => {
  it('makes unguessable, URL-safe tokens', () => {
    const tokens = new Set(Array.from({ length: 200 }, newInviteToken))
    expect(tokens.size).toBe(200)
    for (const t of tokens) expect(isInviteTokenShape(t)).toBe(true)
  })

  it('accepts only the token whose hash is stored', () => {
    const token = newInviteToken()
    const stored = hashInviteToken(token)
    expect(stored).not.toContain(token)
    expect(inviteTokenMatches(token, stored)).toBe(true)
    expect(inviteTokenMatches(newInviteToken(), stored)).toBe(false)
  })

  it('fails closed on missing hashes and malformed tokens', () => {
    const token = newInviteToken()
    expect(inviteTokenMatches(token, null)).toBe(false)
    expect(inviteTokenMatches('', hashInviteToken(''))).toBe(false)
    expect(inviteTokenMatches(`${token}x`, hashInviteToken(`${token}x`))).toBe(false)
    expect(inviteTokenMatches(token, 'not-hex')).toBe(false)
  })

  it('expires a week out', () => {
    const now = new Date('2026-10-21T00:00:00Z')
    expect(inviteExpiry(now).toISOString()).toBe('2026-10-28T00:00:00.000Z')
  })
})

import { isUrlInBase } from '@/lib/media-url'

describe('bucket URL guard', () => {
  const base = 'https://br-x.storage.c-3.ap-southeast-1.aws.neon.tech/card-media/'
  const good = `${base}14299c98-e6c0-4c0d-b100-44741682a410/16638e26-70aa-49c4-80d5-d3c5e02d49b0/photo-430a11f1-9d75-45d6-9e4f-de8f31109925.webp`

  it('accepts keys this app writes', () => {
    expect(isUrlInBase(good, base)).toBe(true)
  })

  it.each([
    ['dot segments', `${base}../other-bucket/x.png`],
    ['encoded dot segments', `${base}%2e%2e/other-bucket/x.png`],
    ['encoded slash', `${base}a%2Fb.png`],
    ['a query string', `${good}?x=1`],
    ['a fragment', `${good}#x`],
    ['credentials', good.replace('https://', 'https://u:p@')],
    ['another host', good.replace('br-x.storage', 'evil.storage')],
    ['plain http', good.replace('https://', 'http://')],
    ['a sibling bucket', good.replace('/card-media/', '/card-media-other/')],
    ['the bucket root', base],
    ['javascript', 'javascript:alert(1)'],
    ['not a URL', 'nope'],
  ])('rejects %s', (_label, url) => {
    expect(isUrlInBase(url, base)).toBe(false)
  })
})

jest.mock('../lib/auth/server', () => ({
  getAuth: () => ({
    handler: () => ({
      GET: async () => new Response('upstream', { status: 200 }),
      POST: async () => new Response('upstream', { status: 200 }),
    }),
  }),
}))

describe('auth proxy allowlist', () => {
  const route = require('../app/api/auth/[...path]/route') as typeof import('../app/api/auth/[...path]/route')
  const call = (method: 'GET' | 'POST', path: string[]) => {
    const req = new Request('https://card.mohdaslam.dev/api/auth/x', { method }) as unknown as Parameters<typeof route.GET>[0]
    return route[method](req, { params: Promise.resolve({ path }) })
  }

  it.each([
    ['GET', ['get-session']],
    ['GET', ['reset-password', 'AbCdEf123456']],
    ['POST', ['sign-out']],
  ] as const)('passes %s %j', async (method, path) => {
    expect((await call(method, [...path])).status).toBe(200)
  })

  it.each([
    ['POST', ['sign-up', 'email']],
    ['POST', ['sign-up/email']],
    ['POST', ['sign-up%2Femail']],
    ['POST', ['Sign-Up', 'email']],
    ['POST', ['sign-in', 'email']],
    ['POST', ['', 'sign-up', 'email']],
    ['POST', ['..', 'sign-up', 'email']],
    ['GET', ['sign-out']],
    ['POST', ['get-session']],
    ['GET', ['reset-password', '..']],
    ['POST', ['update-user']],
  ] as const)('blocks %s %j', async (method, path) => {
    expect((await call(method, [...path])).status).toBe(404)
  })
})
