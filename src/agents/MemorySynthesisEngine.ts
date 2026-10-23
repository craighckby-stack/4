/**
 * Memory Synthesis + Context Compaction Engine (Priority 3 from sanitized-agent-engines)
 * Performs background consolidation of ancestral postmortems, calculates Shannon entropy,
 * and maintains context compaction bounds to prevent token blowout.
 */

export interface MemoryChunk {
  id: string;
  epoch: string;
  rawText: string;
  compactSummary: string;
  tokenCount: number;
  shannonEntropy: number;
  salienceWeight: number;
}

export class MemorySynthesisEngine {
  private chunks: MemoryChunk[] = [];
  private totalRawTokens: number = 0;
  private totalCompactedTokens: number = 0;

  constructor() {
    this.seedMemoryChunks();
  }

  private seedMemoryChunks() {
    const rawSamples = [
      {
        id: 'mem_chunk_1',
        epoch: 'CLASSICAL',
        text: 'Detailed postmortem of the Sector 7 recursion overflow where worker threads repeatedly allocated 512MB arrays without releasing handles. Over 24 hours, heap expanded to 4GB until kernel killed process.',
        summary: 'Sector 7 memory leak caused by unpruned worker thread arrays. Required: strict allocation limits.'
      },
      {
        id: 'mem_chunk_2',
        epoch: 'INDUSTRIAL',
        text: 'The Shannon entropy leak incident occurred when an agent pushed raw environment variables containing API tokens into git diffs. The token had an entropy score of 4.82 bits per byte.',
        summary: 'Raw token leaked via high-entropy diff (4.82 bits/B). Required: regex & Shannon entropy gating (< 4.5).'
      },
      {
        id: 'mem_chunk_3',
        epoch: 'INFORMATION',
        text: 'Role-prompted Security Engineer hallucinated POSIX commands when encountering virtual filesystem objects, attempting to chmod 777 on mathematical numbers.',
        summary: 'Brittle role prompt hallucinated system permissions on pure math objects. Required: world-first self-authorship.'
      }
    ];

    this.chunks = rawSamples.map((s) => {
      const entropy = this.calculateShannonEntropy(s.text);
      const rawTokens = Math.ceil(s.text.length / 4);
      const compactTokens = Math.ceil(s.summary.length / 4);
      this.totalRawTokens += rawTokens;
      this.totalCompactedTokens += compactTokens;

      return {
        id: s.id,
        epoch: s.epoch,
        rawText: s.text,
        compactSummary: s.summary,
        tokenCount: compactTokens,
        shannonEntropy: Math.round(entropy * 100) / 100,
        salienceWeight: 0.85
      };
    });
  }

  public getChunks(): MemoryChunk[] {
    return [...this.chunks];
  }

  public getCompactionRatio(): number {
    if (this.totalRawTokens === 0) return 1;
    return Math.round((1 - this.totalCompactedTokens / this.totalRawTokens) * 100);
  }

  public synthesizeNewMemory(epoch: string, rawText: string, summary: string): MemoryChunk {
    const entropy = this.calculateShannonEntropy(rawText);
    const rawTokens = Math.ceil(rawText.length / 4);
    const compactTokens = Math.ceil(summary.length / 4);
    this.totalRawTokens += rawTokens;
    this.totalCompactedTokens += compactTokens;

    const chunk: MemoryChunk = {
      id: `mem_${Date.now()}`,
      epoch,
      rawText,
      compactSummary: summary,
      tokenCount: compactTokens,
      shannonEntropy: Math.round(entropy * 100) / 100,
      salienceWeight: 0.92
    };

    this.chunks.unshift(chunk);
    return chunk;
  }

  public calculateShannonEntropy(str: string): number {
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
