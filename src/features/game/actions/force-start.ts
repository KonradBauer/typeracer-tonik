'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function forceStart(raceId: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const race = await payload.findByID({ collection: 'races', id: raceId })

  if (!race || race.status !== 'waiting') {
    return { success: false, error: 'Race cannot be started' }
  }

  const isParticipant = await payload.find({
    collection: 'race-participants',
    where: {
      and: [
        { race: { equals: raceId } },
        { player: { equals: user.id } },
      ],
    },
    limit: 1,
  })

  if (isParticipant.docs.length === 0) {
    return { success: false, error: 'Not a participant' }
  }

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

  return { success: true }
}
