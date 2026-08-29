import { z } from 'zod'

/**
 * The publication boundary, in the one place both apps read it from.
 *
 * These four exports are small enough that copying them into the emcee app
 * would have looked harmless. It is not: they encode what "published" means,
 * and two copies of that rule is precisely how one app starts publishing
 * something the other would have withheld. The portfolio and the emcee site
 * answer the question with the same function or the answer is not worth
 * trusting.
 */

export const visibilitySchema = z.enum(['public', 'sanitised', 'gated', 'private'])

export const permissionStatusSchema = z.enum([
  'not-required',
  'approved',
  'pending',
  'prohibited',
])

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}(-\d{2}){0,2}$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD')

/**
 * Visible to anyone. Sanitised items are public items with detail withheld.
 *
 * Deliberately structural rather than typed to a specific content shape —
 * projects, events and run sheets are different models that happen to carry
 * the same two fields, and the gate cares only about those two.
 */
export function isPublished(item: {
  visibility: string
  permissionStatus: string
}): boolean {
  const visibleKind = item.visibility === 'public' || item.visibility === 'sanitised'
  const permitted =
    item.permissionStatus === 'approved' || item.permissionStatus === 'not-required'
  return visibleKind && permitted
}

export type Visibility = z.infer<typeof visibilitySchema>
export type PermissionStatus = z.infer<typeof permissionStatusSchema>
