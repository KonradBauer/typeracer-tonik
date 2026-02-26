import Link from 'next/link'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

interface LobbyCardProps {
  raceId: string
  createdBy: string
  maxPlayers: number
  playerCount: number
}

export function LobbyCard({ raceId, createdBy, maxPlayers, playerCount }: LobbyCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors duration-150">
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Race by {createdBy}</p>
          <div className="flex gap-2">
            <Badge>
              {playerCount}/{maxPlayers} players
            </Badge>
          </div>
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
