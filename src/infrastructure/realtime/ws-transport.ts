import type { ClientMessage, ServerMessage } from './messages'
import { decodeServerMessage, encodeMessage } from './messages'
import type { ConnectionState, RealtimeTransport } from './transport'
import { WS_URL } from '@/shared/lib/constants'

export function createWsTransport(): RealtimeTransport {
  let ws: WebSocket | null = null
  let state: ConnectionState = 'disconnected'

  const messageHandlers = new Set<(msg: ServerMessage) => void>()
  const stateHandlers = new Set<(state: ConnectionState) => void>()

  function setState(next: ConnectionState) {
    state = next
    stateHandlers.forEach((h) => h(next))
  }

  function connect(roomId: string, token: string) {
    if (ws) disconnect()

    setState('connecting')

    const url = `${WS_URL}?roomId=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}`
    ws = new WebSocket(url)

    ws.onopen = () => {
      setState('connected')
    }

    ws.onmessage = (event) => {
      const msg = decodeServerMessage(String(event.data))
      if (msg) {
        messageHandlers.forEach((h) => h(msg))
      }
    }

    ws.onclose = () => {
      ws = null
      setState('disconnected')
    }

    ws.onerror = () => {
      setState('error')
    }
  }

  function disconnect() {
    if (ws) {
      ws.onclose = null
      ws.onerror = null
      ws.onmessage = null
      ws.close()
      ws = null
    }
    setState('disconnected')
  }

  function send(message: ClientMessage) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(encodeMessage(message))
    }
  }

  function onMessage(handler: (msg: ServerMessage) => void) {
    messageHandlers.add(handler)
    return () => {
      messageHandlers.delete(handler)
    }
  }

  function onStateChange(handler: (s: ConnectionState) => void) {
    stateHandlers.add(handler)
    return () => {
      stateHandlers.delete(handler)
    }
  }

  function getState() {
    return state
  }

  return { connect, disconnect, send, onMessage, onStateChange, getState }
}
