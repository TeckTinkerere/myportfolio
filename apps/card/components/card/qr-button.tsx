'use client'

import { QrCode, X } from 'lucide-react'
import { useMemo, useRef } from 'react'

import { qrSvg } from './qr-svg'

/** QR code in a native dialog, for sharing with someone who has no NFC. */
export function QrButton({ url, name }: { url: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const svg = useMemo(() => qrSvg(url), [url])

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="grid h-10 w-10 place-items-center rounded-full bg-black/25 text-white backdrop-blur transition hover:bg-black/40"
      >
        <QrCode className="h-5 w-5" aria-hidden />
        <span className="sr-only">Show QR code</span>
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(22rem,calc(100vw-2rem))] rounded-2xl bg-white p-6 text-center text-neutral-900 backdrop:bg-black/60"
      >
        <div className="flex items-start justify-between">
          <p className="text-left text-base font-semibold">Scan to open {name}&rsquo;s card</p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="-mr-2 -mt-2 grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mx-auto mt-4 w-full max-w-[16rem]" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mt-3 break-all text-xs text-neutral-500">{url.replace(/^https?:\/\//, '')}</p>
      </dialog>
    </>
  )
}
