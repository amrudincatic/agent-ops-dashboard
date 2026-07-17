import { LiveIndicator } from './LiveIndicator';
import { ThemeToggle } from './ThemeToggle';
import { formatHour } from '../lib/format';

export function Header({ lastUpdated }: { lastUpdated: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand text-white shadow-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 12h4l2-5 4 10 2-5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h1 className="font-display text-lg font-semibold tracking-tight text-ink">Agent Ops</h1>
          <p className="text-[13px] text-muted">AI pipeline analytics, simulated live stream</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-strong">control: human-approved</span>
        <span className="num text-xs text-faint">updated {formatHour(lastUpdated)}</span>
        <LiveIndicator />
        <ThemeToggle />
      </div>
    </div>
  );
}
