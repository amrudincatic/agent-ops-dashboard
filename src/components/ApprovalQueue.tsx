import type { AgentRun } from '../data/types';
import { AGENT_BY_ID } from '../data/agents';
import { formatPct, formatRelativeTime } from '../lib/format';

interface Props {
  items: AgentRun[];
  now: number;
  onResolve: (id: string, approved: boolean) => void;
}

export function ApprovalQueue({ items, now, onResolve }: Props) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-title">Approval queue</h2>
        <span className="rounded-full bg-warn/10 px-2 py-0.5 text-xs font-medium text-warn">
          {items.length} pending
        </span>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-faint">Nothing awaiting review.</p>
      ) : (
        <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {items.slice(0, 12).map((r) => (
            <li key={r.id} className="rounded-lg border border-hairline p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{AGENT_BY_ID[r.agentId].label}</span>
                <span className="num text-xs text-faint">{formatRelativeTime(r.timestamp, now)}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">{r.action} · conf <span className="num">{formatPct(r.confidence, 0)}</span></p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onResolve(r.id, true)}
                  className="rounded-md bg-ok px-3 py-1 text-xs font-medium text-white hover:opacity-90"
                >
                  Approve
                </button>
                <button
                  onClick={() => onResolve(r.id, false)}
                  className="rounded-md border border-hairline px-3 py-1 text-xs font-medium text-muted hover:bg-canvas"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
