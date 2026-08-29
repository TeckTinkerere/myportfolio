import 'server-only'

import { isPublished } from '@mohdaslam/content-rules'

import { runSheets } from '@/content'
import type { RunSheet } from '@/lib/schema'

/**
 * The publication boundary for run sheets.
 *
 * isPublished() is imported from @mohdaslam/content-rules — the same
 * function the portfolio gates its projects and events with — rather than
 * restated here. These are two separately deployed sites, which is exactly
 * the condition under which a second copy of a rule quietly drifts, so the
 * rule is shared even though it is only a few lines.
 *
 * Host notes deserve a moment's thought before a sheet is published. There
 * is no login on this site, so "published" means published: a note that
 * would embarrass an organiser belongs in a private sheet, not behind a URL
 * nobody has been given.
 */

export function getPublicRunSheets(): RunSheet[] {
  return runSheets
    .filter(isPublished)
    .sort(
      (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title),
    )
}

export function getRunSheetBySlug(slug: string): RunSheet | undefined {
  return getPublicRunSheets().find((sheet) => sheet.slug === slug)
}
