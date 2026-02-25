'use client'

import { useGameStore } from '@/features/game/stores/game-store'
import { cn } from '@/shared/lib/cn'

interface PlayerProgressProps {
  currentUserId: string
  textLength: number
}

export function PlayerProgress({ currentUserId, textLength }: PlayerProgressProps) {
  const players = useGameStore((s) => s.players)
  const playerProgress = useGameStore((s) => s.playerProgress)
  const localPosition = useGameStore((s) => s.localPosition)
  const localWpm = useGameStore((s) => s.localWpm)

  if (players.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      {players.map((player) => {
        const isLocal = player.id === currentUserId
        const progress = isLocal
          ? { position: localPosition, wpm: localWpm }
          : playerProgress.get(player.id)

        const percent = textLength > 0 ? ((progress?.position ?? 0) / textLength) * 100 : 0

        return (
          <div key={player.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className={cn('font-medium', isLocal && 'text-primary')}>
                {player.username} {isLocal && '(you)'}
              </span>
              <span className="tabular-nums text-muted">{progress?.wpm ?? 0} WPM</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-150',
                  isLocal ? 'bg-primary' : 'bg-muted',
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
