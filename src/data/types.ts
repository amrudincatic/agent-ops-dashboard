export type AgentId =
  | 'intent-signal'
  | 'ai-core'
  | 'content-engine'
  | 'attribution'
  | 'revenue-engine';

export type RunStatus = 'success' | 'failed' | 'needs-review';

export interface AgentRun {
  id: string;
  agentId: AgentId;
  action: string;
  status: RunStatus;
  confidence: number; // 0..1
  tokens: number;
  costUsd: number;
  latencyMs: number;
  revenueUsd: number;
  timestamp: number; // epoch ms
  approved?: boolean; // set when a needs-review run is resolved
}

export interface Agent {
  id: AgentId;
  label: string;
  description: string;
  order: number;
}

export interface Kpis {
  totalRuns: number;
  successRate: number; // 0..1
  avgConfidence: number; // 0..1
  totalCostUsd: number;
  totalRevenueUsd: number;
  activeAgents: number;
  approvalsPending: number;
  deltas: {
    totalRuns: number; // relative change vs previous window half
    successRate: number; // absolute pct-point change
    avgConfidence: number; // absolute change
    totalCostUsd: number; // relative change
    totalRevenueUsd: number; // relative change
  };
}

export interface TimeBucket {
  t: number; // bucket start epoch ms
  success: number;
  failed: number;
  needsReview: number;
  total: number;
  costUsd: number;
}

export interface AgentRollup {
  agentId: AgentId;
  label: string;
  runs: number;
  successRate: number;
  avgLatencyMs: number;
  avgConfidence: number;
  costUsd: number;
  trend: number[]; // runs per sub-bucket, for sparkline
}

export interface StatusBreakdown {
  success: number;
  failed: number;
  needsReview: number;
}
