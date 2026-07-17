import type { AgentId, RunStatus } from '../data/types';

export const ACCENT = '#4f46e5'; // indigo-600 (baseline; refined in frontend-design)

export const STATUS_COLORS: Record<RunStatus, string> = {
  success: '#16a34a',
  'needs-review': '#d97706',
  failed: '#dc2626',
};

export const AGENT_COLORS: Record<AgentId, string> = {
  'intent-signal': '#0ea5e9',
  'ai-core': '#4f46e5',
  'content-engine': '#8b5cf6',
  attribution: '#0d9488',
  'revenue-engine': '#16a34a',
};
