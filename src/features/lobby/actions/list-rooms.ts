'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function listRooms() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'races',
    where: {
      status: { equals: 'waiting' },
    },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
  })

  return result.docs
}
