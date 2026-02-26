'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/features/game/stores/game-store'
import { cn } from '@/shared/lib/cn'

interface TypingAreaProps {
  errors: Set<number>
  onKeystroke: (char: string, timestamp: number) => void
  onFinished: () => void
}

export function TypingArea({ errors, onKeystroke, onFinished }: TypingAreaProps) {
  const text = useGameStore((s) => s.text)
  const status = useGameStore((s) => s.status)
  const localPosition = useGameStore((s) => s.localPosition)
  const localFinished = useGameStore((s) => s.localFinished)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status !== 'racing' || localFinished || !text) return
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length !== 1) return

      e.preventDefault()
      onKeystroke(e.key, Date.now())

      if (localPosition + 1 >= text.length) {
        onFinished()
      }
    },
    [status, localFinished, text, localPosition, onKeystroke, onFinished],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (status === 'racing') {
      containerRef.current?.focus()
    }
  }, [status])

  if (!text) return null

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="rounded-xl border border-border bg-card p-6 font-mono text-lg leading-relaxed outline-none focus:border-primary"
    >
      {text.split('').map((char, i) => {
        let className = 'text-muted'
        if (i < localPosition) {
          className = errors.has(i) ? 'text-danger' : 'text-success'
        } else if (i === localPosition && status === 'racing') {
          className = 'bg-primary/20 text-foreground'
        }

        return (
          <span key={i} className={cn(className)}>
            {char === ' ' && i === localPosition ? '\u00B7' : char}
          </span>
        )
      })}
    </div>
  )
}
