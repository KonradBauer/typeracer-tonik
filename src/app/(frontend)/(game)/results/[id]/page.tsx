import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { RaceResult } from '@/features/results/components/race-result'
import { Button } from '@/shared/ui/button'

export const metadata = {
  title: 'Results — TypeRacer Tonik',
}

interface ResultsPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  const results = await payload.find({
    collection: 'race-results',
    where: { race: { equals: id } },
    sort: 'position',
    depth: 1,
  })

  if (results.docs.length === 0) {
    notFound()
  }

  const rankings = results.docs.map((doc) => ({
    position: doc.position,
    username:
      typeof doc.player === 'object' && doc.player !== null
        ? (doc.player as any).username || (doc.player as any).email
        : 'Unknown',
    wpm: doc.wpm,
    accuracy: doc.accuracy,
  }))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Race Results</h1>
      <RaceResult rankings={rankings} />
      <div className="flex gap-3">
        <Link href="/lobby">
          <Button>Back to Lobby</Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="secondary">Leaderboard</Button>
        </Link>
      </div>
    </div>
  )
}
