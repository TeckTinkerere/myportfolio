'use client'

import { Download, Grid3x3, Redo2, Undo2, ZoomIn, ZoomOut } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { createPrintTag, saveCardDesign, uploadPrintImage } from '@/app/edit/[id]/print/actions'
import { printIssues, textBoxHeight, type PrintIssue } from '@/lib/design/checks'
import { BLEED, cardSize } from '@/lib/design/dimensions'
import type { DesignContext } from '@/lib/design/resolve'
import { designSchema, type DesignDoc, type DesignElement, type DesignSide } from '@/lib/design/schema'
import { applyTemplate, elementId, type Template } from '@/lib/design/templates'

import { DesignCanvas } from './canvas'
import { AddPanel, BackgroundPanel, ElementPanel, IssuesPanel, LayersPanel, TemplatesPanel, useFilePicker, type AddKind } from './panels'
import { SideSvg } from './side-svg'

type SideKey = 'front' | 'back'
const HISTORY_LIMIT = 80
const MAX_PRINT_PX = 2400

/* -------------------------------------------------------------- history */

interface History {
  doc: DesignDoc
  past: DesignDoc[]
  future: DesignDoc[]
  lastKey: string
  lastAt: number
}

type HistoryAction =
  /** A change that is one undo step, or merges into the last one with the same key. */
  | { type: 'commit'; next: DesignDoc; mergeKey?: string; now: number }
  /** A live change during a drag: shown, not yet in history. */
  | { type: 'live'; next: DesignDoc }
  /** A drag ended: record the state before it as one undo step. */
  | { type: 'checkpoint'; before: DesignDoc }
  | { type: 'undo' }
  | { type: 'redo' }

function historyReducer(s: History, a: HistoryAction): History {
  switch (a.type) {
    case 'commit': {
      const merge = a.mergeKey && s.lastKey === a.mergeKey && a.now - s.lastAt < 900
      return {
        doc: a.next,
        past: merge ? s.past : [...s.past.slice(-HISTORY_LIMIT), s.doc],
        future: merge ? s.future : [],
        lastKey: a.mergeKey ?? '',
        lastAt: a.now,
      }
    }
    case 'live':
      return { ...s, doc: a.next }
    case 'checkpoint':
      return { ...s, past: [...s.past.slice(-HISTORY_LIMIT), a.before], future: [], lastKey: '' }
    case 'undo': {
      const prev = s.past.at(-1)
      return prev ? { ...s, doc: prev, past: s.past.slice(0, -1), future: [s.doc, ...s.future], lastKey: '' } : s
    }
    case 'redo': {
      const [next, ...rest] = s.future
      return next ? { ...s, doc: next, past: [...s.past, s.doc], future: rest, lastKey: '' } : s
    }
  }
}

/** Downscale an upload to at most 2400px (≈700 dpi across a card), keeping transparency. */
async function prepareImage(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const iw = img.naturalWidth || 1200
    const ih = img.naturalHeight || 1200
    const scale = Math.min(1, MAX_PRINT_PX / Math.max(iw, ih))
    // Vector logos have no natural pixel limit: render them at full size.
    const vector = file.type === 'image/svg+xml'
    const w = Math.round(vector ? MAX_PRINT_PX * (iw / Math.max(iw, ih)) : iw * scale)
    const h = Math.round(vector ? MAX_PRINT_PX * (ih / Math.max(iw, ih)) : ih * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
    const enc = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q))
    let blob = await enc('image/webp', 0.92)
    if (!blob || blob.type !== 'image/webp') blob = await enc('image/png', 1)
    if (blob && blob.size > 1.9 * 1024 * 1024) blob = (await enc('image/webp', 0.8)) ?? blob
    if (!blob) throw new Error('Could not encode image')
    return { blob, w, h }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function Studio({
  profileId,
  handle,
  initial,
  ctx,
  initialTags,
}: {
  profileId: string
  handle: string
  initial: DesignDoc
  ctx: DesignContext
  initialTags: { id: string; label: string }[]
}) {
  const [history, dispatch] = useReducer(historyReducer, { doc: initial, past: [], future: [], lastKey: '', lastAt: 0 })
  const doc = history.doc
  const [sideKey, setSideKey] = useState<SideKey>('front')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [showGuides, setShowGuides] = useState(true)
  const [tags, setTags] = useState(initialTags)
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [cropMarks, setCropMarks] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const [stageWidth, setStageWidth] = useState(800)

  const side = doc[sideKey]
  const selected = side.elements.find((e) => e.id === selectedId) ?? null
  const { w, h } = cardSize(doc.orientation)
  const json = JSON.stringify(doc)
  const dirty = json !== savedJson
  const issues = useMemo(() => printIssues(doc, ctx), [doc, ctx])

  // Fit the card to the stage width; zoom multiplies on top.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const fit = Math.max(2, Math.min(9, (stageWidth - 48) / (w + BLEED * 2)))
  const scale = fit * zoom

  /* ------------------------------------------------------------ history */

  const commit = useCallback((next: DesignDoc, mergeKey?: string) => dispatch({ type: 'commit', next, mergeKey, now: Date.now() }), [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const redo = useCallback(() => dispatch({ type: 'redo' }), [])

  const updateSide = useCallback(
    (fn: (s: DesignSide) => DesignSide, mergeKey?: string) => commit({ ...doc, [sideKey]: fn(doc[sideKey]) }, mergeKey),
    [commit, doc, sideKey],
  )

  const updateElement = useCallback(
    (id: string, patch: Partial<DesignElement>, mergeKey?: string) =>
      updateSide(
        (s) => ({
          ...s,
          elements: s.elements.map((e) => {
            if (e.id !== id) return e
            const next = { ...e, ...patch } as DesignElement
            // Text boxes grow and shrink with their type size and lines.
            if (next.type === 'text' && ('size' in patch || 'lineHeight' in patch || 'text' in patch || 'binding' in patch)) {
              next.h = Math.round(textBoxHeight(next.size, next.lineHeight, Math.max(1, next.text.split('\n').length)) * 10) / 10
            }
            return next
          }),
        }),
        mergeKey,
      ),
    [updateSide],
  )

  /* ------------------------------------------------------------- autosave */

  useEffect(() => {
    if (!dirty) return
    const sending = json
    const timer = setTimeout(async () => {
      const parsed = designSchema.safeParse(JSON.parse(sending))
      if (!parsed.success) {
        setError(`Not saved: ${parsed.error.issues[0]?.message}`)
        return
      }
      setSaving(true)
      const res = await saveCardDesign(profileId, parsed.data)
      setSaving(false)
      if (res.ok) {
        setSavedJson(sending)
        setError(null)
      } else setError(res.error)
    }, 1000)
    return () => clearTimeout(timer)
  }, [json, dirty, profileId])

  /* ------------------------------------------------------------ actions */

  const centre = (ew: number, eh: number) => ({ x: Math.round(((w - ew) / 2) * 10) / 10, y: Math.round(((h - eh) / 2) * 10) / 10 })

  function addElement(el: DesignElement) {
    updateSide((s) => ({ ...s, elements: [...s.elements, el] }))
    setSelectedId(el.id)
  }

  const base = { rotation: 0, hidden: false, locked: false }

  async function uploadInto(file: File, apply: (url: string, w: number, h: number) => void) {
    setBusy('Uploading image…')
    try {
      const prepared = await prepareImage(file)
      const form = new FormData()
      form.set('file', prepared.blob, 'print')
      const res = await uploadPrintImage(profileId, form)
      if (res.ok) apply(res.url, prepared.w, prepared.h)
      else setError(res.error)
    } catch {
      setError('That image could not be read. Try a PNG, JPEG or SVG.')
    } finally {
      setBusy(null)
    }
  }

  const newImage = useFilePicker((file) =>
    uploadInto(file, (url, pw, ph) => {
      const ew = 30
      const eh = Math.round((ew * ph) / pw * 10) / 10
      addElement({ ...base, id: elementId(), type: 'image', src: url, fit: 'contain', radius: 0, opacity: 1, naturalW: pw, naturalH: ph, w: ew, h: eh, ...centre(ew, eh) })
    }),
  )
  const replaceImage = useFilePicker((file) =>
    uploadInto(file, (url, pw, ph) => {
      if (selected?.type === 'image') updateElement(selected.id, { src: url, naturalW: pw, naturalH: ph } as Partial<DesignElement>)
    }),
  )
  const backgroundImage = useFilePicker((file) =>
    uploadInto(file, (url) => updateSide((s) => ({ ...s, background: { ...s.background, kind: 'image', image: url } }))),
  )

  function onAdd(kind: AddKind) {
    const id = elementId()
    const dark = side.background.kind !== 'image' && isDark(side.background.color) && doc.material === 'pvc'
    const ink = dark ? '#ffffff' : '#111111'
    switch (kind) {
      case 'image':
        return newImage.open()
      case 'qr':
        return addElement({ ...base, id, type: 'qr', target: 'card', tagId: null, url: '', color: '#111111', background: dark ? '#ffffff' : null, w: 20, h: 20, ...centre(20, 20) })
      case 'nfc':
        return addElement({ ...base, id, type: 'icon', icon: 'nfc', color: ink, w: 6, h: 6, ...centre(6, 6) })
      case 'rect':
        return addElement({ ...base, id, type: 'shape', shape: 'rect', fill: '#2563eb', stroke: null, strokeWidth: 0.3, radius: 1, opacity: 1, w: 30, h: 15, ...centre(30, 15) })
      case 'ellipse':
        return addElement({ ...base, id, type: 'shape', shape: 'ellipse', fill: '#2563eb', stroke: null, strokeWidth: 0.3, radius: 0, opacity: 1, w: 18, h: 18, ...centre(18, 18) })
      case 'line':
        return addElement({ ...base, id, type: 'shape', shape: 'line', fill: ink, stroke: null, strokeWidth: 0.4, radius: 0, opacity: 1, w: 40, h: 1, ...centre(40, 1) })
      default: {
        const binding = kind === 'text' ? null : kind
        const size = binding === 'name' ? 14 : binding === 'title' || binding === 'company' ? 9 : 8
        const eh = textBoxHeight(size)
        addElement({
          ...base, id, type: 'text', text: binding ? '' : 'Your text', binding, font: 'sans', size,
          weight: binding === 'name' ? 600 : 400, italic: false, uppercase: false, letterSpacing: 0, lineHeight: 1.2,
          align: 'left', color: ink, w: 50, h: eh, ...centre(50, eh),
        })
      }
    }
  }

  function elementAction(a: 'delete' | 'duplicate' | 'forward' | 'backward') {
    if (!selected) return
    updateSide((s) => {
      const i = s.elements.findIndex((e) => e.id === selected.id)
      const els = [...s.elements]
      if (a === 'delete') els.splice(i, 1)
      if (a === 'duplicate') {
        const copy = { ...selected, id: elementId(), x: selected.x + 2, y: selected.y + 2 }
        els.splice(i + 1, 0, copy)
        setSelectedId(copy.id)
      }
      if (a === 'forward' && i < els.length - 1) [els[i], els[i + 1]] = [els[i + 1], els[i]]
      if (a === 'backward' && i > 0) [els[i], els[i - 1]] = [els[i - 1], els[i]]
      return { ...s, elements: els }
    })
    if (a === 'delete') setSelectedId(null)
  }

  async function onCreateTag() {
    const res = await createPrintTag(profileId)
    if (!res.ok) return setError(res.error)
    setTags((t) => [...t, { id: res.id, label: 'Printed card' }])
    if (selected?.type === 'qr') updateElement(selected.id, { target: 'tag', tagId: res.id } as Partial<DesignElement>)
  }

  function pickTemplate(t: Template) {
    const hasContent = doc.front.elements.length + doc.back.elements.length > 0
    if (hasContent && !window.confirm(`Replace both sides with “${t.name}”? You can undo this.`)) return
    commit(applyTemplate(t))
    setSelectedId(null)
    setSideKey('front')
  }

  async function runExport(kind: 'pdf' | 'png' | 'svg') {
    setExportOpen(false)
    setBusy(kind === 'pdf' ? 'Building print PDF…' : 'Exporting…')
    try {
      const ex = await import('./export')
      const name = `card-${handle}`
      if (kind === 'pdf') await ex.exportPdf(doc, ctx, name, cropMarks)
      if (kind === 'png') await ex.exportPng(doc, ctx, name)
      if (kind === 'svg') await ex.exportSvg(doc, ctx, name)
    } catch (err) {
      console.error(err)
      setError('Export failed. Try again, or try another format.')
    } finally {
      setBusy(null)
    }
  }

  /* ------------------------------------------------------------ keyboard */

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        return redo()
      }
      if (!selected) return
      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        return elementAction('duplicate')
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        return elementAction('delete')
      }
      if (e.key === 'Escape') return setSelectedId(null)
      const step = e.shiftKey ? 2 : 0.5
      const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
      const mv = moves[e.key]
      if (mv && !selected.locked) {
        e.preventDefault()
        updateElement(selected.id, { x: Math.round((selected.x + mv[0]) * 10) / 10, y: Math.round((selected.y + mv[1]) * 10) / 10 }, `nudge-${selected.id}`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* --------------------------------------------------------------- view */

  const status = error ?? (busy ? busy : saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved')

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      {newImage.input}
      {replaceImage.input}
      {backgroundImage.input}

      {/* ------------------------------------------------------- toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-3 py-2">
        <Link href={`/edit/${profileId}`} className="text-sm text-ink-muted hover:text-ink">← Card</Link>
        <span className="mx-1 h-5 w-px bg-border" />
        <div className="inline-flex rounded-md border border-border-strong p-0.5 text-sm" role="tablist">
          {(['front', 'back'] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={sideKey === s}
              onClick={() => {
                setSideKey(s)
                setSelectedId(null)
              }}
              className={`rounded px-3 py-1 capitalize ${sideKey === s ? 'bg-accent text-accent-contrast' : 'text-ink-muted hover:text-ink'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <ToolBtn title="Undo (Ctrl+Z)" onClick={undo} disabled={!history.past.length}><Undo2 className="h-4 w-4" /></ToolBtn>
        <ToolBtn title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!history.future.length}><Redo2 className="h-4 w-4" /></ToolBtn>
        <ToolBtn title="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}><ZoomOut className="h-4 w-4" /></ToolBtn>
        <span className="w-10 text-center text-xs text-ink-muted">{Math.round(zoom * 100)}%</span>
        <ToolBtn title="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}><ZoomIn className="h-4 w-4" /></ToolBtn>
        <ToolBtn title="Print guides" onClick={() => setShowGuides((v) => !v)} active={showGuides}><Grid3x3 className="h-4 w-4" /></ToolBtn>
        <span className={`ml-2 text-xs ${error ? 'text-danger' : 'text-ink-muted'}`} role="status">{status}</span>
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            disabled={busy !== null}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-11 z-30 w-72 rounded-lg border border-border-strong bg-surface p-2 text-sm shadow-xl">
              <button type="button" onClick={() => runExport('pdf')} className="block w-full rounded px-2 py-2 text-left hover:bg-surface-raised">
                <span className="font-medium">Print PDF</span>
                <span className="block text-xs text-ink-muted">Front and back, 600 dpi, 3 mm bleed. Send this to a card printer.</span>
              </button>
              <label className="flex items-center gap-2 px-2 pb-2 text-xs">
                <input type="checkbox" checked={cropMarks} onChange={(e) => setCropMarks(e.target.checked)} className="h-3.5 w-3.5" /> Include crop marks
              </label>
              <button type="button" onClick={() => runExport('png')} className="block w-full rounded px-2 py-2 text-left hover:bg-surface-raised">
                <span className="font-medium">PNG images</span>
                <span className="block text-xs text-ink-muted">One per side, 600 dpi with bleed.</span>
              </button>
              <button type="button" onClick={() => runExport('svg')} className="block w-full rounded px-2 py-2 text-left hover:bg-surface-raised">
                <span className="font-medium">SVG (vector)</span>
                <span className="block text-xs text-ink-muted">Trimmed size. For laser engravers or a designer to adjust.</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* --------------------------------------------------- left panel */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-surface lg:block">
          <AddPanel onAdd={onAdd} />
          <TemplatesPanel ctx={ctx} onPick={pickTemplate} />
        </aside>

        {/* -------------------------------------------------------- stage */}
        <main ref={stage} className="relative min-w-0 flex-1 overflow-auto bg-surface-raised" onPointerDown={(e) => e.target === e.currentTarget && setSelectedId(null)}>
          <div className="flex min-h-full flex-col items-center justify-center gap-6 p-6">
            <DesignCanvas
              doc={doc}
              side={side}
              ctx={ctx}
              scale={scale}
              selectedId={selectedId}
              showGuides={showGuides}
              onSelect={setSelectedId}
              onChange={(el) =>
                dispatch({ type: 'live', next: { ...doc, [sideKey]: { ...side, elements: side.elements.map((e) => (e.id === el.id ? el : e)) } } })
              }
              onCommit={(before) => {
                // Record the pre-drag state as one undo step, if anything moved.
                const now = side.elements.find((e) => e.id === before.id)
                if (now && JSON.stringify(now) !== JSON.stringify(before)) {
                  dispatch({ type: 'checkpoint', before: { ...doc, [sideKey]: { ...side, elements: side.elements.map((e) => (e.id === before.id ? before : e)) } } })
                }
              }}
            />
            {/* The other side, small, to click across. */}
            <button
              type="button"
              onClick={() => {
                setSideKey(sideKey === 'front' ? 'back' : 'front')
                setSelectedId(null)
              }}
              className="flex items-center gap-3 text-xs text-ink-muted hover:text-ink"
            >
              <span className="w-28 overflow-hidden rounded border border-border-strong shadow-sm">
                <SideSvg side={doc[sideKey === 'front' ? 'back' : 'front']} doc={doc} ctx={ctx} mode={doc.material === 'pvc' ? 'color' : 'engrave-preview'} withBleed={false} className="w-full" />
              </span>
              Edit the {sideKey === 'front' ? 'back' : 'front'}
            </button>
            <p className="max-w-md text-center text-xs text-ink-muted">
              Red line: where the card is cut. Blue dashes: keep text inside. Colour past the red line is bleed and gets trimmed off. Drag to move, corners to resize, Alt to turn off snapping, arrows to nudge.
            </p>
          </div>
        </main>

        {/* -------------------------------------------------- right panel */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-surface">
          {selected ? (
            <ElementPanel
              key={selected.id}
              el={selected}
              ctx={ctx}
              tags={tags}
              onChange={(patch) => updateElement(selected.id, patch, `${selected.id}-${Object.keys(patch).join()}`)}
              onAction={elementAction}
              onUploadImage={replaceImage.open}
              onCreateTag={onCreateTag}
            />
          ) : (
            <BackgroundPanel
              doc={doc}
              side={side}
              onSide={(patch) => updateSide((s) => ({ ...s, background: { ...s.background, ...patch } }), `bg-${Object.keys(patch).join()}`)}
              onDoc={(patch) => commit({ ...doc, ...patch })}
              onUploadBackground={backgroundImage.open}
            />
          )}
          <div className="lg:hidden">
            <AddPanel onAdd={onAdd} />
          </div>
          <LayersPanel
            side={side}
            ctx={ctx}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggle={(id, key) => {
              const el = side.elements.find((e) => e.id === id)
              if (el) updateElement(id, { [key]: !el[key] } as Partial<DesignElement>)
            }}
          />
          <IssuesPanel
            issues={issues}
            onPick={(i: PrintIssue) => {
              setSideKey(i.side)
              setSelectedId(i.elementId)
            }}
          />
          <div className="lg:hidden">
            <TemplatesPanel ctx={ctx} onPick={pickTemplate} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function ToolBtn({ title, onClick, disabled, active, children }: { title: string; onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-md hover:bg-surface-raised disabled:opacity-40 ${active ? 'bg-surface-raised text-accent' : 'text-ink-muted'}`}
    >
      {children}
    </button>
  )
}

function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16)
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 140
}
