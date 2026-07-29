'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

import { submitContactForm } from '@/app/actions/contact'
import {
  ENQUIRY_TYPES,
  type ContactFormState,
  type EnquiryType,
} from '@/lib/validation/contact'
import { cn } from '@/lib/utils'

const INITIAL: ContactFormState = { status: 'idle' }

export function ContactForm({ defaultType }: { defaultType: EnquiryType }) {
  const [state, formAction] = useActionState(submitContactForm, INITIAL)
  // Referring route preselects the type (PRD FR-06); the visitor can change it.
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(
    (state.values?.enquiryType as EnquiryType) ?? defaultType,
  )

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-lg border border-success/40 bg-surface p-8 text-center"
      >
        <h2 className="text-title font-semibold text-ink">Message sent</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Failures are announced, not just coloured. */}
      <div aria-live="polite">
        {state.status === 'error' && state.message ? (
          <p className="rounded-md border border-danger/40 bg-surface p-4 text-sm text-ink">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          required
          error={state.errors?.name}
          defaultValue={state.values?.name}
          autoComplete="name"
        />
        <Field
          name="email"
          label="Email"
          type="email"
          required
          error={state.errors?.email}
          defaultValue={state.values?.email}
          autoComplete="email"
        />
      </div>

      <Field
        name="organisation"
        label="Organisation"
        hint="Optional"
        error={state.errors?.organisation}
        defaultValue={state.values?.organisation}
        autoComplete="organization"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="enquiryType" className="text-sm font-medium text-ink">
          What is this about?{' '}
          <span aria-hidden className="text-accent">
            *
          </span>
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          required
          value={enquiryType}
          onChange={(event) => setEnquiryType(event.target.value as EnquiryType)}
          aria-invalid={state.errors?.enquiryType ? true : undefined}
          aria-describedby={state.errors?.enquiryType ? 'enquiryType-error' : undefined}
          className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink"
        >
          {Object.entries(ENQUIRY_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {state.errors?.enquiryType ? (
          <p id="enquiryType-error" className="text-sm text-danger">
            {state.errors.enquiryType}
          </p>
        ) : null}
      </div>

      {/* Conditional fields (PRD FR-06). Unrendered fields simply are not
          submitted, and the schema treats them as optional. */}
      {enquiryType === 'website' ? (
        <fieldset className="grid gap-6 rounded-lg border border-border p-5 sm:grid-cols-2">
          <legend className="label-mono px-2 text-ink-muted">Project details</legend>
          <Field
            name="targetDate"
            label="Target launch date"
            hint="Optional"
            defaultValue={state.values?.targetDate}
          />
          <Field
            name="budgetRange"
            label="Budget range"
            hint="Optional"
            defaultValue={state.values?.budgetRange}
          />
          <div className="sm:col-span-2">
            <Field
              name="scope"
              label="Roughly what is involved?"
              hint="Optional"
              defaultValue={state.values?.scope}
            />
          </div>
        </fieldset>
      ) : null}

      {enquiryType === 'event' ? (
        <fieldset className="grid gap-6 rounded-lg border border-border p-5 sm:grid-cols-2">
          <legend className="label-mono px-2 text-ink-muted">Event details</legend>
          <Field
            name="eventDate"
            label="Event date"
            hint="Optional"
            defaultValue={state.values?.eventDate}
          />
          <Field
            name="eventLocation"
            label="Location"
            hint="Optional"
            defaultValue={state.values?.eventLocation}
          />
          <Field
            name="audienceType"
            label="Audience"
            hint="Optional"
            defaultValue={state.values?.audienceType}
          />
          <Field
            name="audienceSize"
            label="Approximate audience size"
            hint="Optional"
            defaultValue={state.values?.audienceSize}
          />
          <div className="sm:col-span-2">
            <Field
              name="roleRequired"
              label="Role you need filled"
              hint="Host, facilitator, workshop instructor, operations support…"
              defaultValue={state.values?.roleRequired}
            />
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message{' '}
          <span aria-hidden className="text-accent">
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          defaultValue={state.values?.message}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted"
          placeholder="What are you trying to do, and where are you stuck?"
        />
        {state.errors?.message ? (
          <p id="message-error" className="text-sm text-danger">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {/*
        Honeypot. aria-hidden and tabIndex -1 keep it away from screen readers
        and keyboard users; only an automated submitter will fill it.
      */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-fit items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-opacity disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

function Field({
  name,
  label,
  hint,
  error,
  required,
  type = 'text',
  defaultValue,
  autoComplete,
}: {
  name: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  type?: string
  defaultValue?: string
  autoComplete?: string
}) {
  const hintId = hint ? `${name}-hint` : undefined
  const errorId = error ? `${name}-error` : undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}{' '}
        {required ? (
          <span aria-hidden className="text-accent">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink"
      />
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
