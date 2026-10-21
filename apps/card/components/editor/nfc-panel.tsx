'use client'

import { Copy, Lock, Nfc, ScanLine, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'

import { createCardTag, lookupTag, removeCardTag, type TagLookup } from '@/app/edit/[id]/nfc/actions'
import { classifyUrl, decodeRecord, nfcErrorMessage, type DecodedRecord } from '@/lib/card/ndef'

import { inputClass, Panel } from './fields'

interface Tag {
  id: string
  label: string
}

type Busy = null | 'write' | 'read' | 'lock'

interface ReadResult {
  serial: string
  records: DecodedRecord[]
  verdict: string
}

/** How long to wait for a tag before giving up. */
const TIMEOUT_MS = 30_000

export function NfcPanel({
  profileId,
  handle,
  siteUrl,
  tags,
}: {
  profileId: string
  handle: string
  siteUrl: string
  tags: Tag[]
}) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [busy, setBusy] = useState<Busy>(null)
  const [status, setStatus] = useState<{ tone: 'info' | 'ok' | 'error'; text: string } | null>(null)
  const [choice, setChoice] = useState<string>(tags[0]?.id ?? 'new')
  const [label, setLabel] = useState('')
  const [read, setRead] = useState<ReadResult | null>(null)
  const [lockConfirm, setLockConfirm] = useState('')
  const [, startTransition] = useTransition()
  const abort = useRef<AbortController | null>(null)
  // Set when an operation is aborted by the 30-second timer rather than by
  // success or Cancel, so the message can say what actually happened.
  const timedOut = useRef(false)

  useEffect(() => {
    // Feature detection has to run in the browser; the server cannot know.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof window !== 'undefined' && 'NDEFReader' in window)
    return () => abort.current?.abort()
  }, [])

  const tagUrl = (id: string) => `${siteUrl}/t/${id}`

  function start(kind: Exclude<Busy, null>) {
    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller
    timedOut.current = false
    const timer = setTimeout(() => {
      timedOut.current = true
      controller.abort()
    }, TIMEOUT_MS)
    controller.signal.addEventListener('abort', () => clearTimeout(timer))
    setBusy(kind)
    return controller
  }

  function stop() {
    abort.current?.abort()
    abort.current = null
    setBusy(null)
  }

  /** The selected tag id, creating a new tag link first if "new" is chosen. */
  async function ensureTag(): Promise<string | null> {
    if (choice !== 'new') return choice
    const res = await createCardTag(profileId, label || `Card for /${handle}`)
    if (!res.ok) {
      setStatus({ tone: 'error', text: res.error })
      return null
    }
    setChoice(res.id)
    setLabel('')
    return res.id
  }

  /** Create a link without writing it: for iPhones and NFC Tools. */
  async function createOnly() {
    const id = await ensureTag()
    if (!id) return
    try {
      await navigator.clipboard?.writeText(tagUrl(id))
    } catch {
      // Clipboard can be refused; the link is listed below either way.
    }
    setStatus({
      tone: 'ok',
      text: `Link created and copied: ${tagUrl(id).replace(/^https?:\/\//, '')}. Write it with the NFC Tools app (Write → Add a record → URL).`,
    })
  }

  async function write() {
    setRead(null)
    const id = await ensureTag()
    if (!id) return
    const url = tagUrl(id)
    const controller = start('write')
    setStatus({ tone: 'info', text: 'Hold the card flat against the back of your phone…' })
    try {
      const reader = new NDEFReader()
      await reader.write({ records: [{ recordType: 'url', data: url }] }, { overwrite: true, signal: controller.signal })
      setStatus({ tone: 'ok', text: `Written. The card now opens ${url.replace(/^https?:\/\//, '')}. Tap it to test.` })
    } catch (err) {
      setStatus({
        tone: 'error',
        text: timedOut.current ? 'No tag found in 30 seconds. Try again and hold the card still.' : nfcErrorMessage(err),
      })
    } finally {
      stop()
    }
  }

  async function scan() {
    setRead(null)
    const controller = start('read')
    setStatus({ tone: 'info', text: 'Hold a card against the back of your phone to read it…' })
    try {
      const reader = new NDEFReader()
      reader.onreading = (event) => {
        controller.abort()
        const records = event.message.records.map(decodeRecord)
        const url = records.find((r) => r.type === 'URL')?.value
        const target = url ? classifyUrl(url, siteUrl) : { kind: 'other' as const }

        const finish = (verdict: string) => {
          setRead({ serial: event.serialNumber || 'not reported', records, verdict })
          setStatus(null)
          setBusy(null)
        }

        if (records.length === 0) return finish('The tag is empty. You can write this card to it.')
        if (target.kind === 'handle') return finish(`Opens the card /${target.handle} directly (not through a tag link).`)
        if (target.kind === 'other') return finish('This tag points somewhere else, not to a card on this site.')

        startTransition(async () => {
          const result: TagLookup = await lookupTag(profileId, target.id)
          const verdicts: Record<TagLookup['kind'], string> = {
            'this-card': 'This tag opens this card.',
            'your-card': result.kind === 'your-card' ? `This tag opens another of your cards: /${result.handle}.` : '',
            unassigned: 'This tag is not linked to any card yet.',
            'someone-else': "This tag belongs to someone else's card.",
            unknown: 'This tag link is not one this site knows about.',
          }
          finish(verdicts[result.kind])
        })
      }
      reader.onreadingerror = () => {
        setStatus({ tone: 'error', text: 'Could not read that tag. It may be empty, damaged or in an unsupported format.' })
      }
      controller.signal.addEventListener('abort', () => {
        // Success aborts too (to stop scanning); only a timeout is an error.
        if (!timedOut.current) return
        setBusy(null)
        setStatus({ tone: 'error', text: 'No tag found in 30 seconds. Try again and hold the card still.' })
      })
      await reader.scan({ signal: controller.signal })
    } catch (err) {
      setStatus({ tone: 'error', text: nfcErrorMessage(err) })
      stop()
    }
  }

  async function lock() {
    const controller = start('lock')
    setStatus({ tone: 'info', text: 'Hold the card you want to lock against your phone…' })
    try {
      await new NDEFReader().makeReadOnly({ signal: controller.signal })
      setStatus({ tone: 'ok', text: 'Locked. This tag can never be rewritten.' })
      setLockConfirm('')
    } catch (err) {
      setStatus({ tone: 'error', text: timedOut.current ? 'No tag found in 30 seconds.' : nfcErrorMessage(err) })
    } finally {
      stop()
    }
  }

  const statusClass = {
    info: 'border-accent/40 bg-accent/10',
    ok: 'border-success/40 bg-success/10 text-success',
    error: 'border-danger/40 bg-danger/10 text-danger',
  }

  return (
    <div className="mt-8 space-y-5">
      {supported === false && (
        <div className="rounded-lg border border-border-strong bg-surface p-4 text-sm">
          <p className="font-medium">This browser can&rsquo;t use NFC.</p>
          <p className="mt-1 text-ink-muted">
            Reading and writing here needs <strong>Chrome on an Android phone</strong>. On an iPhone, or as a
            fallback, use the free <strong>NFC Tools</strong> app: Write → Add a record → URL → paste a tag link from
            below → Write.
          </p>
        </div>
      )}

      {status && (
        <p role="status" aria-live="polite" className={`rounded-md border px-3 py-2 text-sm ${statusClass[status.tone]}`}>
          {status.text}
        </p>
      )}

      <Panel title="Write this card to a tag" description="Overwrites whatever the tag holds now.">
        <fieldset className="space-y-2 text-sm">
          <legend className="sr-only">Which tag link to write</legend>
          {tags.map((t) => (
            <label key={t.id} className="flex items-center gap-2">
              <input type="radio" name="tag" checked={choice === t.id} onChange={() => setChoice(t.id)} className="h-4 w-4" />
              <span>{t.label || 'Untitled tag'}</span>
              <span className="font-mono text-xs text-ink-muted">/t/{t.id}</span>
            </label>
          ))}
          <label className="flex items-center gap-2">
            <input type="radio" name="tag" checked={choice === 'new'} onChange={() => setChoice('new')} className="h-4 w-4" />
            <span>A new tag link</span>
          </label>
          {choice === 'new' && (
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={60}
              placeholder="Label, e.g. Metal card"
              className={`${inputClass} ml-6 w-[calc(100%-1.5rem)]`}
            />
          )}
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={write}
            disabled={!supported || busy !== null}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-50"
          >
            <Nfc className="h-4 w-4" aria-hidden />
            {busy === 'write' ? 'Waiting for tag…' : 'Write to tag'}
          </button>
          {choice === 'new' && (
            <button
              type="button"
              onClick={createOnly}
              disabled={busy !== null}
              className={`h-10 rounded-md px-4 text-sm font-medium disabled:opacity-50 ${supported ? 'border border-border-strong hover:bg-surface-raised' : 'bg-accent font-semibold text-accent-contrast hover:opacity-90'}`}
            >
              Create link only
            </button>
          )}
          {busy && (
            <button type="button" onClick={stop} className="h-10 rounded-md border border-border-strong px-3 text-sm">
              Cancel
            </button>
          )}
        </div>
      </Panel>

      <Panel title="Read a tag" description="Check what a card holds, for example whether your old card can be rewritten.">
        <button
          type="button"
          onClick={scan}
          disabled={!supported || busy !== null}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium hover:bg-surface-raised disabled:opacity-50"
        >
          <ScanLine className="h-4 w-4" aria-hidden />
          {busy === 'read' ? 'Waiting for tag…' : 'Scan a tag'}
        </button>
        {read && (
          <div className="rounded-md border border-border-strong bg-background p-3 text-sm">
            <p className="font-medium">{read.verdict}</p>
            <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1">
              <dt className="text-ink-muted">Serial</dt>
              <dd className="font-mono text-xs">{read.serial}</dd>
              {read.records.map((r, i) => (
                <div key={i} className="contents">
                  <dt className="text-ink-muted">{r.type}</dt>
                  <dd className="break-all font-mono text-xs">{r.value || '—'}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-ink-muted">
              To check if a tag is locked, try writing to it: a locked tag refuses the write.
            </p>
          </div>
        )}
      </Panel>

      <Panel title="Tag links for this card" description="Each link can be written to one or more physical cards.">
        {tags.length === 0 ? (
          <p className="text-sm text-ink-muted">None yet. Writing &ldquo;A new tag link&rdquo; above creates one.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {tags.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="min-w-0">
                  <span className="block">{t.label || 'Untitled tag'}</span>
                  <span className="block break-all font-mono text-xs text-ink-muted">{tagUrl(t.id)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(tagUrl(t.id))}
                    className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:text-ink"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this tag link? Cards written with it will open the "not set up" page.')) {
                        startTransition(() => removeCardTag(profileId, t.id))
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:text-danger"
                    aria-label="Delete tag link"
                    title="Delete tag link"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <details className="rounded-lg border border-danger/50 p-5">
        <summary className="cursor-pointer font-semibold text-danger">Lock a tag (permanent)</summary>
        <div className="mt-3 space-y-3 text-sm">
          <p className="text-ink-muted">
            Locking stops anyone rewriting the tag, including you. It can never be undone. You rarely need this:
            because the tag holds a link, you can already change which card it opens without rewriting it.
          </p>
          <label className="block">
            Type <span className="font-mono">LOCK</span> to enable
            <input value={lockConfirm} onChange={(e) => setLockConfirm(e.target.value)} className={`${inputClass} mt-1 w-40 font-mono`} />
          </label>
          <button
            type="button"
            onClick={lock}
            disabled={!supported || busy !== null || lockConfirm !== 'LOCK'}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-danger px-4 font-semibold text-white disabled:opacity-50"
          >
            <Lock className="h-4 w-4" aria-hidden />
            {busy === 'lock' ? 'Waiting for tag…' : 'Lock tag'}
          </button>
        </div>
      </details>
    </div>
  )
}
