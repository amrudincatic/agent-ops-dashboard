# Agent Ops

A clean, modern, single-page analytics dashboard that monitors a **simulated live AI agent pipeline**. Runs stream in real time; KPIs, charts, a per-agent table, a live event feed, and a human-approval queue all update as the pipeline works.

Built as a compact proof-of-work piece: an example of the kind of dashboard and analytics work I set up for clients.

![Agent Ops dashboard](docs/screenshot.png)

## What it demonstrates

- **A real data layer, not hard-coded numbers.** A deterministic seeded generator builds ~24h of run history on load, and a live simulator streams new runs on an interval. Every KPI, chart, and table is derived from that run log by pure, unit-tested selector functions.
- **State and live updates.** A small Zustand store holds the run log; a live-stream hook feeds it. The UI stays in sync without a backend.
- **Considered visual design.** Data is set in a monospace face for instrument-like precision, the five agents share a blue to green color sequence that encodes pipeline order (signal to revenue), and the layout is a flat, hairline-bordered card system that reads as a professional analytics product.
- **Engineering hygiene.** TypeScript strict mode, focused unit tests on the data layer, lint clean, self-hosted fonts (no external calls), and a clear, incremental commit history.

## The pipeline

Five agents, mirrored from the live diagram on [amrudincatic.com](https://amrudincatic.com):

`intent-signal` to `ai-core` to `content-engine` to `attribution` to `revenue-engine`

Each run produces a decision with a confidence score, token cost, latency, and a status (`success`, `failed`, or `needs-review`). Runs that need review surface in a human-approval queue.

## Stack

React · Vite · TypeScript (strict) · Tailwind CSS · Zustand · Recharts · Vitest

## Run it

```bash
npm install
npm run dev      # open the printed localhost URL
npm test         # unit tests for the data layer
npm run build    # typecheck + production build
```

## How it works

- `src/data/seed.ts` deterministically generates the historical run log with a seeded PRNG (mulberry32), so the demo is reproducible.
- `src/data/simulator.ts` emits new runs on an interval to simulate a live stream.
- `src/data/aggregations.ts` derives KPIs, time-series buckets, per-agent rollups, the status breakdown, and the approval queue. These are pure functions with unit tests.
- `src/store/` holds the run log (Zustand) and drives the live ticks.
- `src/components/` renders the derived views.

## Project structure

```
src/
  data/        types, agent registry, seeded history, aggregations, live simulator
  store/       Zustand store + live-stream hook
  lib/         formatting + color tokens
  components/  Header, KPI row, charts, agent table, event feed, approval queue
docs/          DESIGN.md (design), PLAN.md (build plan), screenshot
```

## Notes

This is intentionally scoped as a proof-of-work: no backend, no auth, no persistence. The data is simulated so the dashboard is self-contained and always shows a live, populated view. See `docs/DESIGN.md` for the design and `docs/PLAN.md` for the implementation plan.
