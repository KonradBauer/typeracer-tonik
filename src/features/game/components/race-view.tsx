'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/features/game/stores/game-store'
import { useRaceConnection } from '@/features/game/hooks/use-race-connection'
import { useTypingEngine } from '@/features/game/hooks/use-typing-engine'
import { TypingArea } from './typing-area'
import { Countdown } from './countdown'
import { PlayerProgress } from './player-progress'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import type { TypingResult } from '@/domain/typing/types'

interface RaceViewProps {
  raceId: string
  token: string | null
  currentUserId: string
}

export function RaceView({ raceId, token, currentUserId }: RaceViewProps) {
  const transportRef = useRaceConnection(raceId, token)

  const connectionState = useGameStore((s) => s.connectionState)
  const status = useGameStore((s) => s.status)
  const text = useGameStore((s) => s.text)
  const players = useGameStore((s) => s.players)
  const countdown = useGameStore((s) => s.countdown)
  const updateLocalProgress = useGameStore((s) => s.updateLocalProgress)
  const setLocalFinished = useGameStore((s) => s.setLocalFinished)

  const handleProgress = useCallback(
    (position: number, wpm: number) => {
      updateLocalProgress(position, wpm)
      transportRef.current?.send({
        type: 'player:keystroke',
        payload: { position, timestamp: Date.now() },
      })
    },
    [updateLocalProgress, transportRef],
  )

  const handleFinish = useCallback(
    (result: TypingResult) => {
      setLocalFinished(result.wpm, result.accuracy)
      transportRef.current?.send({
        type: 'player:finished',
        payload: { wpm: result.wpm, accuracy: result.accuracy },
      })
    },
    [setLocalFinished, transportRef],
  )

  const { handleChar } = useTypingEngine({
    text,
    onProgress: handleProgress,
    onFinish: handleFinish,
  })

  const handleReady = useCallback(() => {
    transportRef.current?.send({ type: 'player:ready' })
  }, [transportRef])

  const handleKeystroke = useCallback(
    (char: string, _position: number, timestamp: number) => {
      handleChar(char, timestamp)
    },
    [handleChar],
  )

  const handleTypingFinished = useCallback(() => {
    // Finish is handled by useTypingEngine's onFinish callback
  }, [])

  if (connectionState === 'connecting') {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Spinner />
        <p className="text-muted">Connecting to race...</p>
      </div>
    )
  }

  if (connectionState === 'error' || connectionState === 'disconnected') {
    return (
      <div className="py-12 text-center">
        <p className="text-danger">Connection lost. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PlayerProgress currentUserId={currentUserId} textLength={text?.length ?? 0} />

      {status === 'waiting' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-muted">
            {players.length} player{players.length !== 1 ? 's' : ''} in room
          </p>
          <Button onClick={handleReady} size="lg">
            Ready
          </Button>
          <p className="text-xs text-muted">Race starts when all players are ready</p>
        </div>
      )}

      {status === 'countdown' && <Countdown seconds={countdown ?? 0} />}

      {(status === 'racing' || status === 'finished') && (
        <TypingArea onKeystroke={handleKeystroke} onFinished={handleTypingFinished} />
      )}
    </div>
  )
}
