import type { AgentRollup } from '../data/types';
import { Sparkline } from './Sparkline';
import { formatDuration, formatNumber, formatPct, formatUsd } from '../lib/format';
import { AGENT_COLORS } from '../lib/colors';

export function AgentTable({ rollups }: { rollups: AgentRollup[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Per-agent performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Agent</th>
              <th className="pb-2 text-right font-medium">Runs</th>
              <th className="pb-2 text-right font-medium">Success</th>
              <th className="pb-2 text-right font-medium">Avg latency</th>
              <th className="pb-2 text-right font-medium">Avg conf.</th>
              <th className="pb-2 text-right font-medium">Cost</th>
              <th className="pb-2 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rollups.map((r) => (
              <tr key={r.agentId} className="text-slate-700">
                <td className="py-2.5">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: AGENT_COLORS[r.agentId] }} />
                    {r.label}
                  </span>
                </td>
                <td className="py-2.5 text-right tabular-nums">{formatNumber(r.runs)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatPct(r.successRate, 0)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatDuration(r.avgLatencyMs)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatPct(r.avgConfidence, 0)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatUsd(r.costUsd)}</td>
                <td className="py-2.5">
                  <div className="flex justify-end">
                    <Sparkline data={r.trend} color={AGENT_COLORS[r.agentId]} width={72} height={22} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
