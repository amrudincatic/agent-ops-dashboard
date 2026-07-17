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
