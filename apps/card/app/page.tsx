import Link from 'next/link'

/**
 * The bare domain. Cards live at /<handle>; there is no directory of them,
 * so this page only points owners to the editor.
 */
export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-sm text-center">
        <p className="label-mono text-ink-muted">card.mohdaslam.dev</p>
        {tag === 'unassigned' ? (
          <>
            <h1 className="mt-3 font-display text-2xl font-semibold">This card isn&rsquo;t set up yet</h1>
            <p className="mt-2 text-ink-muted">
              The NFC tag you tapped isn&rsquo;t linked to a published card. If it&rsquo;s yours, link it from the
              admin page.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 font-display text-2xl font-semibold">Digital business cards</h1>
            <p className="mt-2 text-ink-muted">Private, invite-only cards for Aslam and friends.</p>
          </>
        )}
        <Link
          href="/edit"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-contrast"
        >
          Edit my card
        </Link>
        <p className="mt-6 text-xs">
          <Link href="/privacy" className="text-ink-muted underline-offset-4 hover:underline">
            Privacy
          </Link>
          {' · '}
          <a href="https://mohdaslam.dev" className="text-ink-muted underline-offset-4 hover:underline">
            mohdaslam.dev
          </a>
        </p>
      </div>
    </main>
  )
}
