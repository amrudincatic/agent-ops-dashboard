import type { AgentRun } from '../data/types';
import { AGENT_BY_ID } from '../data/agents';
import { formatPct, formatRelativeTime } from '../lib/format';
import { AGENT_COLORS, STATUS_COLORS } from '../lib/colors';

export function EventFeed({ runs, now }: { runs: AgentRun[]; now: number }) {
  return (
    <div className="card p-5">
      <h2 className="panel-title mb-4">Live event feed</h2>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {runs.map((r) => (
          <li key={r.id} className="animate-feed-in flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-canvas">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[r.status] }} />
            <span className="text-xs font-medium" style={{ color: AGENT_COLORS[r.agentId] }}>
              {AGENT_BY_ID[r.agentId].label}
            </span>
            <span className="truncate text-sm text-ink">{r.action}</span>
            <span className="num ml-auto whitespace-nowrap text-xs text-faint">
              {formatPct(r.confidence, 0)} · {formatRelativeTime(r.timestamp, now)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
