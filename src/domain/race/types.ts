export type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished'

export interface RaceConfig {
  maxPlayers: number
  countdownSeconds: number
}

export interface RacePlayer {
  id: string
  username: string
  position: number
  wpm: number
  accuracy: number
  finished: boolean
}

export interface Race {
  id: string
  status: RaceStatus
  text: string
  config: RaceConfig
  players: Map<string, RacePlayer>
  countdownRemaining: number
  startTime: number | null
  finishedAt: number | null
}

export interface RaceRanking {
  playerId: string
  username: string
  position: number
  wpm: number
  accuracy: number
}
