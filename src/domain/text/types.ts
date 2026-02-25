export type TextDifficulty = 'easy' | 'medium' | 'hard'

export interface TextPassage {
  id: string
  content: string
  source?: string
  author?: string
  difficulty: TextDifficulty
  wordCount: number
  charCount: number
}
