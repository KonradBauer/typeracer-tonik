import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect, notFound } from 'next/navigation'
import config from '@payload-config'
import { MultiplayerRace } from '@/features/game/components/multiplayer-race'
import type { User } from '@/payload-types'

export const metadata = {
  title: 'Race — TypeRacer Tonik',
}

interface RacePageProps {
  params: Promise<{ id: string }>
}

export default async function RacePage({ params }: RacePageProps) {
  const { id } = await params

  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  let race
  try {
    race = await payload.findByID({ collection: 'races', id, depth: 1 })
  } catch {
    notFound()
  }

  if (race.status === 'finished') {
    redirect(`/results/${id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Race</h1>
      <MultiplayerRace
        raceId={id}
        userId={String(user.id)}
        username={(user as User).username}
      />
    </div>
  )
}
