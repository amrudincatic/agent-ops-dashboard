import type { AgentRollup, Kpis } from '../data/types';
import { KpiCard } from './KpiCard';
import { formatCompact, formatPct, formatUsd } from '../lib/format';

export function KpiRow({ kpis, rollups }: { kpis: Kpis; rollups: AgentRollup[] }) {
  const runTrend = rollups.reduce<number[]>((acc, r) => {
    r.trend.forEach((v, i) => (acc[i] = (acc[i] ?? 0) + v));
    return acc;
  }, []);
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Total runs" value={formatCompact(kpis.totalRuns)} delta={kpis.deltas.totalRuns} spark={runTrend} />
      <KpiCard label="Success rate" value={formatPct(kpis.successRate, 1)} delta={kpis.deltas.successRate} />
      <KpiCard label="Avg confidence" value={formatPct(kpis.avgConfidence, 1)} delta={kpis.deltas.avgConfidence} />
      <KpiCard label="Total cost" value={formatUsd(kpis.totalCostUsd)} delta={kpis.deltas.totalCostUsd} deltaMode="lower-better" />
      <KpiCard label="Active agents" value={String(kpis.activeAgents)} />
      <KpiCard label="Approvals pending" value={String(kpis.approvalsPending)} deltaMode="lower-better" />
    </section>
  );
}
