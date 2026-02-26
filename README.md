# TypeRacer Tonik

A real-time multiplayer typing competition platform built with Next.js, Payload CMS, and MongoDB.

Players join races, type the same sentence simultaneously, and compete on speed and accuracy — all synchronized via server-driven polling with no WebSocket dependency.

## Quick Start

```bash
git clone <repo-url>
cd typeracer-tonik
cp .env.example .env
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Create an admin user on first launch, then seed texts via the admin panel at `/admin`.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string (e.g. `mongodb://127.0.0.1/typeracer-tonik`) |
| `PAYLOAD_SECRET` | Auth secret for Payload CMS (min 24 chars) |

### Docker

```bash
docker compose up        # development (with hot reload)
docker compose -f docker-compose.prod.yml up -d  # production
```

## Architecture

### Tech Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript** — strict typing throughout
- **Payload CMS 3** — headless CMS for data management and auth
- **MongoDB** — primary persistence
- **Zustand** — client-side race state
- **Tailwind CSS** — utility-first styling

### Design Decisions

**Server-driven realtime (no WebSockets)**
Multiplayer synchronization uses Server Actions + client-side polling. The server is the single source of truth for race state. Players poll at phase-aware intervals (3s waiting, 500ms countdown, 1.5s racing). This was chosen for simplicity, stateless deployment, and compatibility with any hosting environment.

**Feature-based architecture**
Code is organized by feature (`auth`, `game`, `lobby`, `leaderboard`, `results`) rather than by type. Each feature owns its actions, components, hooks, and stores.

**Strict layer separation**
```
UI Components
     ↓
Application Layer (Server Actions — orchestration, auth, persistence)
     ↓
Domain Layer (pure functions — typing engine, race state machine, scoring)
     ↓
Infrastructure Layer (Payload collections, MongoDB)
```
Domain logic has zero framework dependencies. Server Actions handle mutations and state transitions. UI components never talk to the database directly.

**Payload as infrastructure only**
Payload manages collections, auth, and admin UI. Business logic lives in the domain layer, not in collection hooks. The one exception is `update-user-stats` — a Payload afterChange hook that updates aggregate user stats when a race result is created.

**Immutable typing engine**
`processKeystroke()` returns a new state object on every keypress. No mutations. This makes the engine testable, predictable, and replayable.

**Elo rating system**
Standard pairwise Elo calculation (K=32) across all race participants. Rankings are computed by WPM (primary) and accuracy (tiebreaker).

### Folder Structure

```
src/
├── app/                    # Next.js routes
│   ├── (frontend)/         # User-facing pages
│   │   ├── (auth)/         # Login, Register
│   │   ├── (game)/         # Lobby, Race, Results
│   │   ├── leaderboard/
│   │   └── profile/[id]/
│   └── (payload)/          # Payload admin + API routes
├── domain/                 # Pure business logic (no dependencies)
│   ├── typing/             # Typing engine, stats, WPM/accuracy
│   ├── race/               # State machine, scoring, Elo
│   └── text/               # Text selection
├── features/               # Feature modules
│   ├── auth/               # Login, register, logout actions + forms
│   ├── game/               # Race actions, components, hooks, store
│   ├── lobby/              # Room listing + creation
│   ├── leaderboard/        # Rankings
│   └── results/            # Post-race results display
├── infrastructure/         # External services
│   └── payload/            # Collections, hooks
└── shared/                 # Reusable UI, utilities, constants
```

### Data Model

- **users** — auth-enabled, tracks stats (totalRaces, avgWpm, bestWpm, avgAccuracy, elo)
- **texts** — sentences for races, with difficulty and auto-computed word/char counts
- **races** — race rooms with status lifecycle (waiting → countdown → racing → finished)
- **race-participants** — live player state per race (position, wpm, accuracy, finished)
- **race-results** — final results, triggers user stats update via hook

### Race Lifecycle

1. **Create** — host creates a room, random text selected
2. **Join** — players join, participant docs created
3. **Countdown** — triggered when minimum players reached (2), server sets `startedAt`
4. **Racing** — players type, submit progress every ~2s, poll state every ~1.5s
5. **Finished** — round timer expires or all players finish, rankings computed, Elo updated
6. **Results** — final standings displayed with WPM, accuracy, position

## Features

- Multiplayer typing races with server-authoritative state
- Real-time player progress bars and live WPM display
- Character-by-character feedback (green = correct, red = error)
- WPM, accuracy, and consistency metrics
- Elo-based ranking system
- Leaderboard with sortable columns, pagination, and URL-persisted state
- Player profiles with stats and race history
- Timed rounds with configurable duration
- Auth with httpOnly cookies and progressive enhancement forms
- Loading states and error boundaries
- Responsive design
- Admin panel (Payload CMS) for content management

## What I Would Add With More Time

- **Tests** — tested only manually
- **Caching** — `unstable_cache` or `revalidateTag` on leaderboard and text queries to reduce DB pressure
- **Monitoring** — structured logging, error tracking (Sentry), health check endpoint
- **SSE transport** — replace polling with Server-Sent Events for lower latency, the architecture already supports transport swapping
- **Lobby auto-refresh** — poll the lobby list so new races appear without page reload
- **Spectator mode** — watch ongoing races without joining
- **Rematch flow** — "Play Again" that creates a new race with same players
- **Text difficulty selection** — let hosts pick easy/medium/hard
- **Anti-cheat** — server-side keystroke timing validation
- **Rate limiting** — on progress submission and polling endpoints
- **Redis** — for hot race state to reduce MongoDB read pressure at scale

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build (standalone output) |
| `pnpm start` | Start production server |
| `pnpm format` | Format all files with Prettier |
| `pnpm generate:types` | Regenerate Payload types |
