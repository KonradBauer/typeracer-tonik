# Deployment Guide

## Prerequisites

- Node.js ^18.20.2 or >=20.9.0
- pnpm ^9 or ^10
- MongoDB 7+
- (Optional) Docker & Docker Compose

## Local Development

```bash
cp .env.example .env
# Edit .env with your MongoDB URL and secret

pnpm install
pnpm seed          # Seed text passages
pnpm dev           # Start dev server on http://localhost:3000
```

Admin panel: http://localhost:3000/admin

## Production Build

```bash
pnpm build
pnpm start
```

The build produces a standalone output in `.next/standalone/`.

## Docker Deployment

### Using Docker Compose (recommended)

```bash
# Set your secrets
export PAYLOAD_SECRET=$(openssl rand -hex 24)
export NEXT_PUBLIC_WS_URL=wss://yourdomain.com/api/ws

# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Seed texts (first time only)
docker compose -f docker-compose.prod.yml exec app node -e "
  import('dotenv/config').then(() =>
    import('./src/infrastructure/db/seed-texts.ts').then(m => m.seedTexts())
  )
"
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| app     | 3000 | Next.js standalone (HTTP + WS) |
| mongo   | 27017| MongoDB with persistent volume |

## Reverse Proxy (Caddy)

Example Caddyfile for HTTPS + WebSocket:

```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

Caddy automatically handles HTTPS certificates and WebSocket upgrades.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `PAYLOAD_SECRET` | Yes | Secret for Payload auth (min 24 chars) |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket URL (use `wss://` in production) |
| `NODE_ENV` | No | Set to `production` for prod builds |

## Post-Deploy Checklist

1. MongoDB is running and accessible
2. `PAYLOAD_SECRET` is set to a secure random value
3. `NEXT_PUBLIC_WS_URL` points to your domain with `wss://`
4. Text passages are seeded (`pnpm seed`)
5. Admin user created via `/admin`
6. Reverse proxy configured for HTTPS
