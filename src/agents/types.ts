/**
 * Agent Engine Contracts & Types
 * Siphoned from sanitized-agent-engines (clean-room cognitive DNA bank)
 */

export interface MutationProposal {
  id: string;
  proposingAgentId: string;
  targetFile: string;
  rationale: string;
  proposedCode: string;
  entropyScore: number;
  timestamp: number;
  generation: number;
}

export interface VerificationResult {
  proposalId: string;
  status: 'ALLOW' | 'VETO';
  astValid: boolean;
  entropySafe: boolean;
  lineageIntact: boolean;
  shannonEntropy: number;
  reason: string;
  timestamp: number;
}

export interface TournamentAgent {
  id: string;
  name: string;
  archetype: string;
  fitness: number;
  wins: number;
  losses: number;
  creed: string;
  narrativeCoherence: number;
  activeMutations: string[];
}

export interface TournamentMatch {
  id: string;
  round: number;
  agentA: TournamentAgent;
  agentB: TournamentAgent;
  taskChallenge: string;
  winnerId: string | null;
  scoreA: number;
  scoreB: number;
  log: string[];
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED';
}

export interface TaskNode {
  id: string;
  title: string;
  assigneeArchetype: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED';
  depth: number;
  children: TaskNode[];
  result?: string;
}

export interface DiscoveryHypothesis {
  id: string;
  hypothesis: string;
  epistemicConfidence: number;
  supportingPostmortems: string[];
  adversarialChallenge: string;
  status: 'FORMULATED' | 'TESTED_VERIFIED' | 'FALSIFIED';
}

export interface SiphonedEngineDefinition {
  id: string;
  name: string;
  priority: number;
  category: 'Evolution' | 'Fleet' | 'Memory' | 'Guardrail' | 'Discovery';
  sourceRepo: string;
  status: 'ACTIVE_RUNNING' | 'VERIFIED_CLEAN';
  description: string;
  cognitiveDna: string;
  metrics: Record<string, string | number>;
}
