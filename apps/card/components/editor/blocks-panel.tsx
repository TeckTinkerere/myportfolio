'use client'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { newWidget, WIDGET_LABELS } from '@/lib/card/defaults'
import type { Widget, WidgetType } from '@/lib/card/schema'

import { WidgetEditor, widgetSummary } from './widget-editor'

const ADDABLE: WidgetType[] = ['heading', 'text', 'contact', 'social', 'link', 'booking', 'embed', 'form']

/** The ordered list of blocks: drag to reorder, expand to edit. */
export function BlocksPanel({ widgets, onChange }: { widgets: Widget[]; onChange: (w: Widget[]) => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return
    const from = widgets.findIndex((w) => w.id === e.active.id)
    const to = widgets.findIndex((w) => w.id === e.over!.id)
    onChange(arrayMove(widgets, from, to))
  }

  function add(type: WidgetType) {
    const w = newWidget(type)
    onChange([...widgets, w])
    setOpen(w.id)
  }

  return (
    <div className="space-y-4">
      {widgets.length === 0 && (
        <p className="rounded-lg border border-dashed border-border-strong p-6 text-center text-sm text-ink-muted">
          No blocks yet. Add contact details, links or a contact form below.
        </p>
      )}

      <DndContext id="blocks" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {widgets.map((w) => (
              <SortableBlock
                key={w.id}
                widget={w}
                open={open === w.id}
                onToggle={() => setOpen(open === w.id ? null : w.id)}
                onChange={(next) => onChange(widgets.map((x) => (x.id === w.id ? next : x)))}
                onRemove={() => onChange(widgets.filter((x) => x.id !== w.id))}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div>
        <p className="mb-2 text-sm font-medium">Add a block</p>
        <div className="flex flex-wrap gap-2">
          {ADDABLE.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => add(t)}
              disabled={widgets.length >= 40}
              className="inline-flex items-center gap-1 rounded-md border border-border-strong px-2.5 py-1.5 text-sm hover:bg-surface-raised disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {WIDGET_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SortableBlock({
  widget,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  widget: Widget
  open: boolean
  onToggle: () => void
  onChange: (w: Widget) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-lg border border-border-strong bg-surface ${isDragging ? 'relative z-10 shadow-lg' : ''} ${widget.hidden ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-1 p-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="grid h-8 w-7 cursor-grab touch-none place-items-center rounded text-ink-muted hover:text-ink active:cursor-grabbing"
          aria-label={`Reorder ${WIDGET_LABELS[widget.type]}`}
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="shrink-0 text-sm font-medium">{WIDGET_LABELS[widget.type]}</span>
          <span className="truncate text-sm text-ink-muted">{widgetSummary(widget)}</span>
          <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-ink-muted transition ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...widget, hidden: !widget.hidden })}
          className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:text-ink"
          aria-label={widget.hidden ? 'Show block' : 'Hide block'}
          title={widget.hidden ? 'Hidden on the card' : 'Visible on the card'}
        >
          {widget.hidden ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Remove this ${WIDGET_LABELS[widget.type].toLowerCase()} block?`)) onRemove()
          }}
          className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:text-danger"
          aria-label="Remove block"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {open && (
        <div className="border-t border-border p-4">
          <WidgetEditor widget={widget} onChange={onChange} />
        </div>
      )}
    </li>
  )
}
