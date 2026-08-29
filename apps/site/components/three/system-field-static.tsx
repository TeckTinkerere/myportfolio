import { systemFieldConfig } from '@/components/three/system-field.config'
import type { SystemFieldData } from '@/lib/content/system-field'

/**
 * Server-rendered projection of the same node field, as inline SVG.
 *
 * This is what a visitor sees before the WebGL scene loads, if WebGL is
 * unavailable, or if they have asked for reduced motion. It ships no
 * JavaScript and is present in the initial HTML, so the hero never renders
 * as an empty box and the 3D layer can never affect LCP.
 */
export function SystemFieldStatic({ data }: { data: SystemFieldData }) {
  const { nodes, links } = data
  const { statusColors, linkColor, linkOpacity } = systemFieldConfig

  // Orthographic projection down -Z, matching the canvas's default view.
  const SIZE = 400
  const SCALE = 46
  const project = ([x, y, z]: [number, number, number]) => ({
    x: SIZE / 2 + x * SCALE,
    y: SIZE / 2 - y * SCALE,
    // Depth drives opacity and radius, which is what reads as dimension.
    depth: (z + systemFieldConfig.radius) / (systemFieldConfig.radius * 2),
  })

  const points = nodes.map((node) => ({ ...project(node.position), node }))

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full"
      role="img"
      aria-label={`Diagram of ${nodes.length} published projects, positioned by discipline and coloured by status.`}
    >
      <g>
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={points[a].x}
            y1={points[a].y}
            x2={points[b].x}
            y2={points[b].y}
            stroke={linkColor}
            strokeWidth={0.5}
            opacity={linkOpacity * 0.7}
          />
        ))}
      </g>
      <g>
        {points.map(({ x, y, depth, node }) => (
          <circle
            key={node.id}
            cx={x}
            cy={y}
            r={(node.featured ? 4.2 : 2.8) * (0.65 + depth * 0.5)}
            fill={statusColors[node.status]}
            opacity={0.35 + depth * 0.6}
          />
        ))}
      </g>
    </svg>
  )
}
