import { cn } from './cn'

/**
 * Line illustrations shared by both apps.
 *
 * Drawn in the instrument-panel palette and coloured entirely through the
 * theme's CSS custom properties, so every one of them flips with light/dark
 * without a second asset. All are decorative (aria-hidden): the words next
 * to them carry the meaning, the picture carries the mood.
 *
 * Every illustration shares one 240×160 canvas so they can sit in the same
 * grid at the same size without per-call tuning.
 */

const INK = 'hsl(var(--text-secondary))'
const LINE = 'hsl(var(--border-strong))'
const ACC = 'hsl(var(--accent))'
const FILL = 'hsl(var(--surface-raised))'
const PAPER = 'hsl(var(--surface))'

type IllustrationProps = { className?: string }

function Canvas({
  className,
  children,
}: IllustrationProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={cn('h-auto w-full', className)}
    >
      {children}
    </svg>
  )
}

/** A seated audience member: head and shoulders. */
function Person({ x, y, scale = 1, accent = false }: { x: number; y: number; scale?: number; accent?: boolean }) {
  const r = 7 * scale
  const w = 14 * scale
  return (
    <g stroke={accent ? ACC : LINE} fill={accent ? ACC : FILL} fillOpacity={accent ? 0.25 : 1}>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x - w} ${y + r + 16 * scale} a${w} ${12 * scale} 0 0 1 ${w * 2} 0`} />
    </g>
  )
}

/** Microphone with sound waves. Host / emcee. */
export function MicIllustration({ className }: IllustrationProps) {
  return (
    <Canvas className={className}>
      <path d="M72 46 q-10 16 0 32 M58 36 q-16 26 0 52" stroke={ACC} />
      <path d="M168 46 q10 16 0 32 M182 36 q16 26 0 52" stroke={ACC} />
      <rect x="100" y="22" width="40" height="62" rx="20" fill={FILL} stroke={INK} />
      <path d="M104 40 h32 M102 52 h36 M104 64 h32" stroke={LINE} />
      <path d="M86 66 a34 34 0 0 0 68 0" stroke={INK} />
      <path d="M120 100 v30 M96 132 h48" stroke={INK} />
      <circle cx="120" cy="52" r="3" fill={ACC} stroke="none" />
    </Canvas>
  )
}

/** Presenter, screen and a seated room. Workshop / instructor. */
export function WorkshopIllustration({ className }: IllustrationProps) {
  return (
    <Canvas className={className}>
      <rect x="70" y="14" width="140" height="78" rx="3" fill={FILL} stroke={INK} />
      <path d="M84 30 h52 M84 42 h72 M84 54 h40" stroke={LINE} />
      <path d="M150 78 v-14 M164 78 v-24 M178 78 v-32 M192 78 v-20" stroke={ACC} strokeWidth={5} strokeLinecap="butt" />
      <circle cx="40" cy="52" r="9" fill={ACC} fillOpacity={0.25} stroke={ACC} />
      <path d="M40 61 v28 M40 70 l24 -14 M40 89 l-8 20 M40 89 l8 20" stroke={ACC} />
      <Person x={84} y={120} />
      <Person x={124} y={120} />
      <Person x={164} y={120} />
      <Person x={204} y={120} />
    </Canvas>
  )
}

/** Two laptops racing a clock. Hackathon / facilitation. */
export function HackathonIllustration({ className }: IllustrationProps) {
  const laptop = (x: number) => (
    <g>
      <rect x={x} y="68" width="72" height="46" rx="3" fill={FILL} stroke={INK} />
      <path d={`M${x + 10} 82 l8 6 -8 6 M${x + 24} 96 h18`} stroke={ACC} />
      <path d={`M${x - 8} 118 h88 l-6 8 h-76 z`} fill={PAPER} stroke={INK} />
    </g>
  )
  return (
    <Canvas className={className}>
      {laptop(26)}
      {laptop(142)}
      <circle cx="120" cy="40" r="22" fill={PAPER} stroke={ACC} />
      <path d="M120 26 v14 l9 6" stroke={ACC} />
      <path d="M112 14 h16" stroke={ACC} />
      <path d="M116 88 l-6 14 h10 l-6 14" stroke={ACC} />
    </Canvas>
  )
}

/** Clipboard checklist. Event operations. */
export function ChecklistIllustration({ className }: IllustrationProps) {
  const rows = [44, 70, 96, 122]
  return (
    <Canvas className={className}>
      <rect x="72" y="18" width="96" height="130" rx="4" fill={FILL} stroke={INK} />
      <rect x="100" y="10" width="40" height="16" rx="3" fill={ACC} fillOpacity={0.3} stroke={ACC} />
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="86" y={y - 7} width="14" height="14" rx="2" fill={PAPER} stroke={i < 3 ? ACC : LINE} />
          {i < 3 ? <path d={`M89 ${y} l3 3 6 -7`} stroke={ACC} /> : null}
          <path d={`M110 ${y} h${i % 2 ? 30 : 44}`} stroke={LINE} />
        </g>
      ))}
    </Canvas>
  )
}

/** A hub connecting people. Organising / co-hosting. */
export function NetworkIllustration({ className }: IllustrationProps) {
  const nodes: [number, number][] = [
    [48, 40], [120, 20], [192, 40], [206, 110], [120, 140], [34, 110],
  ]
  return (
    <Canvas className={className}>
      {nodes.map(([x, y], i) => (
        <path key={`l${i}`} d={`M120 80 L${x} ${y}`} stroke={LINE} strokeDasharray="3 4" />
      ))}
      <path d="M48 40 L120 20 L192 40 M206 110 L120 140 L34 110" stroke={LINE} />
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r="10" fill={FILL} stroke={INK} />
      ))}
      <circle cx="120" cy="80" r="22" fill={ACC} fillOpacity={0.2} stroke={ACC} />
      <circle cx="120" cy="80" r="8" fill={ACC} stroke="none" />
    </Canvas>
  )
}

/** Terminal with code. Software & automation. */
export function CodeIllustration({ className }: IllustrationProps) {
  return (
    <Canvas className={className}>
      <rect x="26" y="18" width="188" height="124" rx="4" fill={FILL} stroke={INK} />
      <path d="M26 36 h188" stroke={LINE} />
      <circle cx="38" cy="27" r="3" fill={ACC} stroke="none" />
      <circle cx="49" cy="27" r="3" fill={LINE} stroke="none" />
      <circle cx="60" cy="27" r="3" fill={LINE} stroke="none" />
      <path d="M42 54 l8 6 -8 6" stroke={ACC} />
      <path d="M58 60 h70 M58 78 h40 M74 94 h84 M74 110 h56 M58 126 h30" stroke={LINE} />
      <path d="M104 78 h48" stroke={ACC} />
      <g transform="translate(176 104)" stroke={ACC}>
        <circle r="12" fill={PAPER} />
        <circle r="4" />
        <path d="M0 -18 v5 M0 13 v5 M-18 0 h5 M13 0 h5 M-13 -13 l3.5 3.5 M9.5 9.5 l3.5 3.5 M13 -13 l-3.5 3.5 M-9.5 9.5 l-3.5 3.5" />
      </g>
    </Canvas>
  )
}

/** Browser plus phone, one layout at two sizes. Websites & products. */
export function BrowserIllustration({ className }: IllustrationProps) {
  return (
    <Canvas className={className}>
      <rect x="18" y="18" width="170" height="118" rx="4" fill={FILL} stroke={INK} />
      <path d="M18 34 h170" stroke={LINE} />
      <rect x="54" y="23" width="100" height="6" rx="3" fill={PAPER} stroke={LINE} />
      <rect x="30" y="44" width="146" height="34" rx="2" fill={ACC} fillOpacity={0.18} stroke={ACC} />
      <path d="M40 56 h60 M40 66 h36" stroke={ACC} />
      <rect x="30" y="88" width="44" height="36" rx="2" fill={PAPER} stroke={LINE} />
      <rect x="81" y="88" width="44" height="36" rx="2" fill={PAPER} stroke={LINE} />
      <rect x="132" y="88" width="44" height="36" rx="2" fill={PAPER} stroke={LINE} />
      <rect x="176" y="60" width="48" height="88" rx="7" fill={PAPER} stroke={INK} />
      <rect x="183" y="72" width="34" height="18" rx="2" fill={ACC} fillOpacity={0.18} stroke={ACC} />
      <path d="M183 98 h34 M183 108 h24 M183 118 h30" stroke={LINE} />
      <path d="M194 141 h12" stroke={INK} />
    </Canvas>
  )
}

/** People side by side around something growing. Community initiatives. */
export function CommunityIllustration({ className }: IllustrationProps) {
  const figure = (x: number, accent = false) => (
    <g stroke={accent ? ACC : INK} fill={accent ? ACC : FILL} fillOpacity={accent ? 0.2 : 1}>
      <circle cx={x} cy="58" r="11" />
      <path d={`M${x - 16} 118 v-26 a16 16 0 0 1 32 0 v26`} />
    </g>
  )
  return (
    <Canvas className={className}>
      <path d="M20 132 h200" stroke={LINE} />
      {figure(52)}
      {figure(188)}
      <path d="M68 96 q20 16 36 18 M172 96 q-20 16 -36 18" stroke={INK} />
      <path d="M120 132 v-40" stroke={ACC} />
      <path d="M120 104 q-22 -4 -24 -26 q22 2 24 26 z" fill={ACC} fillOpacity={0.25} stroke={ACC} />
      <path d="M120 92 q20 -4 22 -24 q-20 2 -22 24 z" fill={ACC} fillOpacity={0.25} stroke={ACC} />
      <path d="M108 132 a12 6 0 0 1 24 0" fill={FILL} stroke={INK} />
    </Canvas>
  )
}

/** A running order with "now" highlighted. Run sheets. */
export function RunSheetIllustration({ className }: IllustrationProps) {
  const rows = [38, 62, 86, 110, 134]
  return (
    <Canvas className={className}>
      <rect x="44" y="16" width="152" height="136" rx="4" fill={FILL} stroke={INK} />
      <path d="M66 32 v112" stroke={LINE} />
      {rows.map((y, i) => {
        const now = i === 2
        return (
          <g key={y}>
            {now ? (
              <rect x="54" y={y - 10} width="132" height="20" rx="2" fill={ACC} fillOpacity={0.15} stroke="none" />
            ) : null}
            <circle cx="66" cy={y} r={now ? 5 : 3.5} fill={now || i < 2 ? ACC : PAPER} stroke={now || i < 2 ? ACC : LINE} />
            <path d={`M80 ${y} h18`} stroke={now ? ACC : INK} strokeWidth={3} />
            <path d={`M106 ${y} h${[60, 44, 70, 38, 52][i]}`} stroke={now ? ACC : LINE} />
          </g>
        )
      })}
    </Canvas>
  )
}

/**
 * A lit stage: screen, lectern, mic and a room. The emcee site's signature
 * picture, drawn wider than the rest and allowed to fill its container.
 */
export function StageIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={cn('h-auto w-full', className)}
    >
      <defs>
        <linearGradient id="stage-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
          <stop offset="1" stopColor="hsl(var(--accent))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="70" y="24" width="260" height="110" rx="4" fill={FILL} stroke={INK} />
      <path d="M92 50 h110 M92 66 h150 M92 82 h80" stroke={LINE} />
      <path d="M254 118 v-20 M272 118 v-34 M290 118 v-48 M308 118 v-28" stroke={ACC} strokeWidth={8} strokeLinecap="butt" />
      <polygon points="200,0 142,176 258,176" fill="url(#stage-beam)" />
      <path d="M40 176 h320" stroke={INK} />
      <path d="M176 134 h48 l-6 42 h-36 z" fill={PAPER} stroke={INK} />
      <path d="M200 134 l8 -18" stroke={INK} />
      <rect x="203" y="104" width="10" height="16" rx="5" transform="rotate(24 208 112)" fill={ACC} stroke={ACC} />
      {[40, 90, 140, 190, 240, 290, 340].map((x, i) => (
        <Person key={`a${x}`} x={x + 10} y={200} accent={i === 3} />
      ))}
      {[15, 65, 115, 165, 215, 265, 315, 365].map((x) => (
        <Person key={`b${x}`} x={x + 10} y={232} scale={1.1} />
      ))}
    </svg>
  )
}

/** Handshake-free "let's talk": a speech bubble pair. Booking / contact. */
export function ConversationIllustration({ className }: IllustrationProps) {
  return (
    <Canvas className={className}>
      <path d="M30 30 h110 a8 8 0 0 1 8 8 v44 a8 8 0 0 1 -8 8 h-70 l-18 16 v-16 h-22 a8 8 0 0 1 -8 -8 v-44 a8 8 0 0 1 8 -8 z" fill={FILL} stroke={INK} />
      <path d="M46 50 h76 M46 66 h52" stroke={LINE} />
      <path d="M210 64 h-96 a8 8 0 0 0 -8 8 v40 a8 8 0 0 0 8 8 h60 l18 16 v-16 h18 a8 8 0 0 0 8 -8 v-40 a8 8 0 0 0 -8 -8 z" fill={ACC} fillOpacity={0.15} stroke={ACC} />
      <path d="M124 84 h66 M124 100 h40" stroke={ACC} />
    </Canvas>
  )
}
