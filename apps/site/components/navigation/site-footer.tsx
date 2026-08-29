import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

import { Wordmark } from '@/components/brand/wordmark'
import { capabilityRoutes, footerLinks, siteConfig } from '@/content/site-config'

const socials = [
  { href: siteConfig.contact.github, label: 'GitHub', Icon: Github },
  { href: siteConfig.contact.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: `mailto:${siteConfig.contact.email}`, label: 'Email', Icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface print-hidden">
      <div className="container py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Wordmark showDescriptor />
            <p className="mt-4 text-sm text-ink-muted">{siteConfig.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <nav aria-label="Capabilities">
              <h2 className="label-mono text-ink-muted">Capabilities</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {capabilityRoutes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Site">
              <h2 className="label-mono text-ink-muted">Site</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="label-mono text-ink-muted">Elsewhere</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
                      {...(href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      <Icon aria-hidden className="size-4" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>Built and maintained by {siteConfig.name}.</p>
        </div>
      </div>
    </footer>
  )
}
