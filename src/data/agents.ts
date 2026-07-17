import type { Agent, AgentId } from './types';

export const AGENTS: Agent[] = [
  { id: 'intent-signal', label: 'Intent Signal', description: 'Detects buying-intent signals', order: 0 },
  { id: 'ai-core', label: 'AI Core', description: 'Reasoning and orchestration', order: 1 },
  { id: 'content-engine', label: 'Content Engine', description: 'Generates content', order: 2 },
  { id: 'attribution', label: 'Attribution', description: 'Tracks attribution', order: 3 },
  { id: 'revenue-engine', label: 'Revenue Engine', description: 'Computes attributed revenue', order: 4 },
];

export const AGENT_ACTIONS: Record<AgentId, string[]> = {
  'intent-signal': ['detect intent', 'score signal', 'segment visitor'],
  'ai-core': ['reason over context', 'plan next action', 'route decision'],
  'content-engine': ['generate variant', 'summarize source', 'rewrite CTA'],
  attribution: ['track touchpoint', 'assign credit', 'reconcile path'],
  'revenue-engine': ['project revenue', 'update pipeline', 'compute ROAS'],
};

export const AGENT_BY_ID: Record<AgentId, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a]),
) as Record<AgentId, Agent>;
