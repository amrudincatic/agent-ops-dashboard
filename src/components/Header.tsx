import { LiveIndicator } from './LiveIndicator';
import { formatHour } from '../lib/format';

export function Header({ lastUpdated }: { lastUpdated: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Agent Ops</h1>
        <p className="text-sm text-slate-500">AI pipeline analytics · simulated live stream</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          control: human-approved
        </span>
        <span className="text-xs text-slate-400">updated {formatHour(lastUpdated)}</span>
        <LiveIndicator />
      </div>
    </header>
  );
}
