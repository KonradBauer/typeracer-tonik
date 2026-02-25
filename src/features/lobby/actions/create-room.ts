'use server'

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import config from '@payload-config'

export async function createRoom() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  const textsResult = await payload.find({ collection: 'texts', limit: 100 })
  if (textsResult.docs.length === 0) {
    throw new Error('No texts available. Seed some texts first.')
  }

  const randomText = textsResult.docs[Math.floor(Math.random() * textsResult.docs.length)]

  const race = await payload.create({
    collection: 'races',
    data: {
      status: 'waiting',
      text: randomText.id,
      config: {
        maxPlayers: 4,
        countdownSeconds: 5,
      },
      createdBy: user.id,
    },
  })

  redirect(`/race/${race.id}`)
}
