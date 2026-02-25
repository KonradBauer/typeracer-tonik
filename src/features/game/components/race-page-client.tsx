'use client'

import { useSession } from '@/features/auth/hooks/use-session'
import { RaceView } from './race-view'
import { Spinner } from '@/shared/ui/spinner'

interface RacePageClientProps {
  raceId: string
}

export function RacePageClient({ raceId }: RacePageClientProps) {
  const session = useSession()

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Spinner />
        <p className="text-muted">Loading session...</p>
      </div>
    )
  }

  return (
    <RaceView raceId={raceId} token={session.token} currentUserId={session.userId} />
  )
}
