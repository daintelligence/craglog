# CragLog — Setup Guide

## Prerequisites
- Docker Desktop (running)
- Git

## Quick Start

```bash
# 1. Copy env file
cp .env.example .env

# 2. Start all services
docker compose up --build

# 3. (First time only) Seed the database
docker exec craglog_backend npm run seed
```

App runs at: http://localhost:3000
API docs:    http://localhost:3001/api/docs

Demo login:  demo@craglog.app / demo1234

---

## Services
| Service    | Port | Notes                              |
|------------|------|------------------------------------|
| Frontend   | 3000 | Next.js (hot reload in dev)        |
| Backend    | 3001 | NestJS API + Swagger docs          |
| PostgreSQL | 5432 | PostGIS enabled                    |
| Redis      | 6379 | Caching layer                      |

---

## Architecture

```
craglog/
├── backend/          NestJS API (DDD modules)
│   └── src/modules/
│       ├── auth/     JWT authentication
│       ├── users/    User accounts
│       ├── crags/    Crag > Buttress hierarchy + PostGIS search
│       ├── routes/   Route catalogue
│       ├── ascents/  Climbing log (core domain)
│       ├── geo/      GPS proximity queries (PostGIS)
│       ├── badges/   Rule-based achievement engine
│       ├── stats/    Analytics queries
│       └── export/   DLOG / RCI / CSV export engine
└── frontend/         Next.js 14 App Router
    └── src/app/
        ├── (auth)/   Login + Register
        └── (dashboard)/
            ├── dashboard/  Overview + recent ascents
            ├── log/        Quick-log flow (<10 second target)
            ├── crags/      Crag browser + map
            ├── stats/      Charts + analytics
            ├── badges/     Achievement gallery
            └── export/     Download climbing logs
```

---

## Badge Engine

Badges are defined in `backend/src/modules/badges/config/badge-rules.json`.
To add a new badge, add a JSON entry — **no code changes required**.

Rule condition types:
- `total_ascents` — total number of logged ascents
- `ascents_by_climbing_type` — trad / sport / etc count
- `ascents_by_type` — onsight / flash / redpoint count
- `unique_crags` — number of different crags visited
- `grade_milestone` — first ascent at or above a difficulty level
- `multipitch_ascents` — routes with pitches > 1
- `onsight_streak_day` — onsights in a single day
- `crag_visits` — visits to a named crag

---

## Export Formats

| Format | Use case                                 |
|--------|------------------------------------------|
| DLOG   | DLOG-compatible UK climbing log CSV      |
| RCI    | Rock Climbing Instructor certification   |
| CSV    | Universal — Excel, Google Sheets         |
| JSON   | Full structured export for developers    |

Field mappings are in `backend/src/modules/export/schemas/`.

---

## Grade Systems

| System  | Examples              | Used for        |
|---------|-----------------------|-----------------|
| UK Trad | HVS 5a, E1 5b, E3 6a | Trad routes     |
| French  | 6a, 7b+, 8c           | Sport routes    |
| Font    | 6A, 7B+               | Bouldering      |

---

## Offline Mode

The frontend stores pending ascents in IndexedDB when offline.
They sync automatically when connectivity is restored.
The status bar shows pending count and online/offline state.

---

## Production Deployment

1. Set strong secrets in `.env`
2. Change `docker-compose.yml` target from `development` to `production`
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Run `docker compose up -d`
