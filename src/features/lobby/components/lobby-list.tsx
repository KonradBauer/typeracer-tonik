import { listRooms } from '@/features/lobby/actions/list-rooms'
import { LobbyCard } from './lobby-card'

export async function LobbyList() {
  const rooms = await listRooms()

  if (rooms.length === 0) {
    return (
      <p className="py-8 text-center text-muted">
        No open races. Create one to get started!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {rooms.map((race, i) => {
        const createdBy =
          typeof race.createdBy === 'object' && race.createdBy !== null
            ? (race.createdBy as any).username || (race.createdBy as any).email
            : 'Unknown'

        return (
          <div key={race.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <LobbyCard
              raceId={race.id}
              createdBy={createdBy}
              maxPlayers={race.config?.maxPlayers ?? 4}
            />
          </div>
        )
      })}
    </div>
  )
}
