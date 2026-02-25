'use client'

import { RaceView } from './race-view'

interface RacePageClientProps {
  raceId: string
  token: string
  currentUserId: string
}

export function RacePageClient({ raceId, token, currentUserId }: RacePageClientProps) {
  return <RaceView raceId={raceId} token={token} currentUserId={currentUserId} />
}
