'use client'

import { ImageUp, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { uploadImage } from '@/app/edit/actions'

type Kind = 'photo' | 'banner' | 'logo' | 'background'

/** Target size per image. Photos and banners are cropped to fill; logos fit. */
const SPECS: Record<Kind, { w: number; h: number; mode: 'cover' | 'contain'; label: string; hint: string }> = {
  photo: { w: 800, h: 800, mode: 'cover', label: 'Profile photo', hint: 'Square crop from the centre.' },
  banner: { w: 1500, h: 500, mode: 'cover', label: 'Banner', hint: 'Wide 3:1, shown on the Classic layout.' },
  logo: { w: 512, h: 512, mode: 'contain', label: 'Logo badge', hint: 'Small badge on the photo. Transparent PNG works best.' },
  // Phone-shaped and modest: it sits behind text, so detail is wasted bytes.
  background: { w: 900, h: 1600, mode: 'cover', label: 'Background photo', hint: 'Portrait works best. Kept small so the card still opens fast.' },
}

/**
 * Resize and crop in the browser before upload: a phone photo is 4–12 MB,
 * the card needs a few hundred KB, and the server never has to touch the
 * original.
 */
async function prepare(file: File, kind: Kind): Promise<Blob> {
  const spec = SPECS[kind]
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = spec.w
  canvas.height = spec.h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')

  const scale =
    spec.mode === 'cover'
      ? Math.max(spec.w / bitmap.width, spec.h / bitmap.height)
      : Math.min(spec.w / bitmap.width, spec.h / bitmap.height, 1)
  const dw = bitmap.width * scale
  const dh = bitmap.height * scale
  ctx.drawImage(bitmap, (spec.w - dw) / 2, (spec.h - dh) / 2, dw, dh)
  bitmap.close()

  const toBlob = (type: string, q?: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q))
  // WebP keeps logo transparency and is small. Browsers that cannot encode
  // it (older Safari) return PNG instead; fall back to JPEG for photos.
  const webp = await toBlob('image/webp', 0.86)
  if (webp && webp.type === 'image/webp') return webp
  const fallback = await toBlob(kind === 'logo' ? 'image/png' : 'image/jpeg', 0.88)
  if (!fallback) throw new Error('Could not encode image')
  return fallback
}

export function ImageField({
  cardId,
  kind,
  value,
  onChange,
}: {
  cardId: string
  kind: Kind
  value: string
  onChange: (url: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const spec = SPECS[kind]

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const blob = await prepare(file, kind)
      const form = new FormData()
      form.set('file', blob, `${kind}`)
      const res = await uploadImage(cardId, kind, form)
      if (res.ok) onChange(res.url)
      else setError(res.error)
    } catch {
      setError('That image could not be read. Try a JPEG or PNG.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className="text-sm">
      <span className="mb-1.5 block font-medium">{spec.label}</span>
      <div className="flex items-center gap-3">
        <div
          className={`relative shrink-0 overflow-hidden border border-border-strong bg-surface-raised ${kind === 'banner' ? 'h-12 w-36 rounded-md' : kind === 'background' ? 'h-20 w-12 rounded-md' : 'h-14 w-14 rounded-full'}`}
        >
          {value && <Image src={value} alt="" fill sizes="144px" className={kind === 'logo' ? 'object-contain p-1' : 'object-cover'} />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 hover:bg-surface-raised disabled:opacity-60"
          >
            <ImageUp className="h-4 w-4" aria-hidden />
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-ink-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Remove
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      <span className={`mt-1 block text-xs ${error ? 'text-danger' : 'text-ink-muted'}`}>{error ?? spec.hint}</span>
    </div>
  )
}
