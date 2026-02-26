import { Spinner } from '@/shared/ui/spinner'

export default function GameLoading() {
  return (
    <div className="flex flex-col items-center gap-2 py-24">
      <Spinner size="lg" />
      <p className="text-sm text-muted">Loading...</p>
    </div>
  )
}
