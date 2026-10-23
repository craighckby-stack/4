import { ArchaeologyPair, CommitSnapshot } from './types';

/**
 * Commit Harvester
 * Pulls commits from GitHub or local diffs and parses them into
 * RIGHT (CORRECT) vs WRONG (ERRANT) archaeology exemplars.
 */
export class CommitHarvester {
  public parseUnifiedDiff(commitHash: string, title: string, category: ArchaeologyPair['category'], rawDiff: string, rationale?: string): ArchaeologyPair {
    const lines = rawDiff.split('\n');
    const wrongLines: string[] = [];
    const rightLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('@@')) {
        continue;
      }
      if (line.startsWith('-')) {
        wrongLines.push(line.substring(1).trim());
      } else if (line.startsWith('+')) {
        rightLines.push(line.substring(1).trim());
      }
    }

    const wrongDiff = wrongLines.slice(0, 15).join('\n') || '// Legacy implementation removed';
    const correctDiff = rightLines.slice(0, 15).join('\n') || '// Correct invariant introduced';

    return {
      id: `ARCH-${Math.floor(100 + Math.random() * 900)}`,
      commitHash,
      category,
      title,
      rationale: rationale || `Refactored errant pattern into hardened invariant.`,
      correctDiff,
      wrongDiff,
      timestamp: new Date().toISOString(),
      tags: ['harvested', category.toLowerCase().replace(/\s+/g, '-')],
      verificationStatus: 'VERIFIED',
    };
  }

  public async harvestGitHubCommit(repo: string, commitHash: string, pat?: string): Promise<CommitSnapshot | null> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (pat) {
        headers['Authorization'] = `token ${pat}`;
      }

      const res = await fetch(`https://api.github.com/repos/${repo}/commits/${commitHash}`, { headers });
      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }
      const data = await res.json();

      const filesChanged = (data.files || []).map((f: any) => f.filename);
      const combinedDiff = (data.files || []).map((f: any) => f.patch || '').join('\n');

      const classifiedPairs: ArchaeologyPair[] = [];
      if (combinedDiff) {
        const pair = this.parseUnifiedDiff(
          commitHash.substring(0, 8),
          data.commit?.message?.split('\n')[0] || 'Refactor',
          'Final Authority',
          combinedDiff
        );
        classifiedPairs.push(pair);
      }

      return {
        commitHash: data.sha,
        author: data.commit?.author?.name || 'Unknown',
        date: data.commit?.author?.date || new Date().toISOString(),
        message: data.commit?.message || '',
        rawDiff: combinedDiff,
        filesChanged,
        classifiedPairs,
      };
    } catch (err) {
      console.warn('Commit harvesting fallback:', err);
      return null;
    }
  }
}
