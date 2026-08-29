'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { systemFieldConfig } from '@/components/three/system-field.config'
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
 * Every tunable value lives in system-field.config.ts.
 */

const config = systemFieldConfig

function Nodes({ data }: { data: SystemFieldData }) {
  const ref = useRef<THREE.InstancedMesh>(null)

  // Per-instance transform and colour, written once.
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    const matrix = new THREE.Matrix4()
    const colour = new THREE.Color()

    data.nodes.forEach((node, index) => {
      const scale = node.featured ? config.nodeSizeFeatured : config.nodeSize
      matrix.makeScale(scale, scale, scale)
      matrix.setPosition(...node.position)
      mesh.setMatrixAt(index, matrix)
      mesh.setColorAt(index, colour.set(config.statusColors[node.status]))
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

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

function Links({ data }: { data: SystemFieldData }) {
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
        opacity={config.linkOpacity}
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

function Field({ data, animate }: { data: SystemFieldData; animate: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    const node = group.current
    if (!node || !animate) return

    node.rotation.y += (config.rotationsPerMinute / 60) * Math.PI * 2 * delta

    if (config.pointerTilt > 0) {
      // Pointer position is normalised device coords; ease toward it so the
      // field leans rather than snaps.
      const targetX = -state.pointer.y * config.pointerTilt
      const targetZ = state.pointer.x * config.pointerTilt * 0.5
      node.rotation.x += (targetX - node.rotation.x) * Math.min(1, delta * 2.2)
      node.rotation.z += (targetZ - node.rotation.z) * Math.min(1, delta * 2.2)
    }
  })

  // Keep the field inside the frame on narrow viewports.
  const scale = Math.min(1, viewport.width / 7.5)

  return (
    <group ref={group} scale={scale}>
      <Dust />
      <Links data={data} />
      <Nodes data={data} />
    </group>
  )
}

export default function SystemFieldCanvas({
  data,
  animate,
}: {
  data: SystemFieldData
  animate: boolean
}) {
  return (
    <Canvas
      // Demand mode renders exactly one frame, which is what a reduced-motion
      // visitor gets: the full composition, held still.
      frameloop={animate ? 'always' : 'demand'}
      dpr={[1, config.maxDpr]}
      camera={{ position: [0, 0, config.cameraZ], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      // Purely presentational: the SVG fallback beneath carries the label.
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      {/* Distance fade is what sells depth with unlit materials. */}
      <fog attach="fog" args={['#06070a', config.cameraZ - 4, config.cameraZ + 5]} />
      <Field data={data} animate={animate} />
    </Canvas>
  )
}
