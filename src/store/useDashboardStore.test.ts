import { describe, it, expect } from 'vitest';
import { useDashboardStore } from './useDashboardStore';
import type { AgentRun } from '../data/types';

const sample = (over: Partial<AgentRun> = {}): AgentRun => ({
  id: 'test_1', agentId: 'ai-core', action: 'reason', status: 'needs-review',
  confidence: 0.8, tokens: 1000, costUsd: 0.008, latencyMs: 500, revenueUsd: 0,
  timestamp: 123, ...over,
});

describe('useDashboardStore', () => {
  it('appends a run and updates lastUpdated', () => {
    const before = useDashboardStore.getState().runs.length;
    useDashboardStore.getState().addRun(sample({ id: 'appended', timestamp: 999 }));
    const s = useDashboardStore.getState();
    expect(s.runs.length).toBe(before + 1);
    expect(s.runs[s.runs.length - 1].id).toBe('appended');
    expect(s.lastUpdated).toBe(999);
  });
  it('resolves an approval by id', () => {
    useDashboardStore.getState().addRun(sample({ id: 'to_resolve', status: 'needs-review' }));
    useDashboardStore.getState().resolveApproval('to_resolve', true);
    expect(useDashboardStore.getState().runs.find((r) => r.id === 'to_resolve')?.approved).toBe(true);
  });
  it('caps the run log at 2000 entries', () => {
    const store = useDashboardStore.getState();
    for (let i = 0; i < 2100; i++) store.addRun(sample({ id: `bulk_${i}`, timestamp: 1000 + i }));
    expect(useDashboardStore.getState().runs.length).toBeLessThanOrEqual(2000);
  });
});
