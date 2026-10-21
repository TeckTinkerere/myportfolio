import { Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Nfc, Phone, type LucideIcon } from 'lucide-react'
import qrcode from 'qrcode-generator'
import { useId, type Ref } from 'react'

import { BLEED, cardSize, ptToMm } from '@/lib/design/dimensions'
import { elementText, qrValue, type DesignContext } from '@/lib/design/resolve'
import type { DesignDoc, DesignElement, DesignFont, DesignSide, IconName, Material } from '@/lib/design/schema'

/**
 * One side of a printed card as SVG, in millimetres. The studio canvas and
 * every export draw through this component, so what is on screen is what is
 * printed.
 *
 * Modes:
 *  - color:            full-colour print (PVC).
 *  - engrave-preview:  how a laser engraving will look on the material.
 *  - engrave-export:   the engraving file itself: black marks on white.
 */
export type RenderMode = 'color' | 'engrave-preview' | 'engrave-export'

export const ICON_COMPONENTS: Record<IconName, LucideIcon> = {
  nfc: Nfc,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  pin: MapPin,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
}

/** CSS font stacks for the design fonts. Exports pass resolved names. */
export const EDITOR_FONTS: Record<DesignFont, string> = {
  sans: 'var(--font-card-sans), system-ui, sans-serif',
  serif: 'var(--font-card-serif), Georgia, serif',
  rounded: 'var(--font-card-rounded), system-ui, sans-serif',
  mono: 'var(--font-mono), ui-monospace, monospace',
  display: 'var(--font-display), system-ui, sans-serif',
}

/** What a laser mark looks like on each material, and its blank surface. */
const ENGRAVE: Record<Exclude<Material, 'pvc'>, { surface: [string, string]; mark: string }> = {
  'metal-black': { surface: ['#2a2a2a', '#0d0d0d'], mark: '#d6d6d6' },
  'metal-silver': { surface: ['#e5e7eb', '#9ca3af'], mark: '#3f3f46' },
  wood: { surface: ['#c8925f', '#9a6537'], mark: '#3b2412' },
}

export interface SideSvgProps {
  side: DesignSide
  doc: Pick<DesignDoc, 'orientation' | 'material'>
  ctx: DesignContext
  mode?: RenderMode
  fonts?: Record<DesignFont, string>
  /** Map an image URL to what the SVG should load (exports inline data URLs). */
  imageHref?: (src: string) => string
  /** Draw the bleed area (exports). Off: draw only the trimmed card. */
  withBleed?: boolean
  className?: string
  svgRef?: Ref<SVGSVGElement>
  /** Pixel size for exports; omit to scale with CSS. */
  pixelWidth?: number
  pixelHeight?: number
}

export function SideSvg({
  side,
  doc,
  ctx,
  mode = 'color',
  fonts = EDITOR_FONTS,
  imageHref = (s) => s,
  withBleed = true,
  className,
  svgRef,
  pixelWidth,
  pixelHeight,
}: SideSvgProps) {
  const { w, h } = cardSize(doc.orientation)
  const pad = withBleed ? BLEED : 0
  const engraved = doc.material !== 'pvc' && mode !== 'color'
  const look = doc.material !== 'pvc' ? ENGRAVE[doc.material] : null
  const markColour = mode === 'engrave-export' ? '#000000' : look?.mark ?? '#000000'
  const colour = (c: string | null) => (c === null ? null : engraved ? markColour : c)
  const bg = side.background
  // Unique per rendering: the studio shows several sides at once, and a
  // shared id would let one side's gradient paint another.
  const gradId = `bg-${useId().replace(/:/g, '')}`

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`}
      width={pixelWidth}
      height={pixelHeight}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${bg.angle - 90} 0.5 0.5)`}>
          <stop offset="0" stopColor={engraved && look ? look.surface[0] : bg.color} />
          <stop offset="1" stopColor={engraved && look ? look.surface[1] : bg.color2} />
        </linearGradient>
        <filter id="engrave-image">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* ------------------------------------------------------ background */}
      {mode === 'engrave-export' ? (
        <rect x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} fill="#ffffff" />
      ) : engraved ? (
        <rect x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} fill={`url(#${gradId})`} />
      ) : bg.kind === 'image' && bg.image ? (
        <>
          <rect x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} fill={bg.color} />
          <image href={imageHref(bg.image)} x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} preserveAspectRatio="xMidYMid slice" />
        </>
      ) : (
        <rect x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} fill={bg.kind === 'gradient' ? `url(#${gradId})` : bg.color} />
      )}

      {/* -------------------------------------------------------- elements */}
      {side.elements.map((el) =>
        el.hidden ? null : (
          <g
            key={el.id}
            data-element-id={el.id}
            transform={el.rotation ? `rotate(${el.rotation} ${el.x + el.w / 2} ${el.y + el.h / 2})` : undefined}
          >
            <ElementSvg el={el} ctx={ctx} fonts={fonts} colour={colour} engraved={engraved} imageHref={imageHref} />
          </g>
        ),
      )}
    </svg>
  )
}

function ElementSvg({
  el,
  ctx,
  fonts,
  colour,
  engraved,
  imageHref,
}: {
  el: DesignElement
  ctx: DesignContext
  fonts: Record<DesignFont, string>
  colour: (c: string | null) => string | null
  engraved: boolean
  imageHref: (src: string) => string
}) {
  switch (el.type) {
    case 'text': {
      const sizeMm = ptToMm(el.size)
      const lines = elementText(el, ctx).split('\n')
      const anchor = el.align === 'center' ? 'middle' : el.align === 'right' ? 'end' : 'start'
      const tx = el.align === 'center' ? el.x + el.w / 2 : el.align === 'right' ? el.x + el.w : el.x
      return (
        <text
          x={tx}
          y={el.y + sizeMm * 0.92}
          fill={colour(el.color) ?? undefined}
          fontSize={sizeMm}
          fontWeight={el.weight}
          fontStyle={el.italic ? 'italic' : undefined}
          letterSpacing={el.letterSpacing ? el.letterSpacing * sizeMm : undefined}
          textAnchor={anchor}
          style={{ fontFamily: fonts[el.font] }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={tx} dy={i === 0 ? 0 : sizeMm * el.lineHeight}>
              {line || ' '}
            </tspan>
          ))}
        </text>
      )
    }

    case 'image': {
      const clip = `clip-${el.id}`
      return (
        <>
          <defs>
            <clipPath id={clip}>
              <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.radius} />
            </clipPath>
          </defs>
          <image
            href={imageHref(el.src)}
            x={el.x}
            y={el.y}
            width={el.w}
            height={el.h}
            opacity={el.opacity}
            clipPath={`url(#${clip})`}
            filter={engraved ? 'url(#engrave-image)' : undefined}
            preserveAspectRatio={el.fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}
          />
        </>
      )
    }

    case 'qr': {
      const qr = qrcode(0, 'M')
      qr.addData(qrValue(el, ctx))
      qr.make()
      const n = qr.getModuleCount()
      const side = Math.min(el.w, el.h)
      const cell = side / n
      let d = ''
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${(c * cell).toFixed(3)} ${(r * cell).toFixed(3)}h${cell.toFixed(3)}v${cell.toFixed(3)}h-${cell.toFixed(3)}z`
      }
      // A light backing plate with a quiet zone, so dark-background cards
      // still scan. Engravings skip it: the surface is the background.
      const quiet = cell * 2
      const plate = colour(el.background)
      return (
        <g transform={`translate(${el.x + (el.w - side) / 2} ${el.y + (el.h - side) / 2})`}>
          {plate && !engraved && <rect x={-quiet} y={-quiet} width={side + quiet * 2} height={side + quiet * 2} rx={quiet} fill={plate} />}
          <path d={d} fill={colour(el.color) ?? '#000'} shapeRendering="crispEdges" />
        </g>
      )
    }

    case 'shape': {
      const fill = colour(el.fill) ?? 'none'
      const stroke = colour(el.stroke) ?? undefined
      const common = { fill, stroke, strokeWidth: el.stroke ? el.strokeWidth : undefined, opacity: el.opacity }
      if (el.shape === 'ellipse') return <ellipse cx={el.x + el.w / 2} cy={el.y + el.h / 2} rx={el.w / 2} ry={el.h / 2} {...common} />
      if (el.shape === 'line') {
        return <line x1={el.x} y1={el.y + el.h / 2} x2={el.x + el.w} y2={el.y + el.h / 2} stroke={colour(el.stroke ?? el.fill) ?? '#000'} strokeWidth={el.strokeWidth || el.h} opacity={el.opacity} />
      }
      return <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.radius} {...common} />
    }

    case 'icon': {
      const Icon = ICON_COMPONENTS[el.icon]
      return <Icon x={el.x} y={el.y} width={el.w} height={el.h} color={colour(el.color) ?? '#000'} strokeWidth={2} />
    }
  }
}
