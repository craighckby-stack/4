# Commit Archaeology Engine

> **The Living Exemplar Ledger of RIGHT (CORRECT) vs WRONG (ERRANT) Code Patterns**  
> Repository: `https://github.com/craighckby-stack/commit-archaeology`  
> Part of the AetherForge Ω Autonomous Intelligence & Verification Architecture

[![Status: Production](https://img.shields.io/badge/Status-Verified-10B981.svg)](#)
[![Format: RIGHT_vs_WRONG](https://img.shields.io/badge/Ledger-RIGHT__vs__WRONG-3B82F6.svg)](#)
[![Lineage: SHA256](https://img.shields.io/badge/Lineage-Chained-7928CA.svg)](#)

---

## 1. What is Commit Archaeology?

Traditional software engineering relies on abstract style guides and static linters that cannot explain *why* an architectural choice was made.

**Commit Archaeology replaces abstract moralism (good vs evil) with rigorous technical verification: RIGHT vs WRONG.**

```
                           ┌───────────────────────────────┐
                           │    Commit-Puller Ingestion    │
                           │  (Verbatim Git Unified Diffs) │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │     Archaeology Classifier    │
                           │     Splits Diff into Pairs    │
                           └───────────────┬───────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌────────────────────────┐                    ┌────────────────────────┐
       │     RIGHT (CORRECT)    │                    │     WRONG (ERRANT)     │
       │  Sound Invariant Code  │                    │  Dangerous Anti-Pattern│
       │  Gated Authorization   │                    │  Unchecked Actuation   │
       │  Chained Parent Hashes │                    │  Silent Failure Loops  │
       └────────────────────────┘                    └────────────────────────┘
```

Every entry in the archaeology ledger is an **ArchaeologyPair**:
1. **Title & Category**: Precise architectural context.
2. **WRONG (Errant Anti-Pattern)**: The code that failed, leaked state, broke lineage, or introduced vulnerabilities.
3. **RIGHT (Correct Invariant)**: The hardened, verified implementation that resolved the defect.
4. **Rationale**: Deep engineering causality explaining why the WRONG code failed and why the RIGHT code holds.

---

## 2. Shared Data Contract: `ArchaeologyPair`

```typescript
export interface ArchaeologyPair {
  id: string;                               // e.g. "ARCH-01"
  commitHash: string;                       // e.g. "c6dba47b"
  category: string;                         // e.g. "Final Authority"
  title: string;                            // e.g. "Deterministic Authorization Separation"
  rationale: string;                        // Causality rationale
  correctDiff: string;                      // The RIGHT code snippet
  wrongDiff: string;                        // The WRONG code snippet
  timestamp: string;                        // ISO timestamp
  tags: string[];                           // ['security', 'authority', 'sandbox']
  verificationStatus: 'VERIFIED' | 'PROMOTED' | 'QUARANTINED';
}
```

---

## 3. Core Exemplar Catalog

### Exemplar 01: Authority Decoupling
- **WRONG**: Probabilistic agent self-evaluates whether its own action is safe.
- **RIGHT**: External deterministic Final Authority evaluates proposal and returns explicit `ALLOW` or `VETO`.

### Exemplar 02: Cryptographic Lineage
- **WRONG**: Naive timestamp ordering that allows silent historical overwrites.
- **RIGHT**: Chained SHA-256 lineage `State[n+1] = SHA-256(parentHash + serializedState)`.

### Exemplar 03: Shannon Entropy Sanitization
- **WRONG**: Plaintext commit of tokens relying on programmer vigilance.
- **RIGHT**: Automated Shannon entropy scan ($< 4.5\text{ bits/B}$) and regex token redaction before staging.

### Exemplar 04: Self-Stopping Circuit Breakers
- **WRONG**: Unbounded `while(running)` loops that drain compute when tasks diverge.
- **RIGHT**: Step-budgeted execution with hard circuit breakers and test-preservation assertions.

---

## 4. How AetherForge Ω Uses Commit Archaeology

```
Mutation Proposal (Free-Thinker)
           │
           ▼
Compare Proposal against Commit Archaeology Ledger
           │
    ┌──────┴───────────────────────────┐
    │                                  │
    ▼                                  ▼
Matches WRONG Pattern?         Matches RIGHT Pattern?
    │                                  │
    ▼                                  ▼
EMG VETO + Rationale Feedback     EMG ALLOW + Lineage Staking
```

When a proposal is submitted:
1. It is scanned against the WRONG anti-pattern corpus. If it matches a known failure mode, it is immediately vetoed with the historical rationale.
2. It is matched against the RIGHT exemplar corpus to score architectural compliance.
3. If an approved mutation subsequently fails in production, the failure is serialized as a **new ArchaeologyPair** and fed back into the ledger.

---

## 5. Usage

```bash
# Install dependencies
npm install

# Run the Archaeology Engine CLI
npm run audit -- --file src/engine/proposal.ts

# Harvest commits from a GitHub repository
npm run harvest -- --repo craighckby-stack/sanitized-agent-engines
```
