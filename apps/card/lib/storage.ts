import 'server-only'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { requireEnv } from './env'

/**
 * Card images in Neon Object Storage (S3-compatible, public-read bucket).
 * Uploads go through the server with a write credential; the browser only
 * ever reads the public URL.
 */

let client: S3Client | undefined

function s3() {
  client ??= new S3Client({
    region: requireEnv('AWS_REGION'),
    endpoint: requireEnv('AWS_ENDPOINT_URL_S3'),
    credentials: {
      accessKeyId: requireEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY'),
    },
    forcePathStyle: true,
    // See Neon's quickstart: recent SDKs otherwise sign an empty-body checksum.
    requestChecksumCalculation: 'WHEN_REQUIRED',
  })
  return client
}

export function mediaBaseUrl(): string {
  return `${requireEnv('AWS_ENDPOINT_URL_S3').replace(/\/$/, '')}/${requireEnv('MEDIA_BUCKET')}/`
}

/** True when a URL points into this app's bucket. Cards may show nothing else. */
export function isMediaUrl(url: string): boolean {
  return url.startsWith(mediaBaseUrl())
}

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export async function putImage(key: string, body: Uint8Array, contentType: keyof typeof IMAGE_TYPES) {
  await s3().send(
    new PutObjectCommand({
      Bucket: requireEnv('MEDIA_BUCKET'),
      Key: key,
      Body: body,
      ContentType: contentType,
      // Keys are random per upload, so the object never changes.
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  return mediaBaseUrl() + key
}

export async function deleteImage(url: string) {
  if (!isMediaUrl(url)) return
  await s3().send(
    new DeleteObjectCommand({ Bucket: requireEnv('MEDIA_BUCKET'), Key: url.slice(mediaBaseUrl().length) }),
  )
}

/** Image bytes sniffed from the header, not trusted from the upload. */
export function sniffImageType(bytes: Uint8Array): keyof typeof IMAGE_TYPES | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png'
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}
