import { archiveProjects } from '@/content/projects/archive'
import { ecoramadan } from '@/content/projects/ecoramadan'
import { enterpriseAutomation } from '@/content/projects/enterprise-automation'
import { localloco } from '@/content/projects/localloco'
import { startuplink } from '@/content/projects/startuplink'
import { parseProjects } from '@/lib/content/schema'

/**
 * Every project, validated at module scope.
 *
 * parseProjects throws on any schema violation. Because this module is
 * imported by the route pages, that throw happens during static generation
 * and fails `next build` with the offending slug and field named. This is
 * the mechanism behind PRD s14.2 — and unlike a type error, no config flag
 * can suppress it.
 *
 * Note that enterpriseAutomation is included here but has a pending
 * permission status, so getPublicProjects() filters it out. Content is
 * authored once; the publication decision lives in the query layer.
 */
export const projects = parseProjects([
  startuplink,
  localloco,
  ecoramadan,
  enterpriseAutomation,
  ...archiveProjects,
])
