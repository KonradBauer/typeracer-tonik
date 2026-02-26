import { listRooms } from '@/features/lobby/actions/list-rooms'
import { LobbyCard } from './lobby-card'

export async function LobbyList() {
  const rooms = await listRooms()

  if (rooms.length === 0) {
    return <p className="text-muted py-8 text-center">No open races. Create one to get started!</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {rooms.map((room, i) => (
        <div key={room.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
          <LobbyCard
            raceId={room.id}
            createdBy={room.createdBy}
            maxPlayers={room.maxPlayers}
            playerCount={room.playerCount}
          />
        </div>
      ))}
    </div>
  )
}
