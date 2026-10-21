'use client'

import { TriangleAlert } from 'lucide-react'

import { themeWarnings } from '@/lib/card/contrast'
import {
  ALIGNMENTS,
  AVATAR_SHAPES,
  BACKGROUND_STYLES,
  BUTTON_STYLES,
  FONTS,
  ROW_STYLES,
  TEMPLATES,
  TEXT_SIZES,
  type CardDoc,
} from '@/lib/card/schema'

import { ColorInput, Panel, Segmented } from './fields'
import { ImageField } from './image-field'

/** Background pairs that read well with the matching text colour. */
const PRESETS: { name: string; from: string; to: string; text: 'light' | 'dark'; accent: string }[] = [
  { name: 'Midnight', from: '#0f172a', to: '#1e3a8a', text: 'light', accent: '#3b82f6' },
  { name: 'Ink', from: '#09090b', to: '#27272a', text: 'light', accent: '#f59e0b' },
  { name: 'Forest', from: '#052e16', to: '#14532d', text: 'light', accent: '#4ade80' },
  { name: 'Plum', from: '#2e1065', to: '#701a75', text: 'light', accent: '#f472b6' },
  { name: 'Teal', from: '#042f2e', to: '#115e59', text: 'light', accent: '#2dd4bf' },
  { name: 'Paper', from: '#fafaf9', to: '#e7e5e4', text: 'dark', accent: '#0f172a' },
  { name: 'Sand', from: '#fef3c7', to: '#fde68a', text: 'dark', accent: '#b45309' },
  { name: 'Mist', from: '#f0f9ff', to: '#e0e7ff', text: 'dark', accent: '#4338ca' },
]

const LABELS: Record<string, string> = {
  classic: 'Classic',
  cover: 'Cover photo',
  split: 'Side by side',
  minimal: 'Minimal',
  system: 'Phone default',
  sans: 'Modern',
  serif: 'Serif',
  rounded: 'Rounded',
  rounded_btn: 'Rounded',
  pill: 'Pill',
  square: 'Square',
  gradient: 'Gradient',
  solid: 'Solid',
  image: 'Photo',
  soft: 'Soft',
  outline: 'Outline',
  circle: 'Circle',
  center: 'Centre',
  left: 'Left',
  normal: 'Normal',
  large: 'Large',
}

const opts = <T extends string>(values: readonly T[]) => values.map((value) => ({ value, label: LABELS[value] ?? value }))

/** The Style tab: layout, type, shapes and colours, with readability checks. */
export function StylePanel({
  cardId,
  doc,
  mutate,
}: {
  cardId: string
  doc: CardDoc
  mutate: (fn: (d: CardDoc) => void) => void
}) {
  const t = doc.theme
  const warnings = themeWarnings(t)

  return (
    <div className="space-y-5">
      {warnings.length > 0 && (
        <div role="status" className="rounded-lg border border-danger/40 bg-danger/5 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium text-danger">
            <TriangleAlert className="h-4 w-4" aria-hidden />
            Readability
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <Panel title="Layout">
        <Segmented label="Template" value={t.template} options={opts(TEMPLATES)} onChange={(v) => mutate((d) => void (d.theme.template = v))} />
        <Segmented label="Alignment" value={t.align} options={opts(ALIGNMENTS)} onChange={(v) => mutate((d) => void (d.theme.align = v))} />
        <Segmented label="Photo shape" value={t.avatar} options={opts(AVATAR_SHAPES)} onChange={(v) => mutate((d) => void (d.theme.avatar = v))} />
      </Panel>

      <Panel title="Text">
        <Segmented label="Font" value={t.font} options={opts(FONTS)} onChange={(v) => mutate((d) => void (d.theme.font = v))} />
        <p className="-mt-2 text-xs text-ink-muted">
          &ldquo;Phone default&rdquo; loads fastest on a tap and shows every script (Tamil, Chinese, Malay, Arabic) in
          the phone&rsquo;s own font.
        </p>
        <Segmented label="Text size" value={t.textSize} options={opts(TEXT_SIZES)} onChange={(v) => mutate((d) => void (d.theme.textSize = v))} />
      </Panel>

      <Panel title="Buttons and rows">
        <Segmented
          label="Corners"
          value={t.buttons}
          options={BUTTON_STYLES.map((value) => ({ value, label: LABELS[value === 'rounded' ? 'rounded_btn' : value] }))}
          onChange={(v) => mutate((d) => void (d.theme.buttons = v))}
        />
        <Segmented label="Row style" value={t.rows} options={opts(ROW_STYLES)} onChange={(v) => mutate((d) => void (d.theme.rows = v))} />
      </Panel>

      <Panel title="Colours">
        <div>
          <p className="mb-1.5 text-sm font-medium">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  mutate((d) => {
                    d.theme.background.from = p.from
                    d.theme.background.to = p.to
                    if (d.theme.background.style === 'image' && !d.theme.background.image) d.theme.background.style = 'gradient'
                    d.theme.text = p.text
                    d.theme.accent = p.accent
                  })
                }
                className="flex items-center gap-2 rounded-md border border-border-strong px-2 py-1.5 text-sm hover:bg-surface-raised"
              >
                <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <Segmented
          label="Background"
          value={t.background.style}
          options={opts(BACKGROUND_STYLES)}
          onChange={(v) => mutate((d) => void (d.theme.background.style = v))}
        />

        {t.background.style === 'image' ? (
          <div className="space-y-4">
            <ImageField
              cardId={cardId}
              kind="background"
              value={t.background.image}
              onChange={(v) => mutate((d) => void (d.theme.background.image = v))}
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Overlay {t.background.overlay}%</span>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={t.background.overlay}
                onChange={(e) => mutate((d) => void (d.theme.background.overlay = Number(e.target.value)))}
                className="w-full accent-[hsl(var(--accent))]"
              />
              <span className="mt-1 block text-xs text-ink-muted">
                Darkens the photo for light text, or lightens it for dark text, so words stay readable.
              </span>
            </label>
            <ColorInput label="Colour behind the photo" value={t.background.from} onChange={(v) => mutate((d) => void (d.theme.background.from = v))} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorInput
              label={t.background.style === 'solid' ? 'Background' : 'Background start'}
              value={t.background.from}
              onChange={(v) => mutate((d) => void (d.theme.background.from = v))}
            />
            {t.background.style === 'gradient' && (
              <ColorInput label="Background end" value={t.background.to} onChange={(v) => mutate((d) => void (d.theme.background.to = v))} />
            )}
            {t.background.style === 'gradient' && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">Gradient direction {t.background.angle}°</span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={15}
                  value={t.background.angle}
                  onChange={(e) => mutate((d) => void (d.theme.background.angle = Number(e.target.value)))}
                  className="w-full accent-[hsl(var(--accent))]"
                />
              </label>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <ColorInput label="Accent (Save contact button)" value={t.accent} onChange={(v) => mutate((d) => void (d.theme.accent = v))} />
          <Segmented
            label="Text colour"
            value={t.text}
            options={[
              { value: 'light', label: 'Light text' },
              { value: 'dark', label: 'Dark text' },
            ]}
            onChange={(v) => mutate((d) => void (d.theme.text = v))}
          />
        </div>
      </Panel>
    </div>
  )
}
