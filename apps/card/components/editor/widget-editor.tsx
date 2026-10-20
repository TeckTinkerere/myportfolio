'use client'

import { Plus, X } from 'lucide-react'

import { SOCIAL_LABELS } from '@/lib/card/links'
import { CONTACT_KINDS, SOCIAL_NETWORKS, type ContactKind, type Widget } from '@/lib/card/schema'

import { Field, inputClass, TextArea, TextInput, Toggle } from './fields'

const CONTACT_LABELS: Record<ContactKind, string> = {
  phone: 'Phone',
  email: 'Email',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  website: 'Website',
  address: 'Address',
}

const CONTACT_PLACEHOLDERS: Record<ContactKind, string> = {
  phone: '+65 9123 4567',
  email: 'you@example.com',
  whatsapp: '+65 9123 4567',
  telegram: '@username',
  website: 'https://example.com',
  address: '1 Raffles Place, Singapore',
}

/** The form for one block. Edits go straight up; the builder autosaves. */
export function WidgetEditor({ widget, onChange }: { widget: Widget; onChange: (w: Widget) => void }) {
  switch (widget.type) {
    case 'heading':
      return (
        <Field label="Heading">
          <TextInput value={widget.text} maxLength={80} onChange={(text) => onChange({ ...widget, text })} />
        </Field>
      )

    case 'text':
      return (
        <Field label="Text" hint={`${widget.body.length}/1000. Line breaks are kept.`}>
          <TextArea rows={4} value={widget.body} maxLength={1000} onChange={(body) => onChange({ ...widget, body })} />
        </Field>
      )

    case 'contact':
      return (
        <div className="space-y-3">
          {widget.items.map((item, i) => {
            const set = (patch: Partial<typeof item>) =>
              onChange({ ...widget, items: widget.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) })
            return (
              <div key={i} className="grid grid-cols-[7.5rem_1fr_auto] gap-2">
                <select
                  value={item.kind}
                  onChange={(e) => set({ kind: e.target.value as ContactKind })}
                  className={inputClass}
                  aria-label="Type"
                >
                  {CONTACT_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {CONTACT_LABELS[k]}
                    </option>
                  ))}
                </select>
                <TextInput
                  value={item.value}
                  maxLength={200}
                  placeholder={CONTACT_PLACEHOLDERS[item.kind]}
                  onChange={(value) => set({ value })}
                  aria-label="Value"
                />
                <RemoveButton onClick={() => onChange({ ...widget, items: widget.items.filter((_, j) => j !== i) })} />
                <div className="col-span-2 col-start-2">
                  <TextInput
                    value={item.label}
                    maxLength={60}
                    placeholder="Label (optional), e.g. Office"
                    onChange={(label) => set({ label })}
                    aria-label="Label"
                  />
                </div>
              </div>
            )
          })}
          <AddButton
            disabled={widget.items.length >= 10}
            onClick={() => onChange({ ...widget, items: [...widget.items, { kind: 'phone', value: '', label: '' }] })}
          >
            Add contact
          </AddButton>
        </div>
      )

    case 'social':
      return (
        <div className="space-y-3">
          {widget.items.map((item, i) => {
            const set = (patch: Partial<typeof item>) =>
              onChange({ ...widget, items: widget.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) })
            return (
              <div key={i} className="grid grid-cols-[7.5rem_1fr_auto] gap-2">
                <select
                  value={item.network}
                  onChange={(e) => set({ network: e.target.value as (typeof SOCIAL_NETWORKS)[number] })}
                  className={inputClass}
                  aria-label="Network"
                >
                  {SOCIAL_NETWORKS.map((n) => (
                    <option key={n} value={n}>
                      {SOCIAL_LABELS[n]}
                    </option>
                  ))}
                </select>
                <TextInput
                  value={item.url}
                  type="url"
                  maxLength={500}
                  placeholder="https://www.linkedin.com/in/…"
                  onChange={(url) => set({ url })}
                  aria-label="Profile link"
                />
                <RemoveButton onClick={() => onChange({ ...widget, items: widget.items.filter((_, j) => j !== i) })} />
                <div className="col-span-2 col-start-2">
                  <TextInput
                    value={item.label}
                    maxLength={60}
                    placeholder="Label (optional), e.g. LocalLoco"
                    onChange={(label) => set({ label })}
                    aria-label="Label"
                  />
                </div>
              </div>
            )
          })}
          <AddButton
            disabled={widget.items.length >= 12}
            onClick={() =>
              onChange({ ...widget, items: [...widget.items, { network: 'linkedin', url: 'https://', label: '' }] })
            }
          >
            Add profile
          </AddButton>
        </div>
      )

    case 'link':
    case 'booking':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label">
            <TextInput value={widget.label} maxLength={60} onChange={(label) => onChange({ ...widget, label })} />
          </Field>
          <Field label="Link" hint={widget.type === 'booking' ? 'Calendly, Cal.com, Google or Microsoft booking page.' : undefined}>
            <TextInput value={widget.url} type="url" maxLength={500} onChange={(url) => onChange({ ...widget, url })} />
          </Field>
        </div>
      )

    case 'embed':
      return (
        <Field label="YouTube or Spotify link" hint="Paste the normal share link. It plays on the card.">
          <TextInput value={widget.url} type="url" maxLength={500} onChange={(url) => onChange({ ...widget, url })} />
        </Field>
      )

    case 'form':
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label">
              <TextInput
                value={widget.buttonLabel}
                maxLength={60}
                onChange={(buttonLabel) => onChange({ ...widget, buttonLabel })}
              />
            </Field>
            <Field label="Form title">
              <TextInput value={widget.title} maxLength={80} onChange={(title) => onChange({ ...widget, title })} />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Fields</legend>
            <p className="mb-2 text-xs text-ink-muted">Name and email are always asked.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(['designation', 'company', 'mobile', 'message'] as const).map((k) => (
                <Toggle
                  key={k}
                  label={k[0].toUpperCase() + k.slice(1)}
                  checked={widget.fields[k]}
                  onChange={(v) => onChange({ ...widget, fields: { ...widget.fields, [k]: v } })}
                />
              ))}
            </div>
          </fieldset>
        </div>
      )
  }
}

/** One line describing a block, for its collapsed header. */
export function widgetSummary(w: Widget): string {
  switch (w.type) {
    case 'heading':
      return w.text
    case 'text':
      return w.body.split('\n')[0] ?? ''
    case 'contact':
      return w.items.map((i) => i.label || i.value).filter(Boolean).join(', ') || 'No items yet'
    case 'social':
      return w.items.map((i) => i.label || SOCIAL_LABELS[i.network]).join(', ') || 'No profiles yet'
    case 'link':
    case 'booking':
      return w.label
    case 'embed':
      return w.url
    case 'form':
      return w.buttonLabel
  }
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:text-danger">
      <X className="h-4 w-4" aria-hidden />
      <span className="sr-only">Remove</span>
    </button>
  )
}

function AddButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline disabled:opacity-50"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {children}
    </button>
  )
}
