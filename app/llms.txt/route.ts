import { bioOpener, education } from '@/content/profile'
import { capabilityRoutes, primaryNav, siteConfig } from '@/content/site-config'
import { getPublicProjects } from '@/lib/content/queries'

/**
 * llms.txt (llmstxt.org) — a plain-text entity summary for AI answer
 * engines (ChatGPT, Perplexity, Google AI Overviews, Claude) that don't
 * render the page like a browser and do better with flat, quotable facts
 * than with parsing HTML/CSS. Generated from the same content modules as
 * the rest of the site, so it can't drift out of sync with what's published.
 */
export async function GET() {
  const base = siteConfig.url
  const projects = getPublicProjects()

  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.positioning}`,
    '',
    bioOpener,
    '',
    `- Legal name: ${siteConfig.legalName}`,
    `- Location: ${siteConfig.location}`,
    `- Role: ${siteConfig.descriptor}`,
    `- Education: ${education.qualification}, ${education.institution} (${education.timeframe})`,
    `- Status: ${siteConfig.status}`,
    `- Contact: ${siteConfig.contact.email}`,
    `- GitHub: ${siteConfig.contact.github}`,
    `- LinkedIn: ${siteConfig.contact.linkedin}`,
    '',
    '## Pages',
    ...primaryNav.map((item) => `- [${item.label}](${base}${item.href})`),
    '',
    '## Areas of work',
    ...capabilityRoutes.map(
      (route) => `- [${route.label}](${base}${route.href}): ${route.description}`,
    ),
    '',
    '## Selected projects',
    ...projects
      .slice(0, 10)
      .map((project) => `- [${project.title}](${base}/work/${project.slug}): ${project.oneLiner}`),
  ]

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
