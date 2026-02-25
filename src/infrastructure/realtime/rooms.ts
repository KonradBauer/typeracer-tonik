import type { ServerMessage } from './messages'
import { encodeMessage } from './messages'

export interface RoomClient {
  id: string
  username: string
  ready: boolean
  send: (data: string) => void
}

export interface Room {
  id: string
  clients: Map<string, RoomClient>
}

const rooms = new Map<string, Room>()

export function getOrCreateRoom(roomId: string): Room {
  let room = rooms.get(roomId)
  if (!room) {
    room = { id: roomId, clients: new Map() }
    rooms.set(roomId, room)
  }
  return room
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId)
}

export function addClient(room: Room, client: RoomClient) {
  room.clients.set(client.id, client)
}

export function removeClient(room: Room, clientId: string) {
  room.clients.delete(clientId)
  if (room.clients.size === 0) {
    rooms.delete(room.id)
  }
}

export function broadcast(room: Room, message: ServerMessage, excludeId?: string) {
  const data = encodeMessage(message)
  for (const [id, client] of room.clients) {
    if (id !== excludeId) {
      client.send(data)
    }
  }
}

export function broadcastAll(room: Room, message: ServerMessage) {
  const data = encodeMessage(message)
  for (const client of room.clients.values()) {
    client.send(data)
  }
}

export function sendTo(room: Room, clientId: string, message: ServerMessage) {
  const client = room.clients.get(clientId)
  if (client) {
    client.send(encodeMessage(message))
  }
}

export function isAllReady(room: Room): boolean {
  if (room.clients.size === 0) return false
  for (const client of room.clients.values()) {
    if (!client.ready) return false
  }
  return true
}

export function getRoomPlayerList(room: Room) {
  return Array.from(room.clients.values()).map((c) => ({
    id: c.id,
    username: c.username,
    ready: c.ready,
  }))
}
