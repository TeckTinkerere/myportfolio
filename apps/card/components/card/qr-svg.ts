import qrcode from 'qrcode-generator'

/**
 * An SVG QR code as a string. Error correction M survives a scuffed print
 * while keeping the code small enough to scan off a phone screen.
 */
export function qrSvg(text: string, { margin = 2, dark = '#000', light = '#fff' } = {}): string {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const count = qr.getModuleCount()
  const size = count + margin * 2
  let path = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) path += `M${c + margin} ${r + margin}h1v1h-1z`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${light}"/><path d="${path}" fill="${dark}"/></svg>`
}
