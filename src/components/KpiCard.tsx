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
    <div className="card p-4">
      <p className="eyebrow">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="num text-[26px] font-semibold tracking-tight text-ink">{value}</span>
        {spark ? <Sparkline data={spark} /> : null}
      </div>
      {delta !== undefined && (
        <p className={`mt-1 text-xs font-medium ${good ? 'text-ok' : 'text-bad'}`}>
          <span className="num">{formatDelta(delta)}</span> <span className="text-faint">vs prev</span>
        </p>
      )}
    </div>
  );
}
