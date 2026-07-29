import { siteConfig } from '@/content/site-config'

/**
 * JSON-LD describing only what is actually visible on the page (PRD s20.2).
 * No claims here that the site does not also state in its own copy.
 */
export function PersonSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    description: siteConfig.positioning,
    url: siteConfig.url,
    email: `mailto:${siteConfig.contact.email}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SG',
      addressLocality: siteConfig.location,
    },
    sameAs: [siteConfig.contact.github, siteConfig.contact.linkedin],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Singapore Polytechnic',
    },
  }

  return (
    <script
      type="application/ld+json"
      // Content is a local literal, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
