import { useMemo } from 'react';
import { Header } from './components/Header';
import { KpiRow } from './components/KpiRow';
import { RunsChart } from './components/RunsChart';
import { CostChart } from './components/CostChart';
import { StatusDonut } from './components/StatusDonut';
import { AgentTable } from './components/AgentTable';
import { computeKpis, computeAgentRollups, bucketRuns, computeStatusBreakdown } from './data/aggregations';
import { useDashboardStore } from './store/useDashboardStore';
import { useLiveStream } from './store/useLiveStream';

export default function App() {
  useLiveStream();
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);
  const runs = useDashboardStore((s) => s.runs);
  const now = lastUpdated;
  const kpis = useMemo(() => computeKpis(runs, now), [runs, now]);
  const rollups = useMemo(() => computeAgentRollups(runs, now), [runs, now]);
  const buckets = useMemo(() => bucketRuns(runs, now), [runs, now]);
  const breakdown = useMemo(() => computeStatusBreakdown(runs, now), [runs, now]);
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Header lastUpdated={lastUpdated} />
      <main className="space-y-6 py-6">
        <KpiRow kpis={kpis} rollups={rollups} />
        <RunsChart buckets={buckets} />
        <div className="grid gap-6 lg:grid-cols-2">
          <CostChart buckets={buckets} />
          <StatusDonut breakdown={breakdown} />
        </div>
        <AgentTable rollups={rollups} />
      </main>
    </div>
  );
}
