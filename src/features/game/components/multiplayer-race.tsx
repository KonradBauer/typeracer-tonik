'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/features/game/stores/game-store'
import { useRacePolling } from '@/features/game/hooks/use-race-polling'
import { useTypingEngine } from '@/features/game/hooks/use-typing-engine'
import { joinRace } from '@/features/game/actions/join-race'
import { forceStart } from '@/features/game/actions/force-start'
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

export function MultiplayerRace({ raceId, userId }: MultiplayerRaceProps) {
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  const [errors, setErrors] = useState<Set<number>>(new Set())
  const [finishError, setFinishError] = useState(false)
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
        .then((res) => {
          if (!res.success) setFinishError(true)
        })
        .catch(() => setFinishError(true))
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

  if (joinError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-danger">{joinError}</p>
        <a href="/lobby" className="text-primary text-sm underline">
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
      {text && <PlayerProgress currentUserId={userId} textLength={text.length} />}

      {status === 'waiting' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Spinner size="md" />
          <p className="text-muted">Waiting for players... ({participants.length} joined)</p>
          <button
            onClick={() => forceStart(raceId)}
            className="border-border text-muted hover:border-primary hover:text-foreground rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Start Now
          </button>
        </div>
      )}

      {status === 'countdown' && countdown !== null && <Countdown seconds={countdown} />}

      {status === 'racing' && <TypingArea errors={errors} onKeystroke={handleKeystroke} />}

      {finishError && (
        <div className="border-danger bg-danger/10 text-danger rounded-lg border p-3 text-center text-sm">
          Failed to save result. Please refresh and try again.
        </div>
      )}

      {status === 'finished' && rankings && (
        <div className="border-border bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Race Results</h2>
          <div className="flex flex-col gap-2">
            {rankings.map((r, i) => (
              <div
                key={r.playerId}
                className="bg-background flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted text-lg font-bold tabular-nums">#{i + 1}</span>
                  <span className={r.playerId === userId ? 'text-primary font-semibold' : ''}>
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
              <button className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
                Back to Lobby
              </button>
            </a>
            <a href={`/results/${raceId}`}>
              <button className="border-border hover:bg-card rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
                Detailed Results
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
