import type { LeaderboardEntry } from '@/features/leaderboard/actions/get-leaderboard'
import { Badge } from '@/shared/ui/badge'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

function rankBadgeVariant(rank: number) {
  if (rank === 1) return 'success' as const
  if (rank === 2) return 'warning' as const
  if (rank === 3) return 'danger' as const
  return 'default' as const
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-muted">No races completed yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card text-left">
            <th className="px-4 py-3 font-medium text-muted">#</th>
            <th className="px-4 py-3 font-medium text-muted">Player</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Elo</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Avg WPM</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Best WPM</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Accuracy</th>
            <th className="px-4 py-3 font-medium text-muted text-right">Races</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const rank = i + 1
            return (
              <tr key={entry.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <Badge variant={rankBadgeVariant(rank)}>{rank}</Badge>
                </td>
                <td className="px-4 py-3 font-medium">{entry.username}</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.elo}</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.avgWpm}</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.bestWpm}</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.avgAccuracy}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.totalRaces}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
