import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimeBucket } from '../data/types';
import { formatHour } from '../lib/format';
import { STATUS_COLORS } from '../lib/colors';

export function RunsChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = buckets.map((b) => ({ ...b, label: formatHour(b.t) }));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Runs over time (24h)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={3} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Area type="monotone" dataKey="success" stackId="1" stroke={STATUS_COLORS.success} fill={STATUS_COLORS.success} fillOpacity={0.18} />
          <Area type="monotone" dataKey="needsReview" stackId="1" stroke={STATUS_COLORS['needs-review']} fill={STATUS_COLORS['needs-review']} fillOpacity={0.18} />
          <Area type="monotone" dataKey="failed" stackId="1" stroke={STATUS_COLORS.failed} fill={STATUS_COLORS.failed} fillOpacity={0.18} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
