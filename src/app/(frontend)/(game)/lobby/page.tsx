import { Suspense } from 'react'
import { CreateRoomButton } from '@/features/lobby/components/create-room-button'
import { LobbyList } from '@/features/lobby/components/lobby-list'
import { Spinner } from '@/shared/ui/spinner'

export const metadata = {
  title: 'Lobby — TypeRacer Tonik',
}

export default function LobbyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lobby</h1>
        <CreateRoomButton />
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        }
      >
        <LobbyList />
      </Suspense>
    </div>
  )
}
