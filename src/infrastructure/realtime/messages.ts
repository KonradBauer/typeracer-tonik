import type { RaceRanking, RaceStatus } from '@/domain/race/types'

// --- Client → Server ---

export type ClientMessage =
  | { type: 'player:ready' }
  | { type: 'player:keystroke'; payload: { position: number; timestamp: number } }
  | { type: 'player:finished'; payload: { wpm: number; accuracy: number } }

// --- Server → Client ---

export interface RoomPlayerInfo {
  id: string
  username: string
  ready: boolean
}

export interface RoomState {
  raceId: string
  status: RaceStatus
  players: RoomPlayerInfo[]
  text: string | null
}

export interface PlayerProgressPayload {
  playerId: string
  username: string
  position: number
  wpm: number
}

export type ServerMessage =
  | { type: 'room:state'; payload: RoomState }
  | { type: 'race:countdown'; payload: { seconds: number } }
  | { type: 'race:start'; payload: { text: string; startTime: number } }
  | { type: 'player:progress'; payload: PlayerProgressPayload }
  | { type: 'race:finish'; payload: { rankings: RaceRanking[] } }
  | { type: 'error'; payload: { message: string } }

// --- Helpers ---

export function encodeMessage(msg: ClientMessage | ServerMessage): string {
  return JSON.stringify(msg)
}

export function decodeClientMessage(raw: string): ClientMessage | null {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.type === 'string') {
      return parsed as ClientMessage
    }
    return null
  } catch {
    return null
  }
}

export function decodeServerMessage(raw: string): ServerMessage | null {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.type === 'string') {
      return parsed as ServerMessage
    }
    return null
  } catch {
    return null
  }
}
