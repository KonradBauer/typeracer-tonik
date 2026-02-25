'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createTypingState, processKeystroke, isFinished, getProgress } from '@/domain/typing/engine'
import { calculateLiveWpm, computeResult } from '@/domain/typing/stats'
import type { TypingState, TypingResult } from '@/domain/typing/types'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/cn'
import { submitResult } from '@/features/game/actions/submit-result'

interface SoloRaceProps {
  raceId: string
  text: string
  userId: string
  username: string
}

type Phase = 'ready' | 'countdown' | 'racing' | 'finished'

export function SoloRace({ raceId, text, userId, username }: SoloRaceProps) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [countdown, setCountdown] = useState(3)
  const [position, setPosition] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [result, setResult] = useState<TypingResult | null>(null)
  const [errors, setErrors] = useState<Set<number>>(new Set())
  const stateRef = useRef<TypingState>(createTypingState(text))

  const startCountdown = useCallback(() => {
    setPhase('countdown')
    let count = 3
    setCountdown(count)
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        stateRef.current = createTypingState(text)
        setPhase('racing')
      }
    }, 1000)
  }, [text])

  useEffect(() => {
    if (phase !== 'racing') return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length !== 1) return
      e.preventDefault()

      const timestamp = Date.now()
      stateRef.current = processKeystroke(stateRef.current, e.key, timestamp)
      const state = stateRef.current

      setPosition(state.position)
      setErrors(new Set(state.errors))
      setWpm(calculateLiveWpm(state, timestamp))

      if (isFinished(state)) {
        const res = computeResult(state)
        setResult(res)
        setPhase('finished')

        submitResult({
          raceId,
          position: 1,
          wpm: res.wpm,
          accuracy: res.accuracy,
          consistency: res.consistency,
        }).catch(() => {})
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, raceId])

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-primary">{username}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150"
            style={{ width: `${text.length > 0 ? (position / text.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-muted">{wpm} WPM</span>
      </div>

      {/* Ready */}
      {phase === 'ready' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-muted">Press Start when you are ready</p>
          <Button size="lg" onClick={startCountdown}>
            Start Race
          </Button>
        </div>
      )}

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="flex flex-col items-center gap-2 py-12">
          <p className="text-6xl font-bold tabular-nums">{countdown}</p>
          <p className="text-muted">Get ready...</p>
        </div>
      )}

      {/* Typing area */}
      {(phase === 'racing' || phase === 'finished') && (
        <div className="rounded-xl border border-border bg-card p-6 font-mono text-lg leading-relaxed">
          {text.split('').map((char, i) => {
            let charClass = 'text-muted'
            if (i < position) {
              charClass = errors.has(i) ? 'text-danger' : 'text-success'
            } else if (i === position && phase === 'racing') {
              charClass = 'bg-primary/20 text-foreground'
            }

            return (
              <span key={i} className={cn(charClass)}>
                {char === ' ' && i === position ? '\u00B7' : char}
              </span>
            )
          })}
        </div>
      )}

      {/* Results */}
      {phase === 'finished' && result && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Results</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem label="WPM" value={String(result.wpm)} />
            <StatItem label="Accuracy" value={`${result.accuracy}%`} />
            <StatItem label="Consistency" value={`${result.consistency}%`} />
            <StatItem label="Errors" value={String(result.errorCount)} />
          </div>
          <div className="mt-6 flex gap-3">
            <Button onClick={startCountdown}>Race Again</Button>
            <a href="/lobby">
              <Button variant="secondary">Back to Lobby</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-background p-3">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
