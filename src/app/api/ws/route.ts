export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET() {
  return new Response('WebSocket endpoint — upgrade required', { status: 426 })
}
