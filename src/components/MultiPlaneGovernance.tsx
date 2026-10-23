import React, { useState } from 'react';
import { DEFAULT_NESTED_LAYERS, INITIAL_ARCHAEOLOGY_PAIRS, INITIAL_SIPHON_ENGINES } from '../data/substrateData';
import { ArchaeologyPair, NestedSimulationLayer, SiphonEngineItem } from '../types/aetherforge';
import { Shield, GitCommit, Layers, Database, ArrowRight, CheckCircle, AlertCircle, FileDiff, Zap, Code2 } from 'lucide-react';

export const MultiPlaneGovernance: React.FC = () => {
  const [siphons] = useState<SiphonEngineItem[]>(INITIAL_SIPHON_ENGINES);
  const [archaeology] = useState<ArchaeologyPair[]>(INITIAL_ARCHAEOLOGY_PAIRS);
  const [nestedLayers] = useState<NestedSimulationLayer[]>(DEFAULT_NESTED_LAYERS);
  const [selectedArch, setSelectedArch] = useState<ArchaeologyPair>(INITIAL_ARCHAEOLOGY_PAIRS[0]);
  const [selectedLayer, setSelectedLayer] = useState<NestedSimulationLayer>(DEFAULT_NESTED_LAYERS[0]);

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Plane Overview Header */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-3xl shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Multi-Plane Governance &amp; Siphon Banks
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-bold uppercase">
                Integration Plan v2.0
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Free-Thinker · EMG · Huxley Ethical Tri-Loop · Verification Tribunal · Siphon DNA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            ZERO UN-SANITIZED ENGINES IN LIVE MEMORY
          </span>
        </div>
      </div>

      {/* The 5 Canonical Planes Architecture Diagram */}
      <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Canonical Multi-Plane Mutation Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-black border border-purple-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">1. Proposal Plane</span>
            <h4 className="text-white font-black text-xs">Free-Thinker</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              High-agency radical mutation generator &amp; multi-agent debate chamber.
            </p>
          </div>

          <div className="p-4 bg-black border border-indigo-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">2. Ethical Risk Plane</span>
            <h4 className="text-white font-black text-xs">Huxley Tri-Loop</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              L1 Intuition ➔ L2 Logic Check ➔ L3 Self-Critique &amp; CCRR quantitative risk gating.
            </p>
          </div>

          <div className="p-4 bg-black border border-blue-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">3. Verification Plane</span>
            <h4 className="text-white font-black text-xs">EMG Gatekeeper</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              AST compiler checks, Shannon entropy &lt; 4.5, test-count preservation, self-stopping.
            </p>
          </div>

          <div className="p-4 bg-black border border-amber-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">4. Epistemic Audit</span>
            <h4 className="text-white font-black text-xs">Tribunal Plane</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Stages 0–5 claim audit. Math on code execution; empirical on grounded quotes; Author Gate.
            </p>
          </div>

          <div className="p-4 bg-black border border-emerald-500/30 rounded-2xl space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">5. Actuation Plane</span>
            <h4 className="text-white font-black text-xs">Atomic GitHub Commit</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Chrono-backup branch created first; mutation committed; shared RAG updated.
            </p>
          </div>
        </div>
      </div>

      {/* Siphoned Clean-Room Engine Bank */}
      <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Siphoned Clean-Room Engine Bank (sanitized-agent-engines)
          </h3>
          <span className="text-[10px] text-zinc-500">Source: craighckby-stack/sanitized-agent-engines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {siphons.map((eng) => (
            <div key={eng.id} className="p-5 bg-black/60 border border-zinc-900 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300">
                  Priority #{eng.priority}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                  {eng.status}
                </span>
              </div>
              <h4 className="text-white font-bold text-xs">{eng.name}</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{eng.description}</p>
              <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Entropy: {eng.entropyScore} bits/B</span>
                <span className="text-emerald-400 font-bold">Verified Clean-Room</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Archaeology-Engine: CORRECT / WRONG Commit Pairs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-purple-400" />
              Archaeology Commit Exemplars
            </h3>
            <div className="space-y-2">
              {archaeology.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setSelectedArch(arch)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                    selectedArch.id === arch.id
                      ? 'bg-zinc-900 border-purple-500/50 shadow-lg'
                      : 'bg-black/60 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold text-[10px]">[{arch.id}]</span>
                    <span className="text-zinc-600 text-[10px] font-mono">{arch.commitHash}</span>
                  </div>
                  <div className="text-white font-bold text-xs">{arch.title}</div>
                  <div className="text-[10px] text-zinc-500">{arch.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div>
                <h4 className="text-white font-black text-sm uppercase">{selectedArch.title}</h4>
                <p className="text-zinc-500 text-[11px] mt-1">{selectedArch.rationale}</p>
              </div>
              <span className="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-400">
                Commit {selectedArch.commitHash}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-emerald-400 font-black text-[10px] uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> CORRECT Pattern (Promoted)
                </span>
                <pre className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {selectedArch.correctDiff}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-red-400 font-black text-[10px] uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> WRONG Anti-Pattern (Vetoed)
                </span>
                <pre className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-[11px] text-red-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {selectedArch.wrongDiff}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Simulation Ledger */}
      <div className="p-8 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          Nested Simulation Reality Tracker (Multi-Layer Stacks)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nestedLayers.map((layer) => (
            <div
              key={layer.depth}
              onClick={() => setSelectedLayer(layer)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedLayer.depth === layer.depth
                  ? 'bg-zinc-900 border-cyan-500/50 shadow-xl'
                  : 'bg-black/60 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold text-[10px]">DEPTH {layer.depth}</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold uppercase">
                  {layer.status}
                </span>
              </div>
              <h4 className="text-white font-bold text-xs">{layer.systemName}</h4>
              <p className="text-[10px] text-zinc-500">{layer.origin}</p>
              <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-400">
                <span>Integrity: {layer.integrity}%</span>
                <span>Agents: {layer.agentCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
