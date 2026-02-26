'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GameError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <h2 className="text-xl font-semibold">Race Error</h2>
      <p className="text-sm text-muted">{error.message || 'Something went wrong with the race.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/lobby"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card"
        >
          Back to Lobby
        </Link>
      </div>
    </div>
  )
}
