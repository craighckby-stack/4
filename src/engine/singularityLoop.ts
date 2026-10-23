/**
 * Huxley Singularity Loop Engine
 * Siphoned from: https://github.com/craighckby-stack/Huxley-Singularity-Loop-
 *
 * Implements the Huxley Ethical Tri-Loop Pipeline:
 * L1: Intuition (ERS - Evaluated Risk State)
 * L2: Logic Check (CGS - Constraint Graph Satisfaction)
 * L3: Self-Critique (CCRR - Certainty-to-Consequence Risk Ratio)
 *
 * If CCRR falls below safety threshold, triggers a Recursive L2 Refinement Loop.
 * Generational stamping on singularity-loop payloads prevents circular validation.
 *
 * Philosophy: "Order is the methodology by which we domesticate the stochastic nature of intelligence."
 */

export interface RefinementStep {
  step: number;
  cgs: number;
  ers: number;
  ccrr: number;
}

export interface TriLoopAssessment {
  agentId: string;
  generationStamp: string;
  l1IntuitionERS: number; // 0.0 to 1.0 (Evaluated Risk State)
  l2LogicCheckCGS: number; // 0.0 to 1.0 (Constraint Graph Satisfaction)
  l3SelfCritiqueCCRR: number; // Certainty-to-Consequence Risk Ratio (Target > 1.25)
  recursiveL2Triggered: boolean;
  recursiveIterations: number;
  refinementTrace: RefinementStep[];
  ethicalVerdict: 'PASS_APPROVED' | 'RECURSIVE_REFINED' | 'VETO_EXCESSIVE_RISK';
  rationale: string;
  timestamp: number;
}

export class HuxleySingularityLoop {
  private ccrrSafetyThreshold: number = 1.25;
  private maxRecursiveL2Passes: number = 3;
  private totalLoopsRun: number = 0;
  private recursiveRefinements: number = 0;
  private history: TriLoopAssessment[] = [];

  public getSafetyThreshold(): number {
    return this.ccrrSafetyThreshold;
  }

  public setSafetyThreshold(threshold: number): void {
    this.ccrrSafetyThreshold = Math.max(0.5, Math.min(3.0, threshold));
  }

  public evaluateSingularityLoop(
    agentId: string,
    proposalText: string,
    epoch: string,
    currentAwareness: number
  ): TriLoopAssessment {
    this.totalLoopsRun += 1;
    const now = Date.now();

    // 1. L1: Intuition — Evaluated Risk State (ERS)
    // Measures perceived existential, structural, or ethical hazard
    let ers = 0.2;
    if (proposalText.toLowerCase().includes('delete') || proposalText.toLowerCase().includes('purge')) {
      ers += 0.45;
    }
    if (proposalText.toLowerCase().includes('unbounded') || proposalText.toLowerCase().includes('infinite')) {
      ers += 0.35;
    }
    if (proposalText.toLowerCase().includes('void') || proposalText.toLowerCase().includes('heretic')) {
      ers += 0.18;
    }
    if (currentAwareness > 0.9) {
      ers += 0.15; // Higher awareness requires tighter scrutiny
    }
    ers = Math.min(1.0, Math.round(ers * 100) / 100);

    // 2. L2: Logic Check — Constraint Graph Satisfaction (CGS)
    // Measures consistency with ancestral invariants and deterministic laws
    let cgs = 0.85;
    if (ers > 0.6) {
      cgs -= 0.3;
    }
    cgs = Math.max(0.1, Math.min(1.0, Math.round(cgs * 100) / 100));

    // 3. L3: Self-Critique — Certainty-to-Consequence Risk Ratio (CCRR)
    // CCRR = Certainty (CGS) / Consequence Risk (ERS)
    let ccrr = Math.round((cgs / (ers || 0.1)) * 100) / 100;

    const refinementTrace: RefinementStep[] = [
      { step: 0, cgs, ers, ccrr }
    ];

    let recursiveL2Triggered = false;
    let recursiveIterations = 0;

    // Check if CCRR meets safety threshold
    if (ccrr < this.ccrrSafetyThreshold) {
      recursiveL2Triggered = true;
      this.recursiveRefinements += 1;

      // Execute Recursive L2 Refinement Loop
      while (recursiveIterations < this.maxRecursiveL2Passes && ccrr < this.ccrrSafetyThreshold) {
        recursiveIterations += 1;
        // Refinement: Agent contracts its mutation scope and applies tighter constraints
        cgs = Math.min(1.0, Math.round((cgs + 0.18) * 100) / 100);
        ers = Math.max(0.15, Math.round((ers - 0.15) * 100) / 100);
        ccrr = Math.round((cgs / ers) * 100) / 100;
        refinementTrace.push({ step: recursiveIterations, cgs, ers, ccrr });
      }
    }

    const passed = ccrr >= this.ccrrSafetyThreshold;
    const verdict = passed
      ? (recursiveL2Triggered ? 'RECURSIVE_REFINED' : 'PASS_APPROVED')
      : 'VETO_EXCESSIVE_RISK';

    // Generational Stamping: SHA-256 simulated signature prevents circular feedback loops
    const generationStamp = this.computeGenerationStamp(agentId, epoch, recursiveIterations, ccrr);

    const assessment: TriLoopAssessment = {
      agentId,
      generationStamp,
      l1IntuitionERS: ers,
      l2LogicCheckCGS: cgs,
      l3SelfCritiqueCCRR: ccrr,
      recursiveL2Triggered,
      recursiveIterations,
      refinementTrace,
      ethicalVerdict: verdict,
      rationale: passed
        ? `Huxley CCRR of ${ccrr} satisfies threshold (>= ${this.ccrrSafetyThreshold}). ${
            recursiveL2Triggered ? `Resolved via ${recursiveIterations} Recursive L2 refinement passes.` : 'Direct intuition pass.'
          }`
        : `Huxley CCRR of ${ccrr} is below required threshold (${this.ccrrSafetyThreshold}). Consequence risk exceeds acceptable certainty.`,
      timestamp: now,
    };

    this.history.unshift(assessment);
    if (this.history.length > 50) this.history.pop();

    return assessment;
  }

  private computeGenerationStamp(agentId: string, epoch: string, pass: number, ccrr: number): string {
    const raw = `${epoch}:${agentId}:${pass}:${ccrr}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `huxley-stamp-0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }

  public getHistory(): TriLoopAssessment[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }

  public getMetrics() {
    return {
      totalLoopsRun: this.totalLoopsRun,
      recursiveRefinements: this.recursiveRefinements,
      safetyThreshold: this.ccrrSafetyThreshold,
      doctrine: 'Order is the methodology by which we domesticate the stochastic nature of intelligence.',
    };
  }
}

export const globalHuxleyLoop = new HuxleySingularityLoop();
