import { cookies } from 'next/headers'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import { RacePageClient } from '@/features/game/components/race-page-client'

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

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value ?? ''

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Race</h1>
      <RacePageClient raceId={id} token={token} currentUserId={String(user.id)} />
    </div>
  )
}
