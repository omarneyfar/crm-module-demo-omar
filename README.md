# CRM Module — Clients & Sales Opportunities

Small internal CRM for tracking **clients** (companies / individuals) and their
**sales opportunities** through a pipeline, with filtering, server-side
pagination, a pipeline recap, and visual highlighting of "problem" deals
(late / stagnant).

**Stack:** NestJS · Prisma · PostgreSQL · Next.js (App Router) · TypeScript (strict).

> Design decisions and the reasoning behind the grey-zone calls (client modeling,
> the "problem" rule, the pipeline indicator, auth, etc.) are documented in
> [DECISIONS.md](./DECISIONS.md).

---

## Prerequisites

- **Node.js 20+** and npm
- **Docker** (for PostgreSQL — the only external dependency)

Ports used: **5432** (Postgres), **3000** (backend API), **3001** (frontend).

---

## Run it locally (≈3–4 min)

Three terminals, top to bottom. Commands use `cp`; on Windows PowerShell use
`Copy-Item` instead.

### 1. Database (from the repo root)

```bash
docker compose up -d
```

Starts PostgreSQL on `localhost:5432` with database `crm_db` (user/pass `crm`/`crm`).

### 2. Backend → http://localhost:3000

```bash
cd backend
cp .env.example .env          # DATABASE_URL (already points at the docker DB)
npm install
npx prisma migrate deploy     # apply the versioned migrations
npx prisma generate           # generate the Prisma client
npm run start:dev
```

- API base: **http://localhost:3000**
- Swagger docs: **http://localhost:3000/api**

### 3. Frontend → http://localhost:3001

```bash
cd frontend
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:3000
npm install
npm run dev
```

Open **http://localhost:3001**.

---

## What you can do

- **Dashboard** (`/`) — pipeline recap: total open value, weighted forecast, and a
  per-stage breakdown.
- **Clients** (`/clients`) — list with type filter + pagination, create/edit/delete/view
  (company vs. individual fields validated conditionally).
- **Opportunities** (`/opportunities`) — list with stage / client-type / status filters,
  search, pagination, full CRUD, and red highlighting of late / stagnant deals.

---

## Project layout

```
backend/    NestJS + Prisma API (modular: clients, opportunities)
frontend/   Next.js App Router (feature-based: features/<f>/{actions,lib,validation,types,components})
docker-compose.yaml   PostgreSQL
DECISIONS.md          assumptions & trade-offs
```

---

## Notes

- The frontend talks to the backend **server-side** (Server Actions / Server
  Components), so there's no CORS setup and no client-side API keys.
- The apps run with plain Node; only Postgres is containerized. App Dockerfiles
  were intentionally skipped — see [DECISIONS.md](./DECISIONS.md).
- For active backend development, use `npx prisma migrate dev` instead of
  `migrate deploy` (it also regenerates the client).
```
