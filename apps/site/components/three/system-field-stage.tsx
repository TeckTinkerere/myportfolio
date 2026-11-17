'use client'

import { useState } from 'react'

import { Panel } from '@/components/system/panel'
import { SystemField } from '@/components/three/system-field'
import type { ProjectStatus } from '@/lib/content/schema'
import type { SystemFieldData } from '@/lib/content/system-field'
import { cn } from '@/lib/utils'

export type StatusRow = { status: ProjectStatus; label: string; count: number }

/**
 * The hero's field and its status readout, as one unit.
 *
 * They share two pieces of state, which is the only reason this is a client
 * component: pointing at a status row lights the matching nodes, and once the
 * WebGL scene has drawn its first frame the server-rendered SVG (passed in as
 * `children`) is faded out so the two are never on screen together. The SVG
 * stays in the accessibility tree — it carries the diagram's label.
 */
export function SystemFieldStage({
  data,
  rows,
  activeCount,
  children,
}: {
  data: SystemFieldData
  rows: StatusRow[]
  activeCount: number
  children: React.ReactNode
}) {
  const [live, setLive] = useState(false)
  const [highlight, setHighlight] = useState<ProjectStatus | null>(null)

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
        <div
          className={cn(
            'h-full w-full transition-opacity duration-500',
            live && 'opacity-0',
          )}
        >
          {children}
        </div>
        <SystemField data={data} highlight={highlight} onLive={() => setLive(true)} />
      </div>

      <Panel
        designation="Published work"
        meta={`${activeCount} active`}
        className="mx-auto mt-4 max-w-[26rem]"
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 sm:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.status}
              onPointerEnter={() => setHighlight(row.status)}
              onPointerLeave={() => setHighlight(null)}
              className="flex items-baseline gap-2"
            >
              <dt
                className={cn(
                  'label-mono truncate transition-colors',
                  highlight === row.status ? 'text-accent' : 'text-ink-muted',
                )}
              >
                {row.label}
              </dt>
              <dd className="label-mono tnum ml-auto text-ink">{row.count}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  )
}
