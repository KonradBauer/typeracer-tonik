import type { TextPassage } from './types'

export function selectRandomText(texts: TextPassage[]): TextPassage | null {
  if (texts.length === 0) return null
  const index = Math.floor(Math.random() * texts.length)
  return texts[index]
}

export function filterByDifficulty(
  texts: TextPassage[],
  difficulty: TextPassage['difficulty'],
): TextPassage[] {
  return texts.filter((t) => t.difficulty === difficulty)
}
