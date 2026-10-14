# CLAUDE.md: Agent Ops Dashboard

Global rules: ~/.claude/CLAUDE.md. Root rules: ../CLAUDE.md. This file holds what is specific to this project.

## What this is
A single-page analytics dashboard monitoring a **simulated live AI agent pipeline**.
Public, client-facing proof-of-work piece. See `docs/DESIGN.md` for the full design and
`docs/PLAN.md` for the implementation plan.

## Stack
React + Vite + TypeScript (strict) + Tailwind CSS + Zustand + Recharts + Vitest.

## Run
- `npm install`
- `npm run dev`: start the dashboard (open the printed localhost URL)
- `npm test`: run unit tests
- `npm run build`: typecheck + production build
- `npm run build:pages`: the same with a relative base, for GitHub Pages
- `npm run lint`: lint

## Structure
- `src/data/`: types, agent registry, seeded history, aggregation selectors, live simulator
- `src/store/`: Zustand store, live-stream hook, theme hook
- `src/lib/`: formatting + color tokens
- `src/components/`: presentational components

## The five agents
`intent-signal` → `ai-core` → `content-engine` → `attribution` → `revenue-engine`

## Conventions
- Keep files small and single-responsibility.
- Aggregation logic is pure and unit-tested (`src/data/*.test.ts`).
- Historical data is deterministic (seeded PRNG); only live ticks use wall-clock time.
- Visual direction: clean, modern, light-first (not a terminal aesthetic).
- Conventional commits.

## Where it runs
- Live demo: https://amrudincatic.github.io/agent-ops-dashboard/ (GitHub Pages). **Every push to `main`
  deploys it** through `.github/workflows/deploy.yml` (`npm run build:pages`).
- Public repo `amrudincatic/agent-ops-dashboard`, MIT license (`LICENSE`).
