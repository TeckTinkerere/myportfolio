import { notFound } from 'next/navigation'

import { keystaticEnabled } from '../../keystatic.config'
import KeystaticApp from './keystatic'

export const metadata = { robots: { index: false, follow: false } }

export default function Layout() {
  // Same gate as the API route: no editor UI where the API is disabled.
  if (!keystaticEnabled) notFound()
  return <KeystaticApp />
}
