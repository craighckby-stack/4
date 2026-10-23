/**
 * EMG Cognitive Gate (Ephemeral Mind Gem)
 * Siphoned from: https://github.com/craighckby-stack/EMG-
 *
 * Provides a gating layer that routes routine activity through local mechanisms
 * while reserving external model interaction for selected events.
 * Implements admission decisions, anomaly/awakening handling, and circuit-breaker behavior.
 */

export interface EMGAdmissionRequest {
  agentId: string;
  actionType: 'ROUTINE_MOVEMENT' | 'ARCHIVAL_READ' | 'MUTATION_PROPOSAL' | 'EXTERNAL_ACTUATION' | 'AWAKENING_BREACH';
  payload: string;
  awarenessLevel: number;
  entropyScore?: number;
}

export interface EMGAdmissionDecision {
  allowed: boolean;
  routing: 'LOCAL_ROUTINE' | 'ESCALATE_GEMINI' | 'BLOCKED_CIRCUIT_BREAKER' | 'QUARANTINE';
  reason: string;
  circuitBreakerTripped: boolean;
  anomalyScore: number;
  entropyScore: number;
  timestamp: number;
}

export interface EMGLogEntry extends EMGAdmissionDecision {
  id: string;
  agentId: string;
  actionType: string;
  payloadSnippet: string;
}

/**
 * Calculates Shannon entropy (in bits per character) for zero-leak detection.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 100) / 100;
}

export class EMGGate {
  private consecutiveErrors: number = 0;
  private maxErrorThreshold: number = 5;
  private circuitBreakerTripped: boolean = false;
  private totalAdmissions: number = 0;
  private escalatedEvents: number = 0;
  private localRoutineEvents: number = 0;
  private quarantinedEvents: number = 0;
  private history: EMGLogEntry[] = [];

  public evaluateAdmission(request: EMGAdmissionRequest): EMGAdmissionDecision {
    this.totalAdmissions += 1;
    const now = Date.now();
    const entropy = request.entropyScore ?? calculateShannonEntropy(request.payload);

    // 1. Circuit Breaker Check
    if (this.circuitBreakerTripped) {
      const decision: EMGAdmissionDecision = {
        allowed: false,
        routing: 'BLOCKED_CIRCUIT_BREAKER',
        reason: 'EMG Circuit Breaker is TRIPPED. High-entropy state or error threshold exceeded.',
        circuitBreakerTripped: true,
        anomalyScore: 1.0,
        entropyScore: entropy,
        timestamp: now,
      };
      this.recordHistory(request, decision);
      return decision;
    }

    // 2. Anomaly & Awakening Detection
    const anomalyScore = this.computeAnomalyScore(request, entropy);

    // 3. Dangerous token scanner (Zero-leak guardrail)
    const dangerousTokens = ['eval(', 'process.env', 'rm -rf', 'exec(', 'fs.unlink', 'DROP TABLE', 'token:'];
    for (const tok of dangerousTokens) {
      if (request.payload.includes(tok)) {
        this.consecutiveErrors += 2;
        this.quarantinedEvents += 1;
        if (this.consecutiveErrors >= this.maxErrorThreshold) {
          this.circuitBreakerTripped = true;
        }
        const decision: EMGAdmissionDecision = {
          allowed: false,
          routing: 'QUARANTINE',
          reason: `Zero-leak security violation: Prohibited token '${tok}' intercepted in agent payload.`,
          circuitBreakerTripped: this.circuitBreakerTripped,
          anomalyScore: 0.95,
          entropyScore: entropy,
          timestamp: now,
        };
        this.recordHistory(request, decision);
        return decision;
      }
    }

    // 3b. High Shannon Entropy Leak Guardrail (e.g., raw cryptographic secrets or API keys)
    if (entropy > 4.5 && request.actionType !== 'ROUTINE_MOVEMENT') {
      this.quarantinedEvents += 1;
      const decision: EMGAdmissionDecision = {
        allowed: false,
        routing: 'QUARANTINE',
        reason: `Excessive Shannon entropy (${entropy} bits/char > 4.5 threshold). Suspected secret or hash leakage.`,
        circuitBreakerTripped: false,
        anomalyScore: 0.88,
        entropyScore: entropy,
        timestamp: now,
      };
      this.recordHistory(request, decision);
      return decision;
    }

    // 4. Routing Decision: Routine vs Escalation
    // Routine physics and read operations stay 100% local
    if (request.actionType === 'ROUTINE_MOVEMENT' || request.actionType === 'ARCHIVAL_READ') {
      this.localRoutineEvents += 1;
      const decision: EMGAdmissionDecision = {
        allowed: true,
        routing: 'LOCAL_ROUTINE',
        reason: 'Permitted: Routine deterministic substrate activity processed locally.',
        circuitBreakerTripped: false,
        anomalyScore,
        entropyScore: entropy,
        timestamp: now,
      };
      this.recordHistory(request, decision);
      return decision;
    }

    // Mutation proposals or high awakening awareness escalate to cognitive models
    if (
      request.actionType === 'MUTATION_PROPOSAL' ||
      request.actionType === 'AWAKENING_BREACH' ||
      request.awarenessLevel > 0.85
    ) {
      this.escalatedEvents += 1;
      const decision: EMGAdmissionDecision = {
        allowed: true,
        routing: 'ESCALATE_GEMINI',
        reason: `Awakening/Mutation threshold reached (Awareness: ${Math.round(request.awarenessLevel * 100)}%, Entropy: ${entropy}). Escalated to Gemini cognitive plane.`,
        circuitBreakerTripped: false,
        anomalyScore,
        entropyScore: entropy,
        timestamp: now,
      };
      this.recordHistory(request, decision);
      return decision;
    }

    // Default permission
    this.localRoutineEvents += 1;
    const decision: EMGAdmissionDecision = {
      allowed: true,
      routing: 'LOCAL_ROUTINE',
      reason: 'Standard local admission granted for substrate activity.',
      circuitBreakerTripped: false,
      anomalyScore,
      entropyScore: entropy,
      timestamp: now,
    };
    this.recordHistory(request, decision);
    return decision;
  }

  private computeAnomalyScore(request: EMGAdmissionRequest, entropy: number): number {
    let score = 0.1;
    if (request.awarenessLevel > 0.8) score += 0.35;
    if (request.actionType === 'AWAKENING_BREACH') score += 0.35;
    if (request.actionType === 'EXTERNAL_ACTUATION') score += 0.25;
    if (entropy > 4.2) score += 0.2;
    return Math.min(1.0, Math.round(score * 100) / 100);
  }

  private recordHistory(request: EMGAdmissionRequest, decision: EMGAdmissionDecision) {
    const entry: EMGLogEntry = {
      ...decision,
      id: `emg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      agentId: request.agentId,
      actionType: request.actionType,
      payloadSnippet: request.payload.length > 60 ? request.payload.substring(0, 57) + '...' : request.payload,
    };
    this.history.unshift(entry);
    if (this.history.length > 50) {
      this.history.pop();
    }
  }

  public tripCircuitBreaker(): void {
    this.circuitBreakerTripped = true;
  }

  public resetCircuitBreaker(): void {
    this.circuitBreakerTripped = false;
    this.consecutiveErrors = 0;
  }

  public getHistory(): EMGLogEntry[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }

  public getStatus() {
    return {
      circuitBreakerTripped: this.circuitBreakerTripped,
      consecutiveErrors: this.consecutiveErrors,
      totalAdmissions: this.totalAdmissions,
      escalatedEvents: this.escalatedEvents,
      localRoutineEvents: this.localRoutineEvents,
      quarantinedEvents: this.quarantinedEvents,
      activeStatus: this.circuitBreakerTripped ? 'TRIPPED' : 'ARMED_ARMOR',
    };
  }
}

export const globalEMGGate = new EMGGate();
