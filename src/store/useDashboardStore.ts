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
