'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MIN_PLAYERS_TO_START } from '@/shared/lib/constants'

interface JoinRaceResult {
  success: boolean
  error?: string
}

export async function joinRace(raceId: string): Promise<JoinRaceResult> {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const race = await payload.findByID({ collection: 'races', id: raceId })

  if (!race) {
    return { success: false, error: 'Race not found' }
  }

  if (race.status !== 'waiting' && race.status !== 'countdown') {
    return { success: false, error: 'Race already started' }
  }

  const existing = await payload.find({
    collection: 'race-participants',
    where: {
      and: [
        { race: { equals: raceId } },
        { player: { equals: user.id } },
      ],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return { success: true }
  }

  const participantCount = await payload.count({
    collection: 'race-participants',
    where: { race: { equals: raceId } },
  })

  const maxPlayers = race.config?.maxPlayers ?? 4
  if (participantCount.totalDocs >= maxPlayers) {
    return { success: false, error: 'Race is full' }
  }

  await payload.create({
    collection: 'race-participants',
    data: {
      race: raceId,
      player: user.id,
      position: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      joinedAt: new Date().toISOString(),
    },
  })

  const newCount = participantCount.totalDocs + 1
  if (newCount >= MIN_PLAYERS_TO_START && race.status === 'waiting') {
    const countdownSeconds = race.config?.countdownSeconds ?? 5
    const startedAt = new Date()
    const roundEndsAt = new Date(
      startedAt.getTime() + countdownSeconds * 1000 + (race.roundDuration ?? 60) * 1000,
    )

    await payload.update({
      collection: 'races',
      id: raceId,
      data: {
        status: 'countdown',
        startedAt: startedAt.toISOString(),
        roundEndsAt: roundEndsAt.toISOString(),
      },
    })
  }

  return { success: true }
}
