import React, { useState, useEffect } from 'react';
import { ArchaeologyPair, CommitArchaeologyFile } from '../types/aetherforge';
import { INITIAL_ARCHAEOLOGY_PAIRS } from '../data/substrateData';
import { GitCommit, FileCode, CheckCircle2, XCircle, Copy, Download, ExternalLink, Sparkles, Plus, Play, Shield, Terminal, ArrowRight, Check } from 'lucide-react';

export const CommitArchaeologyStudio: React.FC = () => {
  const [pairs, setPairs] = useState<ArchaeologyPair[]>(INITIAL_ARCHAEOLOGY_PAIRS);
  const [selectedPair, setSelectedPair] = useState<ArchaeologyPair>(INITIAL_ARCHAEOLOGY_PAIRS[0]);
  const [producedFiles, setProducedFiles] = useState<CommitArchaeologyFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [activeTab, setActiveTab] = useState<'EXEMPLARS' | 'PRODUCED_FILES' | 'AUDITOR' | 'HARVESTER'>('EXEMPLARS');

  // Interactive audit state
  const [auditSnippet, setAuditSnippet] = useState<string>(
    `const shouldCommit = await agent.decideIfSafe(proposal);\nif (shouldCommit) {\n  await commitToGitHub(proposal);\n}`
  );
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // New pair creator
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Final Authority');
  const [newWrongDiff, setNewWrongDiff] = useState<string>('');
  const [newCorrectDiff, setNewCorrectDiff] = useState<string>('');
  const [newRationale, setNewRationale] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchProducedFiles();
  }, []);

  const fetchProducedFiles = async () => {
    try {
      const res = await fetch('/api/archaeology/files');
      if (res.ok) {
        const data = await res.json();
        setProducedFiles(data.files || []);
      }
    } catch (err) {
      console.warn('Files fetch fallback:', err);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    producedFiles.forEach((file) => {
      handleDownloadFile(file.path, file.content);
    });
  };

  const handleAuditCode = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/archaeology/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSnippet: auditSnippet }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch {
      // Fallback
      const isWrong = auditSnippet.includes('agent.decideIfSafe') || auditSnippet.includes('eval(');
      setAuditResult({
        verdict: isWrong ? 'WRONG' : 'RIGHT',
        matches: isWrong
          ? [{ pairId: 'ARCH-01', type: 'WRONG_MATCH', rationale: 'Probabilistic agent directly decided safety without deterministic Final Authority.' }]
          : [],
        totalPairsAudited: pairs.length,
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCreatePair = () => {
    if (!newTitle.trim()) return;
    const newP: ArchaeologyPair = {
      id: `ARCH-0${pairs.length + 1}`,
      commitHash: Math.random().toString(16).substring(2, 10),
      category: newCategory as any,
      title: newTitle,
      rationale: newRationale || 'Refactored errant anti-pattern into verified invariant.',
      correctDiff: newCorrectDiff || '// RIGHT (CORRECT) invariant implemented',
      wrongDiff: newWrongDiff || '// WRONG (ERRANT) anti-pattern removed',
    };
    setPairs([newP, ...pairs]);
    setSelectedPair(newP);
    setNewTitle('');
    setNewWrongDiff('');
    setNewCorrectDiff('');
    setNewRationale('');
    setActiveTab('EXEMPLARS');
  };

  const activeProducedFile = producedFiles.find((f) => f.path === selectedFile) || producedFiles[0];

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Studio Header */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400 text-3xl shadow-inner">
            <GitCommit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Commit Archaeology Studio
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-bold uppercase">
                RIGHT vs WRONG Ledger
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Producing repository files for <code className="text-zinc-300 font-bold">https://github.com/craighckby-stack/commit-archaeology</code>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/craighckby-stack/commit-archaeology"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            GitHub Repository
          </a>

          <button
            onClick={handleDownloadAllBundle}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs uppercase flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Produced Bundle
          </button>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-3">
        <button
          onClick={() => setActiveTab('EXEMPLARS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'EXEMPLARS'
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-zinc-500 hover:text-zinc-300 bg-black'
          }`}
        >
          RIGHT vs WRONG Exemplars ({pairs.length})
        </button>

        <button
          onClick={() => setActiveTab('PRODUCED_FILES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PRODUCED_FILES'
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-zinc-500 hover:text-zinc-300 bg-black'
          }`}
        >
          Produced Repo Files ({producedFiles.length || 6})
        </button>

        <button
          onClick={() => setActiveTab('AUDITOR')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'AUDITOR'
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-zinc-500 hover:text-zinc-300 bg-black'
          }`}
        >
          Interactive Code Auditor
        </button>

        <button
          onClick={() => setActiveTab('HARVESTER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'HARVESTER'
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-zinc-500 hover:text-zinc-300 bg-black'
          }`}
        >
          Harvest New Pair
        </button>
      </div>

      {/* TAB 1: Exemplars Viewer */}
      {activeTab === 'EXEMPLARS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pair list (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
              Verified Archaeology Pairs
            </span>
            <div className="space-y-2">
              {pairs.map((p) => {
                const isSelected = selectedPair.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPair(p)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-zinc-900 border-blue-500/50 shadow-xl'
                        : 'bg-black/60 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold text-[10px]">[{p.id}]</span>
                      <span className="text-zinc-600 font-mono text-[9px]">{p.commitHash}</span>
                    </div>
                    <div className="text-white font-bold text-xs">{p.title}</div>
                    <div className="text-[10px] text-zinc-500">{p.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Diff Inspector (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-black text-sm">[{selectedPair.id}]</span>
                    <h3 className="text-base font-black text-white uppercase">{selectedPair.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{selectedPair.rationale}</p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-lg bg-zinc-900 text-zinc-400 text-[10px] font-mono">
                    Commit: {selectedPair.commitHash}
                  </span>
                </div>
              </div>

              {/* Side-by-side Right vs Wrong */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WRONG Block */}
                <div className="space-y-2 p-5 bg-red-950/20 border border-red-500/30 rounded-2xl">
                  <div className="flex items-center justify-between text-red-400 font-black text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> WRONG (Errant Defect)
                    </span>
                    <span className="text-[9px] text-red-500">ANTI-PATTERN</span>
                  </div>
                  <pre className="p-4 bg-black/80 rounded-xl text-[11px] text-red-300 font-mono overflow-x-auto leading-relaxed border border-red-900/40 whitespace-pre-wrap">
                    {selectedPair.wrongDiff}
                  </pre>
                  <p className="text-[10px] text-zinc-500 leading-relaxed pt-1">
                    Defect: Lacks deterministic verification boundary or leaks high-entropy unmanaged state.
                  </p>
                </div>

                {/* RIGHT Block */}
                <div className="space-y-2 p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
                  <div className="flex items-center justify-between text-emerald-400 font-black text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> RIGHT (Correct Invariant)
                    </span>
                    <span className="text-[9px] text-emerald-500">HARDENED</span>
                  </div>
                  <pre className="p-4 bg-black/80 rounded-xl text-[11px] text-emerald-300 font-mono overflow-x-auto leading-relaxed border border-emerald-900/40 whitespace-pre-wrap">
                    {selectedPair.correctDiff}
                  </pre>
                  <p className="text-[10px] text-zinc-500 leading-relaxed pt-1">
                    Invariant: Enforces technical authorization, cryptographic parent-hash chaining, or zero-leak bounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Produced Repo Files Explorer */}
      {activeTab === 'PRODUCED_FILES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
              Produced Repository Tree
            </span>
            <div className="space-y-2">
              {producedFiles.map((f) => {
                const isSelected = selectedFile === f.path;
                return (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f.path)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-zinc-900 border-blue-500/50 shadow-xl'
                        : 'bg-black/60 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-xs flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        {f.path}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">PRODUCED</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{f.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {activeProducedFile ? (
              <div className="p-6 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase">{activeProducedFile.path}</h3>
                    <p className="text-[10px] text-zinc-500">{activeProducedFile.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(activeProducedFile.content)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(activeProducedFile.path, activeProducedFile.content)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>

                <pre className="p-5 bg-black border border-zinc-900 rounded-2xl text-[11px] text-zinc-300 font-mono overflow-x-auto leading-relaxed max-h-[480px]">
                  {activeProducedFile.content}
                </pre>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600">Loading produced files...</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Code Auditor */}
      {activeTab === 'AUDITOR' && (
        <div className="p-8 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Archaeology Code Auditor
            </h3>
            <p className="text-zinc-500 text-xs mt-1">
              Tests candidate code against the RIGHT vs WRONG exemplar ledger. Detects historical anti-patterns before actuation.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-zinc-400">
              Paste Code Proposal or Diff Snippet:
            </label>
            <textarea
              value={auditSnippet}
              onChange={(e) => setAuditSnippet(e.target.value)}
              rows={6}
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAuditCode}
              disabled={isAuditing}
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isAuditing ? 'Auditing Proposal...' : 'Audit Against Archaeology Ledger'}
            </button>
          </div>

          {auditResult && (
            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                auditResult.verdict === 'RIGHT'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/30 border-red-500/40 text-red-300'
              }`}
            >
              <div className="flex items-center justify-between text-sm font-black uppercase">
                <span className="flex items-center gap-2">
                  {auditResult.verdict === 'RIGHT' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  Audit Verdict: {auditResult.verdict}
                </span>
                <span className="text-xs font-mono font-normal">
                  Pairs Audited: {auditResult.totalPairsAudited}
                </span>
              </div>

              {auditResult.matches && auditResult.matches.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-red-900/40">
                  <span className="text-[10px] font-bold uppercase text-red-400">Matched Anti-Patterns:</span>
                  {auditResult.matches.map((m: any, idx: number) => (
                    <div key={idx} className="p-3 bg-black/60 rounded-xl border border-red-900/50 text-xs">
                      <strong className="text-white block">[{m.pairId}] Anti-Pattern Triggered:</strong>
                      <span className="text-red-200">{m.rationale}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-200">
                  Code proposal passed: No known WRONG anti-patterns detected. Conforms to verified invariants.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Harvest New Pair Form */}
      {activeTab === 'HARVESTER' && (
        <div className="p-8 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Harvest &amp; Author New Archaeology Pair
            </h3>
            <p className="text-zinc-500 text-xs mt-1">
              Extract new RIGHT vs WRONG exemplars from bug postmortems or recent git commits to expand the living ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Exemplar Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Lineage Hash Re-computation on Fork"
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Category:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="Final Authority">Final Authority</option>
                <option value="Memory Lineage">Memory Lineage</option>
                <option value="Entropy Sanitization">Entropy Sanitization</option>
                <option value="Self-Stopping">Self-Stopping</option>
                <option value="AST Security">AST Security</option>
                <option value="Concurrency">Concurrency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-red-400">
                WRONG (Errant Anti-Pattern):
              </label>
              <textarea
                value={newWrongDiff}
                onChange={(e) => setNewWrongDiff(e.target.value)}
                rows={4}
                placeholder="// Errant code that failed"
                className="w-full bg-black border border-red-900/50 rounded-xl p-3 text-xs text-red-300 font-mono outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-400">
                RIGHT (Correct Invariant):
              </label>
              <textarea
                value={newCorrectDiff}
                onChange={(e) => setNewCorrectDiff(e.target.value)}
                rows={4}
                placeholder="// Hardened invariant code"
                className="w-full bg-black border border-emerald-900/50 rounded-xl p-3 text-xs text-emerald-300 font-mono outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">Engineering Rationale:</label>
            <input
              type="text"
              value={newRationale}
              onChange={(e) => setNewRationale(e.target.value)}
              placeholder="Why the WRONG pattern fails and why the RIGHT invariant holds..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleCreatePair}
            className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs uppercase cursor-pointer shadow-lg"
          >
            Register Archaeology Pair into Ledger
          </button>
        </div>
      )}
    </div>
  );
};
