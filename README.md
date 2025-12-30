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
├── pnpm-workspace.yaml
└── README.md
```

## Prerequisites

- Node.js >= 22
- PostgreSQL 15+
- pnpm

## Getting Started

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

# Edit apps/api/.env with your database credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/shooting_game"
# JWT_SECRET="your-secret-key"

# Run migrations
cd apps/api && npx prisma db push

# Seed users
npx prisma db seed
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
| `pnpm --filter api dev` | Start API server |
| `pnpm --filter web dev` | Start web client |
| `pnpm --filter @shared/core build` | Build shared package |
| `pnpm --filter @shared/core test` | Run scoring tests |
| `pnpm --filter api run mint:token -- <email>` | Generate JWT token |

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sessions` | Start a new game session |
| `POST` | `/sessions/:id/events` | Record a shot event |
| `POST` | `/sessions/:id/finish` | End session and calculate score |
| `GET` | `/sessions/:id` | View session details |
| `GET` | `/leaderboard?mode=arcade&limit=10` | Get top scores |

## Playing the Game

### 1. Generate a token

```bash
cd apps/api
pnpm run mint:token -- player1@test.com
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
  -d '{
    "type": "SHOT",
    "ts": "2025-01-01T10:00:01Z",
    "payload": {"hit": true, "distance": 15}
  }'

# Miss
curl -X POST "http://localhost:3001/sessions/$SESSION_ID/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SHOT",
    "ts": "2025-01-01T10:00:02Z",
    "payload": {"hit": false, "distance": 5}
  }'
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

Or open the web client at http://localhost:5173 and paste your token.

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

## Database Management

### Prisma Studio (GUI)

Browse and edit database records in a visual interface:

```bash
cd apps/api && npx prisma studio
```

Opens at http://localhost:5555

### Clear Leaderboard

```bash
# Delete all sessions and events (keep users)
cd apps/api && npx prisma db execute --stdin <<< "DELETE FROM \"Event\"; DELETE FROM \"Session\";"

# Or full reset (deletes everything, re-seeds users)
cd apps/api && npx prisma db push --force-reset && npx prisma db seed
```

## Testing

```bash
# Run scoring logic tests
pnpm --filter @shared/core test
```

Tests cover:
- ✅ Hits and misses
- ✅ Distance bonus (>10)
- ✅ Combo bonus (3/6/7 consecutive hits)
- ✅ Empty sequences
- ✅ Mixed sequences with combo interruption

## Auth Validation

| Status | Condition |
|--------|-----------|
| 401 | Missing or invalid token |
| 403 | User ID from token not found in database |
| 403 | Accessing another user's session |
| 400 | Adding events to finished session |
| 404 | Session not found |

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

