import { ArchaeologyEvaluationResult, ArchaeologyPair } from './types';
import ledgerData from './archaeology_ledger.json';

/**
 * Archaeology Engine
 * Evaluates code proposals and diffs against the RIGHT (CORRECT) vs WRONG (ERRANT) exemplar corpus.
 */
export class ArchaeologyEngine {
  private pairs: ArchaeologyPair[] = [];

  constructor(initialPairs?: ArchaeologyPair[]) {
    this.pairs = initialPairs || (ledgerData as ArchaeologyPair[]);
  }

  public getPairs(): ArchaeologyPair[] {
    return [...this.pairs];
  }

  public getPairsByCategory(category: string): ArchaeologyPair[] {
    return this.pairs.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  public registerPair(pair: ArchaeologyPair): void {
    this.pairs.unshift(pair);
  }

  /**
   * Evaluates a code proposal against both RIGHT and WRONG corpora.
   * If the code matches a WRONG pattern, it fails.
   * If it implements the RIGHT pattern, it passes with verified confidence.
   */
  public evaluateProposal(proposalId: string, codeSnippet: string): ArchaeologyEvaluationResult {
    const matches: ArchaeologyEvaluationResult['matchedPairs'] = [];
    const recommendations: string[] = [];
    let isWrongDetected = false;

    for (const pair of this.pairs) {
      // Check for presence of wrong patterns
      const wrongTokens = this.extractDistinctTokens(pair.wrongDiff);
      const wrongMatchCount = wrongTokens.filter((token) => codeSnippet.includes(token)).length;
      const wrongSimilarity = wrongTokens.length > 0 ? wrongMatchCount / wrongTokens.length : 0;

      if (wrongSimilarity > 0.5) {
        isWrongDetected = true;
        matches.push({
          pairId: pair.id,
          similarity: Math.round(wrongSimilarity * 100) / 100,
          exemplarType: 'WRONG_MATCH',
          rationale: pair.rationale,
        });
        recommendations.push(
          `Detected anti-pattern matching ${pair.id} (${pair.title}). Required fix: ${pair.rationale}`
        );
      }

      // Check for presence of right patterns
      const rightTokens = this.extractDistinctTokens(pair.correctDiff);
      const rightMatchCount = rightTokens.filter((token) => codeSnippet.includes(token)).length;
      const rightSimilarity = rightTokens.length > 0 ? rightMatchCount / rightTokens.length : 0;

      if (rightSimilarity > 0.4) {
        matches.push({
          pairId: pair.id,
          similarity: Math.round(rightSimilarity * 100) / 100,
          exemplarType: 'CORRECT_MATCH',
          rationale: `Correctly conforms to verified invariant ${pair.id}.`,
        });
      }
    }

    const verdict = isWrongDetected ? 'WRONG' : 'RIGHT';
    const confidenceScore = isWrongDetected ? 0.95 : 0.88;

    return {
      proposalId,
      verdict,
      confidenceScore,
      matchedPairs: matches,
      recommendations,
      timestamp: Date.now(),
    };
  }

  private extractDistinctTokens(code: string): string[] {
    return code
      .split(/[\s();{},]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 4 && !['const', 'return', 'function', 'import', 'export'].includes(t));
  }
}
