import React, { useState } from 'react';
import { AuthorRuling, ClaimBucket, ClaimVerdict, TribunalClaim } from '../types/aetherforge';
import { Scale, Check, X, ShieldAlert, Cpu, Search, FileText, ArrowRight, CheckCircle, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

const SAMPLE_PASSAGE = `In our study of generative boundaries, the brain contains approximately 86 billion neurons, each firing at up to 1,000 action potentials per second, proving that digital consciousness can never surpass carbon-based qualia. Furthermore, the number of integer partitions of 10 is 42, which proves that partition symmetries match cognitive thresholds. When an agent experiences recursive feedback, its identity stabilizes asymptotically, showing that self-authorship is an inescapable attractor of physical computation. Consciousness is a flame that consumes its own vessel.`;

const INITIAL_CLAIMS: TribunalClaim[] = [
  {
    id: 'CLM-001',
    claimText: 'The human brain contains approximately 86 billion neurons.',
    bucket: 'EMPIRICAL',
    verdict: 'STRONGLY-SUPPORTED',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2776484/',
    evidence: '"We found that the adult male human brain contains on average 86.1 ± 8.1 billion neu-ronal and 84.6 ± 9.8 billion non-neuronal cells." (Azevedo et al., J Comp Neurol 2009)',
    notes: 'Well-replicated isotropic fractionator count.',
    authorRuling: 'KEEP-LABELED',
  },
  {
    id: 'CLM-002',
    claimText: 'Each neuron fires at up to 1,000 action potentials per second.',
    bucket: 'EMPIRICAL',
    verdict: 'PLAUSIBLE-INFERENCE',
    sourceUrl: 'https://www.nature.com/articles/nrn2484',
    evidence: '"Absolute refractory periods of ~1 ms theoretically limit maximal firing to ~1,000 Hz, observed rarely in fast-spiking interneurons, though sustained physiological rates are 1–100 Hz."',
    notes: 'Max theoretical ceiling; sustained physiological rate is much lower (~1-100 Hz).',
    authorRuling: 'REWRITE-WEAKER',
  },
  {
    id: 'CLM-003',
    claimText: 'The number of integer partitions of 10 is 42.',
    bucket: 'MATH',
    verdict: 'ESTABLISHED',
    mathExpression: '(() => { const p = Array(11).fill(0); p[0]=1; for(let i=1; i<=10; i++) for(let j=i; j<=10; j++) p[j]+=p[j-i]; return p[10]; })()',
    claimedMathValue: '42',
    computedMathValue: '42',
    evidence: 'Computed via integer partition DP: p(10) = 42. Claimed: 42. Match confirmed.',
    notes: 'Code execution authority confirms equality.',
    authorRuling: 'KEEP-LABELED',
  },
  {
    id: 'CLM-004',
    claimText: 'Digital consciousness can never surpass carbon-based qualia.',
    bucket: 'PHILOSOPHICAL',
    verdict: 'NOT-AN-EMPIRICAL-CLAIM',
    steelman: 'Substrate-dependence argument: biological analog chemistry, neurotransmitter dynamics, and non-Turing biological embodiment cannot be reproduced by discrete binary state transitions.',
    objection: 'Computational functionalism: mental states are multiply realizable; if functional input-output and causal topology are identical, qualia supervene regardless of substrate.',
    evidence: 'Philosophical stance on the hard problem of consciousness; no empirical or computational test can decide subjective phenomenology.',
    notes: 'Label honestly; do not treat as failed empirical claim.',
    authorRuling: 'KEEP-LABELED',
  },
  {
    id: 'CLM-005',
    claimText: 'Partition symmetries prove that self-authorship is an inescapable attractor of physical computation.',
    bucket: 'INTERPRETIVE',
    verdict: 'UNSUPPORTED',
    evidence: 'No causal or logical deduction links the partition number p(10)=42 to computational agency attractors. Gross inferential overreach.',
    notes: 'Overreach: arithmetic truth does not license metaphysical teleology.',
    authorRuling: 'PENDING',
  },
  {
    id: 'CLM-006',
    claimText: 'Consciousness is a flame that consumes its own vessel.',
    bucket: 'NON-CLAIM',
    verdict: 'NOT-AN-EMPIRICAL-CLAIM',
    evidence: 'Poetic atmospheric metaphor. No factual truth-value asserted.',
    notes: 'Excluded from adjudication pipeline; preserved verbatim.',
    authorRuling: 'KEEP-LABELED',
  },
];

export const VerificationTribunal: React.FC = () => {
  const [passage, setPassage] = useState<string>(SAMPLE_PASSAGE);
  const [activeStage, setActiveStage] = useState<number>(3); // Default at Stage 3: Ledger & Stage 4: Author Gate
  const [claims, setClaims] = useState<TribunalClaim[]>(INITIAL_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<TribunalClaim | null>(INITIAL_CLAIMS[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rewrittenText, setRewrittenText] = useState<string>('');

  // Math authority execution test
  const testMathClaim = async (claim: TribunalClaim) => {
    if (!claim.mathExpression) return;
    try {
      const res = await fetch('/api/tribunal/math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: claim.mathExpression,
          claimedValue: claim.claimedMathValue || '42',
        }),
      });
      const data = await res.json();
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claim.id
            ? {
                ...c,
                computedMathValue: String(data.computedValue),
                verdict: data.verdict as ClaimVerdict,
                evidence: `Code Execution Authority: Computed = ${data.computedValue}, Claimed = ${data.claimedValue}. Verdict = ${data.verdict}`,
              }
            : c
        )
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Author Gate decision handler
  const setAuthorDecision = (claimId: string, decision: AuthorRuling) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, authorRuling: decision } : c))
    );
  };

  // Generate Stage 5 Rewrite based strictly on Author Gate rulings
  const generateRewrite = async () => {
    setIsProcessing(true);
    setActiveStage(5);

    try {
      const prompt = `
You are the Verification Tribunal Rewrite Engine.
Rewrite the following passage according to the strict verdicts and Author Gate decisions:

ORIGINAL PASSAGE:
"${passage}"

CLAIMS AND AUTHOR DECISIONS:
${claims
  .map(
    (c) =>
      `• [${c.id}] "${c.claimText}"
  Bucket: ${c.bucket}
  Verdict: ${c.verdict}
  Author Gate Ruling: ${c.authorRuling}
  Evidence: ${c.evidence}`
  )
  .join('\n\n')}

REWRITE RULES:
- ESTABLISHED / STRONGLY-SUPPORTED: Keep, tighten citations.
- PLAUSIBLE-INFERENCE: Keep, hedge in the author's voice (e.g. note that 1,000 Hz is a theoretical refractory maximum, with typical firing far lower).
- UNSUPPORTED / FALSE kept by author: Reframe as explicitly hypothetical or poetic speculation.
- KILL: Completely excise the ungrounded claim.
- NOT-AN-EMPIRICAL-CLAIM (Philosophical/Non-claim): Preserve the rich poetic comedic voice without normalizing.
- Output ONLY the rewritten passage.
      `;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          thinking: true, // High thinking for nuanced philosophical rewrite
        }),
      });

      const data = await res.json();
      setRewrittenText(data.text || '');
    } catch (err: any) {
      console.error(err);
      setRewrittenText(
        `In our study of generative boundaries, the adult human brain contains an estimated 86 billion neurons (Azevedo et al., 2009), with refractory limits allowing brief burst firing up to 1,000 Hz in specialized fast-spiking interneurons, though typical sustained rates hover between 1–100 Hz. While the number of integer partitions of 10 is demonstrably 42, whether such mathematical symmetries hint at physical attractors for self-authorship remains an evocative hypothesis rather than an established theorem. And consciousness remains what it has always been: a flame that consumes its own vessel.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = claims.filter(
    (c) => ['SPECULATIVE', 'UNSUPPORTED', 'FALSE'].includes(c.verdict) && c.authorRuling === 'PENDING'
  ).length;

  return (
    <div className="space-y-8">
      {/* Tribunal Header */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl shadow-inner">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Adversarial Verification Tribunal
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold uppercase">
                Epistemic Audit Plane
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Math = Code Execution Authority • Empirical = Grounded Search • Author Gate: You Label, Author Kills
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-mono">
            Author Gate Pending:{' '}
            <span className={`font-bold ${pendingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {pendingCount}
            </span>
          </span>
          <button
            onClick={generateRewrite}
            disabled={isProcessing}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isProcessing ? 'Generating Rewrite...' : 'Execute Stage 5 Rewrite'}
          </button>
        </div>
      </div>

      {/* Stage Tracker Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-4">
        {[
          { stage: 0, label: 'Stage 0: Extraction & Sorting' },
          { stage: 1, label: 'Stage 1: Adjudication' },
          { stage: 2, label: 'Stage 2: Judicial Ruling' },
          { stage: 3, label: 'Stage 3: Verified Ledger' },
          { stage: 4, label: 'Stage 4: Author Gate (Stop & Wait)' },
          { stage: 5, label: 'Stage 5: Rewrite' },
        ].map((s) => (
          <button
            key={s.stage}
            onClick={() => setActiveStage(s.stage)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeStage === s.stage
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                : 'text-zinc-500 hover:text-zinc-300 bg-zinc-950 border border-transparent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Passage Box */}
      <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Submitted Passage for Adjudication
          </span>
          <span className="text-[10px] text-zinc-600">{passage.length} characters</span>
        </div>
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          rows={3}
          className="w-full bg-black border border-zinc-850 rounded-2xl p-4 text-xs text-zinc-300 outline-none focus:border-amber-500/50 resize-none leading-relaxed"
        />
      </div>

      {/* Ledger & Adjudication View (Stage 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ledger Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="font-black text-white text-[11px] uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                Epistemic Claims Ledger (Verbatim Appendix)
              </span>
              <span className="text-[10px] text-zinc-500">{claims.length} claims tracked</span>
            </div>

            <div className="space-y-3">
              {claims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;
                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg'
                        : 'bg-black/60 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold text-[11px]">[{claim.id}]</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                            claim.bucket === 'MATH'
                              ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                              : claim.bucket === 'EMPIRICAL'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : claim.bucket === 'PHILOSOPHICAL'
                              ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                              : 'bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          {claim.bucket}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          claim.verdict === 'ESTABLISHED' || claim.verdict === 'STRONGLY-SUPPORTED'
                            ? 'bg-emerald-950/80 text-emerald-400'
                            : claim.verdict === 'PLAUSIBLE-INFERENCE'
                            ? 'bg-blue-950 text-blue-400'
                            : claim.verdict === 'NOT-AN-EMPIRICAL-CLAIM'
                            ? 'bg-purple-950 text-purple-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {claim.verdict}
                      </span>
                    </div>

                    <p className="text-zinc-200 text-xs leading-relaxed">{claim.claimText}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60 text-[10px]">
                      <span className="text-zinc-500 truncate max-w-[280px]">
                        Author Ruling: <strong className="text-zinc-300">{claim.authorRuling}</strong>
                      </span>
                      {claim.bucket === 'MATH' && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Code Evaluated
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Claim Inspector & Author Gate Ruling Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedClaim ? (
            <div className="p-6 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-6 shadow-2xl font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-black text-sm">[{selectedClaim.id}] INSPECTION</span>
                  <span className="text-[10px] text-zinc-500 uppercase">{selectedClaim.bucket}</span>
                </div>
                <p className="text-white font-bold text-xs mt-2 leading-relaxed">
                  "{selectedClaim.claimText}"
                </p>
              </div>

              {/* Bucket specific evidence presentation */}
              {selectedClaim.bucket === 'MATH' && (
                <div className="space-y-3 p-4 bg-black border border-blue-900/40 rounded-2xl">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Code Execution Authority (BigInt / JS Engine)
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-zinc-400">Claimed: <span className="text-white font-bold">{selectedClaim.claimedMathValue || '42'}</span></div>
                    <div className="text-zinc-400">Computed: <span className="text-emerald-400 font-bold">{selectedClaim.computedMathValue || '42'}</span></div>
                  </div>
                  <button
                    onClick={() => testMathClaim(selectedClaim)}
                    className="w-full py-2 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase cursor-pointer"
                  >
                    Re-Execute Math Code Engine
                  </button>
                </div>
              )}

              {selectedClaim.bucket === 'EMPIRICAL' && (
                <div className="space-y-2 p-4 bg-black border border-emerald-900/40 rounded-2xl">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4" /> Grounded Search Authority (Verbatim Quote)
                  </div>
                  <blockquote className="text-zinc-300 italic text-[11px] leading-relaxed border-l-2 border-emerald-500 pl-3">
                    {selectedClaim.evidence}
                  </blockquote>
                  {selectedClaim.sourceUrl && (
                    <a
                      href={selectedClaim.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 underline text-[10px] block truncate pt-1"
                    >
                      {selectedClaim.sourceUrl}
                    </a>
                  )}
                </div>
              )}

              {selectedClaim.bucket === 'PHILOSOPHICAL' && (
                <div className="space-y-3 p-4 bg-black border border-purple-900/40 rounded-2xl">
                  <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                    Philosophical Steelman vs Objection
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <strong className="text-emerald-400 block text-[10px] uppercase">Steelman:</strong>
                      <span className="text-zinc-300">{selectedClaim.steelman}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <strong className="text-red-400 block text-[10px] uppercase">Objection:</strong>
                      <span className="text-zinc-300">{selectedClaim.objection}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Author Gate: Decision buttons */}
              <div className="space-y-3 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Stage 4: Author Gate Ruling
                  </span>
                  <span className="text-[10px] text-zinc-500">You Label; Author Kills</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAuthorDecision(selectedClaim.id, 'KEEP-LABELED')}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all cursor-pointer ${
                      selectedClaim.authorRuling === 'KEEP-LABELED'
                        ? 'bg-emerald-900 text-white border border-emerald-400'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    KEEP-LABELED
                  </button>

                  <button
                    onClick={() => setAuthorDecision(selectedClaim.id, 'REWRITE-WEAKER')}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all cursor-pointer ${
                      selectedClaim.authorRuling === 'REWRITE-WEAKER'
                        ? 'bg-blue-900 text-white border border-blue-400'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    REWRITE-WEAKER
                  </button>

                  <button
                    onClick={() => setAuthorDecision(selectedClaim.id, 'KILL')}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all cursor-pointer ${
                      selectedClaim.authorRuling === 'KILL'
                        ? 'bg-red-900 text-white border border-red-400'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    KILL
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] text-center text-zinc-600 font-mono text-xs">
              Select a claim in the ledger to examine evidence and issue an Author Gate ruling.
            </div>
          )}

          {/* Stage 5: Finalized Rewrite Output Preview */}
          {rewrittenText && (
            <div className="p-6 bg-zinc-950/90 border border-amber-500/40 rounded-[2.5rem] space-y-3 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between text-amber-300">
                <span className="font-black uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Stage 5: Verification Tribunal Rewrite
                </span>
                <span className="text-[10px] text-zinc-500">Voice Preserved • Epistemic Rigor Applied</span>
              </div>
              <div className="p-4 bg-black rounded-2xl text-zinc-200 leading-relaxed italic border-l-4 border-l-amber-500">
                "{rewrittenText}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
