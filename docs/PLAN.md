# Agent Ops Dashboard - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, clean, modern analytics dashboard that monitors a simulated live AI agent pipeline, as a public client-facing proof-of-work repo.

**Architecture:** A typed data layer (deterministic seeded history + a live "tick" simulator) feeds a small Zustand store. Pure selector functions derive KPIs, time-series buckets, per-agent rollups, and an approval queue from the run log. React components render these with Recharts + inline SVG sparklines. A live-stream hook appends new runs on an interval so the UI feels alive.

**Tech Stack:** React 18, Vite, TypeScript (strict), Tailwind CSS, Zustand, Recharts, Vitest.

## Global Constraints

- TypeScript strict mode ON (`"strict": true`).
- No backend, no auth, no persistence, no router, no CI (all out of scope per DESIGN.md).
- Agents are exactly five, in order: `intent-signal`, `ai-core`, `content-engine`, `attribution`, `revenue-engine`.
- `RunStatus` is exactly: `success` | `failed` | `needs-review`.
- Historical data generation MUST be deterministic given a seed (reproducible).
- Keep files focused and small; one clear responsibility each.
- Update `progress.md` at the end of every task (append what was done).
- Commit after every task with a conventional-commit message.

---

## File map

```
src/
  data/
    types.ts          # domain model + aggregate shapes
    agents.ts         # 5-agent registry + action vocab + color map
    seed.ts           # mulberry32 PRNG + deterministic history generator
    aggregations.ts   # pure selectors: KPIs, buckets, rollups, breakdown, queue
    simulator.ts      # live "next run" generator
  store/
    useDashboardStore.ts  # zustand: runs + addRun + resolveApproval
    useLiveStream.ts      # interval hook that appends live runs
  lib/
    format.ts         # number/currency/pct/duration/relative-time
    colors.ts         # status + accent tokens (baseline; refined in frontend-design)
  components/
    Header.tsx        LiveIndicator.tsx
    KpiRow.tsx        KpiCard.tsx        Sparkline.tsx
    RunsChart.tsx     CostChart.tsx      StatusDonut.tsx
    AgentTable.tsx    EventFeed.tsx      ApprovalQueue.tsx
  App.tsx  main.tsx  index.css
docs/DESIGN.md  docs/PLAN.md
README.md  CLAUDE.md  progress.md
```

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.cjs`, `.prettierrc`, `.gitignore`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Create: `README.md`, `CLAUDE.md`, `progress.md`

**Interfaces:**
- Produces: a running Vite dev server and a working Vitest runner. `App` default export renders a placeholder.

- [ ] **Step 1: Scaffold with Vite**

Run:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install zustand recharts
npm install -D tailwindcss@3 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom prettier
```

- [ ] **Step 2: Configure Tailwind**

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

`postcss.config.js`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Replace `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
body { @apply bg-slate-50 text-slate-900 antialiased; }
```

- [ ] **Step 3: Enable strict TS + Vitest**

Ensure `tsconfig.json` `compilerOptions` includes `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`.

Add to `vite.config.ts`:
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: './src/test-setup.ts' },
});
```

Create `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom';
```

Add scripts to `package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "eslint . --ext ts,tsx",
  "format": "prettier --write ."
}
```

- [ ] **Step 4: Placeholder App**

`src/App.tsx`:
```tsx
export default function App() {
  return <div className="p-8 text-lg font-semibold">Agent Ops - booting…</div>;
}
```

- [ ] **Step 5: Create docs (`README.md`, `CLAUDE.md`, `progress.md`)**

`CLAUDE.md`:
```markdown
# CLAUDE.md - Agent Ops Dashboard

## What this is
A single-page analytics dashboard monitoring a simulated live AI agent pipeline.
Public, client-facing proof-of-work piece. See `docs/DESIGN.md` for the full design.

## Stack
React + Vite + TypeScript (strict) + Tailwind + Zustand + Recharts + Vitest.

## Run
- `npm install`
- `npm run dev` - start the dashboard
- `npm test` - run unit tests
- `npm run build` - typecheck + production build

## Structure
- `src/data/` - types, agent registry, seeded history, aggregation selectors, live simulator
- `src/store/` - Zustand store + live-stream hook
- `src/lib/` - formatting + color tokens
- `src/components/` - presentational components

## Conventions
- Keep files small and single-responsibility.
- Aggregation logic is pure and unit-tested (`src/data/*.test.ts`).
- Historical data is deterministic (seeded PRNG); only live ticks use wall-clock time.
- Conventional commits. Update `progress.md` after each task.
```

`progress.md`:
```markdown
# Build Progress - Agent Ops Dashboard

A running journal of every build step. Newest entries at the bottom.

## 2026-07-17
- Brainstormed and approved design (see `docs/DESIGN.md`).
- Wrote implementation plan (see `docs/PLAN.md`).
- Task 1: Scaffolded Vite + React + TS + Tailwind + Zustand + Recharts + Vitest. Dev server and test runner working.
```

`README.md` (screenshot added in Task 15):
```markdown
# Agent Ops - AI Pipeline Analytics Dashboard

A clean, modern, single-page dashboard that monitors a **simulated live AI agent pipeline**
(intent-signal → ai-core → content-engine → attribution → revenue-engine). Runs stream in
real time; KPIs, charts, a per-agent table, a live event feed, and a human-approval queue
update as the pipeline works.

Built as a proof-of-work piece demonstrating dashboard & analytics engineering.

## Stack
React · Vite · TypeScript (strict) · Tailwind CSS · Zustand · Recharts · Vitest

## Run
\`\`\`bash
npm install
npm run dev      # open the printed localhost URL
npm test         # unit tests for the data layer
\`\`\`

## How it works
- `src/data/seed.ts` deterministically generates ~24h of historical runs (seeded PRNG).
- `src/data/simulator.ts` emits new runs on an interval to simulate a live stream.
- `src/data/aggregations.ts` derives KPIs, time buckets, per-agent rollups, and the approval queue.
- A small Zustand store holds the run log; components render derived views.

See `docs/DESIGN.md` for the full design.
```

- [ ] **Step 6: Verify dev + test run**

Run: `npm run dev` → Expected: server starts, page shows "Agent Ops - booting…".
Run: `npm test` → Expected: "No test files found" (exit 0) - runner works.

- [ ] **Step 7: Commit**

```bash
printf "node_modules\ndist\n*.local\n.DS_Store\n" > .gitignore
git add -A
git commit -m "chore: scaffold vite react ts tailwind + docs"
```

---

## Task 2: Domain types + agent registry

**Files:**
- Create: `src/data/types.ts`, `src/data/agents.ts`, `src/data/agents.test.ts`

**Interfaces:**
- Produces: `AgentId`, `RunStatus`, `AgentRun`, `Agent`, `Kpis`, `TimeBucket`, `AgentRollup`, `StatusBreakdown`; `AGENTS`, `AGENT_ACTIONS`, `AGENT_BY_ID`.

- [ ] **Step 1: Write `src/data/types.ts`**

```ts
export type AgentId =
  | 'intent-signal'
  | 'ai-core'
  | 'content-engine'
  | 'attribution'
  | 'revenue-engine';

export type RunStatus = 'success' | 'failed' | 'needs-review';

export interface AgentRun {
  id: string;
  agentId: AgentId;
  action: string;
  status: RunStatus;
  confidence: number; // 0..1
  tokens: number;
  costUsd: number;
  latencyMs: number;
  revenueUsd: number;
  timestamp: number; // epoch ms
  approved?: boolean; // set when a needs-review run is resolved
}

export interface Agent {
  id: AgentId;
  label: string;
  description: string;
  order: number;
}

export interface Kpis {
  totalRuns: number;
  successRate: number; // 0..1
  avgConfidence: number; // 0..1
  totalCostUsd: number;
  activeAgents: number;
  approvalsPending: number;
  deltas: {
    totalRuns: number; // relative change vs previous window half
    successRate: number; // absolute pct-point change
    avgConfidence: number; // absolute change
    totalCostUsd: number; // relative change
  };
}

export interface TimeBucket {
  t: number; // bucket start epoch ms
  success: number;
  failed: number;
  needsReview: number;
  total: number;
  costUsd: number;
}

export interface AgentRollup {
  agentId: AgentId;
  label: string;
  runs: number;
  successRate: number;
  avgLatencyMs: number;
  avgConfidence: number;
  costUsd: number;
  trend: number[]; // runs per sub-bucket, for sparkline
}

export interface StatusBreakdown {
  success: number;
  failed: number;
  needsReview: number;
}
```

- [ ] **Step 2: Write `src/data/agents.ts`**

```ts
import type { Agent, AgentId } from './types';

export const AGENTS: Agent[] = [
  { id: 'intent-signal', label: 'Intent Signal', description: 'Detects buying-intent signals', order: 0 },
  { id: 'ai-core', label: 'AI Core', description: 'Reasoning and orchestration', order: 1 },
  { id: 'content-engine', label: 'Content Engine', description: 'Generates content', order: 2 },
  { id: 'attribution', label: 'Attribution', description: 'Tracks attribution', order: 3 },
  { id: 'revenue-engine', label: 'Revenue Engine', description: 'Computes attributed revenue', order: 4 },
];

export const AGENT_ACTIONS: Record<AgentId, string[]> = {
  'intent-signal': ['detect intent', 'score signal', 'segment visitor'],
  'ai-core': ['reason over context', 'plan next action', 'route decision'],
  'content-engine': ['generate variant', 'summarize source', 'rewrite CTA'],
  attribution: ['track touchpoint', 'assign credit', 'reconcile path'],
  'revenue-engine': ['project revenue', 'update pipeline', 'compute ROAS'],
};

export const AGENT_BY_ID: Record<AgentId, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a]),
) as Record<AgentId, Agent>;
```

- [ ] **Step 3: Write failing test `src/data/agents.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { AGENTS, AGENT_ACTIONS, AGENT_BY_ID } from './agents';

describe('agent registry', () => {
  it('has exactly five agents in pipeline order', () => {
    expect(AGENTS.map((a) => a.id)).toEqual([
      'intent-signal', 'ai-core', 'content-engine', 'attribution', 'revenue-engine',
    ]);
  });
  it('defines at least one action per agent', () => {
    for (const a of AGENTS) expect(AGENT_ACTIONS[a.id].length).toBeGreaterThan(0);
  });
  it('indexes agents by id', () => {
    expect(AGENT_BY_ID['ai-core'].label).toBe('AI Core');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test` → Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/agents.ts src/data/agents.test.ts
git commit -m "feat(data): domain types and agent registry"
```

- [ ] **Step 6: Update progress.md** - append a "Task 2" bullet, then `git commit -am "docs: progress task 2"`.

---

## Task 3: Seeded PRNG + deterministic history

**Files:**
- Create: `src/data/seed.ts`, `src/data/seed.test.ts`

**Interfaces:**
- Consumes: `AGENTS`, `AGENT_ACTIONS` (Task 2); `AgentRun`, `RunStatus` (Task 2).
- Produces: `mulberry32(seed): () => number`, `makeRun(rng, timestamp, id): AgentRun`, `generateHistory(opts): AgentRun[]`.

- [ ] **Step 1: Write failing test `src/data/seed.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mulberry32, generateHistory } from './seed';

const NOW = 1_700_000_000_000;

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42); const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe('generateHistory', () => {
  it('produces the same runs for the same seed', () => {
    const x = generateHistory({ seed: 7, now: NOW, count: 50 });
    const y = generateHistory({ seed: 7, now: NOW, count: 50 });
    expect(x).toEqual(y);
  });
  it('honors count and stays within the window, sorted ascending', () => {
    const runs = generateHistory({ seed: 7, now: NOW, count: 100, windowMs: 3_600_000 });
    expect(runs).toHaveLength(100);
    for (const r of runs) {
      expect(r.timestamp).toBeGreaterThanOrEqual(NOW - 3_600_000);
      expect(r.timestamp).toBeLessThanOrEqual(NOW);
      expect(['success', 'failed', 'needs-review']).toContain(r.status);
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].timestamp).toBeGreaterThanOrEqual(runs[i - 1].timestamp);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/data/seed.test.ts` → Expected: FAIL ("mulberry32 is not a function").

- [ ] **Step 3: Write `src/data/seed.ts`**

```ts
import { AGENTS, AGENT_ACTIONS } from './agents';
import type { AgentId, AgentRun, RunStatus } from './types';

const DAY = 24 * 60 * 60 * 1000;

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

function makeStatus(rng: () => number): RunStatus {
  const r = rng();
  if (r < 0.82) return 'success';
  if (r < 0.92) return 'needs-review';
  return 'failed';
}

export function makeRun(rng: () => number, timestamp: number, id: string): AgentRun {
  const agent = pick(rng, AGENTS);
  const agentId = agent.id as AgentId;
  const action = pick(rng, AGENT_ACTIONS[agentId]);
  const status = makeStatus(rng);
  const confidence = clamp(0.62 + rng() * 0.37 - (status === 'failed' ? 0.35 : 0), 0.15, 0.99);
  const tokens = Math.floor(300 + rng() * 3700);
  const costUsd = +(tokens * 0.000002 * (agentId === 'ai-core' ? 4 : 1)).toFixed(4);
  const latencyMs = Math.floor(180 + rng() * 2400);
  const revenueUsd =
    agentId === 'revenue-engine' && status === 'success' ? +(rng() * 900).toFixed(2) : 0;
  return {
    id,
    agentId,
    action,
    status,
    confidence: +confidence.toFixed(3),
    tokens,
    costUsd,
    latencyMs,
    revenueUsd,
    timestamp,
  };
}

export interface SeedOptions {
  seed?: number;
  now: number;
  windowMs?: number;
  count?: number;
}

export function generateHistory(opts: SeedOptions): AgentRun[] {
  const { seed = 1337, now, windowMs = DAY, count = 520 } = opts;
  const rng = mulberry32(seed);
  const runs: AgentRun[] = [];
  for (let i = 0; i < count; i++) {
    const frac = i / count;
    const jitter = Math.floor(rng() * (windowMs / count));
    const ts = clamp(now - windowMs + Math.floor(frac * windowMs) + jitter, now - windowMs, now);
    runs.push(makeRun(rng, ts, `seed_${i}`));
  }
  return runs.sort((a, b) => a.timestamp - b.timestamp);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/data/seed.test.ts` → Expected: PASS.

- [ ] **Step 5: Commit + progress**

```bash
git add src/data/seed.ts src/data/seed.test.ts
git commit -m "feat(data): seeded prng and deterministic history"
```
Append Task 3 to `progress.md`; `git commit -am "docs: progress task 3"`.

---

## Task 4: Aggregation selectors

**Files:**
- Create: `src/data/aggregations.ts`, `src/data/aggregations.test.ts`

**Interfaces:**
- Consumes: `AgentRun`, `Kpis`, `TimeBucket`, `AgentRollup`, `StatusBreakdown` (Task 2); `AGENTS` (Task 2).
- Produces: `computeKpis(runs, now, windowMs?)`, `bucketRuns(runs, now, bucketMs?, buckets?)`, `computeAgentRollups(runs, now, windowMs?)`, `computeStatusBreakdown(runs, now, windowMs?)`, `approvalQueue(runs)`. Exports `DAY`, `HOUR`.

- [ ] **Step 1: Write failing test `src/data/aggregations.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { computeKpis, bucketRuns, computeStatusBreakdown, approvalQueue, HOUR } from './aggregations';
import type { AgentRun } from './types';

const NOW = 100 * HOUR;

function run(partial: Partial<AgentRun>): AgentRun {
  return {
    id: 'x', agentId: 'ai-core', action: 'reason', status: 'success',
    confidence: 0.9, tokens: 1000, costUsd: 0.008, latencyMs: 500, revenueUsd: 0,
    timestamp: NOW - HOUR, ...partial,
  };
}

describe('computeStatusBreakdown', () => {
  it('counts statuses in window', () => {
    const runs = [run({ status: 'success' }), run({ status: 'failed' }), run({ status: 'needs-review' }), run({ status: 'success' })];
    expect(computeStatusBreakdown(runs, NOW)).toEqual({ success: 2, failed: 1, needsReview: 1 });
  });
});

describe('computeKpis', () => {
  it('computes totals, success rate and pending approvals', () => {
    const runs = [
      run({ status: 'success', costUsd: 1 }),
      run({ status: 'failed', costUsd: 2 }),
      run({ status: 'needs-review', costUsd: 3 }),
    ];
    const k = computeKpis(runs, NOW);
    expect(k.totalRuns).toBe(3);
    expect(k.successRate).toBeCloseTo(1 / 3, 5);
    expect(k.totalCostUsd).toBeCloseTo(6, 5);
    expect(k.approvalsPending).toBe(1);
  });
  it('excludes runs older than the window', () => {
    const runs = [run({ timestamp: NOW - 48 * HOUR }), run({ timestamp: NOW - HOUR })];
    expect(computeKpis(runs, NOW).totalRuns).toBe(1);
  });
});

describe('bucketRuns', () => {
  it('places runs in the correct hourly bucket', () => {
    const runs = [run({ timestamp: NOW - 1.5 * HOUR }), run({ timestamp: NOW - 0.5 * HOUR })];
    const buckets = bucketRuns(runs, NOW, HOUR, 24);
    expect(buckets).toHaveLength(24);
    expect(buckets[buckets.length - 1].total).toBe(1);
    expect(buckets[buckets.length - 2].total).toBe(1);
  });
});

describe('approvalQueue', () => {
  it('returns only unresolved needs-review runs', () => {
    const runs = [
      run({ id: 'a', status: 'needs-review' }),
      run({ id: 'b', status: 'needs-review', approved: true }),
      run({ id: 'c', status: 'success' }),
    ];
    expect(approvalQueue(runs).map((r) => r.id)).toEqual(['a']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/data/aggregations.test.ts` → Expected: FAIL (module not found).

- [ ] **Step 3: Write `src/data/aggregations.ts`**

```ts
import { AGENTS } from './agents';
import type { AgentRollup, AgentRun, Kpis, StatusBreakdown, TimeBucket } from './types';

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

const inWindow = (runs: AgentRun[], now: number, windowMs: number) =>
  runs.filter((r) => r.timestamp >= now - windowMs && r.timestamp <= now);

const rate = (arr: AgentRun[]) =>
  arr.length ? arr.filter((r) => r.status === 'success').length / arr.length : 0;
const meanConf = (arr: AgentRun[]) =>
  arr.length ? arr.reduce((s, r) => s + r.confidence, 0) / arr.length : 0;
const sumCost = (arr: AgentRun[]) => arr.reduce((s, r) => s + r.costUsd, 0);
const rel = (a: number, b: number) => (b ? (a - b) / b : 0);

export function computeKpis(runs: AgentRun[], now: number, windowMs = DAY): Kpis {
  const w = inWindow(runs, now, windowMs);
  const half = now - windowMs / 2;
  const recent = w.filter((r) => r.timestamp >= half);
  const prev = w.filter((r) => r.timestamp < half);
  return {
    totalRuns: w.length,
    successRate: rate(w),
    avgConfidence: meanConf(w),
    totalCostUsd: sumCost(w),
    activeAgents: new Set(recent.map((r) => r.agentId)).size,
    approvalsPending: w.filter((r) => r.status === 'needs-review' && r.approved === undefined).length,
    deltas: {
      totalRuns: rel(recent.length, prev.length),
      successRate: rate(recent) - rate(prev),
      avgConfidence: meanConf(recent) - meanConf(prev),
      totalCostUsd: rel(sumCost(recent), sumCost(prev)),
    },
  };
}

export function bucketRuns(runs: AgentRun[], now: number, bucketMs = HOUR, buckets = 24): TimeBucket[] {
  const start = now - bucketMs * buckets;
  const out: TimeBucket[] = Array.from({ length: buckets }, (_, i) => ({
    t: start + i * bucketMs, success: 0, failed: 0, needsReview: 0, total: 0, costUsd: 0,
  }));
  for (const r of runs) {
    if (r.timestamp < start || r.timestamp > now) continue;
    const idx = Math.min(buckets - 1, Math.floor((r.timestamp - start) / bucketMs));
    const b = out[idx];
    b.total += 1;
    b.costUsd += r.costUsd;
    if (r.status === 'success') b.success += 1;
    else if (r.status === 'failed') b.failed += 1;
    else b.needsReview += 1;
  }
  return out;
}

function sparkTrend(rs: AgentRun[], now: number, windowMs: number, buckets: number): number[] {
  const bucketMs = windowMs / buckets;
  const start = now - windowMs;
  const arr = new Array(buckets).fill(0) as number[];
  for (const r of rs) {
    if (r.timestamp < start) continue;
    arr[Math.min(buckets - 1, Math.floor((r.timestamp - start) / bucketMs))] += 1;
  }
  return arr;
}

export function computeAgentRollups(runs: AgentRun[], now: number, windowMs = DAY): AgentRollup[] {
  const w = inWindow(runs, now, windowMs);
  return AGENTS.map((agent) => {
    const rs = w.filter((r) => r.agentId === agent.id);
    const n = rs.length;
    return {
      agentId: agent.id,
      label: agent.label,
      runs: n,
      successRate: rate(rs),
      avgLatencyMs: n ? rs.reduce((s, r) => s + r.latencyMs, 0) / n : 0,
      avgConfidence: meanConf(rs),
      costUsd: sumCost(rs),
      trend: sparkTrend(rs, now, windowMs, 10),
    };
  });
}

export function computeStatusBreakdown(runs: AgentRun[], now: number, windowMs = DAY): StatusBreakdown {
  const w = inWindow(runs, now, windowMs);
  return {
    success: w.filter((r) => r.status === 'success').length,
    failed: w.filter((r) => r.status === 'failed').length,
    needsReview: w.filter((r) => r.status === 'needs-review').length,
  };
}

export function approvalQueue(runs: AgentRun[]): AgentRun[] {
  return runs
    .filter((r) => r.status === 'needs-review' && r.approved === undefined)
    .sort((a, b) => b.timestamp - a.timestamp);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/data/aggregations.test.ts` → Expected: PASS.

- [ ] **Step 5: Commit + progress**

```bash
git add src/data/aggregations.ts src/data/aggregations.test.ts
git commit -m "feat(data): aggregation selectors with tests"
```
Append Task 4 to `progress.md`; commit.

---

## Task 5: Formatting utilities + color tokens

**Files:**
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`, `src/lib/colors.ts`

**Interfaces:**
- Consumes: `AgentId`, `RunStatus` (Task 2).
- Produces: `formatNumber`, `formatCompact`, `formatUsd`, `formatPct`, `formatDelta`, `formatDuration`, `formatRelativeTime`, `formatHour`; `STATUS_COLORS`, `AGENT_COLORS`, `ACCENT`.

- [ ] **Step 1: Write failing test `src/lib/format.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { formatUsd, formatPct, formatDuration, formatDelta, formatRelativeTime } from './format';

describe('formatters', () => {
  it('formats currency', () => { expect(formatUsd(12.5)).toBe('$12.50'); });
  it('formats percent', () => { expect(formatPct(0.333, 1)).toBe('33.3%'); });
  it('formats duration', () => {
    expect(formatDuration(850)).toBe('850ms');
    expect(formatDuration(1500)).toBe('1.5s');
  });
  it('formats signed delta', () => {
    expect(formatDelta(0.12)).toBe('+12.0%');
    expect(formatDelta(-0.05)).toBe('-5.0%');
  });
  it('formats relative time', () => {
    const now = 1_000_000;
    expect(formatRelativeTime(now - 5000, now)).toBe('5s ago');
    expect(formatRelativeTime(now - 120000, now)).toBe('2m ago');
  });
});
```

- [ ] **Step 2: Run test to verify it fails** - `npm test src/lib/format.test.ts` → FAIL.

- [ ] **Step 3: Write `src/lib/format.ts`**

```ts
const nf = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const formatNumber = (n: number): string => nf.format(Math.round(n));
export const formatCompact = (n: number): string => compact.format(n);

export const formatUsd = (n: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: n < 1000 ? 2 : 0,
  }).format(n);

export const formatPct = (x: number, digits = 0): string => `${(x * 100).toFixed(digits)}%`;

export const formatDelta = (x: number): string => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`;

export const formatDuration = (ms: number): string =>
  ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;

export function formatRelativeTime(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export const formatHour = (ts: number): string =>
  new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
```

- [ ] **Step 4: Write `src/lib/colors.ts`**

```ts
import type { AgentId, RunStatus } from '../data/types';

export const ACCENT = '#4f46e5'; // indigo-600 (baseline; refined in frontend-design)

export const STATUS_COLORS: Record<RunStatus, string> = {
  success: '#16a34a',
  'needs-review': '#d97706',
  failed: '#dc2626',
};

export const AGENT_COLORS: Record<AgentId, string> = {
  'intent-signal': '#0ea5e9',
  'ai-core': '#4f46e5',
  'content-engine': '#8b5cf6',
  attribution: '#0d9488',
  'revenue-engine': '#16a34a',
};
```

- [ ] **Step 5: Run test to verify it passes** - `npm test src/lib/format.test.ts` → PASS.

- [ ] **Step 6: Commit + progress**

```bash
git add src/lib/format.ts src/lib/format.test.ts src/lib/colors.ts
git commit -m "feat(lib): formatting utilities and color tokens"
```
Append Task 5 to `progress.md`; commit.

---

## Task 6: Live simulator

**Files:**
- Create: `src/data/simulator.ts`, `src/data/simulator.test.ts`

**Interfaces:**
- Consumes: `makeRun`, `mulberry32` (Task 3); `AgentRun` (Task 2).
- Produces: `createSimulator(seed?): { next(now: number): AgentRun }`.

- [ ] **Step 1: Write failing test `src/data/simulator.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { createSimulator } from './simulator';

describe('createSimulator', () => {
  it('produces valid runs with unique ids and the given timestamp', () => {
    const sim = createSimulator(123);
    const a = sim.next(5000);
    const b = sim.next(6000);
    expect(a.id).not.toBe(b.id);
    expect(a.timestamp).toBe(5000);
    expect(b.timestamp).toBe(6000);
    expect(['success', 'failed', 'needs-review']).toContain(a.status);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** - FAIL.

- [ ] **Step 3: Write `src/data/simulator.ts`**

```ts
import { makeRun, mulberry32 } from './seed';
import type { AgentRun } from './types';

export function createSimulator(seed = 9999): { next: (now: number) => AgentRun } {
  const rng = mulberry32(seed);
  let n = 0;
  return {
    next(now: number): AgentRun {
      n += 1;
      return makeRun(rng, now, `live_${n}`);
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes** - PASS.

- [ ] **Step 5: Commit + progress**

```bash
git add src/data/simulator.ts src/data/simulator.test.ts
git commit -m "feat(data): live run simulator"
```
Append Task 6 to `progress.md`; commit.

---

## Task 7: Store + live-stream hook

**Files:**
- Create: `src/store/useDashboardStore.ts`, `src/store/useLiveStream.ts`

**Interfaces:**
- Consumes: `generateHistory` (Task 3), `createSimulator` (Task 6), `AgentRun` (Task 2).
- Produces: `useDashboardStore` (state: `runs`, `startedAt`, `lastUpdated`; actions: `addRun`, `resolveApproval`), `useLiveStream(intervalMs?)`.

- [ ] **Step 1: Write `src/store/useDashboardStore.ts`**

```ts
import { create } from 'zustand';
import { generateHistory } from '../data/seed';
import type { AgentRun } from '../data/types';

const MAX_RUNS = 2000;
const now = Date.now();

interface DashboardState {
  runs: AgentRun[];
  startedAt: number;
  lastUpdated: number;
  addRun: (run: AgentRun) => void;
  resolveApproval: (id: string, approved: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  runs: generateHistory({ now }),
  startedAt: now,
  lastUpdated: now,
  addRun: (run) =>
    set((s) => ({
      runs: [...s.runs, run].slice(-MAX_RUNS),
      lastUpdated: run.timestamp,
    })),
  resolveApproval: (id, approved) =>
    set((s) => ({
      runs: s.runs.map((r) => (r.id === id ? { ...r, approved } : r)),
    })),
}));
```

- [ ] **Step 2: Write `src/store/useLiveStream.ts`**

```ts
import { useEffect } from 'react';
import { createSimulator } from '../data/simulator';
import { useDashboardStore } from './useDashboardStore';

export function useLiveStream(intervalMs = 2000): void {
  const addRun = useDashboardStore((s) => s.addRun);
  useEffect(() => {
    const sim = createSimulator();
    const id = window.setInterval(() => addRun(sim.next(Date.now())), intervalMs);
    return () => window.clearInterval(id);
  }, [addRun, intervalMs]);
}
```

- [ ] **Step 3: Typecheck** - Run: `npm run build` → Expected: no type errors (app still placeholder).

- [ ] **Step 4: Commit + progress**

```bash
git add src/store/useDashboardStore.ts src/store/useLiveStream.ts
git commit -m "feat(store): zustand store and live-stream hook"
```
Append Task 7 to `progress.md`; commit.

---

## Task 8: App shell + Header + LiveIndicator

**Files:**
- Create: `src/components/LiveIndicator.tsx`, `src/components/Header.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useDashboardStore`, `useLiveStream` (Task 7); `formatHour` (Task 5).
- Produces: `<Header lastUpdated />`, `<LiveIndicator />`, an `App` that starts the stream and lays out a responsive container.

> Baseline styling only - the `frontend-design` pass (Task 15) refines the visual system.

- [ ] **Step 1: Write `src/components/LiveIndicator.tsx`**

```tsx
export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}
```

- [ ] **Step 2: Write `src/components/Header.tsx`**

```tsx
import { LiveIndicator } from './LiveIndicator';
import { formatHour } from '../lib/format';

export function Header({ lastUpdated }: { lastUpdated: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Agent Ops</h1>
        <p className="text-sm text-slate-500">AI pipeline analytics · simulated live stream</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          control: human-approved
        </span>
        <span className="text-xs text-slate-400">updated {formatHour(lastUpdated)}</span>
        <LiveIndicator />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Rewrite `src/App.tsx`**

```tsx
import { Header } from './components/Header';
import { useDashboardStore } from './store/useDashboardStore';
import { useLiveStream } from './store/useLiveStream';

export default function App() {
  useLiveStream();
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Header lastUpdated={lastUpdated} />
      <main className="py-10 text-slate-400">Panels coming online…</main>
    </div>
  );
}
```

- [ ] **Step 4: Verify** - Run: `npm run dev` → Expected: header renders, "Live" dot pulses, "updated HH:MM" ticks every ~2s.

- [ ] **Step 5: Commit + progress**

```bash
git add src/components/LiveIndicator.tsx src/components/Header.tsx src/App.tsx
git commit -m "feat(ui): app shell, header, live indicator"
```
Append Task 8 to `progress.md`; commit.

---

## Task 9: KPI row (Sparkline, KpiCard, KpiRow)

**Files:**
- Create: `src/components/Sparkline.tsx`, `src/components/KpiCard.tsx`, `src/components/KpiRow.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Kpis`, `AgentRollup` (Task 2); `computeKpis`, `computeAgentRollups`, `DAY` (Task 4); formatters (Task 5); `ACCENT` (Task 5).
- Produces: `<Sparkline data color? />`, `<KpiCard label value delta? deltaMode? spark? />`, `<KpiRow kpis rollups />`.

- [ ] **Step 1: Write `src/components/Sparkline.tsx`**

```tsx
export function Sparkline({
  data, width = 80, height = 26, color = '#4f46e5',
}: { data: number[]; width?: number; height?: number; color?: string }) {
  if (data.length < 2) return <svg width={width} height={height} />;
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - (v / max) * (height - 2) - 1}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Write `src/components/KpiCard.tsx`**

```tsx
import { Sparkline } from './Sparkline';
import { formatDelta } from '../lib/format';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaMode?: 'higher-better' | 'lower-better';
  spark?: number[];
}

export function KpiCard({ label, value, delta, deltaMode = 'higher-better', spark }: KpiCardProps) {
  const good = delta === undefined ? true : deltaMode === 'higher-better' ? delta >= 0 : delta <= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tabular-nums text-slate-900">{value}</span>
        {spark ? <Sparkline data={spark} /> : null}
      </div>
      {delta !== undefined && (
        <p className={`mt-1 text-xs font-medium ${good ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatDelta(delta)} <span className="text-slate-400">vs prev</span>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/KpiRow.tsx`**

```tsx
import type { AgentRollup, Kpis } from '../data/types';
import { KpiCard } from './KpiCard';
import { formatCompact, formatPct, formatUsd } from '../lib/format';

export function KpiRow({ kpis, rollups }: { kpis: Kpis; rollups: AgentRollup[] }) {
  const runTrend = rollups.reduce<number[]>((acc, r) => {
    r.trend.forEach((v, i) => (acc[i] = (acc[i] ?? 0) + v));
    return acc;
  }, []);
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Total runs" value={formatCompact(kpis.totalRuns)} delta={kpis.deltas.totalRuns} spark={runTrend} />
      <KpiCard label="Success rate" value={formatPct(kpis.successRate, 1)} delta={kpis.deltas.successRate} />
      <KpiCard label="Avg confidence" value={formatPct(kpis.avgConfidence, 1)} delta={kpis.deltas.avgConfidence} />
      <KpiCard label="Total cost" value={formatUsd(kpis.totalCostUsd)} delta={kpis.deltas.totalCostUsd} deltaMode="lower-better" />
      <KpiCard label="Active agents" value={String(kpis.activeAgents)} />
      <KpiCard label="Approvals pending" value={String(kpis.approvalsPending)} deltaMode="lower-better" />
    </section>
  );
}
```

- [ ] **Step 4: Wire into `src/App.tsx`** (add derived state via `useMemo`)

Replace the `<main>` block; add imports at top:
```tsx
import { useMemo } from 'react';
import { KpiRow } from './components/KpiRow';
import { computeKpis, computeAgentRollups } from './data/aggregations';
```
Inside `App`, after `lastUpdated`:
```tsx
  const runs = useDashboardStore((s) => s.runs);
  const now = lastUpdated;
  const kpis = useMemo(() => computeKpis(runs, now), [runs, now]);
  const rollups = useMemo(() => computeAgentRollups(runs, now), [runs, now]);
```
Replace `<main>…</main>` with:
```tsx
      <main className="space-y-6 py-6">
        <KpiRow kpis={kpis} rollups={rollups} />
      </main>
```

- [ ] **Step 5: Verify** - `npm run dev` → Expected: 6 KPI cards render with live-updating values and a sparkline on "Total runs".

- [ ] **Step 6: Commit + progress**

```bash
git add src/components/Sparkline.tsx src/components/KpiCard.tsx src/components/KpiRow.tsx src/App.tsx
git commit -m "feat(ui): kpi row with sparklines"
```
Append Task 9 to `progress.md`; commit.

---

## Task 10: Charts (RunsChart, CostChart, StatusDonut)

**Files:**
- Create: `src/components/RunsChart.tsx`, `src/components/CostChart.tsx`, `src/components/StatusDonut.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `TimeBucket`, `StatusBreakdown` (Task 2); `bucketRuns`, `computeStatusBreakdown` (Task 4); `formatHour`, `formatUsd` (Task 5); `STATUS_COLORS` (Task 5).
- Produces: `<RunsChart buckets />`, `<CostChart buckets />`, `<StatusDonut breakdown />`.

- [ ] **Step 1: Write `src/components/RunsChart.tsx`**

```tsx
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimeBucket } from '../data/types';
import { formatHour } from '../lib/format';
import { STATUS_COLORS } from '../lib/colors';

export function RunsChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = buckets.map((b) => ({ ...b, label: formatHour(b.t) }));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Runs over time (24h)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={3} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Area type="monotone" dataKey="success" stackId="1" stroke={STATUS_COLORS.success} fill={STATUS_COLORS.success} fillOpacity={0.18} />
          <Area type="monotone" dataKey="needsReview" stackId="1" stroke={STATUS_COLORS['needs-review']} fill={STATUS_COLORS['needs-review']} fillOpacity={0.18} />
          <Area type="monotone" dataKey="failed" stackId="1" stroke={STATUS_COLORS.failed} fill={STATUS_COLORS.failed} fillOpacity={0.18} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/CostChart.tsx`**

```tsx
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimeBucket } from '../data/types';
import { formatHour, formatUsd } from '../lib/format';
import { ACCENT } from '../lib/colors';

export function CostChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = buckets.map((b) => ({ label: formatHour(b.t), costUsd: +b.costUsd.toFixed(3) }));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Cost over time</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ left: -8, right: 8, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => formatUsd(v)} />
          <Tooltip formatter={(v: number) => formatUsd(v)} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Bar dataKey="costUsd" fill={ACCENT} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/StatusDonut.tsx`**

```tsx
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusBreakdown } from '../data/types';
import { STATUS_COLORS } from '../lib/colors';

export function StatusDonut({ breakdown }: { breakdown: StatusBreakdown }) {
  const data = [
    { name: 'Success', value: breakdown.success, color: STATUS_COLORS.success },
    { name: 'Needs review', value: breakdown.needsReview, color: STATUS_COLORS['needs-review'] },
    { name: 'Failed', value: breakdown.failed, color: STATUS_COLORS.failed },
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Status breakdown</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={2}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-3 flex justify-center gap-4 text-xs text-slate-600">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Wire into `src/App.tsx`**

Add imports:
```tsx
import { RunsChart } from './components/RunsChart';
import { CostChart } from './components/CostChart';
import { StatusDonut } from './components/StatusDonut';
import { bucketRuns, computeStatusBreakdown } from './data/aggregations';
```
Add derived state after `rollups`:
```tsx
  const buckets = useMemo(() => bucketRuns(runs, now), [runs, now]);
  const breakdown = useMemo(() => computeStatusBreakdown(runs, now), [runs, now]);
```
Extend `<main>`:
```tsx
        <RunsChart buckets={buckets} />
        <div className="grid gap-6 lg:grid-cols-2">
          <CostChart buckets={buckets} />
          <StatusDonut breakdown={breakdown} />
        </div>
```

- [ ] **Step 5: Verify** - `npm run dev` → Expected: area chart, bar chart, donut render and refresh as runs stream.

- [ ] **Step 6: Commit + progress**

```bash
git add src/components/RunsChart.tsx src/components/CostChart.tsx src/components/StatusDonut.tsx src/App.tsx
git commit -m "feat(ui): runs, cost, and status charts"
```
Append Task 10 to `progress.md`; commit.

---

## Task 11: Per-agent table

**Files:**
- Create: `src/components/AgentTable.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `AgentRollup` (Task 2); `Sparkline` (Task 9); formatters (Task 5); `AGENT_COLORS` (Task 5).
- Produces: `<AgentTable rollups />`.

- [ ] **Step 1: Write `src/components/AgentTable.tsx`**

```tsx
import type { AgentRollup } from '../data/types';
import { Sparkline } from './Sparkline';
import { formatDuration, formatNumber, formatPct, formatUsd } from '../lib/format';
import { AGENT_COLORS } from '../lib/colors';

export function AgentTable({ rollups }: { rollups: AgentRollup[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Per-agent performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Agent</th>
              <th className="pb-2 text-right font-medium">Runs</th>
              <th className="pb-2 text-right font-medium">Success</th>
              <th className="pb-2 text-right font-medium">Avg latency</th>
              <th className="pb-2 text-right font-medium">Avg conf.</th>
              <th className="pb-2 text-right font-medium">Cost</th>
              <th className="pb-2 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rollups.map((r) => (
              <tr key={r.agentId} className="text-slate-700">
                <td className="py-2.5">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: AGENT_COLORS[r.agentId] }} />
                    {r.label}
                  </span>
                </td>
                <td className="py-2.5 text-right tabular-nums">{formatNumber(r.runs)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatPct(r.successRate, 0)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatDuration(r.avgLatencyMs)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatPct(r.avgConfidence, 0)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatUsd(r.costUsd)}</td>
                <td className="py-2.5">
                  <div className="flex justify-end">
                    <Sparkline data={r.trend} color={AGENT_COLORS[r.agentId]} width={72} height={22} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into `src/App.tsx`** - import `AgentTable`, add `<AgentTable rollups={rollups} />` to `<main>`.

- [ ] **Step 3: Verify** - `npm run dev` → Expected: 5-row table with per-agent metrics and trend sparklines.

- [ ] **Step 4: Commit + progress**

```bash
git add src/components/AgentTable.tsx src/App.tsx
git commit -m "feat(ui): per-agent performance table"
```
Append Task 11 to `progress.md`; commit.

---

## Task 12: Live event feed

**Files:**
- Create: `src/components/EventFeed.tsx`
- Modify: `src/App.tsx`, `src/index.css`

**Interfaces:**
- Consumes: `AgentRun` (Task 2); formatters (Task 5); `STATUS_COLORS`, `AGENT_COLORS` (Task 5).
- Produces: `<EventFeed runs now />` (expects newest-first, already sliced).

- [ ] **Step 1: Add a fade-in keyframe to `src/index.css`**

```css
@keyframes feed-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-feed-in { animation: feed-in 240ms ease-out; }
```

- [ ] **Step 2: Write `src/components/EventFeed.tsx`**

```tsx
import type { AgentRun } from '../data/types';
import { AGENT_BY_ID } from '../data/agents';
import { formatPct, formatRelativeTime } from '../lib/format';
import { AGENT_COLORS, STATUS_COLORS } from '../lib/colors';

export function EventFeed({ runs, now }: { runs: AgentRun[]; now: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Live event feed</h2>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {runs.map((r) => (
          <li key={r.id} className="animate-feed-in flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[r.status] }} />
            <span className="text-xs font-medium" style={{ color: AGENT_COLORS[r.agentId] }}>
              {AGENT_BY_ID[r.agentId].label}
            </span>
            <span className="truncate text-sm text-slate-700">{r.action}</span>
            <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-slate-400">
              {formatPct(r.confidence, 0)} · {formatRelativeTime(r.timestamp, now)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Wire into `src/App.tsx`**

Add import and derived state:
```tsx
import { EventFeed } from './components/EventFeed';
```
```tsx
  const feed = useMemo(() => [...runs].slice(-40).reverse(), [runs]);
```
Add to `<main>` (feed + approval queue share a row in Task 13):
```tsx
        <EventFeed runs={feed} now={now} />
```

- [ ] **Step 4: Verify** - `npm run dev` → Expected: new events appear at the top every ~2s with a fade-in.

- [ ] **Step 5: Commit + progress**

```bash
git add src/components/EventFeed.tsx src/App.tsx src/index.css
git commit -m "feat(ui): live event feed"
```
Append Task 12 to `progress.md`; commit.

---

## Task 13: Approval queue

**Files:**
- Create: `src/components/ApprovalQueue.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `AgentRun` (Task 2); `approvalQueue` (Task 4); `useDashboardStore.resolveApproval` (Task 7); formatters (Task 5); `AGENT_BY_ID` (Task 2).
- Produces: `<ApprovalQueue items onResolve />`.

- [ ] **Step 1: Write `src/components/ApprovalQueue.tsx`**

```tsx
import type { AgentRun } from '../data/types';
import { AGENT_BY_ID } from '../data/agents';
import { formatPct, formatRelativeTime } from '../lib/format';

interface Props {
  items: AgentRun[];
  now: number;
  onResolve: (id: string, approved: boolean) => void;
}

export function ApprovalQueue({ items, now, onResolve }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Approval queue</h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {items.length} pending
        </span>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Nothing awaiting review.</p>
      ) : (
        <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {items.slice(0, 12).map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">{AGENT_BY_ID[r.agentId].label}</span>
                <span className="text-xs tabular-nums text-slate-400">{formatRelativeTime(r.timestamp, now)}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{r.action} · conf {formatPct(r.confidence, 0)}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onResolve(r.id, true)}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onResolve(r.id, false)}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into `src/App.tsx`** and place feed + queue side by side

Add imports/state:
```tsx
import { ApprovalQueue } from './components/ApprovalQueue';
import { approvalQueue } from './data/aggregations';
```
```tsx
  const resolveApproval = useDashboardStore((s) => s.resolveApproval);
  const queue = useMemo(() => approvalQueue(runs), [runs]);
```
Replace the standalone `<EventFeed …/>` line with a two-column row:
```tsx
        <div className="grid gap-6 lg:grid-cols-2">
          <EventFeed runs={feed} now={now} />
          <ApprovalQueue items={queue} now={now} onResolve={resolveApproval} />
        </div>
```

- [ ] **Step 3: Verify** - `npm run dev` → Expected: Approve/Reject removes an item from the queue and updates the "Approvals pending" KPI.

- [ ] **Step 4: Commit + progress**

```bash
git add src/components/ApprovalQueue.tsx src/App.tsx
git commit -m "feat(ui): human approval queue"
```
Append Task 13 to `progress.md`; commit.

---

## Task 14: Full assembly review + typecheck + test gate

**Files:**
- Modify: `src/App.tsx` (final layout ordering only, if needed)

- [ ] **Step 1: Confirm final `<main>` order** - KPI row → RunsChart → (CostChart | StatusDonut) → AgentTable → (EventFeed | ApprovalQueue).

- [ ] **Step 2: Full test + typecheck gate**

Run: `npm test` → Expected: all suites PASS.
Run: `npm run build` → Expected: no type errors, production build succeeds.
Run: `npm run lint` → Expected: no errors.

- [ ] **Step 3: Commit + progress**

```bash
git add -A
git commit -m "chore: assemble dashboard and pass test/build/lint gate"
```
Append Task 14 to `progress.md`; commit.

---

## Task 15: Visual design pass (frontend-design) + README screenshot

**REQUIRED SUB-SKILL:** Invoke `frontend-design:frontend-design` before restyling. Then apply a single cohesive visual system across all components.

**Files:**
- Modify: `src/index.css`, `tailwind.config.ts`, and any `src/components/*.tsx` for styling only (no logic/interface changes).
- Modify: `README.md` (embed screenshot), add `docs/screenshot.png`.

- [ ] **Step 1: Invoke the frontend-design skill** and establish the system: type scale, a restrained accent + neutral palette, spacing rhythm, card elevation, chart color harmony, and motion for the live feed. Optionally add a subtle dark mode only if inexpensive.

- [ ] **Step 2: Apply the system** consistently to Header, KPI cards, charts, table, feed, and approval queue. Keep all component props and data interfaces unchanged.

- [ ] **Step 3: Responsiveness pass** - verify the grid collapses cleanly at `sm`/`md`/`lg`; the page body must not scroll horizontally.

- [ ] **Step 4: Capture a screenshot** of the running dashboard, save to `docs/screenshot.png`, and embed it at the top of `README.md`:
```markdown
![Agent Ops dashboard](docs/screenshot.png)
```

- [ ] **Step 5: Final gate** - `npm run build` and `npm test` both green.

- [ ] **Step 6: Commit + progress**

```bash
git add -A
git commit -m "style: cohesive visual system and README screenshot"
```
Append Task 15 to `progress.md`; commit.

---

## Self-review notes

- **Spec coverage:** all 6 dashboard zones (Header, KPI row, primary chart, secondary charts, per-agent table, event feed + approval queue) map to Tasks 8-13; data layer + deterministic seed + simulator + tests map to Tasks 2-7; `CLAUDE.md`/`progress.md`/`README.md`/`.gitignore` in Task 1; frontend-design + screenshot in Task 15. No CI (correctly omitted).
- **Type consistency:** selector signatures in Task 4 match consumers in Tasks 9-13; `resolveApproval(id, approved)` defined in Task 7 matches `onResolve` in Task 13; `AgentRun`/`Kpis`/`TimeBucket`/`AgentRollup`/`StatusBreakdown` defined once in Task 2 and reused verbatim.
- **No placeholders:** every code step contains complete, runnable code.
