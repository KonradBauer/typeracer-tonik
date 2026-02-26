'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
