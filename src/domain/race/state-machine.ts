import type { Race, RaceConfig, RacePlayer, RaceStatus } from './types'

export function createRace(id: string, text: string, config: RaceConfig): Race {
  return {
    id,
    status: 'waiting',
    text,
    config,
    players: new Map(),
    countdownRemaining: config.countdownSeconds,
    startTime: null,
    finishedAt: null,
  }
}

export function addPlayer(race: Race, player: RacePlayer): Race | null {
  if (race.status !== 'waiting') return null
  if (race.players.size >= race.config.maxPlayers) return null
  if (race.players.has(player.id)) return null

  const players = new Map(race.players)
  players.set(player.id, player)
  return { ...race, players }
}

export function removePlayer(race: Race, playerId: string): Race {
  const players = new Map(race.players)
  players.delete(playerId)
  return { ...race, players }
}

export function canTransition(from: RaceStatus, to: RaceStatus): boolean {
  const transitions: Record<RaceStatus, RaceStatus[]> = {
    waiting: ['countdown'],
    countdown: ['racing'],
    racing: ['finished'],
    finished: [],
  }
  return transitions[from].includes(to)
}

export function startCountdown(race: Race): Race | null {
  if (!canTransition(race.status, 'countdown')) return null
  if (race.players.size < 1) return null

  return {
    ...race,
    status: 'countdown',
    countdownRemaining: race.config.countdownSeconds,
  }
}

export function tickCountdown(race: Race): Race {
  if (race.status !== 'countdown') return race
  return {
    ...race,
    countdownRemaining: Math.max(0, race.countdownRemaining - 1),
  }
}

export function startRacing(race: Race, startTime: number): Race | null {
  if (!canTransition(race.status, 'racing')) return null

  return {
    ...race,
    status: 'racing',
    startTime,
    countdownRemaining: 0,
  }
}

export function updatePlayerProgress(
  race: Race,
  playerId: string,
  position: number,
  wpm: number,
): Race {
  if (race.status !== 'racing') return race

  const player = race.players.get(playerId)
  if (!player) return race

  const players = new Map(race.players)
  players.set(playerId, { ...player, position, wpm })
  return { ...race, players }
}

export function finishPlayer(race: Race, playerId: string, wpm: number, accuracy: number): Race {
  if (race.status !== 'racing') return race

  const player = race.players.get(playerId)
  if (!player || player.finished) return race

  const players = new Map(race.players)
  players.set(playerId, { ...player, wpm, accuracy, finished: true })

  const updatedRace = { ...race, players }

  const allFinished = Array.from(players.values()).every((p) => p.finished)
  if (allFinished) {
    return {
      ...updatedRace,
      status: 'finished' as const,
      finishedAt: Date.now(),
    }
  }

  return updatedRace
}

export function isRaceComplete(race: Race): boolean {
  return race.status === 'finished'
}
