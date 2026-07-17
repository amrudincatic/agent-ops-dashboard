import { describe, it, expect } from 'vitest';
import { AGENTS, AGENT_ACTIONS, AGENT_BY_ID } from './agents';

describe('agent registry', () => {
  it('has exactly five agents in pipeline order', () => {
    expect(AGENTS.map((a) => a.id)).toEqual([
      'intent-signal', 'ai-core', 'content-engine', 'attribution', 'revenue-engine',
    ]);
  });
  it('defines at least one action per agent', () => {
    for (const a of AGENTS) expect(AGENT_ACTIONS[a.id].length).toBeGreaterThan(0);
  });
  it('indexes agents by id', () => {
    expect(AGENT_BY_ID['ai-core'].label).toBe('AI Core');
  });
});
