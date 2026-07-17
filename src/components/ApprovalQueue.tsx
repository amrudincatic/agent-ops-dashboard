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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Approval queue</h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {items.length} pending
        </span>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Nothing awaiting review.</p>
      ) : (
        <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {items.slice(0, 12).map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">{AGENT_BY_ID[r.agentId].label}</span>
                <span className="text-xs tabular-nums text-slate-400">{formatRelativeTime(r.timestamp, now)}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{r.action} · conf {formatPct(r.confidence, 0)}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onResolve(r.id, true)}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onResolve(r.id, false)}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
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
