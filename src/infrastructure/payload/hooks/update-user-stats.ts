import type { CollectionAfterChangeHook } from 'payload'
import { calculateEloChange } from '@/domain/race/scoring'

export const updateUserStatsAfterResult: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const { payload } = req
  const playerId = typeof doc.player === 'object' ? doc.player.id : doc.player

  const allResults = await payload.find({
    collection: 'race-results',
    where: { player: { equals: playerId } },
    limit: 0,
    req,
  })

  const results = allResults.docs
  const totalRaces = results.length

  if (totalRaces === 0) return doc

  const totalWpm = results.reduce((sum, r) => sum + (r.wpm ?? 0), 0)
  const totalAccuracy = results.reduce((sum, r) => sum + (r.accuracy ?? 0), 0)
  const bestWpm = Math.max(...results.map((r) => r.wpm ?? 0))
  const avgWpm = Math.round(totalWpm / totalRaces)
  const avgAccuracy = Math.round(totalAccuracy / totalRaces)

  const user = await payload.findByID({ collection: 'users', id: playerId, req })
  const currentElo = (user as any).stats?.elo ?? 1000

  const raceId = typeof doc.race === 'object' ? doc.race.id : doc.race
  const raceResults = await payload.find({
    collection: 'race-results',
    where: { race: { equals: raceId } },
    depth: 1,
    req,
  })

  let eloChange = 0
  for (const opponent of raceResults.docs) {
    const opponentId = typeof opponent.player === 'object' ? opponent.player.id : opponent.player
    if (String(opponentId) === String(playerId)) continue

    const opponentUser = await payload.findByID({ collection: 'users', id: opponentId, req })
    const opponentElo = (opponentUser as any).stats?.elo ?? 1000
    const won = doc.position < opponent.position
    eloChange += calculateEloChange(currentElo, opponentElo, won)
  }

  const newElo = Math.max(0, currentElo + eloChange)

  if (!req.context?.skipStatsUpdate) {
    await payload.update({
      collection: 'users',
      id: playerId,
      data: {
        stats: {
          totalRaces,
          avgWpm,
          bestWpm,
          avgAccuracy,
          elo: newElo,
        },
      },
      req,
      context: { skipStatsUpdate: true },
    })
  }

  return doc
}
