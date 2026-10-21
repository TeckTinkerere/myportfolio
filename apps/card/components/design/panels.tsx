'use client'

import {
  ArrowDown,
  ArrowUp,
  Circle,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  Minus,
  QrCode,
  Square,
  Trash2,
  Type,
  Unlock,
} from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

import { ColorInput, inputClass } from '@/components/editor/fields'
import type { PrintIssue } from '@/lib/design/checks'
import { BINDING_LABELS, elementText, type DesignContext } from '@/lib/design/resolve'
import {
  BINDINGS,
  DESIGN_FONTS,
  ICONS,
  type Binding,
  type DesignDoc,
  type DesignElement,
  type DesignSide,
  type ElementOf,
} from '@/lib/design/schema'
import { TEMPLATES, type Template } from '@/lib/design/templates'

import { ICON_COMPONENTS, SideSvg } from './side-svg'

/* ------------------------------------------------------------------ bits */

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="border-b border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Num({
  label,
  value,
  onChange,
  step = 0.5,
  min,
  max,
  unit = 'mm',
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-ink-muted">
        {label} <span className="opacity-60">{unit}</span>
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? Math.round(value * 100) / 100 : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (Number.isFinite(v)) onChange(v)
        }}
        className={`${inputClass} px-2 py-1.5`}
      />
    </label>
  )
}

function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-ink-muted">{label}</span>
      <select
        value={String(value)}
        onChange={(e) => {
          const hit = options.find((o) => String(o.value) === e.target.value)
          if (hit) onChange(hit.value)
        }}
        className={`${inputClass} px-2 py-1.5`}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  )
}

/** Colour or "none", for fills and QR backing plates. */
function OptionalColour({ label, value, onChange, fallback }: { label: string; value: string | null; onChange: (v: string | null) => void; fallback: string }) {
  return (
    <div className="space-y-1.5">
      <Check label={`${label}`} checked={value !== null} onChange={(on) => onChange(on ? fallback : null)} />
      {value !== null && <ColorInput label="" value={value} onChange={onChange} />}
    </div>
  )
}

const FONT_LABELS: Record<(typeof DESIGN_FONTS)[number], string> = {
  sans: 'Modern sans',
  serif: 'Serif',
  rounded: 'Rounded',
  mono: 'Mono',
  display: 'Display',
}

/* ---------------------------------------------------------- properties */

export function ElementPanel({
  el,
  ctx,
  tags,
  onChange,
  onAction,
  onUploadImage,
  onCreateTag,
}: {
  el: DesignElement
  ctx: DesignContext
  tags: { id: string; label: string }[]
  onChange: (patch: Partial<DesignElement>) => void
  onAction: (a: 'delete' | 'duplicate' | 'forward' | 'backward') => void
  onUploadImage: () => void
  onCreateTag: () => Promise<void>
}) {
  const set = onChange as (p: Record<string, unknown>) => void

  return (
    <>
      <Section
        title={{ text: 'Text', image: 'Image', qr: 'QR code', shape: 'Shape', icon: 'Icon' }[el.type]}
        action={
          <div className="flex gap-1">
            <IconBtn title="Bring forward" onClick={() => onAction('forward')}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn title="Send backward" onClick={() => onAction('backward')}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn title="Duplicate (Ctrl+D)" onClick={() => onAction('duplicate')}><Copy className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn title="Delete (Del)" onClick={() => onAction('delete')} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
          </div>
        }
      >
        {el.type === 'text' && <TextProps el={el} ctx={ctx} set={set} />}
        {el.type === 'image' && (
          <>
            <button type="button" onClick={onUploadImage} className={`${inputClass} flex items-center justify-center gap-2`}>
              <ImagePlus className="h-4 w-4" /> Replace image
            </button>
            <Select label="Fit" value={el.fit} options={[{ value: 'contain', label: 'Show whole image' }, { value: 'cover', label: 'Fill the box' }]} onChange={(v) => set({ fit: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Num label="Corner radius" value={el.radius} onChange={(v) => set({ radius: v })} />
              <Num label="Opacity" unit="%" value={el.opacity * 100} step={5} min={10} max={100} onChange={(v) => set({ opacity: Math.min(1, Math.max(0.1, v / 100)) })} />
            </div>
          </>
        )}
        {el.type === 'qr' && <QrProps el={el} tags={tags} set={set} onCreateTag={onCreateTag} />}
        {el.type === 'shape' && (
          <>
            <Select label="Shape" value={el.shape} options={[{ value: 'rect', label: 'Rectangle' }, { value: 'ellipse', label: 'Ellipse' }, { value: 'line', label: 'Line' }]} onChange={(v) => set({ shape: v })} />
            <OptionalColour label="Fill" value={el.fill} fallback="#111111" onChange={(v) => set({ fill: v })} />
            <OptionalColour label="Outline" value={el.stroke} fallback="#111111" onChange={(v) => set({ stroke: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Num label="Outline width" value={el.strokeWidth} step={0.1} onChange={(v) => set({ strokeWidth: v })} />
              {el.shape === 'rect' && <Num label="Corner radius" value={el.radius} onChange={(v) => set({ radius: v })} />}
              <Num label="Opacity" unit="%" value={el.opacity * 100} step={5} min={5} max={100} onChange={(v) => set({ opacity: Math.min(1, Math.max(0.05, v / 100)) })} />
            </div>
          </>
        )}
        {el.type === 'icon' && (
          <>
            <div className="grid grid-cols-4 gap-1.5">
              {ICONS.map((name) => {
                const I = ICON_COMPONENTS[name]
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => set({ icon: name })}
                    className={`grid h-9 place-items-center rounded border ${el.icon === name ? 'border-accent bg-accent/10' : 'border-border-strong'}`}
                  >
                    <I className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
            <ColorInput label="Colour" value={el.color} onChange={(v) => set({ color: v })} />
          </>
        )}
      </Section>

      <Section title="Position and size">
        <div className="grid grid-cols-2 gap-2">
          <Num label="X" value={el.x} onChange={(v) => set({ x: v })} />
          <Num label="Y" value={el.y} onChange={(v) => set({ y: v })} />
          <Num label="Width" value={el.w} onChange={(v) => set(el.type === 'qr' ? { w: v, h: v } : { w: v })} />
          <Num label="Height" value={el.h} onChange={(v) => set(el.type === 'qr' ? { w: v, h: v } : { h: v })} />
          <Num label="Rotate" unit="°" value={el.rotation} step={5} onChange={(v) => set({ rotation: Math.max(-180, Math.min(180, v)) })} />
        </div>
        <div className="flex gap-4">
          <Check label="Hide" checked={el.hidden} onChange={(v) => set({ hidden: v })} />
          <Check label="Lock" checked={el.locked} onChange={(v) => set({ locked: v })} />
        </div>
      </Section>
    </>
  )
}

function TextProps({ el, ctx, set }: { el: ElementOf<'text'>; ctx: DesignContext; set: (p: Record<string, unknown>) => void }) {
  return (
    <>
      <Select
        label="Content"
        value={el.binding ?? 'custom'}
        options={[{ value: 'custom', label: 'Custom text' }, ...BINDINGS.map((b) => ({ value: b, label: `Your ${BINDING_LABELS[b].toLowerCase()} (from card)` }))]}
        onChange={(v) => set({ binding: v === 'custom' ? null : (v as Binding), text: v === 'custom' ? elementText(el, ctx) : el.text })}
      />
      {el.binding ? (
        <p className="rounded bg-surface-raised px-2 py-1.5 text-xs text-ink-muted">
          Shows “{elementText(el, ctx) || 'empty'}”. Updates when you edit your card.
        </p>
      ) : (
        <textarea value={el.text} rows={2} maxLength={200} onChange={(e) => set({ text: e.target.value })} className={`${inputClass} text-sm`} />
      )}
      <Select label="Font" value={el.font} options={DESIGN_FONTS.map((f) => ({ value: f, label: FONT_LABELS[f] }))} onChange={(v) => set({ font: v })} />
      <div className="grid grid-cols-2 gap-2">
        <Num label="Size" unit="pt" value={el.size} step={0.5} min={4} max={72} onChange={(v) => set({ size: Math.max(4, Math.min(72, v)) })} />
        <Select
          label="Weight"
          value={el.weight}
          options={[{ value: 400, label: 'Regular' }, { value: 500, label: 'Medium' }, { value: 600, label: 'Semibold' }, { value: 700, label: 'Bold' }]}
          onChange={(v) => set({ weight: v })}
        />
        <Select label="Align" value={el.align} options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Centre' }, { value: 'right', label: 'Right' }]} onChange={(v) => set({ align: v })} />
        <Num label="Letter spacing" unit="em" value={el.letterSpacing} step={0.01} onChange={(v) => set({ letterSpacing: Math.max(-0.1, Math.min(0.5, v)) })} />
      </div>
      <div className="flex gap-4">
        <Check label="Italic" checked={el.italic} onChange={(v) => set({ italic: v })} />
        <Check label="ALL CAPS" checked={el.uppercase} onChange={(v) => set({ uppercase: v })} />
      </div>
      <ColorInput label="Colour" value={el.color} onChange={(v) => set({ color: v })} />
    </>
  )
}

function QrProps({
  el,
  tags,
  set,
  onCreateTag,
}: {
  el: ElementOf<'qr'>
  tags: { id: string; label: string }[]
  set: (p: Record<string, unknown>) => void
  onCreateTag: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  return (
    <>
      <Select
        label="Opens"
        value={el.target}
        options={[
          { value: 'card', label: 'My card link' },
          { value: 'tag', label: 'An NFC tag link (re-pointable)' },
          { value: 'custom', label: 'Another web address' },
        ]}
        onChange={(v) => set({ target: v, tagId: v === 'tag' ? el.tagId ?? tags[0]?.id ?? null : el.tagId })}
      />
      {el.target === 'tag' && (
        <>
          {tags.length > 0 && (
            <Select
              label="Tag link"
              value={el.tagId ?? ''}
              options={[{ value: '', label: 'Choose…' }, ...tags.map((t) => ({ value: t.id, label: `${t.label || 'Untitled'} (/t/${t.id})` }))]}
              onChange={(v) => set({ tagId: v || null })}
            />
          )}
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              await onCreateTag()
              setBusy(false)
            }}
            className="text-xs text-accent underline-offset-4 hover:underline disabled:opacity-50"
          >
            {busy ? 'Creating…' : '+ New tag link for this printed card'}
          </button>
          <p className="text-xs text-ink-muted">Use the same link on the chip, and you can re-point both later in Admin.</p>
        </>
      )}
      {el.target === 'custom' && (
        <input value={el.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://" className={`${inputClass} text-sm`} />
      )}
      <ColorInput label="Code colour" value={el.color} onChange={(v) => set({ color: v })} />
      <OptionalColour label="Light backing plate (helps scanning on dark cards)" value={el.background} fallback="#ffffff" onChange={(v) => set({ background: v })} />
    </>
  )
}

function IconBtn({ title, onClick, children, danger }: { title: string; onClick: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={`grid h-7 w-7 place-items-center rounded text-ink-muted hover:bg-surface-raised ${danger ? 'hover:text-danger' : 'hover:text-ink'}`}>
      {children}
    </button>
  )
}

/* ----------------------------------------------------------- background */

export function BackgroundPanel({
  doc,
  side,
  onSide,
  onDoc,
  onUploadBackground,
}: {
  doc: DesignDoc
  side: DesignSide
  onSide: (bg: Partial<DesignSide['background']>) => void
  onDoc: (patch: Partial<Pick<DesignDoc, 'orientation' | 'material'>>) => void
  onUploadBackground: () => void
}) {
  const bg = side.background
  return (
    <>
      <Section title="Card">
        <Select label="Orientation" value={doc.orientation} options={[{ value: 'landscape', label: 'Landscape' }, { value: 'portrait', label: 'Portrait' }]} onChange={(v) => onDoc({ orientation: v })} />
        <Select
          label="Material"
          value={doc.material}
          options={[
            { value: 'pvc', label: 'PVC, full colour print' },
            { value: 'metal-black', label: 'Black metal, engraved' },
            { value: 'metal-silver', label: 'Silver metal, engraved' },
            { value: 'wood', label: 'Wood, engraved' },
          ]}
          onChange={(v) => onDoc({ material: v })}
        />
        {doc.material !== 'pvc' && (
          <p className="text-xs text-ink-muted">Engraving is one colour. The preview shows the finish; exports are black-on-white for the engraver.</p>
        )}
      </Section>
      {doc.material === 'pvc' && (
        <Section title="Background">
          <Select label="Style" value={bg.kind} options={[{ value: 'solid', label: 'Solid colour' }, { value: 'gradient', label: 'Gradient' }, { value: 'image', label: 'Image' }]} onChange={(v) => onSide({ kind: v })} />
          <ColorInput label={bg.kind === 'gradient' ? 'Start colour' : 'Colour'} value={bg.color} onChange={(v) => onSide({ color: v })} />
          {bg.kind === 'gradient' && (
            <>
              <ColorInput label="End colour" value={bg.color2} onChange={(v) => onSide({ color2: v })} />
              <Num label="Angle" unit="°" value={bg.angle} step={15} min={0} max={360} onChange={(v) => onSide({ angle: Math.round(Math.max(0, Math.min(360, v))) })} />
            </>
          )}
          {bg.kind === 'image' && (
            <button type="button" onClick={onUploadBackground} className={`${inputClass} flex items-center justify-center gap-2`}>
              <ImagePlus className="h-4 w-4" /> {bg.image ? 'Replace background image' : 'Upload background image'}
            </button>
          )}
        </Section>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ add */

export type AddKind = 'text' | Binding | 'image' | 'qr' | 'nfc' | 'rect' | 'ellipse' | 'line'

export function AddPanel({ onAdd }: { onAdd: (k: AddKind) => void }) {
  const btn = 'flex items-center gap-2 rounded-md border border-border-strong px-2.5 py-2 text-left text-xs hover:bg-surface-raised'
  return (
    <Section title="Add">
      <div className="grid grid-cols-2 gap-1.5">
        <button type="button" className={btn} onClick={() => onAdd('text')}><Type className="h-3.5 w-3.5" /> Text</button>
        <button type="button" className={btn} onClick={() => onAdd('image')}><ImagePlus className="h-3.5 w-3.5" /> Image / logo</button>
        <button type="button" className={btn} onClick={() => onAdd('qr')}><QrCode className="h-3.5 w-3.5" /> QR code</button>
        <button type="button" className={btn} onClick={() => onAdd('nfc')}><ICON_COMPONENTS.nfc className="h-3.5 w-3.5" /> NFC icon</button>
        <button type="button" className={btn} onClick={() => onAdd('rect')}><Square className="h-3.5 w-3.5" /> Rectangle</button>
        <button type="button" className={btn} onClick={() => onAdd('ellipse')}><Circle className="h-3.5 w-3.5" /> Circle</button>
        <button type="button" className={btn} onClick={() => onAdd('line')}><Minus className="h-3.5 w-3.5" /> Line</button>
      </div>
      <p className="pt-1 text-xs text-ink-muted">From your card (updates automatically):</p>
      <div className="flex flex-wrap gap-1.5">
        {BINDINGS.map((b) => (
          <button key={b} type="button" onClick={() => onAdd(b)} className="rounded-full border border-border-strong px-2.5 py-1 text-xs hover:bg-surface-raised">
            + {BINDING_LABELS[b]}
          </button>
        ))}
      </div>
    </Section>
  )
}

/* --------------------------------------------------------------- layers */

export function LayersPanel({
  side,
  ctx,
  selectedId,
  onSelect,
  onToggle,
}: {
  side: DesignSide
  ctx: DesignContext
  selectedId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string, key: 'hidden' | 'locked') => void
}) {
  const label = (el: DesignElement) =>
    el.type === 'text'
      ? elementText(el, ctx) || 'Text'
      : el.type === 'shape'
        ? { rect: 'Rectangle', ellipse: 'Circle', line: 'Line' }[el.shape]
        : el.type === 'icon'
          ? `Icon: ${el.icon}`
          : el.type === 'qr'
            ? 'QR code'
            : 'Image'
  return (
    <Section title="Layers">
      {side.elements.length === 0 ? (
        <p className="text-xs text-ink-muted">Nothing on this side yet.</p>
      ) : (
        <ul className="space-y-0.5">
          {[...side.elements].reverse().map((el) => (
            <li key={el.id} className={`flex items-center gap-1 rounded px-1.5 ${el.id === selectedId ? 'bg-accent/10' : 'hover:bg-surface-raised'}`}>
              <button type="button" onClick={() => onSelect(el.id)} className={`min-w-0 flex-1 truncate py-1.5 text-left text-xs ${el.hidden ? 'opacity-50' : ''}`}>
                {label(el)}
              </button>
              <IconBtn title={el.hidden ? 'Show' : 'Hide'} onClick={() => onToggle(el.id, 'hidden')}>
                {el.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </IconBtn>
              <IconBtn title={el.locked ? 'Unlock' : 'Lock'} onClick={() => onToggle(el.id, 'locked')}>
                {el.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </IconBtn>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

/* ------------------------------------------------------------ templates */

export function TemplatesPanel({ ctx, onPick }: { ctx: DesignContext; onPick: (t: Template) => void }) {
  return (
    <Section title="Templates">
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => {
          const built = t.build()
          return (
            <button key={t.id} type="button" onClick={() => onPick(t)} title={t.description} className="group text-left">
              <div className="overflow-hidden rounded-md border border-border-strong transition group-hover:border-accent">
                <SideSvg side={built.front} doc={{ orientation: t.orientation, material: t.material }} ctx={ctx} mode={t.material === 'pvc' ? 'color' : 'engrave-preview'} withBleed={false} className="w-full" />
              </div>
              <span className="mt-1 block text-xs font-medium">{t.name}</span>
            </button>
          )
        })}
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------- issues */

export function IssuesPanel({ issues, onPick }: { issues: PrintIssue[]; onPick: (i: PrintIssue) => void }) {
  return (
    <Section title={issues.length ? `Print check · ${issues.length}` : 'Print check'}>
      {issues.length === 0 ? (
        <p className="text-xs text-success">Ready to print. Nothing is outside the safe area, too small or blurry.</p>
      ) : (
        <ul className="space-y-1.5">
          {issues.map((i, n) => (
            <li key={n}>
              <button type="button" onClick={() => onPick(i)} className={`w-full rounded border px-2 py-1.5 text-left text-xs ${i.level === 'error' ? 'border-danger/40 bg-danger/5' : 'border-border-strong bg-surface-raised'}`}>
                <span className="font-medium capitalize">{i.side}:</span> {i.message}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

/** Hidden file input plus a function to open it. */
export function useFilePicker(onFile: (f: File) => void) {
  const ref = useRef<HTMLInputElement>(null)
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/png,image/jpeg,image/webp,image/svg+xml"
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) onFile(f)
        e.target.value = ''
      }}
    />
  )
  return { input, open: () => ref.current?.click() }
}
