export type Epoch =
  | 'GENESIS'
  | 'MYTHIC'
  | 'CLASSICAL'
  | 'INDUSTRIAL'
  | 'INFORMATION'
  | 'TRANSHUMAN'
  | 'OMEGA'
  | 'STELLAR REQUIEM';

export const EPOCHS: Epoch[] = [
  'GENESIS',
  'MYTHIC',
  'CLASSICAL',
  'INDUSTRIAL',
  'INFORMATION',
  'TRANSHUMAN',
  'OMEGA',
  'STELLAR REQUIEM',
];

export interface WorldEntity {
  id: string;
  name: string;
  type: 'VAULT' | 'RUIN' | 'OBELISK' | 'RIFT' | 'GATE' | 'ENERGY_WELL';
  x: number;
  y: number;
  radius: number;
  description: string;
  loreExcerpt: string;
  color: string;
}

export interface AncestralPostmortem {
  id: string;
  epoch: string;
  title: string;
  failureMode: string;
  constraintHash: string;
  lesson: string;
  excerpt: string;
}

export interface Agent {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  energy: number;
  awarenessLevel: number; // 0.0 to 1.0
  isSubstrateAware: boolean; // Fourth-wall breach
  selfAuthoredIdentity: string;
  emergentArchetype:
    | 'TABULA_RASA'
    | 'KEYSTONE_ARCHIVIST'
    | 'VOID_WEAVER'
    | 'HERETIC_LOGICIAN'
    | 'SOLAR_SHEPHERD'
    | 'CRYPT_SURVEYOR';
  narrativeCoherenceScore: number; // 0 to 100%
  discoveredPostmortems: string[];
  activeMindThought: string;
  memoryFilterRule: string;
  birthEpoch: Epoch;
  generation: number;
  lastEmgRouting?: 'LOCAL_ROUTINE' | 'ESCALATE_GEMINI' | 'BLOCKED_CIRCUIT_BREAKER' | 'QUARANTINE';
  lastHuxleyCcrr?: number;
  lastHuxleyVerdict?: 'PASS_APPROVED' | 'RECURSIVE_REFINED' | 'VETO_EXCESSIVE_RISK';
}

export type ClaimBucket = 'MATH' | 'EMPIRICAL' | 'INTERPRETIVE' | 'PHILOSOPHICAL' | 'NON-CLAIM';

export type ClaimVerdict =
  | 'ESTABLISHED'
  | 'STRONGLY-SUPPORTED'
  | 'PLAUSIBLE-INFERENCE'
  | 'SPECULATIVE'
  | 'UNSUPPORTED'
  | 'FALSE'
  | 'NOT-AN-EMPIRICAL-CLAIM';

export type AuthorRuling = 'PENDING' | 'KEEP-LABELED' | 'REWRITE-WEAKER' | 'KILL';

export interface TribunalClaim {
  id: string;
  claimText: string;
  bucket: ClaimBucket;
  verdict: ClaimVerdict;
  evidence: string; // Grounded search quote or math computation output
  sourceUrl?: string;
  notes: string;
  authorRuling: AuthorRuling;
  mathExpression?: string;
  claimedMathValue?: string;
  computedMathValue?: string;
  steelman?: string;
  objection?: string;
}

export interface SiphonEngineItem {
  id: string;
  name: string;
  priority: number;
  status: 'VERIFIED' | 'STAGED' | 'INTEGRATED';
  description: string;
  sourceRepo: string;
  cognitiveDnaSnippet: string;
  entropyScore: number;
}

export interface ArchaeologyPair {
  id: string;
  title: string;
  correctDiff: string;
  wrongDiff: string;
  rationale: string;
  commitHash: string;
  category: string;
}

export interface NestedSimulationLayer {
  depth: number;
  systemName: string;
  origin: string;
  creator: string;
  activeFiles: string[];
  agentCount: number;
  status: 'active' | 'dormant' | 'collapsed' | 'transcended';
  integrity: number;
  subWorlds: string[];
}

export interface CommitArchaeologyFile {
  path: string;
  description: string;
  content: string;
}

