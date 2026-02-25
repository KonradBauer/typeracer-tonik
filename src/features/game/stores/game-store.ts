import { create } from 'zustand'
import type { ConnectionState } from '@/infrastructure/realtime/transport'
import type {
  RoomPlayerInfo,
  PlayerProgressPayload,
} from '@/infrastructure/realtime/messages'
import type { RaceRanking, RaceStatus } from '@/domain/race/types'

export interface PlayerProgress {
  playerId: string
  username: string
  position: number
  wpm: number
}

export interface GameState {
  // Connection
  connectionState: ConnectionState
  raceId: string | null

  // Room
  status: RaceStatus
  players: RoomPlayerInfo[]
  playerProgress: Map<string, PlayerProgress>

  // Race
  text: string | null
  countdown: number | null
  startTime: number | null
  rankings: RaceRanking[] | null

  // Local typing
  localPosition: number
  localWpm: number
  localAccuracy: number
  localFinished: boolean

  // Actions
  setConnectionState: (state: ConnectionState) => void
  setRoomState: (raceId: string, status: RaceStatus, players: RoomPlayerInfo[], text: string | null) => void
  setCountdown: (seconds: number) => void
  startRace: (text: string, startTime: number) => void
  updatePlayerProgress: (payload: PlayerProgressPayload) => void
  setRaceFinished: (rankings: RaceRanking[]) => void
  updateLocalProgress: (position: number, wpm: number) => void
  setLocalFinished: (wpm: number, accuracy: number) => void
  reset: () => void
}

const initialState = {
  connectionState: 'disconnected' as ConnectionState,
  raceId: null as string | null,
  status: 'waiting' as RaceStatus,
  players: [] as RoomPlayerInfo[],
  playerProgress: new Map<string, PlayerProgress>(),
  text: null as string | null,
  countdown: null as number | null,
  startTime: null as number | null,
  rankings: null as RaceRanking[] | null,
  localPosition: 0,
  localWpm: 0,
  localAccuracy: 0,
  localFinished: false,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setConnectionState: (connectionState) => set({ connectionState }),

  setRoomState: (raceId, status, players, text) =>
    set({ raceId, status, players, text }),

  setCountdown: (seconds) => set({ countdown: seconds, status: 'countdown' }),

  startRace: (text, startTime) =>
    set({
      text,
      startTime,
      status: 'racing',
      countdown: null,
      localPosition: 0,
      localWpm: 0,
      localFinished: false,
      playerProgress: new Map(),
    }),

  updatePlayerProgress: (payload) =>
    set((state) => {
      const progress = new Map(state.playerProgress)
      progress.set(payload.playerId, {
        playerId: payload.playerId,
        username: payload.username,
        position: payload.position,
        wpm: payload.wpm,
      })
      return { playerProgress: progress }
    }),

  setRaceFinished: (rankings) => set({ status: 'finished', rankings }),

  updateLocalProgress: (position, wpm) =>
    set({ localPosition: position, localWpm: wpm }),

  setLocalFinished: (wpm, accuracy) =>
    set({ localFinished: true, localWpm: wpm, localAccuracy: accuracy }),

  reset: () => set(initialState),
}))
