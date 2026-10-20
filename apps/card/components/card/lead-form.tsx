'use client'

import { ClipboardList, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useRef } from 'react'

import { submitLead, type LeadState } from '@/app/actions/lead'
import type { WidgetOf } from '@/lib/card/schema'

/**
 * The contact-form widget: a row that opens a form in a dialog. The visitor
 * sends their details to the card owner, with an explicit consent box that
 * names who receives them (PDPA: the purpose and recipient are stated at
 * the point of collection).
 */
export function LeadFormButton({
  widget,
  handle,
  ownerName,
  preview,
  className,
}: {
  widget: WidgetOf<'form'>
  handle: string
  ownerName: string
  preview: boolean
  className: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: 'idle' })
  const f = widget.fields
  const consent = `I agree to share these details with ${ownerName} so they can contact me.`

  const input =
    'mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className={className}>
        <ClipboardList className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
        <span className="flex-1 truncate font-medium">{widget.buttonLabel}</span>
        <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
      </button>

      <dialog
        ref={dialog}
        className="m-auto max-h-[90dvh] w-[min(26rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl bg-white p-6 text-left font-sans text-neutral-900 backdrop:bg-black/60"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">{widget.title || widget.buttonLabel}</h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="-mr-2 -mt-1 grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {state.status === 'sent' ? (
          <p className="mt-4 text-[15px] text-neutral-700">
            Thanks. Your details were sent to {ownerName}.
          </p>
        ) : (
          <form action={action} className="mt-4 flex flex-col gap-3 text-sm">
            <input type="hidden" name="handle" value={handle} />
            {/* Honeypot: hidden from people, filled in by naive bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Leave empty
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="font-medium">
              Name
              <input name="name" required maxLength={80} autoComplete="name" className={input} />
            </label>
            {f.designation && (
              <label className="font-medium">
                Designation
                <input name="designation" maxLength={80} autoComplete="organization-title" className={input} />
              </label>
            )}
            {f.company && (
              <label className="font-medium">
                Company
                <input name="company" maxLength={80} autoComplete="organization" className={input} />
              </label>
            )}
            <label className="font-medium">
              Email
              <input name="email" type="email" required maxLength={200} autoComplete="email" className={input} />
            </label>
            {f.mobile && (
              <label className="font-medium">
                Mobile
                <input name="mobile" type="tel" maxLength={40} autoComplete="tel" className={input} />
              </label>
            )}
            {f.message && (
              <label className="font-medium">
                Message
                <textarea name="message" rows={4} maxLength={1000} className={input} />
              </label>
            )}

            <label className="mt-1 flex items-start gap-2 text-[13px] font-normal text-neutral-700">
              <input type="checkbox" name="consent" value={consent} required className="mt-0.5 h-4 w-4" />
              <span>{consent}</span>
            </label>

            {state.status === 'error' && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending || preview}
              className="mt-1 h-11 rounded-lg bg-neutral-900 font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {preview ? 'Disabled in preview' : pending ? 'Sending…' : 'Send'}
            </button>
            <p className="text-xs text-neutral-500">
              See the{' '}
              <Link href="/privacy" className="underline">
                privacy notice
              </Link>{' '}
              for how this is handled.
            </p>
          </form>
        )}
      </dialog>
    </>
  )
}
