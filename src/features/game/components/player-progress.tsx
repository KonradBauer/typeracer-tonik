'use client'

import { useGameStore } from '@/features/game/stores/game-store'
import { cn } from '@/shared/lib/cn'

interface PlayerProgressProps {
  currentUserId: string
  textLength: number
}

export function PlayerProgress({ currentUserId, textLength }: PlayerProgressProps) {
  const participants = useGameStore((s) => s.participants)
  const localPosition = useGameStore((s) => s.localPosition)
  const localWpm = useGameStore((s) => s.localWpm)

  if (participants.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      {participants.map((participant) => {
        const isLocal = participant.playerId === currentUserId
        const position = isLocal ? localPosition : participant.position
        const wpm = isLocal ? localWpm : participant.wpm
        const percent = textLength > 0 ? (position / textLength) * 100 : 0

        return (
          <div key={participant.playerId} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className={cn('font-medium', isLocal && 'text-primary')}>
                {participant.username} {isLocal && '(you)'}
              </span>
              <span className="tabular-nums text-muted">{wpm} WPM</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-150',
                  isLocal ? 'bg-primary' : 'bg-muted',
                  participant.finished && !isLocal && 'bg-success',
                )}
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
