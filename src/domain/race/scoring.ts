import type { Race, RaceRanking } from './types'

export function calculateRankings(race: Race): RaceRanking[] {
  const players = Array.from(race.players.values())

  const sorted = players.sort((a, b) => {
    if (a.finished && !b.finished) return -1
    if (!a.finished && b.finished) return 1
    if (a.wpm !== b.wpm) return b.wpm - a.wpm
    return b.accuracy - a.accuracy
  })

  return sorted.map((player, index) => ({
    playerId: player.id,
    username: player.username,
    position: index + 1,
    wpm: player.wpm,
    accuracy: player.accuracy,
  }))
}

export function calculateEloChange(
  playerElo: number,
  opponentElo: number,
  won: boolean,
  k: number = 32,
): number {
  const expected = 1 / (1 + 10 ** ((opponentElo - playerElo) / 400))
  const score = won ? 1 : 0
  return Math.round(k * (score - expected))
}

export function calculateEloChanges(
  rankings: RaceRanking[],
  elos: Map<string, number>,
): Map<string, number> {
  const changes = new Map<string, number>()

  for (const player of rankings) {
    let totalChange = 0
    const playerElo = elos.get(player.playerId) ?? 1000

    for (const opponent of rankings) {
      if (opponent.playerId === player.playerId) continue
      const opponentElo = elos.get(opponent.playerId) ?? 1000
      const won = player.position < opponent.position
      totalChange += calculateEloChange(playerElo, opponentElo, won)
    }

    changes.set(player.playerId, totalChange)
  }

  return changes
}
