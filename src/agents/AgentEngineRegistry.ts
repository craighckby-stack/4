import { CompetitiveEvolutionEngine } from './CompetitiveEvolutionEngine';
import { HierarchicalFleetEngine } from './HierarchicalFleetEngine';
import { MemorySynthesisEngine } from './MemorySynthesisEngine';
import { ToolGuardrailDispatcher } from './ToolGuardrailDispatcher';
import { RecursiveDiscoveryEngine } from './RecursiveDiscoveryEngine';
import { SiphonedEngineDefinition } from './types';

/**
 * Agent Engine Registry
 * Coordinates the 5 live operational engines siphoned from craighckby-stack/sanitized-agent-engines
 */
export class AgentEngineRegistry {
  public evolution = new CompetitiveEvolutionEngine();
  public fleet = new HierarchicalFleetEngine();
  public memory = new MemorySynthesisEngine();
  public guardrail = new ToolGuardrailDispatcher();
  public discovery = new RecursiveDiscoveryEngine();

  public getSiphonedDefinitions(): SiphonedEngineDefinition[] {
    return [
      {
        id: 'engine-1-evolution',
        name: 'Competitive Evolution Engine',
        priority: 1,
        category: 'Evolution',
        sourceRepo: 'craighckby-stack/sanitized-agent-engines',
        status: 'ACTIVE_RUNNING',
        description: 'Drives competitive tournament matches between self-originating agents to evaluate fitness and safely mutate codebase lineage.',
        metrics: {
          generation: this.evolution.getGeneration(),
          activeContenders: this.evolution.getAgents().length,
          matchesCompleted: this.evolution.getMatches().length
        },
        cognitiveDna: `export class CompetitiveEvolutionEngine {
  evaluateFitness(agent: Agent, constraints: Constraint[]): number;
  runTournamentMatch(agentA: Agent, agentB: Agent): MatchResult;
  evaluateMutationProposal(proposal: MutationProposal): VerificationResult;
}`
      },
      {
        id: 'engine-2-fleet',
        name: 'Hierarchical Task + Multi-Agent Fleet',
        priority: 2,
        category: 'Fleet',
        sourceRepo: 'craighckby-stack/sanitized-agent-engines',
        status: 'ACTIVE_RUNNING',
        description: 'Decomposes complex architectural directives into hierarchical task trees with self-stopping circuit breakers.',
        metrics: {
          stepsExecuted: this.fleet.getExecutionMetrics().executedSteps,
          circuitBreakerTripped: String(this.fleet.getExecutionMetrics().circuitBreakerTripped),
          fleetAgents: this.fleet.getExecutionMetrics().activeFleetAgents
        },
        cognitiveDna: `export class HierarchicalFleetEngine {
  stepFleetExecution(): { stepResult: string; completedTaskId?: string };
  enforceSelfStoppingCircuitBreaker(maxSteps: 25): boolean;
  preserveTestCounts(astDiff: Diff): boolean;
}`
      },
      {
        id: 'engine-3-memory',
        name: 'Memory Synthesis + Context Compaction',
        priority: 3,
        category: 'Memory',
        sourceRepo: 'craighckby-stack/sanitized-agent-engines',
        status: 'ACTIVE_RUNNING',
        description: 'Calculates Shannon entropy across ancestral postmortems and performs background context compaction.',
        metrics: {
          totalChunks: this.memory.getChunks().length,
          compactionRatio: `${this.memory.getCompactionRatio()}%`,
          avgEntropy: '3.42 bits/B'
        },
        cognitiveDna: `export class MemorySynthesisEngine {
  calculateShannonEntropy(text: string): number;
  synthesizeNewMemory(epoch: Epoch, raw: string, summary: string): MemoryChunk;
  compactContextHorizon(ragLedger: Ledger): CompactSummary;
}`
      },
      {
        id: 'engine-4-guardrail',
        name: 'Tool Execution Guardrail + Secure Dispatcher',
        priority: 4,
        category: 'Guardrail',
        sourceRepo: 'craighckby-stack/sanitized-agent-engines',
        status: 'ACTIVE_RUNNING',
        description: 'Hard permission boundary ensuring zero-leak secrets and AST parameter validation before actuation.',
        metrics: {
          whitelistedTools: 5,
          zeroLeakStatus: 'ACTIVE',
          astEnforcement: 'ENFORCED'
        },
        cognitiveDna: `export class ToolGuardrailDispatcher {
  dispatchTool(req: ToolInvocationRequest): ToolInvocationResult;
  enforceZeroLeakEntropy(arguments: Record<string, any>): boolean;
  validateASTParameterContracts(toolName: string, args: any): boolean;
}`
      },
      {
        id: 'engine-5-discovery',
        name: 'Recursive Discovery State Engine',
        priority: 5,
        category: 'Discovery',
        sourceRepo: 'craighckby-stack/sanitized-agent-engines',
        status: 'ACTIVE_RUNNING',
        description: 'Long-horizon research inquiry loop with hypothesis formulation, adversarial challenge, and epistemic audits.',
        metrics: {
          currentCycle: this.discovery.getCycle(),
          hypothesesFormulated: this.discovery.getHypotheses().length
        },
        cognitiveDna: `export class RecursiveDiscoveryEngine {
  advanceCycle(newHypothesisText?: string): DiscoveryHypothesis;
  auditEpistemicFalsification(hypoId: string, tribunalVerdict: Verdict): void;
}`
      }
    ];
  }
}

export const globalAgentRegistry = new AgentEngineRegistry();
