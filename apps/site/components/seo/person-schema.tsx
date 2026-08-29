import { capabilities, education } from '@/content/profile'
import { siteConfig } from '@/content/site-config'

/**
 * JSON-LD describing only what is actually visible on the page (PRD s20.2).
 * No claims here that the site does not also state in its own copy.
 *
 * jobTitle/image/knowsAbout exist to strengthen this as the canonical entity
 * for a full-name search — every field here already appears in visible copy
 * on /about or the homepage, restated for machine readers (Google's
 * Knowledge Graph, AI answer engines) rather than stated only in prose.
 */
export function PersonSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    description: siteConfig.positioning,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/profile/portrait.jpg`,
    email: `mailto:${siteConfig.contact.email}`,
    jobTitle: siteConfig.descriptor,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SG',
      addressLocality: siteConfig.location,
    },
    sameAs: [siteConfig.contact.github, siteConfig.contact.linkedin],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: education.institution,
    },
    knowsAbout: capabilities.flatMap((group) => group.items),
  }

  return (
    <script
      type="application/ld+json"
      // Content is a local literal, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
