import { useMemo } from 'react';
import { Header } from './components/Header';
import { KpiRow } from './components/KpiRow';
import { RunsChart } from './components/RunsChart';
import { CostChart } from './components/CostChart';
import { StatusDonut } from './components/StatusDonut';
import { AgentTable } from './components/AgentTable';
import { EventFeed } from './components/EventFeed';
import { ApprovalQueue } from './components/ApprovalQueue';
import { computeKpis, computeAgentRollups, bucketRuns, computeStatusBreakdown, approvalQueue } from './data/aggregations';
import { useDashboardStore } from './store/useDashboardStore';
import { useLiveStream } from './store/useLiveStream';

export default function App() {
  useLiveStream();
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);
  const runs = useDashboardStore((s) => s.runs);
  const resolveApproval = useDashboardStore((s) => s.resolveApproval);
  const now = lastUpdated;
  const kpis = useMemo(() => computeKpis(runs, now), [runs, now]);
  const rollups = useMemo(() => computeAgentRollups(runs, now), [runs, now]);
  const buckets = useMemo(() => bucketRuns(runs, now), [runs, now]);
  const breakdown = useMemo(() => computeStatusBreakdown(runs, now), [runs, now]);
  const feed = useMemo(() => [...runs].slice(-40).reverse(), [runs]);
  const queue = useMemo(() => approvalQueue(runs), [runs]);
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-20 border-b border-hairline bg-canvas/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Header lastUpdated={lastUpdated} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <KpiRow kpis={kpis} rollups={rollups} />
        <RunsChart buckets={buckets} />
        <div className="grid gap-6 lg:grid-cols-2">
          <CostChart buckets={buckets} />
          <StatusDonut breakdown={breakdown} />
        </div>
        <AgentTable rollups={rollups} />
        <div className="grid gap-6 lg:grid-cols-2">
          <EventFeed runs={feed} now={now} />
          <ApprovalQueue items={queue} now={now} onResolve={resolveApproval} />
        </div>
      </main>
    </div>
  );
}
