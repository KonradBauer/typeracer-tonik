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
      <p className="text-muted text-sm">{error.message || 'Something went wrong with the race.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Try again
        </button>
        <Link
          href="/lobby"
          className="border-border hover:bg-card rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          Back to Lobby
        </Link>
      </div>
    </div>
  )
}
