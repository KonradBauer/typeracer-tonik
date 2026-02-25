import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'

export const metadata = {
  title: 'Profile — TypeRacer Tonik',
}

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  let user: any
  try {
    user = await payload.findByID({ collection: 'users', id })
  } catch {
    notFound()
  }

  const stats = user.stats ?? {}
  const recentResults = await payload.find({
    collection: 'race-results',
    where: { player: { equals: id } },
    sort: '-createdAt',
    limit: 10,
    depth: 1,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          {user.displayName && <p className="text-muted">{user.displayName}</p>}
        </div>
        <Badge>{stats.elo ?? 1000} Elo</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Races" value={stats.totalRaces ?? 0} />
        <StatCard label="Avg WPM" value={stats.avgWpm ?? 0} />
        <StatCard label="Best WPM" value={stats.bestWpm ?? 0} />
        <StatCard label="Accuracy" value={`${stats.avgAccuracy ?? 0}%`} />
        <StatCard label="Elo" value={stats.elo ?? 1000} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Races</CardTitle>
        </CardHeader>
        <CardContent>
          {recentResults.docs.length === 0 ? (
            <p className="text-muted">No races yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentResults.docs.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <Badge variant={result.position === 1 ? 'success' : 'default'}>
                    #{result.position}
                  </Badge>
                  <span className="tabular-nums">{result.wpm} WPM</span>
                  <span className="tabular-nums">{result.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
