import { readCollection } from '@/lib/content/data-files'
import { parseProjects } from '@/lib/content/schema'

/**
 * Every project, validated at module scope.
 *
 * Entries live as JSON in content/data/projects/ and are edited through
 * Keystatic (/keystatic). The filename is the slug; `sortOrder` breaks ties
 * where the query layer's lens ranking leaves two items equal.
 *
 * parseProjects throws on any schema violation. Because this module is
 * imported by the route pages, that throw happens during static generation
 * and fails `next build` with the offending slug and field named. This is
 * the mechanism behind PRD s14.2 — and unlike a type error, no config flag
 * can suppress it.
 *
 * Items with a pending permission status are still loaded here;
 * getPublicProjects() filters them out. Content is authored once; the
 * publication decision lives in the query layer.
 */
export const projects = parseProjects(
  readCollection('projects')
    .sort((a, b) => Number(a.sortOrder ?? 100) - Number(b.sortOrder ?? 100))
    .map(({ tier, ...rest }) => ({ ...rest, ...(tier ? { tier: Number(tier) } : {}) })),
)
