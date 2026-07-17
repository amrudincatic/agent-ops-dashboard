import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimeBucket } from '../data/types';
import { formatHour, formatUsd } from '../lib/format';
import { ACCENT } from '../lib/colors';

export function CostChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = buckets.map((b) => ({ label: formatHour(b.t), costUsd: +b.costUsd.toFixed(3) }));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">Cost over time</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ left: -8, right: 8, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => formatUsd(v)} />
          <Tooltip formatter={(v: number) => formatUsd(v)} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Bar dataKey="costUsd" fill={ACCENT} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
