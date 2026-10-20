import Image from 'next/image'
import type { CSSProperties } from 'react'

import { readableOn } from '@/lib/card/color'
import {
  contactDisplay,
  contactHref,
  embedSrc,
  quickActionLinks,
  socialDisplay,
  SOCIAL_LABELS,
} from '@/lib/card/links'
import type { CardDoc, Widget } from '@/lib/card/schema'

import { CalendarDays, CONTACT_ICONS, LinkIcon, QUICK_ICONS, SOCIAL_ICONS } from './icons'
import { LeadFormButton } from './lead-form'
import { QrButton } from './qr-button'
import { ShareButton } from './share-button'

/**
 * The card itself. One component renders both the public page and the
 * editor's live preview, so what the owner sees while editing is exactly
 * what a visitor gets.
 *
 * Styling comes from the card's own theme through CSS variables, not from
 * the app's design system: each person's card should look like theirs.
 */

export interface CardViewProps {
  doc: CardDoc
  handle: string
  /** Absolute URL of the public card, for the QR code and share sheet. */
  url: string
  /** In the editor: links and forms are inert. */
  preview?: boolean
}

const FONT_VARS = {
  sans: 'var(--font-card-sans)',
  serif: 'var(--font-card-serif)',
  rounded: 'var(--font-card-rounded)',
} as const

const RADIUS = { rounded: '14px', pill: '999px', square: '4px' } as const

export function themeStyle(doc: CardDoc): CSSProperties {
  const t = doc.theme
  const light = t.text === 'light'
  return {
    '--c-from': t.background.from,
    '--c-to': t.background.to,
    '--c-fg': light ? '#ffffff' : '#0b0b0f',
    '--c-muted': light ? 'rgba(255,255,255,0.74)' : 'rgba(11,11,15,0.68)',
    '--c-surface': light ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.72)',
    '--c-surface-hover': light ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.92)',
    '--c-line': light ? 'rgba(255,255,255,0.18)' : 'rgba(11,11,15,0.12)',
    '--c-accent': t.accent,
    '--c-accent-fg': readableOn(t.accent),
    '--c-radius': RADIUS[t.buttons],
    fontFamily: FONT_VARS[t.font],
  } as CSSProperties
}

export function CardView({ doc, handle, url, preview = false }: CardViewProps) {
  const { header: h, theme } = doc
  const quick = quickActionLinks(h.quickActions, h)
  const widgets = doc.widgets.filter((w) => !w.hidden)
  const subtitle = [h.title, h.company].filter(Boolean).join(' · ')

  return (
    <div
      // overflow-x-clip, not overflow-hidden: hidden would make this a scroll
      // container and break the sticky Save contact bar.
      className="card-root relative min-h-full w-full overflow-x-clip text-[color:var(--c-fg)]"
      style={{
        ...themeStyle(doc),
        background: 'linear-gradient(165deg, var(--c-from) 0%, var(--c-to) 100%)',
      }}
    >
      <div className="absolute right-3 top-3 z-20">
        <QrButton url={url} name={h.name} />
      </div>

      {/* ------------------------------------------------------------ header */}
      {theme.template === 'classic' && (
        <header className="relative">
          <div className="relative h-36 w-full overflow-hidden">
            {h.banner ? (
              <Image src={h.banner} alt="" fill sizes="480px" className="object-cover" priority={!preview} />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background: 'radial-gradient(120% 140% at 15% 0%, var(--c-accent) 0%, transparent 65%)',
                  opacity: 0.85,
                  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent)',
                  maskImage: 'linear-gradient(to bottom, black 40%, transparent)',
                }}
              />
            )}
          </div>
          <div className="-mt-14 flex flex-col items-center px-6 text-center">
            <Avatar doc={doc} size={112} preview={preview} />
            <Identity doc={doc} subtitle={subtitle} align="center" />
          </div>
        </header>
      )}

      {theme.template === 'split' && (
        <header className="px-6 pt-14">
          <div className="flex items-center gap-4">
            <Avatar doc={doc} size={88} preview={preview} square />
            <Identity doc={doc} subtitle={subtitle} align="left" />
          </div>
        </header>
      )}

      {theme.template === 'minimal' && (
        <header className="flex flex-col items-center px-6 pt-16 text-center">
          <Avatar doc={doc} size={72} preview={preview} />
          <Identity doc={doc} subtitle={subtitle} align="center" />
        </header>
      )}

      {/* ------------------------------------------------------ quick actions */}
      {quick.length > 0 && (
        <nav
          aria-label="Quick actions"
          className={`mt-5 flex gap-3 px-6 ${theme.template === 'split' ? 'justify-start' : 'justify-center'}`}
        >
          {quick.map((q) => {
            const Icon = QUICK_ICONS[q.action]
            const cls =
              'grid h-12 w-12 place-items-center rounded-full bg-[color:var(--c-surface)] ring-1 ring-[color:var(--c-line)] transition hover:bg-[color:var(--c-surface-hover)]'
            if (q.action === 'share') {
              return (
                <ShareButton key="share" url={url} title={h.name} className={cls} disabled={preview}>
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="sr-only">{q.label}</span>
                </ShareButton>
              )
            }
            return (
              <a key={q.action} href={preview ? undefined : q.href ?? undefined} className={cls}>
                <Icon className="h-5 w-5" aria-hidden />
                <span className="sr-only">{q.label}</span>
              </a>
            )
          })}
        </nav>
      )}

      {/* ------------------------------------------------------------ widgets */}
      <main className="mt-6 flex flex-col gap-3 px-5 pb-28">
        {widgets.map((w) => (
          <WidgetView key={w.id} widget={w} doc={doc} handle={handle} preview={preview} />
        ))}
      </main>

      {/* -------------------------------------------------------- save contact */}
      <div className="pointer-events-none sticky bottom-0 z-10 px-5 pb-5 pt-8" style={{ background: 'linear-gradient(to top, var(--c-to) 35%, transparent)' }}>
        <a
          href={preview ? undefined : `/${handle}/vcard`}
          className="pointer-events-auto flex h-14 w-full items-center justify-center rounded-[var(--c-radius)] bg-[color:var(--c-accent)] text-base font-semibold text-[color:var(--c-accent-fg)] shadow-lg shadow-black/20 transition hover:brightness-110"
        >
          Save contact
        </a>
      </div>
    </div>
  )
}

function Avatar({
  doc,
  size,
  preview,
  square = false,
}: {
  doc: CardDoc
  size: number
  preview: boolean
  square?: boolean
}) {
  const h = doc.header
  const initials = h.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[color:var(--c-surface)] ring-4 ring-[color:var(--c-from)] ${square ? 'rounded-2xl' : 'rounded-full'}`}
      style={{ width: size, height: size }}
    >
      {h.photo ? (
        <Image src={h.photo} alt={h.name} fill sizes={`${size * 2}px`} className="object-cover" priority={!preview} />
      ) : (
        <span className="grid h-full w-full place-items-center text-2xl font-semibold text-[color:var(--c-muted)]">
          {initials}
        </span>
      )}
      {h.logo && (
        <span className="absolute bottom-0 right-0 h-1/3 w-1/3 overflow-hidden rounded-full bg-white ring-2 ring-[color:var(--c-from)]">
          <Image src={h.logo} alt="" fill sizes="64px" className="object-contain p-0.5" />
        </span>
      )}
    </div>
  )
}

function Identity({ doc, subtitle, align }: { doc: CardDoc; subtitle: string; align: 'left' | 'center' }) {
  const h = doc.header
  return (
    <div className={`mt-4 ${align === 'left' ? 'mt-0 text-left' : 'text-center'}`}>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight">
        {h.name}
        {h.pronouns && <span className="ml-2 align-middle text-sm font-normal text-[color:var(--c-muted)]">({h.pronouns})</span>}
      </h1>
      {subtitle && <p className="mt-1 text-[0.95rem] text-[color:var(--c-muted)]">{subtitle}</p>}
    </div>
  )
}

const rowClass =
  'flex min-h-14 w-full items-center gap-3 rounded-[var(--c-radius)] bg-[color:var(--c-surface)] px-4 py-3 text-left ring-1 ring-[color:var(--c-line)] transition hover:bg-[color:var(--c-surface-hover)]'

function WidgetView({
  widget: w,
  doc,
  handle,
  preview,
}: {
  widget: Widget
  doc: CardDoc
  handle: string
  preview: boolean
}) {
  const href = (u: string) => (preview ? undefined : u)
  const external = preview ? {} : { target: '_blank', rel: 'noopener noreferrer' }

  switch (w.type) {
    case 'heading':
      return (
        <h2 className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">
          {w.text}
        </h2>
      )

    case 'text':
      return <p className="whitespace-pre-line px-1 text-[0.95rem] leading-relaxed">{w.body}</p>

    case 'contact':
      return (
        <ul className="flex flex-col gap-2">
          {w.items.map((item, i) => {
            const Icon = CONTACT_ICONS[item.kind]
            const opensApp = item.kind === 'phone' || item.kind === 'email'
            return (
              <li key={i}>
                <a href={href(contactHref(item.kind, item.value))} {...(opensApp ? {} : external)} className={rowClass}>
                  <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate">{item.label || contactDisplay(item.kind, item.value)}</span>
                    {item.label && (
                      <span className="block truncate text-xs text-[color:var(--c-muted)]">
                        {contactDisplay(item.kind, item.value)}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      )

    case 'social':
      return (
        <ul className="flex flex-col gap-2">
          {w.items.map((item, i) => {
            const Icon = SOCIAL_ICONS[item.network]
            return (
              <li key={i}>
                <a href={href(item.url)} {...external} className={rowClass}>
                  <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate">{item.label || socialDisplay(item.url)}</span>
                    <span className="block truncate text-xs text-[color:var(--c-muted)]">
                      {SOCIAL_LABELS[item.network]}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      )

    case 'link':
      return (
        <a href={href(w.url)} {...external} className={rowClass}>
          <LinkIcon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
          <span className="truncate font-medium">{w.label}</span>
        </a>
      )

    case 'booking':
      return (
        <a href={href(w.url)} {...external} className={rowClass}>
          <CalendarDays className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
          <span className="truncate font-medium">{w.label}</span>
        </a>
      )

    case 'embed': {
      const src = embedSrc(w.url)
      if (!src) return null
      const spotify = src.includes('spotify')
      return (
        <div className="overflow-hidden rounded-[var(--c-radius)] ring-1 ring-[color:var(--c-line)]">
          {preview ? (
            <div className="grid h-40 place-items-center bg-[color:var(--c-surface)] text-sm text-[color:var(--c-muted)]">
              {spotify ? 'Spotify player' : 'YouTube video'}
            </div>
          ) : (
            <iframe
              src={src}
              title={spotify ? 'Spotify player' : 'YouTube video'}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className={`w-full ${spotify ? 'h-[152px]' : 'aspect-video'}`}
            />
          )}
        </div>
      )
    }

    case 'form':
      return <LeadFormButton widget={w} handle={handle} ownerName={doc.header.name} preview={preview} className={rowClass} />
  }
}
