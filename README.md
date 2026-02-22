# 🎯 Shooting Game

A full-stack shooting game with session management, scoring system, and leaderboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | pnpm workspaces |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Database** | PostgreSQL 15+ |
| **Frontend** | React 19, Vite, Tailwind CSS 4 |
| **Auth** | JWT (passport-jwt) |
| **Testing** | Jest |
| **Shared** | TypeScript package with scoring logic |

## Project Structure

```
shooting-game-monorepo/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── packages/
│   └── shared/       # Shared scoring logic
├── docker-compose.yml
├── Dockerfile.api
├── Dockerfile.web
└── README.md
```

## Quick Start (Docker)

The easiest way to run the application:

```bash
# Clone and run
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

Services:
- **Web**: http://localhost:5173
- **API**: http://localhost:3001
- **Database**: localhost:5432

### First Time Use

1. Open http://localhost:5173
2. Enter your email (e.g., `player1@test.com`)
3. Click "Generate Token"
4. You're in!

---

## Local Development

### Prerequisites

- Node.js >= 22
- PostgreSQL 15+
- pnpm

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup database

```bash
# Create PostgreSQL database
createdb shooting_game

# Copy environment file
cp apps/api/.env.example apps/api/.env

# Run migrations
cd apps/api && npx prisma db push
```

### 3. Build shared package

```bash
pnpm --filter @shared/core build
```

### 4. Start development servers

```bash
# Start both API and web
pnpm dev

# Or separately:
pnpm --filter api dev      # API on http://localhost:3001
pnpm --filter web dev      # Web on http://localhost:5173
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm test` | Run all tests |
| `pnpm build` | Build shared package |
| `pnpm --filter api dev` | Start API server |
| `pnpm --filter web dev` | Start web client |
| `pnpm --filter @shared/core test` | Run scoring tests |
| `pnpm --filter api lint` | Lint API |
| `pnpm --filter web lint` | Lint Web |

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/token` | Generate JWT token (no auth required) |
| `POST` | `/sessions` | Start a new game session |
| `POST` | `/sessions/:id/events` | Record a shot event |
| `POST` | `/sessions/:id/finish` | End session and calculate score |
| `GET` | `/sessions/:id` | View session details |
| `GET` | `/leaderboard?mode=arcade&limit=10` | Get top scores |

## Playing the Game

### 1. Generate a token

```bash
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email": "player1@test.com"}'
```

### 2. Start a session

```bash
TOKEN="<your-token>"

curl -X POST http://localhost:3001/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode": "arcade"}'
```

Response:
```json
{
  "id": "session-uuid",
  "userId": "user-uuid",
  "mode": "arcade",
  "startedAt": "2025-01-01T10:00:00.000Z"
}
```

### 3. Record shots

```bash
SESSION_ID="<session-id>"

# Hit at distance 15 (gets distance bonus)
curl -X POST "http://localhost:3001/sessions/$SESSION_ID/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "SHOT", "ts": "2025-01-01T10:00:01Z", "payload": {"hit": true, "distance": 15}}'

# Miss
curl -X POST "http://localhost:3001/sessions/$SESSION_ID/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "SHOT", "ts": "2025-01-01T10:00:02Z", "payload": {"hit": false, "distance": 5}}'
```

### 4. Finish session

```bash
curl -X POST "http://localhost:3001/sessions/$SESSION_ID/finish" \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "id": "session-uuid",
  "userId": "user-uuid",
  "score": 45,
  "hits": 3,
  "misses": 1,
  "finishedAt": "2025-01-01T10:05:00.000Z"
}
```

### 5. View leaderboard

```bash
curl "http://localhost:3001/leaderboard?mode=arcade&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Or open http://localhost:5173 to see the leaderboard.

## Scoring Rules

| Event | Points |
|-------|--------|
| Hit | +10 |
| Miss | 0 |
| Distance bonus (hit with distance > 10) | +5 |
| Combo (every 3 consecutive hits) | +5 |

### Examples

- 3 hits at distance 5: `3×10 + 5 (combo) = 35 pts`
- 3 hits at distance 15: `3×10 + 3×5 (distance) + 5 (combo) = 50 pts`
- Hit, miss, hit, hit, hit: `4×10 + 5 (combo for last 3) = 45 pts`

## Testing

```bash
# Run all tests
pnpm test

# Run scoring logic tests
pnpm --filter @shared/core test
```

Tests cover:
- ✅ Hits and misses
- ✅ Distance bonus (>10)
- ✅ Combo bonus (3/6/7 consecutive hits)
- ✅ Empty sequences
- ✅ Mixed sequences with combo interruption

## Architecture

### Backend Patterns

- **DTOs** with class-validator for request validation
- **Repository Pattern** for data access abstraction
- **Custom Exceptions** for error handling
- **Guards** for authentication and authorization

### Frontend Patterns

- **API Client** with interceptors
- **Service Layer** for business logic
- **Custom Hooks** (useAuth, useLeaderboard)
- **Common Components** (Button, Input, Card)
- **Theme System** with design tokens

## Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/shooting_game"
JWT_SECRET="your-super-secret-key"
```

### Web (`apps/web/.env`)

```env
VITE_API_URL="http://localhost:3001"
VITE_DEV_TOKEN=""  # Optional: auto-login during development
```

## License

UNLICENSED
