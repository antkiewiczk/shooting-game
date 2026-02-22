# 🎯 Shooting Game

A full-stack shooting game with session management, real-time scoring, and global leaderboards. Players compete to achieve the highest scores through strategic shooting.

## 🚀 Quick Start (Docker)

```bash
docker-compose up --build
```

Then open **http://localhost:5173**

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | pnpm workspaces |
| **Backend** | NestJS, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Frontend** | React 19, Vite, Tailwind CSS 4 |
| **Auth** | JWT (passport-jwt) |
| **Testing** | Jest |

## 📁 Project Structure

```
shooting-game-monorepo/
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/    # Authentication (JWT, guards)
│   │   │   ├── session/ # Game sessions, DTOs, repositories
│   │   │   └── prisma/  # Database schema & migrations
│   │   └── package.json
│   └── web/              # React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── auth/       # Login form, player selector
│       │   │   ├── game/      # Game component
│       │   │   ├── layout/    # Header, layout components
│       │   │   └── leaderboard/
│       │   ├── services/       # API client, auth, game services
│       │   ├── hooks/         # useAuth, useLeaderboard
│       │   └── theme/         # Design tokens
│       └── package.json
├── packages/
│   └── shared/           # Shared scoring logic
├── docker-compose.yml
└── README.md
```

## 💻 Local Development

### Prerequisites
- Node.js >= 22
- PostgreSQL 15+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp apps/api/.env.example apps/api/.env

# Setup database
cd apps/api && npx prisma db push

# Build shared package
pnpm --filter @shared/core build

# Start development servers
pnpm dev
```

Services will be available at:
- **Web**: http://localhost:5173
- **API**: http://localhost:3001

## 🎮 How to Play

1. Open http://localhost:5173
2. Enter your email or select a pre-seeded player
3. Click "Start Playing"
4. Click "Start New Game"
5. Click "Shoot (Hit)" or "Shoot (Miss)"
6. Click "Finish Game" to see your final score
7. Compete for the top spot on the leaderboard!

### Pre-seeded Players

Try these accounts or create your own:

| Email | Description |
|-------|-------------|
| player1@test.com | Test player |
| player2@test.com | Test player |
| player3@test.com | Test player |
| sharpshooter@test.com | Experienced shooter |
| aimbot@test.com | Precision marksman |
| sniper@test.com | Long-range expert |

## 📊 Scoring System

| Action | Points |
|--------|--------|
| Hit | +10 |
| Miss | 0 |
| Distance Bonus | +5 (only when hit distance > 10) |
| Combo Bonus | +5 (every 3 consecutive hits) |

### Scoring Examples

```
3 hits at distance 5:     3×10 + 5 (combo) = 35 points
3 hits at distance 15:   3×10 + 3×5 (distance) + 5 (combo) = 50 points
Hit, miss, hit, hit:    3×10 + 5 (combo for last 3) = 35 points
```

## 🔌 API Documentation

### Authentication

Generate a JWT token:

```bash
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email": "player1@test.com"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Endpoints

All endpoints (except `/auth/token`) require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/token` | Generate JWT token |
| `POST` | `/sessions` | Start a new game session |
| `POST` | `/sessions/:id/events` | Record a shot event |
| `POST` | `/sessions/:id/finish` | End session & calculate score |
| `GET` | `/sessions/:id` | Get session details |
| `GET` | `/leaderboard?mode=arcade&limit=10` | Get top scores |

### Example: Full Game Flow

```bash
# 1. Start a session
curl -X POST http://localhost:3001/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode": "arcade"}'

# 2. Record a hit
curl -X POST http://localhost:3001/sessions/$SESSION_ID/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "SHOT", "ts": "2025-01-01T10:00:01Z", "payload": {"hit": true, "distance": 15}}'

# 3. Record a miss
curl -X POST http://localhost:3001/sessions/$SESSION_ID/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "SHOT", "ts": "2025-01-01T10:00:02Z", "payload": {"hit": false, "distance": 5}}'

# 4. Finish the game
curl -X POST http://localhost:3001/sessions/$SESSION_ID/finish \
  -H "Authorization: Bearer $TOKEN"

# 5. View leaderboard
curl http://localhost:3001/leaderboard?mode=arcade&limit=10 \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run API tests
pnpm --filter api test

# Run shared package tests
pnpm --filter @shared/core test

# Run with coverage
pnpm --filter api test:cov
```

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm test` | Run all tests |
| `pnpm build` | Build shared package |
| `pnpm --filter api dev` | Start API server |
| `pnpm --filter web dev` | Start web client |
| `pnpm --filter api lint` | Lint API code |
| `pnpm --filter web lint` | Lint web code |

## ⚙️ Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shooting_game"
JWT_SECRET="your-secret-key"
```

### Web (`apps/web/.env`)

```env
VITE_API_URL="http://localhost:3001"
VITE_DEV_TOKEN=""  # Optional: auto-login for development
```

## 🏗️ Architecture

### Backend Patterns
- **DTOs** with class-validator for request validation
- **Repository Pattern** for data access abstraction
- **Custom Exceptions** for domain-specific errors
- **Guards** for authentication/authorization

### Frontend Patterns
- **Service Layer** for API communication
- **Custom Hooks** (useAuth, useLeaderboard)
- **Common Components** (Button, Input, Card)
- **Theme System** with Tailwind CSS 4 @theme

## 🔐 Authentication

### How It Works

The app uses JWT (JSON Web Tokens) for authentication:

```
┌─────────────┐     POST /auth/token      ┌─────────────┐
│             │ ──────────────────────►  │             │
│   Browser   │   { email: "..." }       │   API       │
│   (React)   │ ◄───────────────────    │  (NestJS)   │
│             │   { token: "..." }      │             │
└─────────────┘                          └─────────────┘
       │
       ▼
┌─────────────┐
│ localStorage│  ← stores token ('auth_token')
│ apiClient   │  ← uses token in Authorization header
└─────────────┘
```

### Token Storage

- **localStorage** (`auth_token` key) - persists across browser sessions
- **API Client memory** - attached to every authenticated request

### Backend Flow

1. `POST /auth/token` - Receives email, creates/finds user, returns JWT
2. JWT signed with `JWT_SECRET` from environment
3. Protected endpoints use `JwtAuthGuard` to validate token
4. `SessionGuard` ensures user owns the session they're accessing

### Frontend Flow

1. User enters email → calls `authService.generateToken(email)`
2. Token stored in localStorage: `localStorage.setItem('auth_token', token)`
3. Token also set in apiClient for making requests
4. All API calls include `Authorization: Bearer <token>`

## 📄 License

UNLICENSED
