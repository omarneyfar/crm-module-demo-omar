# Decisions & trade-offs

Notes on the main choices, focused on the database and the project structure.

## Database

### Clients: one table, not two

I kept clients in a single `clients` table with nullable, type-specific columns rather than separate `CompanyProfile` / `IndividualProfile` tables.

- Company fields: `companyName`, `siret`
- Individual fields: `firstName`, `lastName`
- Shared: `email`, `phone`

Why: there are only a few fields per type. Separate tables would add a join and a transaction on every write for no real gain. The "a company needs a name, a person needs first + last" rule is enforced in validation (`@ValidateIf`), not by the schema. If a type grows much larger, I'd split it then to get `NOT NULL` back.

`email` is nullable but unique. Postgres treats NULLs as distinct, so many clients can have no email while duplicates are still rejected — which fits (not everyone has an email on file, but you don't want two of the same).

### Opportunities

Each opportunity belongs to a client (`clientId`, cascade delete), and has `title`, `amount` (Decimal), `stage`, `expectedCloseDate`, plus a `lastStageChangedAt`.

`lastStageChangedAt` exists so I can tell *stagnant* deals from simply *edited* ones — it's only updated when the stage actually changes, not on every edit.

### "Problem" deals

- **Late**: open deal past its expected close date.
- **Stagnant**: open deal whose stage hasn't changed in too long. The threshold is
  for internships (LEAD 7d, contacted 10d, PROPOSAL 14d, NEGOTIATION 30d), be a cause atale lead and a slow negotiation aren't the same thing.

These are computed on read, not stored, so they're always current. For filtering the list by status they're also expressed as SQL conditions so it works across pages, not just the current one.

### Pipeline recap

A single `groupBy` returns count + total amount per stage. On top of that:
**total open value** (excludes WON/LOST) and a **weighted forecast** (each stage's total × a win probability). The weighted number is more honest than a raw total since early-stage deals rarely all close.

## Structure

- **Backend**: standard NestJS modules (`clients`, `opportunities`), each with
  controller / service / DTOs. Pagination, the paginated response shape, and the Swagger decorator for it are shared in `common/` so both modules stay consistent.
  
- **Frontend**: feature folders (`features/<x>/{actions, lib,     validation, types,components}`).
  All API calls go through Server Actions; components never hit the fetch layer directly. The UI uses shadcn/ui components.
- **Errors**: one global Prisma exception filter maps the caller-fault codes
  (P2002 → 409, P2003 → 400, P2025 → 404), everything else is a logged 500. On the frontend, actions return `{ success, error }`, pages show it inline, mutations toast it, and there are `error.tsx` boundaries.

## Out of scope / shortcuts

- **No auth** — not in the brief; treated as an internal too behind existing SSO.
- **No seed data and thin tests** — given the time box. The first tests I'd add are for the late/stagnant logic and the pipeline aggregation.
- **No app Dockerfiles** — only Postgres is containerised; building images would more likely break the "≤5 min to run" goal than help it.

## Stack note

Prisma 7's new client generator emits ESM, which breaks a CommonJS NestJS build, so it's pinned to `moduleFormat = "cjs"` and uses the `@prisma/adapter-pg` drivers adapter. TypeScript is in strict mode on both sides.
