import Link from 'next/link'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

interface LobbyCardProps {
  raceId: string
  createdBy: string
  maxPlayers: number
}

export function LobbyCard({ raceId, createdBy, maxPlayers }: LobbyCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Race by {createdBy}</p>
          <Badge>Max {maxPlayers} players</Badge>
        </div>
        <Link href={`/race/${raceId}`}>
          <Button variant="secondary" size="sm">
            Join
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
