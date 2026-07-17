import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimeBucket } from '../data/types';
import { formatHour } from '../lib/format';
import { STATUS_COLORS } from '../lib/colors';

export function RunsChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = buckets.map((b) => ({ ...b, label: formatHour(b.t) }));
  return (
    <div className="card p-5">
      <h2 className="panel-title mb-4">Runs over time (24h)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#98A2B3' }} interval={3} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#98A2B3' }} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EAECF0', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />
          <Area type="monotone" dataKey="success" stackId="1" stroke={STATUS_COLORS.success} fill={STATUS_COLORS.success} fillOpacity={0.2} />
          <Area type="monotone" dataKey="needsReview" stackId="1" stroke={STATUS_COLORS['needs-review']} fill={STATUS_COLORS['needs-review']} fillOpacity={0.2} />
          <Area type="monotone" dataKey="failed" stackId="1" stroke={STATUS_COLORS.failed} fill={STATUS_COLORS.failed} fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
