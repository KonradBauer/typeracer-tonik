import { RacePageClient } from '@/features/game/components/race-page-client'

export const metadata = {
  title: 'Race — TypeRacer Tonik',
}

interface RacePageProps {
  params: Promise<{ id: string }>
}

export default async function RacePage({ params }: RacePageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Race</h1>
      <RacePageClient raceId={id} />
    </div>
  )
}
