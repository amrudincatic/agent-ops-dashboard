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
