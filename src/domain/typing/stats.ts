import type { KeyStroke, TypingResult, TypingState } from './types'

export function calculateWpm(correctChars: number, durationMs: number): number {
  if (durationMs <= 0) return 0
  const minutes = durationMs / 60_000
  const words = correctChars / 5
  return Math.round(words / minutes)
}

export function calculateAccuracy(totalChars: number, errorCount: number): number {
  if (totalChars === 0) return 0
  return Math.round(((totalChars - errorCount) / totalChars) * 100)
}

export function calculateConsistency(keystrokes: KeyStroke[]): number {
  if (keystrokes.length < 2) return 100

  const intervals: number[] = []
  for (let i = 1; i < keystrokes.length; i++) {
    intervals.push(keystrokes[i].timestamp - keystrokes[i - 1].timestamp)
  }

  const mean = intervals.reduce((sum, v) => sum + v, 0) / intervals.length
  const variance = intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / intervals.length
  const stdDev = Math.sqrt(variance)

  const cv = mean > 0 ? stdDev / mean : 0
  return Math.round(Math.max(0, (1 - cv) * 100))
}

export function computeResult(state: TypingState): TypingResult {
  const { keystrokes, errors, startTime, endTime, text } = state

  const totalChars = keystrokes.length
  const errorCount = errors.size
  const correctChars = totalChars - errorCount
  const durationMs = startTime && endTime ? endTime - startTime : 0

  return {
    wpm: calculateWpm(correctChars, durationMs),
    accuracy: calculateAccuracy(totalChars, errorCount),
    consistency: calculateConsistency(keystrokes),
    totalChars,
    correctChars,
    errorCount,
    durationMs,
    keystrokes,
  }
}

export function calculateLiveWpm(state: TypingState, now: number): number {
  if (!state.startTime) return 0
  const correctChars = state.position - state.errors.size
  const durationMs = now - state.startTime
  return calculateWpm(Math.max(0, correctChars), durationMs)
}
