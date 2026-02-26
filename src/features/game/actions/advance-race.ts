'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function advanceRace(raceId: string): Promise<void> {
  const payload = await getPayload({ config })

  const race = await payload.findByID({ collection: 'races', id: raceId })
  if (!race) return

  const now = Date.now()

  if (race.status === 'countdown' && race.startedAt) {
    const countdownEnd =
      new Date(race.startedAt).getTime() + (race.config?.countdownSeconds ?? 5) * 1000
    if (now >= countdownEnd) {
      await payload.update({
        collection: 'races',
        id: raceId,
        data: { status: 'racing' },
      })
      return
    }
  }

  if (race.status === 'racing' && race.roundEndsAt) {
    const roundEnd = new Date(race.roundEndsAt).getTime()
    if (now >= roundEnd) {
      await payload.update({
        collection: 'races',
        id: raceId,
        data: { status: 'finished', finishedAt: new Date().toISOString() },
      })
    }
  }
}
