'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Save contact, optionally followed by "say hi on WhatsApp".
 *
 * A browser cannot both save a contact and open WhatsApp from one tap: the
 * vCard download takes the phone into its contacts sheet, and a second
 * navigation would cancel it. So the first tap saves, and once the visitor
 * is back, a sheet offers WhatsApp with the message already typed. That is
 * one extra tap, and it works the same on iPhone and Android.
 */
export function SaveContact({
  href,
  label,
  whatsapp,
  preview,
}: {
  href: string
  label: string
  /** Set when the owner chose "Save, then offer WhatsApp". */
  whatsapp: { href: string; ownerFirstName: string } | null
  preview: boolean
}) {
  const [offer, setOffer] = useState(false)

  return (
    <>
      <a
        href={preview ? undefined : href}
        onClick={() => {
          if (!whatsapp) return
          // Let the download start first, then show the sheet underneath it.
          setTimeout(() => setOffer(true), preview ? 0 : 700)
        }}
        className="card-focus pointer-events-auto flex h-14 w-full items-center justify-center gap-2 rounded-[var(--c-radius)] bg-[color:var(--c-accent)] text-base font-semibold text-[color:var(--c-accent-fg)] shadow-lg shadow-black/20 transition hover:brightness-110"
      >
        {label || 'Save contact'}
        {whatsapp && <MessageCircle className="h-4 w-4 opacity-80" aria-hidden />}
      </a>

      {whatsapp && offer && (
        <div
          role="dialog"
          aria-label="Message on WhatsApp"
          className="pointer-events-auto absolute inset-x-3 bottom-3 z-20 rounded-2xl bg-white p-4 text-left font-sans text-neutral-900 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] font-semibold">Contact saved? Say hi to {whatsapp.ownerFirstName}.</p>
            <button
              type="button"
              onClick={() => setOffer(false)}
              className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-neutral-100"
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Opens WhatsApp with a message ready to send, so you both have each other&rsquo;s number.
          </p>
          <a
            href={preview ? undefined : whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOffer(false)}
            className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] font-semibold text-[#06281a] transition hover:brightness-105"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Message on WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
