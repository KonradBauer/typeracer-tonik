'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@payload-config'

interface SubmitProgressInput {
  raceId: string
  position: number
  wpm: number
  accuracy: number
}

export async function submitProgress(input: SubmitProgressInput) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return { success: false }
  }

  const participant = await payload.find({
    collection: 'race-participants',
    where: {
      and: [{ race: { equals: input.raceId } }, { player: { equals: user.id } }],
    },
    limit: 1,
  })

  if (participant.docs.length === 0) {
    return { success: false }
  }

  const doc = participant.docs[0]

  if (doc.finished) {
    return { success: true }
  }

  await payload.update({
    collection: 'race-participants',
    id: doc.id,
    data: {
      position: input.position,
      wpm: input.wpm,
      accuracy: input.accuracy,
    },
  })

  return { success: true }
}
