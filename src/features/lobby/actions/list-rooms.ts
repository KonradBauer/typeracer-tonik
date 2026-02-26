'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export interface RoomListItem {
  id: string
  createdBy: string
  maxPlayers: number
  playerCount: number
}

export async function listRooms(): Promise<RoomListItem[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'races',
    where: {
      status: { in: ['waiting', 'countdown'] },
    },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
  })

  const rooms: RoomListItem[] = await Promise.all(
    result.docs.map(async (race) => {
      const participants = await payload.count({
        collection: 'race-participants',
        where: { race: { equals: race.id } },
      })

      const createdBy =
        typeof race.createdBy === 'object' && race.createdBy !== null
          ? ((race.createdBy as { username?: string; email: string }).username ||
            (race.createdBy as { email: string }).email)
          : 'Unknown'

      return {
        id: race.id,
        createdBy,
        maxPlayers: race.config?.maxPlayers ?? 4,
        playerCount: participants.totalDocs,
      }
    }),
  )

  return rooms
}
