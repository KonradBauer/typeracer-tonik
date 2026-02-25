import { Suspense } from 'react'
import { getLeaderboard } from '@/features/leaderboard/actions/get-leaderboard'
import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { Spinner } from '@/shared/ui/spinner'

export const metadata = {
  title: 'Leaderboard — TypeRacer Tonik',
}

async function LeaderboardData() {
  const entries = await getLeaderboard()
  return <LeaderboardTable entries={entries} />
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        }
      >
        <LeaderboardData />
      </Suspense>
    </div>
  )
}
