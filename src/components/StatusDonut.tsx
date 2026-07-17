import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusBreakdown } from '../data/types';
import { STATUS_COLORS } from '../lib/colors';

export function StatusDonut({ breakdown }: { breakdown: StatusBreakdown }) {
  const data = [
    { name: 'Success', value: breakdown.success, color: STATUS_COLORS.success },
    { name: 'Needs review', value: breakdown.needsReview, color: STATUS_COLORS['needs-review'] },
    { name: 'Failed', value: breakdown.failed, color: STATUS_COLORS.failed },
  ];
  return (
    <div className="card p-5">
      <h2 className="panel-title mb-4">Status breakdown</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={2}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EAECF0', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-3 flex justify-center gap-4 text-xs text-muted">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
