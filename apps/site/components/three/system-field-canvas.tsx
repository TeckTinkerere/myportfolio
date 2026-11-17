'use client'

import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { systemFieldConfig } from '@/components/three/system-field.config'
import { STATUS_LABELS } from '@/lib/content/public-view'
import type { ProjectStatus } from '@/lib/content/schema'
import type { SystemFieldData } from '@/lib/content/system-field'

/**
 * The hero's node field in WebGL.
 *
 * Nodes are octahedra rather than sprites so the rotation actually reveals
 * dimension. Materials are unlit and fog-blended: flat on-token colour, with
 * distance doing the shading. That reads as a display rather than a lit
 * scene, costs almost nothing, and keeps the colours exactly where the
 * design system put them.
 *
 * Every node is a link to its case study. Picking is done by projecting the
 * nodes to screen space and taking the nearest one to the pointer, not by
 * raycasting: the nodes are a few pixels wide, and a hit radius in pixels is
 * what makes them comfortable to point at. The same projection positions the
 * label, which is ordinary HTML so it is crisp and themeable.
 *
 * Every tunable value lives in system-field.config.ts.
 */

const config = systemFieldConfig

/** Shared between the DOM handlers and the render loop; never causes a render. */
type PointerState = { x: number; y: number; inside: boolean; overLabel: boolean }

function Nodes({
  data,
  hovered,
  highlight,
}: {
  data: SystemFieldData
  hovered: number | null
  highlight: ProjectStatus | null
}) {
  const ref = useRef<THREE.InstancedMesh>(null)

  // Per-instance transform and colour. Rewritten only when the emphasis
  // changes — a couple of dozen matrices, so not worth diffing.
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    const matrix = new THREE.Matrix4()
    const colour = new THREE.Color()
    const dimmed = new THREE.Color(config.dimColor)

    data.nodes.forEach((node, index) => {
      const base = node.featured ? config.nodeSizeFeatured : config.nodeSize
      const scale = index === hovered ? base * config.hoverScale : base
      matrix.makeScale(scale, scale, scale)
      matrix.setPosition(...node.position)
      mesh.setMatrixAt(index, matrix)

      colour.set(config.statusColors[node.status])
      if (highlight && node.status !== highlight) colour.lerp(dimmed, 0.82)
      mesh.setColorAt(index, colour)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    // Reduced-motion visitors are in demand mode: ask for the frame.
    invalidate()
  }, [data, hovered, highlight])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, data.nodes.length]}
      frustumCulled={false}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function Links({ data, dim }: { data: SystemFieldData; dim: boolean }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(data.links.length * 6)
    data.links.forEach(([a, b], index) => {
      positions.set(data.nodes[a].position, index * 6)
      positions.set(data.nodes[b].position, index * 6 + 3)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [data])

  // Geometry is created here, so it must be released here.
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={config.linkColor}
        transparent
        opacity={dim ? config.linkOpacity * 0.35 : config.linkOpacity}
        toneMapped={false}
      />
    </lineSegments>
  )
}

function Dust() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(config.dustCount * 3)
    // Deterministic: a fixed lattice walk rather than Math.random, so the
    // field looks identical on every load.
    for (let i = 0; i < config.dustCount; i += 1) {
      const t = i * 2.399963 // golden angle, radians
      const y = 1 - (i / (config.dustCount - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const spread = config.radius * 2.4
      positions[i * 3] = Math.cos(t) * r * spread
      positions[i * 3 + 1] = y * spread * 0.62
      positions[i * 3 + 2] = Math.sin(t) * r * spread
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  if (config.dustCount === 0) return null

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={config.dustColor}
        size={0.035}
        transparent
        opacity={config.dustOpacity}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

function Field({
  data,
  animate,
  hovered,
  highlight,
  pointer,
  label,
  labelPosition,
  onHover,
}: {
  data: SystemFieldData
  animate: boolean
  hovered: number | null
  highlight: ProjectStatus | null
  pointer: React.RefObject<PointerState>
  label: React.RefObject<HTMLAnchorElement | null>
  labelPosition: React.RefObject<{ x: number; y: number }>
  onHover: (index: number | null) => void
}) {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const scratch = useMemo(() => new THREE.Vector3(), [])
  // 1 = drifting, 0 = held still. Eased so a hover brakes rather than stops.
  const drift = useRef(1)
  const hoveredRef = useRef(hovered)
  hoveredRef.current = hovered

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return

    const { width, height } = state.size
    const p = pointer.current
    const holding = hoveredRef.current !== null

    if (animate) {
      // Hold the field while a node is being pointed at, so the target does
      // not slide out from under the cursor.
      drift.current += ((holding ? 0 : 1) - drift.current) * Math.min(1, delta * 6)
      node.rotation.y +=
        (config.rotationsPerMinute / 60) * Math.PI * 2 * delta * drift.current

      if (config.pointerTilt > 0 && !holding) {
        // Ease toward the pointer so the field leans rather than snaps, and
        // settles level again once the pointer leaves.
        const nx = p.inside ? (p.x / width) * 2 - 1 : 0
        const ny = p.inside ? 1 - (p.y / height) * 2 : 0
        const targetX = -ny * config.pointerTilt
        const targetZ = nx * config.pointerTilt * 0.5
        node.rotation.x += (targetX - node.rotation.x) * Math.min(1, delta * 2.2)
        node.rotation.z += (targetZ - node.rotation.z) * Math.min(1, delta * 2.2)
      }
      node.updateMatrixWorld()
    }

    const toScreen = (index: number) => {
      scratch
        .set(...data.nodes[index].position)
        .applyMatrix4(node.matrixWorld)
        .project(state.camera)
      return { x: ((scratch.x + 1) / 2) * width, y: ((1 - scratch.y) / 2) * height }
    }

    // Nearest node within the hit radius. While the pointer is on the label
    // itself the current pick is kept, or the label could never be clicked.
    let pick = hoveredRef.current
    if (!p.overLabel) {
      pick = null
      if (p.inside) {
        let nearest = config.hitRadiusPx ** 2
        for (let i = 0; i < data.nodes.length; i += 1) {
          const s = toScreen(i)
          const distance = (s.x - p.x) ** 2 + (s.y - p.y) ** 2
          if (distance < nearest) {
            nearest = distance
            pick = i
          }
        }
      }
    }

    if (pick !== null) {
      const s = toScreen(pick)
      labelPosition.current.x = s.x
      labelPosition.current.y = s.y
      if (label.current) {
        label.current.style.transform = `translate(${s.x}px, ${s.y}px)`
      }
    }

    if (pick !== hoveredRef.current) {
      hoveredRef.current = pick
      onHover(pick)
    }
  })

  // Keep the field inside the frame on narrow viewports.
  const scale = Math.min(1, viewport.width / 7.5)

  return (
    <group ref={group} scale={scale}>
      <Dust />
      <Links data={data} dim={highlight !== null} />
      <Nodes data={data} hovered={hovered} highlight={highlight} />
    </group>
  )
}

export default function SystemFieldCanvas({
  data,
  animate,
  active,
  highlight,
  onLive,
}: {
  data: SystemFieldData
  /** False for reduced-motion visitors: the composition is held still. */
  animate: boolean
  /** False while the field is scrolled out of view. */
  active: boolean
  highlight: ProjectStatus | null
  onLive?: () => void
}) {
  const router = useRouter()
  const [hovered, setHovered] = useState<number | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLAnchorElement>(null)
  const labelPosition = useRef({ x: 0, y: 0 })
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: false, overLabel: false })
  const pointerType = useRef('mouse')

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current.x = event.clientX - rect.left
    pointer.current.y = event.clientY - rect.top
    pointer.current.inside = true
    pointerType.current = event.pointerType
    invalidate()
  }

  // A touch has no "leave", so a tap anywhere else dismisses the label.
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (container.current?.contains(event.target as Node)) return
      pointer.current.inside = false
      pointer.current.overLabel = false
      invalidate()
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  const node = hovered === null ? null : data.nodes[hovered]

  return (
    <div
      ref={container}
      className="relative h-full w-full"
      style={{ cursor: node ? 'pointer' : undefined }}
      onPointerMove={track}
      onPointerDown={track}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        pointer.current.inside = false
        invalidate()
      }}
      onClick={(event) => {
        // With a mouse the node itself is the target. A tap only reveals the
        // label; the label is the link, so a stray touch never navigates.
        if (!node || pointerType.current !== 'mouse') return
        if (label.current?.contains(event.target as Node)) return
        router.push(`/work/${node.id}`)
      }}
    >
      <Canvas
        // Demand mode draws only when asked: one held frame for a
        // reduced-motion visitor, and nothing at all once the hero has
        // scrolled out of view.
        frameloop={animate && active ? 'always' : 'demand'}
        dpr={[1, config.maxDpr]}
        camera={{ position: [0, 0, config.cameraZ], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={() => onLive?.()}
        // The SVG fallback beneath carries the label for assistive tech, and
        // the wrapper above handles the pointer.
        aria-hidden
        style={{ pointerEvents: 'none' }}
      >
        {/* Distance fade is what sells depth with unlit materials. */}
        <fog attach="fog" args={['#06070a', config.cameraZ - 4, config.cameraZ + 5]} />
        <Field
          data={data}
          animate={animate}
          hovered={hovered}
          highlight={highlight}
          pointer={pointer}
          label={label}
          labelPosition={labelPosition}
          onHover={setHovered}
        />
      </Canvas>

      {node ? (
        <Link
          ref={label}
          href={`/work/${node.id}`}
          // Reachable by pointer only: every project is already a real link
          // on /work, so this would be a duplicate, moving tab stop.
          tabIndex={-1}
          className="absolute left-0 top-0 z-10 block"
          style={{
            transform: `translate(${labelPosition.current.x}px, ${labelPosition.current.y}px)`,
          }}
          onPointerEnter={() => {
            pointer.current.overLabel = true
          }}
          onPointerLeave={() => {
            pointer.current.overLabel = false
            invalidate()
          }}
        >
          <span className="block -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-sm border border-border-strong bg-surface px-3 py-2 shadow-lg">
            <span className="block text-sm font-semibold text-ink">{node.title}</span>
            <span className="label-mono mt-1 flex items-center gap-2 text-ink-muted">
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ backgroundColor: config.statusColors[node.status] }}
              />
              {STATUS_LABELS[node.status]}
              <span className="text-accent">View →</span>
            </span>
          </span>
        </Link>
      ) : null}
    </div>
  )
}
