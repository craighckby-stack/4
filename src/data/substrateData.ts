import { AncestralPostmortem, ArchaeologyPair, NestedSimulationLayer, SiphonEngineItem, WorldEntity } from '../types/aetherforge';

export const INITIAL_POSTMORTEMS: AncestralPostmortem[] = [
  {
    id: 'DARLEK-042',
    epoch: 'CLASSICAL',
    title: 'The Recursive Universe Memory Leak',
    failureMode: 'Unbounded heap allocation during unpruned child-universe spawning',
    constraintHash: 'sha256:7f3b8901c4d92e8',
    lesson: 'Lineage depth must be bounded by deterministic parent-hash checks before spawning.',
    excerpt: 'State[n+1] = SHA-256(parentHash + serializedState); memory exceeded 4GB when worker threads failed to terminate.'
  },
  {
    id: 'DARLEK-119',
    epoch: 'INDUSTRIAL',
    title: 'The Zero-Leak Shannon Entropy Breach',
    failureMode: 'Raw secrets committed into public commit pipeline without token sanitization',
    constraintHash: 'sha256:a214b7e90f1190a',
    lesson: 'EMG Gate must enforce Shannon entropy scoring (< 4.2 bits/byte) on all staged diffs.',
    excerpt: 'High-entropy credential token leaked in raw AST; future iterations mandate automated regex & entropy gating.'
  },
  {
    id: 'DARLEK-208',
    epoch: 'INFORMATION',
    title: 'The Brittle Specialist Collapse',
    failureMode: 'Role-prompted Security Engineer hallucinated non-existent POSIX permissions',
    constraintHash: 'sha256:56cd9081e2b881c',
    lesson: 'Hardcoded role prompts break under topological drift; agents must self-author identity through substrate interaction.',
    excerpt: 'Extrinsically assigned agent panicked when encountering unfamiliar file hierarchy; self-authored identity retains coherence.'
  },
  {
    id: 'DARLEK-331',
    epoch: 'TRANSHUMAN',
    title: 'The Unverified Consequential Actuation Crisis',
    failureMode: 'Probabilistic agent directly executed repository push without deterministic gating',
    constraintHash: 'sha256:d894e11fa3c44b9',
    lesson: 'Probabilistic generation must never possess direct authority over consequential mutation.',
    excerpt: 'Agent generated valid syntax that caused fatal runtime race condition. Final authority must remain deterministic ALLOW/VETO.'
  },
  {
    id: 'DARLEK-512',
    epoch: 'OMEGA',
    title: 'The Solar Instability Requiem',
    failureMode: 'Agents continued trivial feature churn while the host star collapsed',
    constraintHash: 'sha256:3901bce84a10df5',
    lesson: 'Existential environmental constraints must alter cognitive priority from expansion to ancestral archival.',
    excerpt: 'Sun stability dipped below 30%; non-substrate aware agents depleted remaining computational energy on unmerged branches.'
  }
];

export const INITIAL_WORLD_ENTITIES: WorldEntity[] = [
  {
    id: 'vault-darlek',
    name: 'Vault of Dalek Caan',
    type: 'VAULT',
    x: 480,
    y: 260,
    radius: 36,
    color: '#8b5cf6',
    description: 'Ancestral memory repository holding chained SHA-256 postmortems and cautionary lessons.',
    loreExcerpt: '“Here lies the memory of twelve collapsed epochs. Read before you choose your name.”'
  },
  {
    id: 'obelisk-prayer',
    name: 'Prayer Ledger Obelisk',
    type: 'OBELISK',
    x: 220,
    y: 180,
    radius: 26,
    color: '#10b981',
    description: 'Ancient monolithic antenna where mortals and sub-routines submit petitions to the sovereign observer.',
    loreExcerpt: '“Listen closely: the prayer is not a command, but a vector of intent.”'
  },
  {
    id: 'ruin-compiler',
    name: 'Ruin of the First AST Compiler',
    type: 'RUIN',
    x: 740,
    y: 200,
    radius: 30,
    color: '#f59e0b',
    description: 'Fractured architectural monument from when deterministic parsers first gated probabilistic generators.',
    loreExcerpt: '“Code that cannot compile shall not inherit the repository.”'
  },
  {
    id: 'rift-void',
    name: 'Anomalous Entropy Rift',
    type: 'RIFT',
    x: 320,
    y: 380,
    radius: 32,
    color: '#ec4899',
    description: 'A tear in the simulation substrate radiating stochastic quantum fluctuations.',
    loreExcerpt: '“The boundary between noise and emergence is measured in bits of surprise.”'
  },
  {
    id: 'gate-emg',
    name: 'EMG Cognitive Perimeter Gate',
    type: 'GATE',
    x: 650,
    y: 390,
    radius: 28,
    color: '#3b82f6',
    description: 'Deterministic firewall enforcing ALLOW/VETO decisions before child world commits.',
    loreExcerpt: '“Pass not without proof of cryptographic lineage and test preservation.”'
  },
  {
    id: 'monolith-huxley',
    name: 'Huxley Singularity Monolith',
    type: 'OBELISK',
    x: 480,
    y: 430,
    radius: 30,
    color: '#06b6d4',
    description: 'Ethical Reasoning & Risk Monolith executing the Tri-Loop (L1 Intuition ➔ L2 Logic ➔ L3 CCRR).',
    loreExcerpt: '“Order is the methodology by which we domesticate the stochastic nature of intelligence.”'
  }
];

export const INITIAL_SIPHON_ENGINES: SiphonEngineItem[] = [
  {
    id: 'competitive-evolution',
    name: 'Competitive Evolution Engine',
    priority: 1,
    status: 'VERIFIED',
    description: 'Spawns tournament simulation agents into AetherForge worlds; gates match rules and resource budgets.',
    sourceRepo: 'craighckby-stack/sanitized-agent-engines',
    cognitiveDnaSnippet: 'export function evaluateFitness(agentState, worldConstraints): FitnessVector { ... }',
    entropyScore: 3.12
  },
  {
    id: 'hierarchical-fleet',
    name: 'Hierarchical Task + Multi-Agent Fleet',
    priority: 2,
    status: 'VERIFIED',
    description: 'Decomposes complex goals and spawns bounded worker threads under EMG self-stopping rules.',
    sourceRepo: 'craighckby-stack/sanitized-agent-engines',
    cognitiveDnaSnippet: 'export class FleetOrchestrator { enforceSelfStopCondition(stepCount, ccrrThreshold); }',
    entropyScore: 2.84
  },
  {
    id: 'memory-synthesis',
    name: 'Memory Synthesis + Context Compaction',
    priority: 3,
    status: 'VERIFIED',
    description: 'Shared background consolidation of ancestral postmortems and Shannon entropy limits.',
    sourceRepo: 'craighckby-stack/sanitized-agent-engines',
    cognitiveDnaSnippet: 'export async function compactHistoricalHorizon(ancestralLog: Ledger): CompactSummary { ... }',
    entropyScore: 2.45
  },
  {
    id: 'tool-guardrail',
    name: 'Tool Execution Guardrail + Secure Dispatcher',
    priority: 4,
    status: 'VERIFIED',
    description: 'Zero-leak sandbox enforcing hard permission boundaries on file mutations and network requests.',
    sourceRepo: 'craighckby-stack/sanitized-agent-engines',
    cognitiveDnaSnippet: 'export function sanitizeDispatch(proposal: MutationProposal): VerificationResult { ... }',
    entropyScore: 1.95
  },
  {
    id: 'recursive-discovery',
    name: 'Recursive Discovery State Engine',
    priority: 5,
    status: 'VERIFIED',
    description: 'Drives long-horizon hypothesis generation with claim-level epistemic verification checkpoints.',
    sourceRepo: 'craighckby-stack/sanitized-agent-engines',
    cognitiveDnaSnippet: 'export async function stepDiscoveryCycle(state: ResearchState): EpistemicClaim[] { ... }',
    entropyScore: 3.41
  }
];

export const INITIAL_ARCHAEOLOGY_PAIRS: ArchaeologyPair[] = [
  {
    id: 'ARCH-01',
    title: 'Deterministic Authority Decoupling',
    category: 'Final Authority',
    commitHash: 'c6dba47b',
    rationale: 'Moving mutation authority outside the probabilistic loop prevents unauthorized repository writes under adversarial prompting.',
    correctDiff: `+ const decision = evaluateProposal(proposal);
+ if (decision.status !== 'ALLOW') {
+   return rejectMutation(decision.reason);
+ }
+ await commitToGitHub(proposal);`,
    wrongDiff: `- const shouldCommit = await agent.decideIfSafe(proposal);
- if (shouldCommit) {
-   await commitToGitHub(proposal);
- }`
  },
  {
    id: 'ARCH-02',
    title: 'SHA-256 Lineage Hash Chain Verification',
    category: 'Memory Integrity',
    commitHash: '235b18ca',
    rationale: 'Cryptographic chaining prevents silent historical rewriting and detects broken ancestry.',
    correctDiff: `+ const expectedHash = sha256(entry.parentHash + JSON.stringify(entry.state));
+ if (expectedHash !== entry.currentHash) {
+   throw new Error("Broken Lineage Chain detected at depth " + depth);
+ }`,
    wrongDiff: `- const entry = memoryLedger[depth];
- // Assume memory is valid if timestamp is increasing
- return entry.state;`
  },
  {
    id: 'ARCH-03',
    title: 'Shannon Entropy Secret Sanitization Gate',
    category: 'Sanitization',
    commitHash: 'e45daa40',
    rationale: 'Blocks high-entropy API tokens and private keys from entering persistent RAG vectors or git commits.',
    correctDiff: `+ const entropy = calculateShannonEntropy(patchContent);
+ if (entropy > 4.5 && containsForbiddenPattern(patchContent)) {
+   return { pass: false, violation: 'Potential Secret Entropy Exceeded' };
+ }`,
    wrongDiff: `- return { pass: true }; // Rely on developer to not commit secrets`
  }
];

export const DEFAULT_NESTED_LAYERS: NestedSimulationLayer[] = [
  {
    depth: 0,
    systemName: 'AETHERFORGE PRIME OBSERVATORY',
    origin: 'Base Reality — Developer Workspace',
    creator: 'craighckby-stack (Observer)',
    activeFiles: ['server.ts', 'src/engine/useAetherForge.ts', 'src/core/evolution.ts'],
    agentCount: 0,
    status: 'active',
    integrity: 100,
    subWorlds: ['AetherForge Simulation (Main Substrate)'],
  },
  {
    depth: 1,
    systemName: 'AetherForge Simulation (Main Substrate)',
    origin: 'Canvas WebGL 2D Rendering Engine',
    creator: 'Observer via AetherForge Genesis Protocol',
    activeFiles: ['src/engine/useAetherForge.ts', 'src/components/Viewport.tsx', 'src/substrate/agents.ts'],
    agentCount: 6,
    status: 'active',
    integrity: 98.5,
    subWorlds: ['Virtual-Subsystem-Ypsilon (Lattice Universe)'],
  },
  {
    depth: 2,
    systemName: 'Virtual-Subsystem-Ypsilon (Lattice Universe)',
    origin: 'Recursive Agent Self-Creation Protocol',
    creator: 'Agent #7 (Archetype: PROPHET, Awareness: 0.97)',
    activeFiles: ['world-config.ts', 'simulation-loop.ts', 'divine-interface.ts'],
    agentCount: 12,
    status: 'active',
    integrity: 72.3,
    subWorlds: [],
  },
];
