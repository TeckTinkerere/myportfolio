'use client'

import { ExternalLink, IdCard, Nfc, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { deleteCard, publishCard, renameCard, saveCard, unpublishCard } from '@/app/edit/actions'
import { CardView } from '@/components/card/card-view'
import { handleProblem, normaliseHandle } from '@/lib/card/handles'
import { describeIssue } from '@/lib/card/issues'
import { cardSchema, LANGUAGES, QUICK_ACTIONS, type CardDoc, type QuickAction } from '@/lib/card/schema'

import { BlocksPanel } from './blocks-panel'
import { Field, inputClass, Panel, TextInput, Toggle } from './fields'
import { ImageField } from './image-field'
import { SaveButtonPanel } from './save-button-panel'
import { StylePanel } from './style-panel'

type Tab = 'profile' | 'blocks' | 'style' | 'settings'
type SaveState = 'saved' | 'saving' | 'pending' | 'invalid' | 'error'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'style', label: 'Style' },
  { id: 'settings', label: 'Settings' },
]

const LANGUAGE_LABELS: Record<(typeof LANGUAGES)[number], string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  ta: 'தமிழ் (Tamil)',
  zh: '中文 (Chinese)',
}

const QUICK_LABELS: Record<QuickAction, string> = { call: 'Call', email: 'Email', whatsapp: 'WhatsApp', share: 'Share' }

export function Builder({
  id,
  initialHandle,
  initialDoc,
  initialUnpublished,
  isPublished: initiallyPublished,
  siteUrl,
  deleteMismatch,
}: {
  id: string
  initialHandle: string
  initialDoc: CardDoc
  initialUnpublished: boolean
  isPublished: boolean
  siteUrl: string
  deleteMismatch: boolean
}) {
  const [doc, setDoc] = useState(initialDoc)
  const [handle, setHandle] = useState(initialHandle)
  const [tab, setTab] = useState<Tab>(deleteMismatch ? 'settings' : 'profile')
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialDoc))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [unpublished, setUnpublished] = useState(initialUnpublished)
  const [published, setPublished] = useState(initiallyPublished)
  const [showPreview, setShowPreview] = useState(false)
  const [publishing, startPublish] = useTransition()

  const json = JSON.stringify(doc)
  const parsed = useMemo(() => cardSchema.safeParse(doc), [doc])
  const dirty = json !== savedJson
  const invalid = parsed.success ? null : describeIssue(parsed.error, doc)

  // Derived, not stored: the status is whatever the document and the last
  // save say it is right now.
  const save: SaveState = invalid ? 'invalid' : saving ? 'saving' : saveError ? 'error' : dirty ? 'pending' : 'saved'
  const message = invalid ?? saveError ?? actionError

  // ------------------------------------------------------------ autosave
  // Debounced: typing a sentence is one save, not forty. Invalid documents
  // are not sent; the problem is shown instead.
  useEffect(() => {
    const data = parsed.data
    if (!dirty || !data) return
    const sending = json
    const timer = setTimeout(async () => {
      setSaving(true)
      const res = await saveCard(id, data)
      setSaving(false)
      if (res.ok) {
        setSavedJson(sending)
        setSaveError(null)
        setUnpublished(true)
      } else {
        setSaveError(res.error)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [json, dirty, parsed, id])

  // Warn before leaving with an unsaved edit.
  useEffect(() => {
    const dirty = save === 'pending' || save === 'saving' || save === 'invalid' || save === 'error'
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [save])

  function mutate(fn: (d: CardDoc) => void) {
    setDoc((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
  }

  function publish() {
    startPublish(async () => {
      if (!parsed.success) return
      if (dirty) {
        const res = await saveCard(id, parsed.data)
        if (!res.ok) {
          setSaveError(res.error)
          return
        }
        setSavedJson(json)
        setSaveError(null)
      }
      const res = await publishCard(id)
      if (res.ok) {
        setUnpublished(false)
        setPublished(true)
        setActionError(null)
      } else {
        setActionError(res.error)
      }
    })
  }

  const cardUrl = `${siteUrl}/${handle}`
  const h = doc.header
  const statusText = {
    saved: unpublished ? (published ? 'Saved. Not live yet' : 'Saved as draft') : 'Saved and live',
    pending: 'Unsaved changes',
    saving: 'Saving…',
    invalid: 'Fix to save',
    error: 'Save failed',
  }[save]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {/* --------------------------------------------------------- top bar */}
      <div className="sticky top-14 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate font-semibold">{h.name || 'Untitled card'}</p>
          <p className="truncate font-mono text-xs text-ink-muted">
            {cardUrl.replace(/^https?:\/\//, '')}
            {' · '}
            <span className={save === 'invalid' || save === 'error' ? 'text-danger' : ''}>{statusText}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm lg:hidden"
          >
            <Smartphone className="h-4 w-4" aria-hidden />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <Link
            href={`/edit/${id}/print`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm hover:bg-surface-raised"
          >
            <IdCard className="h-4 w-4" aria-hidden />
            Print design
          </Link>
          <Link
            href={`/edit/${id}/nfc`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm hover:bg-surface-raised"
          >
            <Nfc className="h-4 w-4" aria-hidden />
            NFC
          </Link>
          {published && (
            <a
              href={`/${handle}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm hover:bg-surface-raised sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View live
            </a>
          )}
          <button
            type="button"
            onClick={publish}
            disabled={publishing || save === 'invalid' || (!unpublished && save === 'saved')}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:opacity-90 disabled:opacity-50"
          >
            {publishing ? 'Publishing…' : published ? 'Publish changes' : 'Publish'}
          </button>
        </div>
        {message && (
          <p role="alert" className="w-full text-sm text-danger">
            {message}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* -------------------------------------------------------- editor */}
        <div className={showPreview ? 'hidden lg:block' : ''}>
          <div role="tablist" className="mb-5 flex gap-1 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${tab === t.id ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <div className="space-y-5">
              <Panel title="Images">
                <ImageField cardId={id} kind="photo" value={h.photo} onChange={(v) => mutate((d) => void (d.header.photo = v))} />
                <ImageField cardId={id} kind="banner" value={h.banner} onChange={(v) => mutate((d) => void (d.header.banner = v))} />
                <ImageField cardId={id} kind="logo" value={h.logo} onChange={(v) => mutate((d) => void (d.header.logo = v))} />
              </Panel>

              <Panel title="About you">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <TextInput value={h.name} maxLength={80} onChange={(v) => mutate((d) => void (d.header.name = v))} />
                  </Field>
                  <Field label="Pronouns" hint="Optional">
                    <TextInput value={h.pronouns} maxLength={30} placeholder="he/him" onChange={(v) => mutate((d) => void (d.header.pronouns = v))} />
                  </Field>
                  <Field label="Title">
                    <TextInput value={h.title} maxLength={80} placeholder="Founder" onChange={(v) => mutate((d) => void (d.header.title = v))} />
                  </Field>
                  <Field label="Company">
                    <TextInput value={h.company} maxLength={80} onChange={(v) => mutate((d) => void (d.header.company = v))} />
                  </Field>
                </div>
              </Panel>

              <Panel title="Main contact" description="Used by the quick-action buttons and saved into the contact file.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone">
                    <TextInput value={h.phone} type="tel" maxLength={40} placeholder="+65 9123 4567" onChange={(v) => mutate((d) => void (d.header.phone = v))} />
                  </Field>
                  <Field label="Email">
                    <TextInput value={h.email} type="email" maxLength={200} onChange={(v) => mutate((d) => void (d.header.email = v))} />
                  </Field>
                  <Field label="Website">
                    <TextInput value={h.website} type="url" maxLength={500} placeholder="https://mohdaslam.dev" onChange={(v) => mutate((d) => void (d.header.website = v))} />
                  </Field>
                  <Field label="Address" hint="Saved to the contact only, not shown.">
                    <TextInput value={h.address} maxLength={200} onChange={(v) => mutate((d) => void (d.header.address = v))} />
                  </Field>
                  <Field label="WhatsApp number" hint="Only if different from your phone.">
                    <TextInput value={h.whatsapp} type="tel" maxLength={40} placeholder={h.phone || '+65 9123 4567'} onChange={(v) => mutate((d) => void (d.header.whatsapp = v))} />
                  </Field>
                </div>
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium">Quick-action buttons</legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {QUICK_ACTIONS.map((a) => (
                      <Toggle
                        key={a}
                        label={QUICK_LABELS[a]}
                        checked={h.quickActions.includes(a)}
                        onChange={(on) =>
                          mutate((d) => {
                            const set = new Set(d.header.quickActions)
                            if (on) set.add(a)
                            else set.delete(a)
                            d.header.quickActions = QUICK_ACTIONS.filter((q) => set.has(q))
                          })
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </Panel>

              <SaveButtonPanel doc={doc} mutate={mutate} />
            </div>
          )}

          {tab === 'blocks' && <BlocksPanel widgets={doc.widgets} onChange={(w) => mutate((d) => void (d.widgets = w))} />}

          {tab === 'style' && <StylePanel cardId={id} doc={doc} mutate={mutate} />}

          {tab === 'settings' && (
            <SettingsTab
              id={id}
              doc={doc}
              handle={handle}
              siteUrl={siteUrl}
              published={published}
              deleteMismatch={deleteMismatch}
              onHandle={setHandle}
              onUnpublished={() => {
                setPublished(false)
                setUnpublished(true)
              }}
              mutate={mutate}
            />
          )}
        </div>

        {/* ------------------------------------------------------- preview */}
        <div className={showPreview ? '' : 'hidden lg:block'}>
          <div className="sticky top-32">
            <div className="mx-auto w-[min(375px,100%)] overflow-hidden rounded-[2.25rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl">
              <div className="h-[min(720px,calc(100dvh-11rem))] overflow-y-auto">
                <CardView doc={doc} handle={handle} url={cardUrl} preview />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-muted">Live preview. Links and the form are off here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsTab({
  id,
  doc,
  handle,
  siteUrl,
  published,
  deleteMismatch,
  onHandle,
  onUnpublished,
  mutate,
}: {
  id: string
  doc: CardDoc
  handle: string
  siteUrl: string
  published: boolean
  deleteMismatch: boolean
  onHandle: (h: string) => void
  onUnpublished: () => void
  mutate: (fn: (d: CardDoc) => void) => void
}) {
  const [draftHandle, setDraftHandle] = useState(handle)
  const [handleMsg, setHandleMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const problem = draftHandle !== handle ? handleProblem(draftHandle) : null
  const host = siteUrl.replace(/^https?:\/\//, '')

  return (
    <div className="space-y-5">
      <Panel title="Link" description="Changing it breaks old links and printed QR codes. NFC tags keep working.">
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1 text-sm">
            <span className="mb-1.5 block font-medium">Card address</span>
            <span className="flex items-center rounded-md border border-border-strong bg-background focus-within:border-accent">
              <span className="pl-3 font-mono text-xs text-ink-muted">{host}/</span>
              <input
                value={draftHandle}
                onChange={(e) => setDraftHandle(normaliseHandle(e.target.value))}
                className="w-full bg-transparent px-1 py-2 font-mono text-sm outline-none"
              />
            </span>
          </label>
          <button
            type="button"
            disabled={pending || draftHandle === handle || Boolean(problem)}
            onClick={() =>
              start(async () => {
                const res = await renameCard(id, draftHandle)
                if (res.ok) {
                  onHandle(res.handle)
                  setHandleMsg('Saved.')
                } else setHandleMsg(res.error)
              })
            }
            className="h-10 rounded-md border border-border-strong px-3 text-sm hover:bg-surface-raised disabled:opacity-50"
          >
            Change
          </button>
        </div>
        {(problem || handleMsg) && <p className={`text-xs ${problem ? 'text-danger' : 'text-ink-muted'}`}>{problem ?? handleMsg}</p>}
      </Panel>

      <Panel title="Language" description="The language your card is written in. Screen readers use it to pronounce your text correctly.">
        <select
          value={doc.meta.lang}
          onChange={(e) => mutate((d) => void (d.meta.lang = e.target.value as CardDoc['meta']['lang']))}
          className={`${inputClass} max-w-xs`}
          aria-label="Card language"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </option>
          ))}
        </select>
      </Panel>

      <Panel title="Link preview and search" description="How the card looks when its link is shared in chat apps.">
        <Field label="Title" hint="Defaults to your name and title.">
          <TextInput value={doc.meta.title} maxLength={70} onChange={(v) => mutate((d) => void (d.meta.title = v))} />
        </Field>
        <Field label="Description" hint={`${doc.meta.description.length}/160`}>
          <textarea
            value={doc.meta.description}
            maxLength={160}
            rows={2}
            onChange={(e) => mutate((d) => void (d.meta.description = e.target.value))}
            className={inputClass}
          />
        </Field>
        <Toggle
          label="Let search engines list this card"
          checked={!doc.meta.noindex}
          onChange={(v) => mutate((d) => void (d.meta.noindex = !v))}
        />
      </Panel>

      <Panel title="Your data">
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={`/edit/${id}/inbox`} className="text-accent underline-offset-4 hover:underline">
            Contact-form inbox
          </Link>
          <a href={`/edit/${id}/export`} className="text-accent underline-offset-4 hover:underline">
            Download everything (JSON)
          </a>
        </div>
        {published && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                if (!window.confirm('Take this card offline? Taps and links will show "No card here" until you publish again.')) return
                const res = await unpublishCard(id)
                if (res.ok) onUnpublished()
              })
            }
            className="rounded-md border border-border-strong px-3 py-2 text-sm hover:bg-surface-raised"
          >
            Unpublish
          </button>
        )}
      </Panel>

      <section className="rounded-lg border border-danger/50 p-5">
        <h2 className="font-semibold text-danger">Delete card</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Deletes the card and every contact-form submission to it. This cannot be undone.
        </p>
        <form action={deleteCard.bind(null, id)} className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1.5 block">
              Type <span className="font-mono">{handle}</span> to confirm
            </span>
            <input name="confirm" autoComplete="off" className={`${inputClass} w-56 font-mono`} />
          </label>
          <button className="h-10 rounded-md bg-danger px-3 text-sm font-semibold text-white hover:opacity-90">Delete</button>
        </form>
        {deleteMismatch && <p className="mt-2 text-sm text-danger">That didn&rsquo;t match the card&rsquo;s link.</p>}
      </section>
    </div>
  )
}
