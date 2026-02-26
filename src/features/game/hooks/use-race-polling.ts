'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '@/features/game/stores/game-store'
import { getRaceState } from '@/features/game/actions/get-race-state'
import { POLLING_INTERVALS } from '@/shared/lib/constants'

export function useRacePolling(raceId: string) {
  const applySnapshot = useGameStore((s) => s.applySnapshot)
  const status = useGameStore((s) => s.status)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const poll = useCallback(async () => {
    if (!mountedRef.current) return

    const snapshot = await getRaceState(raceId)
    if (!snapshot || !mountedRef.current) return

    applySnapshot(raceId, snapshot)

    if (snapshot.status === 'finished') return

    const interval =
      POLLING_INTERVALS[snapshot.status as keyof typeof POLLING_INTERVALS] ??
      POLLING_INTERVALS.waiting

    timerRef.current = setTimeout(poll, interval)
  }, [raceId, applySnapshot])

  useEffect(() => {
    mountedRef.current = true
    poll()

    return () => {
      mountedRef.current = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [poll])
}
