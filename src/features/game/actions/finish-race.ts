'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@payload-config'

interface FinishRaceInput {
  raceId: string
  wpm: number
  accuracy: number
  consistency: number
}

export async function finishRace(input: FinishRaceInput) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const participant = await payload.find({
    collection: 'race-participants',
    where: {
      and: [
        { race: { equals: input.raceId } },
        { player: { equals: user.id } },
      ],
    },
    limit: 1,
  })

  if (participant.docs.length === 0) {
    return { success: false, error: 'Not a participant' }
  }

  const doc = participant.docs[0]

  if (doc.finished) {
    return { success: true }
  }

  await payload.update({
    collection: 'race-participants',
    id: doc.id,
    data: {
      finished: true,
      finishedAt: new Date().toISOString(),
      wpm: input.wpm,
      accuracy: input.accuracy,
    },
  })

  const allParticipants = await payload.find({
    collection: 'race-participants',
    where: { race: { equals: input.raceId } },
    limit: 20,
  })

  const allFinished = allParticipants.docs.every((p) => p.finished || p.id === doc.id)

  if (allFinished) {
    await payload.update({
      collection: 'races',
      id: input.raceId,
      data: {
        status: 'finished',
        finishedAt: new Date().toISOString(),
      },
    })
  }

  const finishedDocs = allParticipants.docs
    .filter((p) => p.finished || p.id === doc.id)
    .sort((a, b) => (b.wpm ?? 0) - (a.wpm ?? 0))

  const position = finishedDocs.findIndex((p) => p.id === doc.id) + 1

  const existingResult = await payload.find({
    collection: 'race-results',
    where: {
      and: [
        { race: { equals: input.raceId } },
        { player: { equals: user.id } },
      ],
    },
    limit: 1,
  })

  if (existingResult.docs.length === 0) {
    await payload.create({
      collection: 'race-results',
      data: {
        race: input.raceId,
        player: user.id,
        position,
        wpm: input.wpm,
        accuracy: input.accuracy,
        consistency: input.consistency,
        finishedAt: new Date().toISOString(),
      },
    })
  }

  return { success: true }
}
