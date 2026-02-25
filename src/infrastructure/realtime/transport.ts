import type { ClientMessage, ServerMessage } from './messages'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface RealtimeTransport {
  connect(roomId: string, token: string): void
  disconnect(): void
  send(message: ClientMessage): void
  onMessage(handler: (message: ServerMessage) => void): () => void
  onStateChange(handler: (state: ConnectionState) => void): () => void
  getState(): ConnectionState
}
