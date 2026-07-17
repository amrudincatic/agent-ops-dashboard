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
