import { Spinner } from '@/shared/ui/spinner'

export default function Loading() {
  return (
    <div className="flex justify-center py-24">
      <Spinner size="lg" />
    </div>
  )
}
