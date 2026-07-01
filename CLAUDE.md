# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack app based on the [FastAPI full-stack template](https://github.com/fastapi/full-stack-fastapi-template):

- **Backend**: FastAPI + SQLModel + PostgreSQL, running at `http://localhost:8000`
- **Frontend**: React + TypeScript + Vite + TanStack Router/Query + shadcn/ui, running at `http://localhost:5173`
- **Infrastructure**: Docker Compose orchestrates all services; Traefik handles routing in production

The frontend client (`frontend/src/client/`) is **auto-generated** from the backend's OpenAPI schema — never edit it by hand. Run `bash ./scripts/generate-client.sh` after changing any backend API.

### Backend structure

- `backend/app/models.py` — all SQLModel models (DB tables + Pydantic schemas in one place)
- `backend/app/crud.py` — all database operations
- `backend/app/api/routes/` — route handlers; one file per domain (`items.py`, `users.py`, `login.py`)
- `backend/app/api/deps.py` — FastAPI dependencies: `SessionDep`, `CurrentUser`, `get_current_active_superuser`
- `backend/app/core/config.py` — settings via pydantic-settings (reads from `.env`)
- `backend/app/alembic/versions/` — migration history; run migrations inside the backend container

### Frontend structure

- `frontend/src/routes/` — file-based routing via TanStack Router; `_layout.tsx` wraps authenticated pages. `frontend/src/routeTree.gen.ts` is auto-generated from this directory by the router's Vite plugin — never edit it by hand.
- `frontend/src/client/` — generated API client (do not edit)
- `frontend/src/components/ui/` — shadcn/ui primitives; domain components live in subdirectories (`Items/`, `Admin/`, `Expenses/`, `Sidebar/`)
- `frontend/src/hooks/useAuth.ts` — auth state/login/logout; `frontend/src/hooks/useCustomToast.ts` — toast notifications (sonner)
- Import alias `@/*` maps to `frontend/src/*` (see `tsconfig.json`)
- Forms use `react-hook-form` + `zod` resolvers; linting/formatting is via **biome** (`bun run lint`), not eslint/prettier

### Frontend code style

- Break up components into separate, appropriately-scoped files rather than growing one large component
- Avoid `as` casts and `any` — use them only when there is truly no better option (e.g. a narrow, documented escape hatch), not as a convenience
- No single-letter variable names, except for genuinely trivial one-line callbacks (e.g. `arr.map(x => x.id)`)

## Development

Start the full stack (recommended):
```bash
docker compose watch
```

Or run services individually — stop the Docker service first, then:
```bash
# Backend
cd backend && fastapi dev app/main.py

# Frontend (from repo root)
bun run dev
```

## Commands

### Backend (run from `backend/`)

```bash
uv sync                          # install dependencies
uv run prek install -f           # install pre-commit hooks

# Lint & type-check
mypy app && ty check app && ruff check app && ruff format app --check
# or via script:
bash scripts/lint.sh

# Tests (requires running DB — use Docker)
docker compose exec backend bash scripts/tests-start.sh
docker compose exec backend bash scripts/tests-start.sh -x   # stop on first failure
docker compose exec backend bash scripts/tests-start.sh tests/api/test_items.py  # single file
```

### Frontend (run from `frontend/` or use `--filter frontend`)

```bash
bun install
bun run dev          # dev server
bun run lint         # biome check + autofix
bun run build        # type-check + production build

# E2E tests (requires backend running)
docker compose up -d --wait backend
bunx playwright test
bunx playwright test --ui
```

### Database migrations (inside backend container)

```bash
docker compose exec backend bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Regenerate frontend client (after backend API changes)

```bash
bash ./scripts/generate-client.sh
```

## Pre-commit hooks

`prek` runs `ruff`, `ruff-format`, `mypy`, and `biome check` before each commit. Run all hooks manually:
```bash
cd backend && uv run prek run --all-files
```

## Key environment variables (`.env`)

`SECRET_KEY`, `FIRST_SUPERUSER`, `FIRST_SUPERUSER_PASSWORD`, `POSTGRES_PASSWORD` must be changed before deploying. The `ENVIRONMENT` variable controls behavior — set to `"local"` to enable the `/api/v1/private` routes used by tests.
