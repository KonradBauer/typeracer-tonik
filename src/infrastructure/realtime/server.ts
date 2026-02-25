import { WebSocketServer, WebSocket } from 'ws'
import type { IncomingMessage } from 'http'
import type { Duplex } from 'stream'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  getOrCreateRoom,
  addClient,
  removeClient,
  broadcast,
  broadcastAll,
  isAllReady,
  getRoomPlayerList,
  type RoomClient,
} from './rooms'
import { decodeClientMessage, encodeMessage } from './messages'
import type { ServerMessage } from './messages'
import {
  createRace,
  addPlayer as addRacePlayer,
  startCountdown,
  tickCountdown,
  startRacing,
  updatePlayerProgress,
  finishPlayer,
} from '@/domain/race/state-machine'
import { calculateRankings } from '@/domain/race/scoring'
import type { Race } from '@/domain/race/types'
import { RACE_DEFAULTS } from '@/shared/lib/constants'

const wss = new WebSocketServer({ noServer: true })
const raceStates = new Map<string, Race>()

async function authenticateToken(token: string) {
  const payload = await getPayload({ config })
  const headers = new Headers()
  headers.set('Authorization', `JWT ${token}`)
  const { user } = await payload.auth({ headers })
  return user
}

function parseQuery(url: string | undefined) {
  if (!url) return { roomId: '', token: '' }
  const params = new URL(url, 'http://localhost').searchParams
  return {
    roomId: params.get('roomId') || '',
    token: params.get('token') || '',
  }
}

wss.on('connection', (ws: WebSocket, req: IncomingMessage, user: { id: string; username: string }, roomId: string) => {
  const room = getOrCreateRoom(roomId)

  const client: RoomClient = {
    id: user.id,
    username: user.username,
    ready: false,
    send: (data: string) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
    },
  }

  addClient(room, client)

  const stateMsg: ServerMessage = {
    type: 'room:state',
    payload: {
      raceId: roomId,
      status: raceStates.get(roomId)?.status ?? 'waiting',
      players: getRoomPlayerList(room),
      text: raceStates.get(roomId)?.text ?? null,
    },
  }
  client.send(encodeMessage(stateMsg))
  broadcast(room, stateMsg, user.id)

  ws.on('message', (raw: Buffer) => {
    const msg = decodeClientMessage(raw.toString())
    if (!msg) return

    switch (msg.type) {
      case 'player:ready': {
        client.ready = true
        broadcastAll(room, {
          type: 'room:state',
          payload: {
            raceId: roomId,
            status: raceStates.get(roomId)?.status ?? 'waiting',
            players: getRoomPlayerList(room),
            text: raceStates.get(roomId)?.text ?? null,
          },
        })

        if (isAllReady(room) && !raceStates.has(roomId)) {
          startRaceCountdown(roomId, room)
        }
        break
      }

      case 'player:keystroke': {
        const race = raceStates.get(roomId)
        if (!race || race.status !== 'racing') break

        const updated = updatePlayerProgress(
          race,
          user.id,
          msg.payload.position,
          0,
        )
        raceStates.set(roomId, updated)

        broadcast(room, {
          type: 'player:progress',
          payload: {
            playerId: user.id,
            username: user.username,
            position: msg.payload.position,
            wpm: 0,
          },
        }, user.id)
        break
      }

      case 'player:finished': {
        const race = raceStates.get(roomId)
        if (!race || race.status !== 'racing') break

        const finished = finishPlayer(race, user.id, msg.payload.wpm, msg.payload.accuracy)
        raceStates.set(roomId, finished)

        broadcastAll(room, {
          type: 'player:progress',
          payload: {
            playerId: user.id,
            username: user.username,
            position: race.text.length,
            wpm: msg.payload.wpm,
          },
        })

        if (finished.status === 'finished') {
          const rankings = calculateRankings(finished)
          broadcastAll(room, { type: 'race:finish', payload: { rankings } })
          raceStates.delete(roomId)
        }
        break
      }
    }
  })

  ws.on('close', () => {
    removeClient(room, user.id)
    const race = raceStates.get(roomId)
    broadcastAll(room, {
      type: 'room:state',
      payload: {
        raceId: roomId,
        status: race?.status ?? 'waiting',
        players: getRoomPlayerList(room),
        text: race?.text ?? null,
      },
    })
  })
})

async function startRaceCountdown(roomId: string, room: ReturnType<typeof getOrCreateRoom>) {
  const payload = await getPayload({ config })
  const textsResult = await payload.find({ collection: 'texts', limit: 100 })
  const texts = textsResult.docs
  if (texts.length === 0) return

  const randomText = texts[Math.floor(Math.random() * texts.length)]
  const textContent = randomText.content

  let race = createRace(roomId, textContent, RACE_DEFAULTS)

  for (const client of room.clients.values()) {
    const result = addRacePlayer(race, {
      id: client.id,
      username: client.username,
      position: 0,
      wpm: 0,
      accuracy: 0,
      finished: false,
    })
    if (result) race = result
  }

  const started = startCountdown(race)
  if (!started) return
  race = started
  raceStates.set(roomId, race)

  let countdown = race.config.countdownSeconds
  const interval = setInterval(() => {
    broadcastAll(room, { type: 'race:countdown', payload: { seconds: countdown } })
    countdown--
    race = tickCountdown(race)
    raceStates.set(roomId, race)

    if (countdown < 0) {
      clearInterval(interval)
      const startTime = Date.now()
      const racing = startRacing(race, startTime)
      if (racing) {
        raceStates.set(roomId, racing)
        broadcastAll(room, {
          type: 'race:start',
          payload: { text: textContent, startTime },
        })
      }
    }
  }, 1000)
}

export function handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
  const { roomId, token } = parseQuery(req.url)

  if (!roomId || !token) {
    socket.destroy()
    return
  }

  authenticateToken(token)
    .then((user) => {
      if (!user) {
        socket.destroy()
        return
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req, { id: String(user.id), username: (user as any).username || user.email }, roomId)
      })
    })
    .catch(() => {
      socket.destroy()
    })
}
