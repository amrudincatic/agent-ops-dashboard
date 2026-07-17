import type { AgentRollup } from '../data/types';
import { Sparkline } from './Sparkline';
import { formatDuration, formatNumber, formatPct, formatUsd } from '../lib/format';
import { AGENT_COLORS } from '../lib/colors';

export function AgentTable({ rollups }: { rollups: AgentRollup[] }) {
  return (
    <div className="card p-5">
      <h2 className="panel-title mb-4">Per-agent performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-faint">
              <th className="pb-2 font-medium">Agent</th>
              <th className="pb-2 text-right font-medium">Runs</th>
              <th className="pb-2 text-right font-medium">Success</th>
              <th className="pb-2 text-right font-medium">Avg latency</th>
              <th className="pb-2 text-right font-medium">Avg conf.</th>
              <th className="pb-2 text-right font-medium">Cost</th>
              <th className="pb-2 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rollups.map((r, i) => (
              <tr key={r.agentId} className="text-ink">
                <td className="py-2.5">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <span className="num mr-2 text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: AGENT_COLORS[r.agentId] }} />
                    {r.label}
                  </span>
                </td>
                <td className="num py-2.5 text-right">{formatNumber(r.runs)}</td>
                <td className="num py-2.5 text-right">{formatPct(r.successRate, 0)}</td>
                <td className="num py-2.5 text-right">{formatDuration(r.avgLatencyMs)}</td>
                <td className="num py-2.5 text-right">{formatPct(r.avgConfidence, 0)}</td>
                <td className="num py-2.5 text-right">{formatUsd(r.costUsd)}</td>
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
