import type { AgentRun } from '../data/types';
import { AGENT_BY_ID } from '../data/agents';
import { formatPct, formatRelativeTime } from '../lib/format';
import { AGENT_COLORS, STATUS_COLORS } from '../lib/colors';

export function EventFeed({ runs, now }: { runs: AgentRun[]; now: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Live event feed</h2>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {runs.map((r) => (
          <li key={r.id} className="animate-feed-in flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[r.status] }} />
            <span className="text-xs font-medium" style={{ color: AGENT_COLORS[r.agentId] }}>
              {AGENT_BY_ID[r.agentId].label}
            </span>
            <span className="truncate text-sm text-slate-700">{r.action}</span>
            <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-slate-400">
              {formatPct(r.confidence, 0)} · {formatRelativeTime(r.timestamp, now)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
