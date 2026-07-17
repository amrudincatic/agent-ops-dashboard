const nf = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const formatNumber = (n: number): string => nf.format(Math.round(n));
export const formatCompact = (n: number): string => compact.format(n);

export const formatUsd = (n: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n < 1000 ? 2 : 0,
    maximumFractionDigits: n < 1000 ? 2 : 0,
  }).format(n);

export const formatPct = (x: number, digits = 0): string => `${(x * 100).toFixed(digits)}%`;

export const formatDelta = (x: number): string => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`;

export const formatDuration = (ms: number): string =>
  ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;

export function formatRelativeTime(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export const formatHour = (ts: number): string =>
  new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
