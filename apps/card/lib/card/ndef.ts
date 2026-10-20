/**
 * Reading NDEF records back into something a person can check: what is on
 * this chip, and does it point at one of our cards?
 */

export interface DecodedRecord {
  type: string
  value: string
}

interface RecordLike {
  recordType: string
  mediaType?: string
  encoding?: string
  data?: DataView
}

export function decodeRecord(record: RecordLike): DecodedRecord {
  const bytes = record.data ? new Uint8Array(record.data.buffer, record.data.byteOffset, record.data.byteLength) : null
  if (!bytes) return { type: record.recordType, value: '' }

  switch (record.recordType) {
    case 'url':
    case 'absolute-url':
      return { type: 'URL', value: new TextDecoder().decode(bytes) }
    case 'text':
      return { type: 'Text', value: new TextDecoder(record.encoding || 'utf-8').decode(bytes) }
    case 'mime':
      return {
        type: record.mediaType || 'MIME',
        value: record.mediaType?.startsWith('text/') ? new TextDecoder().decode(bytes) : `${bytes.length} bytes`,
      }
    case 'empty':
      return { type: 'Empty', value: '' }
    default:
      return { type: record.recordType, value: `${bytes.length} bytes` }
  }
}

export type CardTarget =
  | { kind: 'tag'; id: string }
  | { kind: 'handle'; handle: string }
  | { kind: 'other' }

/** Classify a URL read off a chip against this app's origin. */
export function classifyUrl(url: string, origin: string): CardTarget {
  let u: URL
  let base: URL
  try {
    u = new URL(url)
    base = new URL(origin)
  } catch {
    return { kind: 'other' }
  }
  if (u.hostname !== base.hostname) return { kind: 'other' }
  const tag = u.pathname.match(/^\/t\/([a-z0-9]{8})\/?$/i)
  if (tag) return { kind: 'tag', id: tag[1].toLowerCase() }
  const handle = u.pathname.match(/^\/([a-z0-9-]{3,32})\/?$/i)
  if (handle) return { kind: 'handle', handle: handle[1].toLowerCase() }
  return { kind: 'other' }
}

/** Human-readable reason for a Web NFC failure. */
export function nfcErrorMessage(err: unknown): string {
  const name = err instanceof DOMException ? err.name : ''
  switch (name) {
    case 'NotAllowedError':
      return 'NFC was blocked. Allow NFC for this site, or the tag is locked (read-only) and cannot be written.'
    case 'NotSupportedError':
      return 'This tag cannot hold that data. Try another tag (NTAG213, 215 or 216 all work).'
    case 'NotReadableError':
      return 'NFC is off or busy. Turn on NFC in your phone settings and try again.'
    case 'NetworkError':
      return 'Lost contact with the tag. Hold it still against the back of the phone and try again.'
    case 'AbortError':
      return 'Stopped.'
    case 'InvalidStateError':
      return 'Another NFC operation is still running. Wait a moment and try again.'
    default:
      return err instanceof Error ? err.message : 'Something went wrong with NFC.'
  }
}
