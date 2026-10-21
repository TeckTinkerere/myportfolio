import Image from 'next/image'
import type { CSSProperties } from 'react'

import { readableOn } from '@/lib/card/color'
import {
  contactDisplay,
  contactHref,
  embedSrc,
  followUpMessage,
  quickActionLinks,
  socialDisplay,
  SOCIAL_LABELS,
  whatsappHref,
  whatsappNumber,
} from '@/lib/card/links'
import type { CardDoc, Widget } from '@/lib/card/schema'

import { Embed } from './embed'
import { CalendarDays, CONTACT_ICONS, LinkIcon, QUICK_ICONS, SOCIAL_ICONS } from './icons'
import { LeadFormButton } from './lead-form'
import { QrButton } from './qr-button'
import { SaveContact } from './save-contact'
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
  system: 'var(--font-card-system)',
  sans: 'var(--font-card-sans)',
  serif: 'var(--font-card-serif)',
  rounded: 'var(--font-card-rounded)',
} as const

const RADIUS = { rounded: '14px', pill: '999px', square: '4px' } as const
const AVATAR_RADIUS = { circle: 'rounded-full', rounded: 'rounded-[28%]', square: 'rounded-lg' } as const

export function themeStyle(doc: CardDoc): CSSProperties {
  const t = doc.theme
  const light = t.text === 'light'
  return {
    '--c-from': t.background.from,
    '--c-to': t.background.style === 'solid' ? t.background.from : t.background.to,
    '--c-fg': light ? '#ffffff' : '#0b0b0f',
    '--c-muted': light ? 'rgba(255,255,255,0.78)' : 'rgba(11,11,15,0.70)',
    '--c-surface': light ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.72)',
    '--c-surface-hover': light ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.92)',
    '--c-line': light ? 'rgba(255,255,255,0.22)' : 'rgba(11,11,15,0.14)',
    '--c-accent': t.accent,
    '--c-accent-fg': readableOn(t.accent),
    '--c-radius': RADIUS[t.buttons],
    fontFamily: FONT_VARS[t.font],
  } as CSSProperties
}

function background(doc: CardDoc): string {
  const b = doc.theme.background
  if (b.style === 'solid' || b.style === 'image') return b.from
  return `linear-gradient(${b.angle}deg, ${b.from} 0%, ${b.to} 100%)`
}

/** Row style: the look shared by contact, social, link and form rows. */
function rowClass(doc: CardDoc): string {
  const base =
    'card-focus flex min-h-14 w-full items-center gap-3 rounded-[var(--c-radius)] px-4 py-3 text-left transition'
  switch (doc.theme.rows) {
    case 'solid':
      return `${base} bg-[color:var(--c-accent)] text-[color:var(--c-accent-fg)] hover:brightness-110`
    case 'outline':
      return `${base} ring-[1.5px] ring-[color:var(--c-muted)] hover:bg-[color:var(--c-surface)]`
    default:
      return `${base} bg-[color:var(--c-surface)] ring-1 ring-[color:var(--c-line)] hover:bg-[color:var(--c-surface-hover)]`
  }
}

export function CardView({ doc, handle, url, preview = false }: CardViewProps) {
  const { header: h, theme } = doc
  const quick = quickActionLinks(h.quickActions, h)
  const widgets = doc.widgets.filter((w) => !w.hidden)
  const subtitle = [h.title, h.company].filter(Boolean).join(' · ')
  const left = theme.template === 'split' || theme.align === 'left'
  const rows = rowClass(doc)
  const wa = whatsappNumber(h)
  const followUp =
    h.afterSave === 'whatsapp' && wa
      ? { href: whatsappHref(wa, followUpMessage(h.whatsappMessage, h.name)), ownerFirstName: h.name.split(/\s+/)[0] ?? h.name }
      : null
  const bgImage = theme.background.style === 'image' ? theme.background.image : ''

  return (
    <div
      lang={doc.meta.lang}
      // overflow-x-clip, not overflow-hidden: hidden would make this a scroll
      // container and break the sticky Save contact bar.
      className="card-root relative min-h-full w-full overflow-x-clip text-[color:var(--c-fg)]"
      style={{ ...themeStyle(doc), background: background(doc) }}
    >
      {bgImage && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image src={bgImage} alt="" fill sizes="480px" quality={60} className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: theme.text === 'light' ? '#000' : '#fff',
              opacity: theme.background.overlay / 100,
            }}
          />
        </div>
      )}

      <div className="relative" style={theme.textSize === 'large' ? { zoom: 1.14 } : undefined}>
        <div className="absolute right-3 top-3 z-20">
          <QrButton url={url} name={h.name} />
        </div>

        {/* ---------------------------------------------------------- header */}
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
            <div className={`-mt-14 flex flex-col px-6 ${left ? 'items-start text-left' : 'items-center text-center'}`}>
              <Avatar doc={doc} size={112} preview={preview} />
              <Identity doc={doc} subtitle={subtitle} left={left} />
            </div>
          </header>
        )}

        {theme.template === 'cover' && (
          <header className="relative">
            <div className="relative aspect-[4/5] max-h-[440px] w-full overflow-hidden">
              {h.photo ? (
                <Image src={h.photo} alt={h.name} fill sizes="480px" className="object-cover" priority={!preview} />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[color:var(--c-surface)] text-6xl font-semibold text-[color:var(--c-muted)]">
                  {initials(h.name)}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(to top, var(--c-from), transparent)' }} />
            </div>
            <div className={`-mt-20 relative px-6 ${left ? 'text-left' : 'text-center'}`}>
              <Identity doc={doc} subtitle={subtitle} left={left} />
            </div>
          </header>
        )}

        {theme.template === 'split' && (
          <header className="px-6 pt-14">
            <div className="flex items-center gap-4">
              <Avatar doc={doc} size={88} preview={preview} />
              <Identity doc={doc} subtitle={subtitle} left />
            </div>
          </header>
        )}

        {theme.template === 'minimal' && (
          <header className={`flex flex-col px-6 pt-16 ${left ? 'items-start text-left' : 'items-center text-center'}`}>
            <Avatar doc={doc} size={72} preview={preview} />
            <Identity doc={doc} subtitle={subtitle} left={left} />
          </header>
        )}

        {/* --------------------------------------------------- quick actions */}
        {quick.length > 0 && (
          <nav aria-label="Quick actions" className={`mt-5 flex gap-3 px-6 ${left ? 'justify-start' : 'justify-center'}`}>
            {quick.map((q) => {
              const Icon = QUICK_ICONS[q.action]
              const cls =
                'card-focus grid h-12 w-12 place-items-center rounded-full bg-[color:var(--c-surface)] ring-1 ring-[color:var(--c-line)] transition hover:bg-[color:var(--c-surface-hover)]'
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

        {/* --------------------------------------------------------- widgets */}
        <main className="mt-6 flex flex-col gap-3 px-5 pb-28">
          {widgets.map((w) => (
            <WidgetView key={w.id} widget={w} doc={doc} handle={handle} preview={preview} rowClass={rows} />
          ))}
        </main>
      </div>

      {/* ------------------------------------------------------- save contact */}
      <div
        className="pointer-events-none sticky bottom-0 z-10 px-5 pb-5 pt-8"
        style={{ background: 'linear-gradient(to top, var(--c-to) 35%, transparent)' }}
      >
        <SaveContact href={`/${handle}/vcard`} label={h.saveLabel} whatsapp={followUp} preview={preview} />
      </div>
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

function Avatar({ doc, size, preview }: { doc: CardDoc; size: number; preview: boolean }) {
  const h = doc.header
  const shape = AVATAR_RADIUS[doc.theme.avatar]
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[color:var(--c-surface)] ring-4 ring-[color:var(--c-from)] ${shape}`}
      style={{ width: size, height: size }}
    >
      {h.photo ? (
        <Image src={h.photo} alt={h.name} fill sizes={`${size * 2}px`} className="object-cover" priority={!preview} />
      ) : (
        <span className="grid h-full w-full place-items-center text-2xl font-semibold text-[color:var(--c-muted)]">
          {initials(h.name)}
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

function Identity({ doc, subtitle, left }: { doc: CardDoc; subtitle: string; left: boolean }) {
  const h = doc.header
  return (
    <div className={`${doc.theme.template === 'split' ? '' : 'mt-4'} ${left ? 'text-left' : 'text-center'}`}>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight">
        {h.name}
        {h.pronouns && (
          <span className="ml-2 align-middle text-sm font-normal text-[color:var(--c-muted)]">({h.pronouns})</span>
        )}
      </h1>
      {subtitle && <p className="mt-1 text-[0.95rem] text-[color:var(--c-muted)]">{subtitle}</p>}
    </div>
  )
}

function WidgetView({
  widget: w,
  doc,
  handle,
  preview,
  rowClass,
}: {
  widget: Widget
  doc: CardDoc
  handle: string
  preview: boolean
  rowClass: string
}) {
  const href = (u: string) => (preview ? undefined : u)
  const external = preview ? {} : { target: '_blank', rel: 'noopener noreferrer' }
  const solid = doc.theme.rows === 'solid'
  const sub = solid ? 'opacity-80' : 'text-[color:var(--c-muted)]'

  switch (w.type) {
    case 'heading':
      return (
        <h2 className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--c-muted)]">{w.text}</h2>
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
                    {item.label && <span className={`block truncate text-xs ${sub}`}>{contactDisplay(item.kind, item.value)}</span>}
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
                    <span className={`block truncate text-xs ${sub}`}>{SOCIAL_LABELS[item.network]}</span>
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
      return (
        <div className="overflow-hidden rounded-[var(--c-radius)] ring-1 ring-[color:var(--c-line)]">
          <Embed src={src} preview={preview} />
        </div>
      )
    }

    case 'form':
      return (
        <LeadFormButton widget={w} handle={handle} ownerName={doc.header.name} preview={preview} className={rowClass} />
      )
  }
}
