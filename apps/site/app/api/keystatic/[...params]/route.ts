import { makeRouteHandler } from '@keystatic/next/route-handler'
import config, { keystaticEnabled } from '../../../../keystatic.config'

/**
 * Fails closed: without GitHub storage outside development, the unauthenticated
 * local-mode API is never constructed and every request gets an opaque 404.
 */
function notFound() {
  return new Response('Not Found', { status: 404 })
}

const handler = keystaticEnabled ? makeRouteHandler({ config }) : { GET: notFound, POST: notFound }

export const { GET, POST } = handler
