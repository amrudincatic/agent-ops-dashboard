# Agent Ops - Design Document

**Date:** 2026-07-17
**Author:** Amrudin Catic
**Status:** Approved, ready for planning

A single-page, clean, modern analytics dashboard that monitors a simulated live AI agent
pipeline. Built as a public, client-facing proof-of-work piece: the goal is that anyone
opening the repository can quickly see the kind of dashboard and analytics work being offered.

---

## 1. Purpose & success criteria

**Purpose.** Demonstrate, in one compact repository, the ability to design and build a modern
analytics dashboard end to end: data modeling, a live-updating data layer, state management,
charting, and clean UI.

**Success looks like:**

- A reviewer opening the repo understands what it is within ~30 seconds (README + screenshot).
- The running app feels *alive* - metrics and an event feed update in real time.
- The code reads as intentional and production-minded: typed, structured, tested at the core,
  with meaningful commits.
- The visual result looks like a real, modern SaaS analytics product - not a template.

**Explicitly out of scope (YAGNI):** real backend/API, authentication, persistence, multiple
routes/pages, CI, and any real third-party analytics integration.

---

## 2. Domain & narrative

An **AI Operations dashboard** monitoring a pipeline of five agents that mirror the live
diagram on amrudincatic.com:

`intent-signal` → `ai-core` → `content-engine` → `attribution` → `revenue-engine`

Each **run** flows through an agent and produces a decision with:

- a **confidence** score (0-1),
- a **token cost** (and derived $ cost),
- a **latency** (ms),
- a **status**: `success` | `failed` | `needs-review`.

Runs with `needs-review` status surface in a human-approval queue, reinforcing the
"human-approved oversight" theme from the brand.

---

## 3. Dashboard layout (single page, 6 zones)

1. **Header bar** - product name, live pulse indicator, "last updated" timestamp, a mock
   time-range selector, and an oversight status chip (`control: human-approved`).
2. **KPI row** - 6 stat cards, each with a delta vs. the prior period and an inline sparkline:
   Total runs, Success rate, Avg confidence, Total cost, Active agents, Approvals pending.
3. **Primary chart** - Runs over time (last 24h), area/line, interactive tooltip.
4. **Secondary charts** - Cost over time (bars) + Status breakdown (donut:
   success / failed / needs-review).
5. **Per-agent table** - one row per agent: runs, success %, avg latency, avg confidence,
   cost, and a mini trend.
6. **Live event feed** - the centerpiece. Newest runs stream in on an interval and animate in,
   showing agent · action · status · confidence · timestamp.
7. **Approval queue** - a panel listing `needs-review` runs with Approve / Reject buttons
   (local state) that move items out of the queue.

*(Zones 6 and 7 sit alongside each other; "6 zones" refers to the six conceptual regions -
header is chrome.)*

---

## 4. Architecture

### Data layer (`src/data/`)

- **`types.ts`** - the typed domain model: `AgentId`, `AgentRun`, `AgentEvent`, and the
  derived aggregate shapes used by the UI.
- **`agents.ts`** - the static registry of the five agents (id, label, description, accent).
- **`seed.ts`** - a **deterministic seeded PRNG** (mulberry32) that generates ~24h of realistic
  historical runs so charts have history on first paint and the demo is reproducible
  (identical screenshots every load).
- **`simulator.ts`** - a "tick" engine that emits new runs on an interval to simulate the live
  stream. Historical data is deterministic; live ticks use real wall-clock time.

### State (`src/store/`)

- A small **Zustand** store holding the run log plus derived aggregates (KPIs, time series,
  per-agent rollups, approval queue).
- A **`useLiveStream`** hook drives the simulator ticks and feeds new runs into the store.
- Aggregations are computed with pure, unit-tested selector functions.

### Utilities (`src/lib/`)

- **`format.ts`** - number, currency, percentage, duration, and relative-time formatting so the
  UI stays clean and consistent.
- **`colors.ts`** - status/agent color tokens shared by charts and UI.

### Components (`src/components/`)

`Header`, `KpiRow` + `KpiCard`, `Sparkline`, `RunsChart`, `CostChart`, `StatusDonut`,
`AgentTable`, `EventFeed`, `ApprovalQueue`, `LiveIndicator`.

### Structure

```
src/
  data/        types.ts, agents.ts, seed.ts, simulator.ts
  store/       useDashboardStore.ts, useLiveStream.ts
  lib/         format.ts, colors.ts
  components/  Header, KpiRow, KpiCard, Sparkline, RunsChart,
               CostChart, StatusDonut, AgentTable, EventFeed,
               ApprovalQueue, LiveIndicator
  App.tsx, main.tsx, index.css
```

---

## 5. Tech stack

- **React + Vite + TypeScript** (strict mode).
- **Tailwind CSS** for styling.
- **Zustand** for state.
- **Recharts** for the primary and secondary charts; lightweight inline SVG for KPI sparklines.
- **Vitest** for unit tests on the data layer.
- **ESLint + Prettier** for consistency.

---

## 6. Visual direction

Clean, modern, **light-first** analytics aesthetic (a tasteful dark mode only if it is cheap to
add). Generous whitespace, strong typographic hierarchy, one restrained accent color, high
data-ink ratio, subtle card elevation, and purposeful motion for the live stream. The detailed
aesthetic system - type scale, color, spacing, motion - is developed with the `frontend-design`
skill during implementation.

---

## 7. Quality & repo hygiene

- TypeScript **strict**; ESLint + Prettier clean.
- **Vitest** unit tests covering: seed determinism, aggregation/selector math, and formatting.
- **README.md** - overview, screenshot placeholder, and run instructions.
- **CLAUDE.md** - project memory (what it is, stack, structure, how to run, conventions).
- **progress.md** - a running build journal, appended at every step of the build.
- Git initialized with clean, meaningful, incremental commits.
- **No CI** (explicitly skipped for this proof-of-work).

---

## 8. Testing strategy

Focused, not exhaustive - enough to signal engineering discipline:

- `seed.test.ts` - the seeded PRNG is deterministic; the same seed yields the same run history.
- `aggregations.test.ts` - KPI/rollup selectors compute correct totals, rates, and averages
  from a known fixture.
- `format.test.ts` - currency, percentage, and duration formatters produce expected strings.

---

## 9. Deliverables

1. A runnable Vite app (`npm install && npm run dev`) showing the live dashboard.
2. Passing unit tests (`npm test`).
3. `README.md`, `CLAUDE.md`, `progress.md`, and this `docs/DESIGN.md`.
4. A clean git history suitable for a public GitHub repository.
