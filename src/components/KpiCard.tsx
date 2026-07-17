import { Sparkline } from './Sparkline';
import { formatDelta } from '../lib/format';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaMode?: 'higher-better' | 'lower-better';
  spark?: number[];
}

export function KpiCard({ label, value, delta, deltaMode = 'higher-better', spark }: KpiCardProps) {
  const good = delta === undefined ? true : deltaMode === 'higher-better' ? delta >= 0 : delta <= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tabular-nums text-slate-900">{value}</span>
        {spark ? <Sparkline data={spark} /> : null}
      </div>
      {delta !== undefined && (
        <p className={`mt-1 text-xs font-medium ${good ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatDelta(delta)} <span className="text-slate-400">vs prev</span>
        </p>
      )}
    </div>
  );
}
