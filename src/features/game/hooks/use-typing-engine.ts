'use client'

import { useCallback, useRef } from 'react'
import { createTypingState, processKeystroke, isFinished } from '@/domain/typing/engine'
import { calculateLiveWpm, calculateAccuracy, computeResult } from '@/domain/typing/stats'
import type { TypingState, TypingResult } from '@/domain/typing/types'

interface UseTypingEngineOptions {
  text: string | null
  onProgress: (position: number, wpm: number, accuracy: number, errors: Set<number>) => void
  onFinish: (result: TypingResult) => void
}

export function useTypingEngine({ text, onProgress, onFinish }: UseTypingEngineOptions) {
  const stateRef = useRef<TypingState | null>(null)

  const handleChar = useCallback(
    (char: string, timestamp: number) => {
      if (!text) return

      if (!stateRef.current) {
        stateRef.current = createTypingState(text)
      }

      stateRef.current = processKeystroke(stateRef.current, char, timestamp)
      const state = stateRef.current
      const wpm = calculateLiveWpm(state, timestamp)
      const accuracy = calculateAccuracy(state.position, state.errors.size)

      onProgress(state.position, wpm, accuracy, new Set(state.errors))

      if (isFinished(state)) {
        onFinish(computeResult(state))
      }
    },
    [text, onProgress, onFinish],
  )

  const reset = useCallback(() => {
    stateRef.current = null
  }, [])

  return { handleChar, reset }
}
