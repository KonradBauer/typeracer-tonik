import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

interface StatsBreakdownProps {
  wpm: number
  accuracy: number
  consistency: number
  position: number
  totalPlayers: number
}

export function StatsBreakdown({
  wpm,
  accuracy,
  consistency,
  position,
  totalPlayers,
}: StatsBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatItem label="WPM" value={String(wpm)} />
          <StatItem label="Accuracy" value={`${accuracy}%`} />
          <StatItem label="Consistency" value={`${consistency}%`} />
          <StatItem label="Position" value={`${position}/${totalPlayers}`} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background flex flex-col items-center gap-1 rounded-lg p-3">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-muted text-xs">{label}</span>
    </div>
  )
}
