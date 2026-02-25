export const APP_NAME = 'TypeRacer Tonik'

export const RACE_DEFAULTS = {
  maxPlayers: 4,
  countdownSeconds: 5,
} as const

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:3000/api/ws`
