import 'server-only'

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

import { requireEnv } from './env'

/**
 * Neon's HTTP driver: one fetch per query, no pool to manage, which suits
 * serverless functions. Created on first use so builds need no database.
 */
let client: NeonQueryFunction<false, false> | undefined

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  client ??= neon(requireEnv('DATABASE_URL'))
  return client(strings, ...values)
}
