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
