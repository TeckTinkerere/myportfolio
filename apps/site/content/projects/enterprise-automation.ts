import type { PortfolioProjectInput } from '@/lib/content/schema'

/**
 * NOT PUBLISHED.
 *
 * permissionStatus is 'pending', so isPublished() in lib/content/queries.ts
 * excludes this from every public query, every route, every sitemap entry and
 * every generateStaticParams call. That exclusion is the point: the PRD
 * requires a sanitised enterprise automation case study, but no employer
 * permission has been recorded and no source material for it exists in this
 * repository.
 *
 * The scaffold is here so that publishing becomes a one-word change once
 * Mohamed confirms (a) that the work happened as described and (b) that his
 * employer permits a sanitised account. Until then, nothing below reaches a
 * page. Every field is intentionally generic: no employer name, no internal
 * product name, no interface detail, no metric. See CONTENT_TODO.md.
 */
export const enterpriseAutomation: PortfolioProjectInput = {
  slug: 'enterprise-automation-reliability',
  title: 'Automation Reliability in a Restricted Enterprise Environment',
  proofVerb: 'AUTOMATED',
  oneLiner:
    'Making a repetitive operational process more reliable and easier to observe when it failed.',
  shortSummary:
    'A sanitised account of automation work carried out inside a restricted enterprise environment, covering the class of problem, my role and the engineering approach only.',
  longSummary:
    'PENDING VERIFICATION — this case study has not been written. It must not be published until the work, the role and the employer permission have all been confirmed.',

  lenses: ['general', 'software'],
  status: 'confidential',
  visibility: 'sanitised',
  permissionStatus: 'pending',

  role: 'PENDING VERIFICATION',
  timeframeLabel: 'PENDING VERIFICATION',
  tier: 1,

  responsibilities: [],
  constraints: [
    'Restricted technical environment.',
    'Employer confidentiality.',
  ],
  outcomes: [],

  confidentialityNote:
    'Certain names, interfaces, datasets, metrics, and implementation details have been omitted or generalised to respect employer or client confidentiality. This case study focuses only on my role, engineering approach, and permitted lessons.',
}
