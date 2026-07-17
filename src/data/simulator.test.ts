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
