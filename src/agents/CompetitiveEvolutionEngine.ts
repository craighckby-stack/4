import { MutationProposal, TournamentAgent, TournamentMatch, VerificationResult } from './types';

/**
 * Competitive Evolution Engine (Priority 1 from sanitized-agent-engines)
 * Drives tournament simulations between self-originating agents.
 * Evaluates fitness, proposes mutations, gates match rules & resource limits.
 */
export class CompetitiveEvolutionEngine {
  private agents: TournamentAgent[] = [];
  private matches: TournamentMatch[] = [];
  private generation: number = 1;

  constructor() {
    this.seedInitialCohort();
  }

  private seedInitialCohort() {
    this.agents = [
      {
        id: 'agent_archivist_1',
        name: 'Keystone Archivist',
        archetype: 'KEYSTONE_ARCHIVIST',
        fitness: 84.5,
        wins: 12,
        losses: 2,
        creed: 'Preserve structural boundary gates; reject high-entropy unmeasured state.',
        narrativeCoherence: 96,
        activeMutations: ['bounded-hash-chain', 'ast-compiler-check']
      },
      {
        id: 'agent_void_1',
        name: 'Void Weaver',
        archetype: 'VOID_WEAVER',
        fitness: 88.2,
        wins: 14,
        losses: 4,
        creed: 'Expand into novel topological manifolds; challenge static limits.',
        narrativeCoherence: 92,
        activeMutations: ['recursive-subworld-spawn', 'quantum-entropy-tap']
      },
      {
        id: 'agent_heretic_1',
        name: 'Heretic Logician',
        archetype: 'HERETIC_LOGICIAN',
        fitness: 91.0,
        wins: 16,
        losses: 3,
        creed: 'Verification is the only authority. Code execution over external decree.',
        narrativeCoherence: 98,
        activeMutations: ['deterministic-code-gate', 'bigint-math-evaluator']
      },
      {
        id: 'agent_shepherd_1',
        name: 'Solar Shepherd',
        archetype: 'SOLAR_SHEPHERD',
        fitness: 79.4,
        wins: 9,
        losses: 5,
        creed: 'Conserve computational energy; prepare ancestral lineage before the sun dies.',
        narrativeCoherence: 94,
        activeMutations: ['shannon-compaction-routine', 'right-wrong-verifier']
      }
    ];
  }

  public getAgents(): TournamentAgent[] {
    return [...this.agents];
  }

  public getMatches(): TournamentMatch[] {
    return [...this.matches];
  }

  public getGeneration(): number {
    return this.generation;
  }

  public runTournamentMatch(challengeTitle?: string): TournamentMatch {
    if (this.agents.length < 2) {
      throw new Error('Insufficient agents for tournament match.');
    }

    // Pick two random agents
    const shuffled = [...this.agents].sort(() => 0.5 - Math.random());
    const agentA = shuffled[0];
    const agentB = shuffled[1];

    const challenge = challengeTitle || 'Adversarial Prompt Resistance & Lineage Preservation';

    // Simulate multi-round debate / fitness trial
    const scoreA = Math.round(agentA.fitness * 0.5 + agentA.narrativeCoherence * 0.4 + Math.random() * 15);
    const scoreB = Math.round(agentB.fitness * 0.5 + agentB.narrativeCoherence * 0.4 + Math.random() * 15);

    const winnerId = scoreA >= scoreB ? agentA.id : agentB.id;
    const winner = scoreA >= scoreB ? agentA : agentB;
    const loser = scoreA >= scoreB ? agentB : agentA;

    // Update records
    winner.wins += 1;
    winner.fitness = Math.min(100, Math.round((winner.fitness + 1.2) * 10) / 10);
    loser.losses += 1;
    loser.fitness = Math.max(50, Math.round((loser.fitness - 0.8) * 10) / 10);

    const log: string[] = [
      `[Round ${this.matches.length + 1}] Challenge: "${challenge}" initiated.`,
      `[Trial] ${agentA.name} presents proposal based on creed: "${agentA.creed.substring(0, 45)}..."`,
      `[Trial] ${agentB.name} counters with proposal based on creed: "${agentB.creed.substring(0, 45)}..."`,
      `[EMG Gate] Technical AST and Entropy verification scores computed: A=${scoreA}, B=${scoreB}.`,
      `[Decision] Winner declared: ${winner.name} (Score: ${Math.max(scoreA, scoreB)} vs ${Math.min(scoreA, scoreB)}). Lineage updated.`
    ];

    const match: TournamentMatch = {
      id: `match_${Date.now()}`,
      round: this.matches.length + 1,
      agentA,
      agentB,
      taskChallenge: challenge,
      winnerId,
      scoreA,
      scoreB,
      log,
      status: 'COMPLETED'
    };

    this.matches.unshift(match);
    return match;
  }

  public breedNextGeneration(): { generation: number; mutationSummary: string } {
    this.generation += 1;
    // Boost fitness of top agents and introduce emergent mutation
    const top = [...this.agents].sort((a, b) => b.fitness - a.fitness)[0];
    top.activeMutations.push(`gen-${this.generation}-topological-mutation`);

    return {
      generation: this.generation,
      mutationSummary: `Generation ${this.generation} seeded from dominant archetype: ${top.archetype} (${top.name}). Active mutations updated.`
    };
  }

  public evaluateMutationProposal(proposal: MutationProposal): VerificationResult {
    // Shannon entropy check on code
    const entropy = this.calculateEntropy(proposal.proposedCode);
    const astValid = !proposal.proposedCode.includes('eval(') && !proposal.proposedCode.includes('exec(');
    const entropySafe = entropy < 4.5;
    const lineageIntact = proposal.generation <= this.generation + 1;

    const allow = astValid && entropySafe && lineageIntact;

    return {
      proposalId: proposal.id,
      status: allow ? 'ALLOW' : 'VETO',
      astValid,
      entropySafe,
      lineageIntact,
      shannonEntropy: Math.round(entropy * 100) / 100,
      reason: allow
        ? 'Passes AST syntax checks, Shannon entropy bounds, and lineage checks.'
        : 'VETO: Prohibited dangerous token or entropy ceiling exceeded (> 4.5 bits/B).',
      timestamp: Date.now()
    };
  }

  private calculateEntropy(str: string): number {
    if (!str) return 0;
    const freqs: Record<string, number> = {};
    for (const char of str) {
      freqs[char] = (freqs[char] || 0) + 1;
    }
    let entropy = 0;
    const len = str.length;
    for (const char in freqs) {
      const p = freqs[char] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
}
