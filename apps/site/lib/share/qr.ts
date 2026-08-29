import qrcode from 'qrcode-generator'

/**
 * QR generation for share links.
 *
 * Deliberately not server-only. The share dialog is loaded on first press
 * rather than with the page, so this module travels in that lazy chunk and
 * the encoder reaches a browser only once someone has actually asked to
 * share something — the same bargain components/three makes with three.js.
 *
 * The alternative was encoding at build time and shipping finished SVG in
 * the HTML. That was measured and rejected: /work renders seventeen cards,
 * and seventeen QR path strings in the payload cost more than the encoder
 * does, on every visit, for a control most visitors never press.
 *
 * Three choices here are about scanning, not looks, and should not be
 * "designed" later:
 *
 * - Colours are fixed black-on-white and deliberately ignore the theme.
 *   A themed QR — amber modules on near-black — inverts the polarity most
 *   scanners assume and drops contrast below what they need. The code sits
 *   on its own white card instead, in both themes.
 * - The quiet zone is four modules, the margin the QR specification
 *   requires. Trimming it to make the code look tighter is the single most
 *   common reason a valid code will not scan.
 * - Error correction stays at M. Higher levels add modules, and a denser
 *   code is *harder* to scan at the physical size a phone screen gives it,
 *   which is the opposite of the intent.
 */

/** Four modules, per ISO/IEC 18004. Not a style value. */
const QUIET_ZONE_MODULES = 4

export type QrCode = {
  /** SVG markup, sized entirely by CSS via its viewBox. */
  svg: string
  /** Module count per side, before the quiet zone. Useful for tests. */
  moduleCount: number
}

export function renderQrSvg(value: string, accessibleLabel: string): QrCode {
  const qr = qrcode(0, 'M')
  qr.addData(value)
  qr.make()

  const svg = qr
    .createSvgTag({ cellSize: 1, margin: QUIET_ZONE_MODULES, scalable: true })
    // The generator emits a bare <svg>. Announce it as one image with a
    // meaningful name rather than letting a screen reader meet an unlabelled
    // graphic, and keep it out of the tab order.
    .replace(
      '<svg ',
      `<svg role="img" focusable="false" aria-label="${escapeAttribute(accessibleLabel)}" `,
    )

  return { svg, moduleCount: qr.getModuleCount() }
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
