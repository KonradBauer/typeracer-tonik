'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { RaceSnapshot } from '@/features/game/stores/game-store'
import { calculateRankings } from '@/domain/race/scoring'
import type { RacePlayer } from '@/domain/race/types'

export async function getRaceState(raceId: string): Promise<RaceSnapshot | null> {
  const payload = await getPayload({ config })

  const race = await payload.findByID({
    collection: 'races',
    id: raceId,
    depth: 1,
  })

  if (!race) return null

  const participants = await payload.find({
    collection: 'race-participants',
    where: { race: { equals: raceId } },
    depth: 1,
    limit: 20,
  })

  const textContent =
    typeof race.text === 'object' && race.text !== null
      ? (race.text as { content: string }).content
      : ''

  let { status } = race
  const now = Date.now()

  if (status === 'countdown' && race.startedAt) {
    const countdownEnd =
      new Date(race.startedAt).getTime() + (race.config?.countdownSeconds ?? 5) * 1000
    if (now >= countdownEnd) {
      status = 'racing'
      await payload.update({
        collection: 'races',
        id: raceId,
        data: { status: 'racing' },
      })
    }
  }

  if (status === 'racing' && race.roundEndsAt) {
    const roundEnd = new Date(race.roundEndsAt).getTime()
    if (now >= roundEnd) {
      status = 'finished'
      await payload.update({
        collection: 'races',
        id: raceId,
        data: { status: 'finished', finishedAt: new Date().toISOString() },
      })
    }
  }

  const participantList = participants.docs.map((p) => {
    const player =
      typeof p.player === 'object' && p.player !== null
        ? (p.player as { id: string; username: string })
        : { id: String(p.player), username: 'Unknown' }

    return {
      playerId: player.id,
      username: player.username,
      position: p.position ?? 0,
      wpm: p.wpm ?? 0,
      accuracy: p.accuracy ?? 100,
      finished: p.finished ?? false,
    }
  })

  let countdown: number | null = null
  if (status === 'countdown' && race.startedAt) {
    const countdownEnd =
      new Date(race.startedAt).getTime() + (race.config?.countdownSeconds ?? 5) * 1000
    countdown = Math.max(0, Math.ceil((countdownEnd - now) / 1000))
  }

  let rankings = null
  if (status === 'finished') {
    const playersMap = new Map<string, RacePlayer>()
    for (const p of participantList) {
      playersMap.set(p.playerId, {
        id: p.playerId,
        username: p.username,
        position: p.position,
        wpm: p.wpm,
        accuracy: p.accuracy,
        finished: p.finished,
      })
    }
    rankings = calculateRankings({
      id: raceId,
      status: 'finished',
      text: textContent,
      config: {
        maxPlayers: race.config?.maxPlayers ?? 4,
        countdownSeconds: race.config?.countdownSeconds ?? 5,
      },
      players: playersMap,
      countdownRemaining: 0,
      startTime: race.startedAt ? new Date(race.startedAt).getTime() : null,
      finishedAt: now,
    })
  }

  return {
    status: status as RaceSnapshot['status'],
    text: textContent,
    countdown,
    startTime: race.startedAt ?? null,
    roundEndsAt: race.roundEndsAt ?? null,
    participants: participantList,
    rankings,
  }
}
