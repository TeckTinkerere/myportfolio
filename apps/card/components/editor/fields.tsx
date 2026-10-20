'use client'

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

/** Small form primitives for the editor, styled with the shared tokens. */

export const inputClass =
  'block w-full rounded-md border border-border-strong bg-background px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25'

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string
  onChange: (v: string) => void
}) {
  return <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
}

export function TextArea({
  value,
  onChange,
  ...rest
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> & {
  value: string
  onChange: (v: string) => void
}) {
  return <textarea {...rest} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--accent))]" />
      {label}
    </label>
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <fieldset className="text-sm">
      <legend className="mb-1.5 font-medium">{label}</legend>
      <div className="inline-flex flex-wrap gap-1 rounded-md border border-border-strong p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded px-3 py-1.5 transition ${value === o.value ? 'bg-accent text-accent-contrast' : 'text-ink-muted hover:text-ink'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-border-strong bg-background p-0.5"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className={`${inputClass} w-28 font-mono`}
          aria-label={`${label} hex value`}
        />
      </span>
    </label>
  )
}

export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border-strong bg-surface p-5">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
