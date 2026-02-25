'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export interface LeaderboardEntry {
  id: string
  username: string
  totalRaces: number
  avgWpm: number
  bestWpm: number
  avgAccuracy: number
  elo: number
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'users',
    where: {
      'stats.totalRaces': { greater_than: 0 },
    },
    sort: '-stats.elo',
    limit: 50,
  })

  return result.docs.map((user) => ({
    id: String(user.id),
    username: (user as any).username || user.email,
    totalRaces: (user as any).stats?.totalRaces ?? 0,
    avgWpm: (user as any).stats?.avgWpm ?? 0,
    bestWpm: (user as any).stats?.bestWpm ?? 0,
    avgAccuracy: (user as any).stats?.avgAccuracy ?? 0,
    elo: (user as any).stats?.elo ?? 1000,
  }))
}
