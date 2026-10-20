import { cardSchema, type CardDoc, type Widget, type WidgetType } from './schema'

/** The starting document for a new card: a name and nothing else to delete. */
export function newCard(name: string): CardDoc {
  return cardSchema.parse({
    header: { name, quickActions: ['call', 'email', 'share'] },
    theme: { background: {} },
    meta: {},
    widgets: [],
  })
}

/** A short random id for a widget, unique within one card. */
export function widgetId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** A blank widget of the given type, as the editor adds it. */
export function newWidget(type: WidgetType): Widget {
  const id = widgetId()
  switch (type) {
    case 'heading':
      return { id, hidden: false, type, text: 'New section' }
    case 'text':
      return { id, hidden: false, type, body: 'Write something about yourself.' }
    case 'contact':
      return { id, hidden: false, type, items: [] }
    case 'social':
      return { id, hidden: false, type, items: [] }
    case 'link':
      return { id, hidden: false, type, label: 'My website', url: 'https://' }
    case 'embed':
      return { id, hidden: false, type, url: 'https://www.youtube.com/watch?v=' }
    case 'booking':
      return { id, hidden: false, type, label: 'Book a meeting', url: 'https://' }
    case 'form':
      return {
        id,
        hidden: false,
        type,
        buttonLabel: 'Send me your details',
        title: 'Get in touch',
        fields: { designation: true, company: true, mobile: true, message: true },
      }
  }
}

export const WIDGET_LABELS: Record<WidgetType, string> = {
  heading: 'Heading',
  text: 'Text',
  contact: 'Contact details',
  social: 'Social links',
  link: 'Link button',
  embed: 'Video or music',
  booking: 'Booking link',
  form: 'Contact form',
}
