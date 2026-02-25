'use client'

import { useEffect, useRef } from 'react'
import { createWsTransport } from '@/infrastructure/realtime/ws-transport'
import type { RealtimeTransport } from '@/infrastructure/realtime/transport'
import type { ServerMessage } from '@/infrastructure/realtime/messages'
import { useGameStore } from '@/features/game/stores/game-store'

export function useRaceConnection(raceId: string, token: string | null) {
  const transportRef = useRef<RealtimeTransport | null>(null)
  const {
    setConnectionState,
    setRoomState,
    setCountdown,
    startRace,
    updatePlayerProgress,
    setRaceFinished,
    reset,
  } = useGameStore()

  useEffect(() => {
    if (!token) return

    const transport = createWsTransport()
    transportRef.current = transport

    const unsubState = transport.onStateChange((state) => {
      setConnectionState(state)
    })

    const unsubMsg = transport.onMessage((msg: ServerMessage) => {
      switch (msg.type) {
        case 'room:state':
          setRoomState(msg.payload.raceId, msg.payload.status, msg.payload.players, msg.payload.text)
          break
        case 'race:countdown':
          setCountdown(msg.payload.seconds)
          break
        case 'race:start':
          startRace(msg.payload.text, msg.payload.startTime)
          break
        case 'player:progress':
          updatePlayerProgress(msg.payload)
          break
        case 'race:finish':
          setRaceFinished(msg.payload.rankings)
          break
      }
    })

    transport.connect(raceId, token)

    return () => {
      unsubState()
      unsubMsg()
      transport.disconnect()
      transportRef.current = null
      reset()
    }
  }, [raceId, token, setConnectionState, setRoomState, setCountdown, startRace, updatePlayerProgress, setRaceFinished, reset])

  return transportRef
}
