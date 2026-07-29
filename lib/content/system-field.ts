import 'server-only'

import { systemFieldConfig } from '@/components/three/system-field.config'
import { getPublicProjects } from '@/lib/content/queries'
import type { PortfolioLens, ProjectStatus } from '@/lib/content/schema'

/**
 * Turns the published project set into the hero's 3D node field.
 *
 * The field is not decoration: every node is one real, published project,
 * placed by the lenses it belongs to and coloured by its actual status. It
 * is generated from the same query layer as the pages, so an unpublished or
 * permission-pending item can no more appear here than it can on /work.
 *
 * Positions are deterministic — derived from the slug, never random — so the
 * server-rendered SVG fallback and the WebGL scene agree exactly and there is
 * no hydration mismatch.
 */

export type SystemNode = {
  id: string
  title: string
  status: ProjectStatus
  position: [number, number, number]
  featured: boolean
}

export type SystemFieldData = {
  nodes: SystemNode[]
  /** Index pairs into `nodes`. */
  links: [number, number][]
}

/**
 * Anchor directions for the four capability lenses. 'general' is excluded —
 * almost everything carries it, so including it would pull the whole field
 * into a single clump.
 */
const LENS_ANCHORS: Partial<Record<PortfolioLens, [number, number, number]>> = {
  software: [-1, 0.34, 0.12],
  websites: [0.22, 0.94, -0.1],
  events: [1, -0.16, 0.2],
  community: [-0.12, -1, -0.08],
}

/** Deterministic 32-bit hash. Same slug always yields the same jitter. */
function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Two independent values in [-1, 1] from one slug. */
function jitter(slug: string): [number, number, number] {
  const h = hash(slug)
  return [
    ((h & 0xff) / 255) * 2 - 1,
    (((h >> 8) & 0xff) / 255) * 2 - 1,
    (((h >> 16) & 0xff) / 255) * 2 - 1,
  ]
}

function normalise([x, y, z]: [number, number, number]): [number, number, number] {
  const length = Math.hypot(x, y, z) || 1
  return [x / length, y / length, z / length]
}

export function buildSystemField(): SystemFieldData {
  const projects = getPublicProjects()
  const { radius, linkAtSharedLenses } = systemFieldConfig

  const nodes: SystemNode[] = projects.map((project) => {
    const anchors = project.lenses
      .map((lens) => LENS_ANCHORS[lens])
      .filter((anchor): anchor is [number, number, number] => Boolean(anchor))

    // A project with only the 'general' lens still needs a direction; fall
    // back to its own hash so it sits somewhere stable rather than at origin.
    const base: [number, number, number] =
      anchors.length > 0
        ? [
            anchors.reduce((sum, a) => sum + a[0], 0) / anchors.length,
            anchors.reduce((sum, a) => sum + a[1], 0) / anchors.length,
            anchors.reduce((sum, a) => sum + a[2], 0) / anchors.length,
          ]
        : jitter(project.slug)

    const [jx, jy, jz] = jitter(project.slug)
    const direction = normalise([
      base[0] + jx * 0.42,
      base[1] + jy * 0.42,
      base[2] + jz * 0.42,
    ])

    // Slight radius variation so the field reads as a shell with depth
    // rather than a perfect sphere. The shift must be unsigned: `>>` coerces
    // to int32 first, so any hash above 2^31 would come back negative and
    // pull the node inside the intended shell.
    const r = radius * (0.82 + ((hash(project.slug) >>> 24) / 255) * 0.3)

    return {
      id: project.slug,
      title: project.title,
      status: project.status,
      position: [direction[0] * r, direction[1] * r, direction[2] * r],
      featured: Boolean(project.featuredRank) || project.tier === 1,
    }
  })

  // Link projects that genuinely overlap. Sparse by design — a fully
  // connected graph is visual noise, not information.
  const links: [number, number][] = []
  for (let i = 0; i < projects.length; i += 1) {
    for (let j = i + 1; j < projects.length; j += 1) {
      const shared = projects[i].lenses.filter((lens) =>
        projects[j].lenses.includes(lens),
      ).length
      if (shared >= linkAtSharedLenses) links.push([i, j])
    }
  }

  return { nodes, links }
}
