/**
 * NFC tag ids. A chip stores /t/<id>, so ids are short (fewer bytes on a
 * small NTAG213) and avoid characters people misread off a printed card.
 */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

export const TAG_PATTERN = /^[a-z0-9]{8}$/

/** Cache tag for tag → card lookups; expire it whenever a mapping can change. */
export const TAGS_CACHE_TAG = 'nfc-tags'

export function newTagId(random: (n: number) => Uint8Array = randomBytes): string {
  const bytes = random(8)
  let id = ''
  for (const b of bytes) id += ALPHABET[b % ALPHABET.length]
  return id
}

function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n)
  crypto.getRandomValues(out)
  return out
}
