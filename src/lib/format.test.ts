import { describe, it, expect } from 'vitest';
import { formatUsd, formatPct, formatDuration, formatDelta, formatRelativeTime } from './format';

describe('formatters', () => {
  it('formats currency', () => { expect(formatUsd(12.5)).toBe('$12.50'); });
  it('formats large currency without throwing', () => {
    expect(formatUsd(1500)).toBe('$1,500');
    expect(formatUsd(0)).toBe('$0.00');
  });
  it('formats percent', () => { expect(formatPct(0.333, 1)).toBe('33.3%'); });
  it('formats duration', () => {
    expect(formatDuration(850)).toBe('850ms');
    expect(formatDuration(1500)).toBe('1.5s');
  });
  it('formats signed delta', () => {
    expect(formatDelta(0.12)).toBe('+12.0%');
    expect(formatDelta(-0.05)).toBe('-5.0%');
  });
  it('formats relative time', () => {
    const now = 1_000_000;
    expect(formatRelativeTime(now - 5000, now)).toBe('5s ago');
    expect(formatRelativeTime(now - 120000, now)).toBe('2m ago');
  });
});
