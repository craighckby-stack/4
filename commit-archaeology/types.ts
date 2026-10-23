/**
 * Commit Archaeology Engine Types
 * Repository: https://github.com/craighckby-stack/commit-archaeology
 *
 * Replaces moralistic/theological binaries with technical verification:
 * RIGHT (CORRECT / Sound Invariant) vs WRONG (ERRANT / Anti-Pattern)
 */

export interface ArchaeologyPair {
  id: string;
  commitHash: string;
  category: 'Final Authority' | 'Memory Lineage' | 'Entropy Sanitization' | 'Concurrency' | 'Self-Stopping' | 'AST Security';
  title: string;
  rationale: string;
  correctDiff: string;
  wrongDiff: string;
  timestamp: string;
  tags: string[];
  verificationStatus: 'VERIFIED' | 'PROMOTED' | 'QUARANTINED';
}

export interface CommitSnapshot {
  commitHash: string;
  author: string;
  date: string;
  message: string;
  rawDiff: string;
  filesChanged: string[];
  classifiedPairs: ArchaeologyPair[];
}

export interface ArchaeologyEvaluationResult {
  proposalId: string;
  verdict: 'RIGHT' | 'WRONG';
  confidenceScore: number;
  matchedPairs: {
    pairId: string;
    similarity: number;
    exemplarType: 'CORRECT_MATCH' | 'WRONG_MATCH';
    rationale: string;
  }[];
  recommendations: string[];
  timestamp: number;
}
