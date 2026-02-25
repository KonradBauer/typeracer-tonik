'use client'

import { Button } from '@/shared/ui/button'
import { createRoom } from '@/features/lobby/actions/create-room'

export function CreateRoomButton() {
  return (
    <form action={createRoom}>
      <Button size="lg">Create Race</Button>
    </form>
  )
}
