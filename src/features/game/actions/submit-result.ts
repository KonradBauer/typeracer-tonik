'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@payload-config'

interface SubmitResultInput {
  raceId: string
  position: number
  wpm: number
  accuracy: number
  consistency: number
}

export async function submitResult(input: SubmitResultInput) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Not authenticated')
  }

  const existing = await payload.find({
    collection: 'race-results',
    where: {
      and: [{ race: { equals: input.raceId } }, { player: { equals: user.id } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0]
  }

  const result = await payload.create({
    collection: 'race-results',
    data: {
      race: input.raceId,
      player: user.id,
      position: input.position,
      wpm: input.wpm,
      accuracy: input.accuracy,
      consistency: input.consistency,
      finishedAt: new Date().toISOString(),
    },
  })

  return result
}
