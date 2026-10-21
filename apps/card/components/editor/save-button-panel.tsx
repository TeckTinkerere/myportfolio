'use client'

import { followUpMessage, whatsappNumber } from '@/lib/card/links'
import type { CardDoc } from '@/lib/card/schema'

import { Field, Panel, Segmented, TextArea, TextInput } from './fields'

/** Profile tab: the Save contact button's label and its WhatsApp follow-up. */
export function SaveButtonPanel({ doc, mutate }: { doc: CardDoc; mutate: (fn: (d: CardDoc) => void) => void }) {
  const h = doc.header
  const number = whatsappNumber(h)

  return (
    <Panel title="Save contact button" description="The big button at the bottom of your card.">
      <Field label="Button text">
        <TextInput value={h.saveLabel} maxLength={40} placeholder="Save contact" onChange={(v) => mutate((d) => void (d.header.saveLabel = v))} />
      </Field>
      <Segmented
        label="After saving"
        value={h.afterSave}
        options={[
          { value: 'none', label: 'Just save' },
          { value: 'whatsapp', label: 'Save, then offer WhatsApp' },
        ]}
        onChange={(v) => mutate((d) => void (d.header.afterSave = v))}
      />
      {h.afterSave === 'whatsapp' && (
        <>
          {!number && (
            <p role="alert" className="text-sm text-danger">
              Add a phone or WhatsApp number in Main contact, or this step is skipped.
            </p>
          )}
          <Field
            label="Message they send you"
            hint={
              <>
                <code>{'{name}'}</code> becomes your first name. They can edit it before sending. Preview:{' '}
                &ldquo;{followUpMessage(h.whatsappMessage, h.name)}&rdquo;
              </>
            }
          >
            <TextArea
              rows={2}
              maxLength={300}
              value={h.whatsappMessage}
              placeholder="Hi {name}, nice to meet you! I just saved your contact."
              onChange={(v) => mutate((d) => void (d.header.whatsappMessage = v))}
            />
          </Field>
          <p className="text-xs text-ink-muted">
            Phones don&rsquo;t let one tap both save a contact and open WhatsApp, so visitors tap Save, then
            &ldquo;Message on WhatsApp&rdquo;. You both end up with each other&rsquo;s number.
          </p>
        </>
      )}
    </Panel>
  )
}
