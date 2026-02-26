import { create } from 'zustand'
import type { RaceRanking, RaceStatus } from '@/domain/race/types'

export interface ParticipantState {
  playerId: string
  username: string
  position: number
  wpm: number
  accuracy: number
  finished: boolean
}

export interface RaceSnapshot {
  status: RaceStatus
  text: string
  countdown: number | null
  startTime: string | null
  roundEndsAt: string | null
  participants: ParticipantState[]
  rankings: RaceRanking[] | null
}

export interface GameState {
  raceId: string | null
  status: RaceStatus
  text: string | null
  countdown: number | null
  startTime: string | null
  roundEndsAt: string | null
  participants: ParticipantState[]
  rankings: RaceRanking[] | null

  localPosition: number
  localWpm: number
  localAccuracy: number
  localFinished: boolean

  applySnapshot: (raceId: string, snapshot: RaceSnapshot) => void
  updateLocalProgress: (position: number, wpm: number, accuracy: number) => void
  setLocalFinished: () => void
  reset: () => void
}

const initialState = {
  raceId: null as string | null,
  status: 'waiting' as RaceStatus,
  text: null as string | null,
  countdown: null as number | null,
  startTime: null as string | null,
  roundEndsAt: null as string | null,
  participants: [] as ParticipantState[],
  rankings: null as RaceRanking[] | null,
  localPosition: 0,
  localWpm: 0,
  localAccuracy: 100,
  localFinished: false,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  applySnapshot: (raceId, snapshot) =>
    set({
      raceId,
      status: snapshot.status,
      text: snapshot.text,
      countdown: snapshot.countdown,
      startTime: snapshot.startTime,
      roundEndsAt: snapshot.roundEndsAt,
      participants: snapshot.participants,
      rankings: snapshot.rankings,
    }),

  updateLocalProgress: (position, wpm, accuracy) =>
    set({ localPosition: position, localWpm: wpm, localAccuracy: accuracy }),

  setLocalFinished: () => set({ localFinished: true }),

  reset: () => set(initialState),
}))
