'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/features/game/stores/game-store'
import { useRacePolling } from '@/features/game/hooks/use-race-polling'
import { useTypingEngine } from '@/features/game/hooks/use-typing-engine'
import { joinRace } from '@/features/game/actions/join-race'
import { submitProgress } from '@/features/game/actions/submit-progress'
import { finishRace } from '@/features/game/actions/finish-race'
import { TypingArea } from './typing-area'
import { PlayerProgress } from './player-progress'
import { Countdown } from './countdown'
import { Spinner } from '@/shared/ui/spinner'
import type { TypingResult } from '@/domain/typing/types'

interface MultiplayerRaceProps {
  raceId: string
  userId: string
  username: string
}

export function MultiplayerRace({ raceId, userId, username }: MultiplayerRaceProps) {
  const router = useRouter()
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  const [errors, setErrors] = useState<Set<number>>(new Set())
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const latestProgressRef = useRef({ position: 0, wpm: 0, accuracy: 100 })

  const status = useGameStore((s) => s.status)
  const text = useGameStore((s) => s.text)
  const countdown = useGameStore((s) => s.countdown)
  const participants = useGameStore((s) => s.participants)
  const rankings = useGameStore((s) => s.rankings)
  const updateLocalProgress = useGameStore((s) => s.updateLocalProgress)
  const setLocalFinished = useGameStore((s) => s.setLocalFinished)
  const reset = useGameStore((s) => s.reset)

  useRacePolling(raceId)

  useEffect(() => {
    joinRace(raceId).then((result) => {
      if (result.success) {
        setJoined(true)
      } else {
        setJoinError(result.error ?? 'Failed to join race')
      }
    })

    return () => {
      reset()
    }
  }, [raceId, reset])

  const onProgress = useCallback(
    (position: number, wpm: number, accuracy: number, errs: Set<number>) => {
      updateLocalProgress(position, wpm, accuracy)
      setErrors(errs)
      latestProgressRef.current = { position, wpm, accuracy }
    },
    [updateLocalProgress],
  )

  const onFinish = useCallback(
    (result: TypingResult) => {
      setLocalFinished()
      finishRace({
        raceId,
        wpm: result.wpm,
        accuracy: result.accuracy,
        consistency: result.consistency,
      })
    },
    [raceId, setLocalFinished],
  )

  const { handleChar } = useTypingEngine({
    text,
    onProgress,
    onFinish,
  })

  useEffect(() => {
    if (status === 'racing') {
      progressTimerRef.current = setInterval(() => {
        const p = latestProgressRef.current
        submitProgress({ raceId, position: p.position, wpm: p.wpm, accuracy: p.accuracy })
      }, 2000)
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [status, raceId])

  const handleKeystroke = useCallback(
    (char: string, timestamp: number) => {
      handleChar(char, timestamp)
    },
    [handleChar],
  )

  const handleFinished = useCallback(() => {
    // Handled by useTypingEngine onFinish callback
  }, [])

  if (joinError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-danger">{joinError}</p>
        <a href="/lobby" className="text-sm text-primary underline">
          Back to Lobby
        </a>
      </div>
    )
  }

  if (!joined) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <Spinner size="lg" />
        <p className="text-muted">Joining race...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {text && (
        <PlayerProgress currentUserId={userId} textLength={text.length} />
      )}

      {status === 'waiting' && (
        <div className="flex flex-col items-center gap-2 py-12">
          <Spinner size="md" />
          <p className="text-muted">
            Waiting for players... ({participants.length} joined)
          </p>
        </div>
      )}

      {status === 'countdown' && countdown !== null && (
        <Countdown seconds={countdown} />
      )}

      {status === 'racing' && (
        <TypingArea
          errors={errors}
          onKeystroke={handleKeystroke}
          onFinished={handleFinished}
        />
      )}

      {status === 'finished' && rankings && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Race Results</h2>
          <div className="flex flex-col gap-2">
            {rankings.map((r, i) => (
              <div
                key={r.playerId}
                className="flex items-center justify-between rounded-lg bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tabular-nums text-muted">
                    #{i + 1}
                  </span>
                  <span className={r.playerId === userId ? 'font-semibold text-primary' : ''}>
                    {r.username}
                  </span>
                </div>
                <div className="flex gap-4 text-sm tabular-nums">
                  <span>{r.wpm} WPM</span>
                  <span>{r.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a href="/lobby">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                Back to Lobby
              </button>
            </a>
            <a href={`/results/${raceId}`}>
              <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card">
                Detailed Results
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
