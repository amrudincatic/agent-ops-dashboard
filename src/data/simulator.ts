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
