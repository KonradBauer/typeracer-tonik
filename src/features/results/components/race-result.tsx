import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

interface RaceResultProps {
  rankings: {
    position: number
    username: string
    wpm: number
    accuracy: number
  }[]
}

function positionBadgeVariant(position: number) {
  if (position === 1) return 'success' as const
  if (position === 2) return 'warning' as const
  return 'default' as const
}

export function RaceResult({ rankings }: RaceResultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Race Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {rankings.map((r, i) => (
            <div
              key={i}
              className="border-border flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge variant={positionBadgeVariant(r.position)}>#{r.position}</Badge>
                <span className="font-medium">{r.username}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="tabular-nums">
                  <span className="text-muted">WPM </span>
                  {r.wpm}
                </span>
                <span className="tabular-nums">
                  <span className="text-muted">ACC </span>
                  {r.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
