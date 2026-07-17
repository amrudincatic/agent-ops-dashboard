import type { AgentId, RunStatus } from '../data/types';

// Deep indigo brand, used for chrome/accents (focus, cost bars, sparklines).
export const ACCENT = '#4338CA';

// Refined, cohesive status palette.
export const STATUS_COLORS: Record<RunStatus, string> = {
  success: '#17B26A',
  'needs-review': '#F79009',
  failed: '#F04438',
};

// Agent colors form a blue -> green sequence that encodes pipeline order
// (intent signal ... revenue). Green at the end reads as money/revenue.
export const AGENT_COLORS: Record<AgentId, string> = {
  'intent-signal': '#3B82F6',
  'ai-core': '#0EA5E9',
  'content-engine': '#06B6D4',
  attribution: '#14B8A6',
  'revenue-engine': '#10B981',
};
