import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-sm text-center">
        <p className="label-mono text-ink-muted">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">No card here</h1>
        <p className="mt-2 text-ink-muted">This card doesn&rsquo;t exist, or its owner hasn&rsquo;t published it yet.</p>
        <Link href="/" className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline">
          Go to the home page
        </Link>
      </div>
    </main>
  )
}
