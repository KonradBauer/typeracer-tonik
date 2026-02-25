import { cookies } from 'next/headers'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect, notFound } from 'next/navigation'
import config from '@payload-config'
import { SoloRace } from '@/features/game/components/solo-race'

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

  let race: any
  try {
    race = await payload.findByID({ collection: 'races', id, depth: 1 })
  } catch {
    notFound()
  }

  const text =
    typeof race.text === 'object' && race.text !== null
      ? race.text.content
      : null

  if (!text) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Race</h1>
      <SoloRace
        raceId={id}
        text={text}
        userId={String(user.id)}
        username={(user as any).username || user.email}
      />
    </div>
  )
}
