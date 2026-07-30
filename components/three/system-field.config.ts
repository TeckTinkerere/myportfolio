/**
 * Everything tunable about the hero's 3D field lives here.
 *
 * Change a number, reload, done — no need to touch the scene code. Colours
 * are plain hex because they cross into WebGL, which cannot read CSS
 * variables; they mirror the dark-theme tokens in app/globals.css, so if you
 * retune a token, retune its twin here.
 */
// Not `as const` on the outer object: these are values to tune, and widening
// them to `number` is what lets guards like `dustCount === 0` typecheck.
export const systemFieldConfig: {
  radius: number
  nodeSize: number
  nodeSizeFeatured: number
  rotationsPerMinute: number
  pointerTilt: number
  linkAtSharedLenses: number
  linkOpacity: number
  dustCount: number
  dustOpacity: number
  cameraZ: number
  maxDpr: number
  statusColors: Record<import('@/lib/content/schema').ProjectStatus, string>
  dustColor: string
  linkColor: string
} = {
  /** Radius of the sphere the project nodes are distributed over. */
  radius: 3.1,

  /** Node size in world units. Live work is drawn slightly larger. */
  nodeSize: 0.085,
  nodeSizeFeatured: 0.13,

  /** Full rotations per minute. Slow enough to read as drift, not spin. */
  rotationsPerMinute: 0.55,

  /** How far the field tilts toward the pointer, in radians. 0 disables it. */
  pointerTilt: 0.12,

  /** Draw a line between two projects that share this many lenses or more. */
  linkAtSharedLenses: 2,
  linkOpacity: 0.22,

  /** Ambient dust behind the nodes. Set to 0 to remove entirely. */
  dustCount: 220,
  dustOpacity: 0.35,

  /** Camera distance. Larger pulls the field further away. */
  cameraZ: 8.2,

  /**
   * Device pixel ratio ceiling. Above 2 the cost rises sharply for almost no
   * visible gain on a field this sparse.
   */
  maxDpr: 1.75,

  /** Status → colour. Mirrors the status tokens used across the site. */
  statusColors: {
    live: '#65c18c',
    'pilot-completed': '#65c18c',
    'in-development': '#f4b942',
    prototype: '#f4b942',
    archived: '#5a6570',
    concept: '#3d4650',
    confidential: '#3d4650',
  },

  dustColor: '#2b3f52',
  linkColor: '#f4b942',
}

export type SystemFieldConfig = typeof systemFieldConfig
