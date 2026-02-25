export interface KeyStroke {
  char: string
  expected: string
  timestamp: number
  correct: boolean
}

export interface TypingState {
  text: string
  position: number
  errors: Set<number>
  keystrokes: KeyStroke[]
  startTime: number | null
  endTime: number | null
}

export interface TypingResult {
  wpm: number
  accuracy: number
  consistency: number
  totalChars: number
  correctChars: number
  errorCount: number
  durationMs: number
  keystrokes: KeyStroke[]
}
