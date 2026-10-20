/**
 * @jest-environment node
 */
// Node, not jsdom: jsdom has no TextEncoder/TextDecoder, which Web NFC
// records are decoded with in the browser.
import { classifyUrl, decodeRecord, nfcErrorMessage } from '@/lib/card/ndef'

const view = (s: string) => new DataView(new TextEncoder().encode(s).buffer)

describe('NDEF helpers', () => {
  const origin = 'https://card.mohdaslam.dev'

  it('decodes URL and text records', () => {
    expect(decodeRecord({ recordType: 'url', data: view('https://card.mohdaslam.dev/t/k7m2x9qa') })).toEqual({
      type: 'URL',
      value: 'https://card.mohdaslam.dev/t/k7m2x9qa',
    })
    expect(decodeRecord({ recordType: 'text', encoding: 'utf-8', data: view('hello') })).toEqual({ type: 'Text', value: 'hello' })
    expect(decodeRecord({ recordType: 'smart-poster', data: view('abc') }).value).toBe('3 bytes')
  })

  it('recognises tag links, handle links and foreign URLs', () => {
    expect(classifyUrl(`${origin}/t/K7M2X9QA`, origin)).toEqual({ kind: 'tag', id: 'k7m2x9qa' })
    expect(classifyUrl(`${origin}/aslam`, origin)).toEqual({ kind: 'handle', handle: 'aslam' })
    expect(classifyUrl('https://ogc.link/u/MohamedAslam', origin)).toEqual({ kind: 'other' })
    expect(classifyUrl(`${origin}/edit/123`, origin)).toEqual({ kind: 'other' })
    expect(classifyUrl('not a url', origin)).toEqual({ kind: 'other' })
  })

  it('explains Web NFC errors in plain words', () => {
    expect(nfcErrorMessage(new DOMException('x', 'NotAllowedError'))).toMatch(/locked/)
    expect(nfcErrorMessage(new DOMException('x', 'NetworkError'))).toMatch(/Hold it still/)
    expect(nfcErrorMessage(new Error('boom'))).toBe('boom')
  })
})
