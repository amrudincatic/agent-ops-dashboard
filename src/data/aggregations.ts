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
const sumRev = (arr: AgentRun[]) => arr.reduce((s, r) => s + r.revenueUsd, 0);
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
    totalRevenueUsd: sumRev(w),
    activeAgents: new Set(recent.map((r) => r.agentId)).size,
    approvalsPending: w.filter((r) => r.status === 'needs-review' && r.approved === undefined).length,
    deltas: {
      totalRuns: rel(recent.length, prev.length),
      successRate: rate(recent) - rate(prev),
      avgConfidence: meanConf(recent) - meanConf(prev),
      totalCostUsd: rel(sumCost(recent), sumCost(prev)),
      totalRevenueUsd: rel(sumRev(recent), sumRev(prev)),
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
    if (r.timestamp < start || r.timestamp > now) continue;
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
