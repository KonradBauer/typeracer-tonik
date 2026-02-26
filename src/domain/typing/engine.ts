import type { KeyStroke, TypingState } from './types'

export function createTypingState(text: string): TypingState {
  return {
    text,
    position: 0,
    errors: new Set<number>(),
    keystrokes: [],
    startTime: null,
    endTime: null,
  }
}

export function processKeystroke(state: TypingState, char: string, timestamp: number): TypingState {
  if (state.endTime !== null) return state
  if (state.position >= state.text.length) return state

  const startTime = state.startTime ?? timestamp
  const expected = state.text[state.position]
  const correct = char === expected

  const keystroke: KeyStroke = {
    char,
    expected,
    timestamp,
    correct,
  }

  const errors = new Set(state.errors)
  if (!correct) {
    errors.add(state.position)
  }

  const nextPosition = state.position + 1
  const isFinished = nextPosition >= state.text.length

  return {
    ...state,
    position: nextPosition,
    errors,
    keystrokes: [...state.keystrokes, keystroke],
    startTime,
    endTime: isFinished ? timestamp : null,
  }
}

export function getProgress(state: TypingState): number {
  if (state.text.length === 0) return 0
  return state.position / state.text.length
}

export function isFinished(state: TypingState): boolean {
  return state.endTime !== null
}
