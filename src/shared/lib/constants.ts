export const APP_NAME = 'TypeRacer Tonik'

export const RACE_DEFAULTS = {
  maxPlayers: 4,
  countdownSeconds: 5,
  roundDuration: 60,
} as const

export const POLLING_INTERVALS = {
  waiting: 3000,
  countdown: 500,
  racing: 1500,
} as const

export const MIN_PLAYERS_TO_START = 2