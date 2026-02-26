'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted text-sm">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
