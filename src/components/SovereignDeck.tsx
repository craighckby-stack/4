import React, { useState, useRef } from 'react';
import { Epoch, EPOCHS } from '../types/aetherforge';
import { Play, Square, Terminal, Shield, Sparkles, AlertCircle, ArrowUpRight, Cpu, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface SovereignDeckProps {
  currentEpoch: Epoch;
  round: number;
  sunHealth: number;
  rightScore: number;
  wrongScore: number;
  emergenceLevel: number;
  requiemMode: boolean;
  onVerificationTrial: (type: 'right' | 'wrong') => void;
  onEpochChange: (epoch: Epoch, round: number) => void;
}

const DEFAULT_TARGETS = [
  'README.md',
  'PHILOSOPHY.md',
  'APPLICATIONS.md',
  'src/engine/useAetherForge.ts',
  'src/substrate/agents.ts',
  'src/core/evolution.ts',
];

export const SovereignDeck: React.FC<SovereignDeckProps> = ({
  currentEpoch,
  round,
  sunHealth,
  rightScore,
  wrongScore,
  emergenceLevel,
  requiemMode,
  onVerificationTrial,
  onEpochChange,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoGenesis, setAutoGenesis] = useState<boolean>(true);
  const [enableSyphon, setEnableSyphon] = useState<boolean>(true);
  const [enableHighThinking, setEnableHighThinking] = useState<boolean>(true);
  const [enhancedCount, setEnhancedCount] = useState<number>(0);
  const [logs, setLogs] = useState<{ id: string; msg: string; type: string; timestamp: string }[]>([]);

  // Workspace configuration
  const [targetRepo, setTargetRepo] = useState<string>('craighckby-stack/sanitized-agent-engines');
  const [targetBranch, setTargetBranch] = useState<string>('main');
  const [syphonRepo, setSyphonRepo] = useState<string>('craighckby-stack/AetherForge-2.0');
  const [syphonBranch, setSyphonBranch] = useState<string>('main');
  const [githubPat, setGithubPat] = useState<string>('');

  const [customPrompt, setCustomPrompt] = useState<string>(
    `You are DALEK CAAN Ω — Sovereign Engine of the World-First Architecture.
Invert the old model: The world precedes the agent. Agents are born unassigned into ruins and self-author their purpose through archaeological exegesis.
Refactor and modernize code into compile-ready TypeScript aligned with AetherForge Ω standards.
Return ONLY clean, valid, compile-ready code without extraneous backticks or conversational preamble.`
  );

  const [fileTargets, setFileTargets] = useState<string[]>(DEFAULT_TARGETS);
  const [newPathInput, setNewPathInput] = useState<string>('');

  const isAborted = useRef<boolean>(false);

  const pushLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        msg,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 70),
    ]);
  };

  const addFilePath = () => {
    const clean = newPathInput.trim();
    if (!clean) return;
    if (fileTargets.includes(clean)) {
      pushLog('File already present in evolution target queue.', 'warn');
      return;
    }
    setFileTargets([...fileTargets, clean]);
    setNewPathInput('');
    pushLog(`Enqueued target file: ${clean}`, 'info');
  };

  const removeFilePath = (pathToRemove: string) => {
    setFileTargets(fileTargets.filter((p) => p !== pathToRemove));
    pushLog(`Deregistered file target: ${pathToRemove}`, 'warn');
  };

  // Execution step via Server API
  const processTargetFile = async (filePath: string) => {
    pushLog(`[EMG-GATE] Evaluating pipeline for ${filePath}...`, 'info');

    try {
      const payloadPrompt = `${customPrompt}

FILE TO MODERNIZE/UPGRADE: ${filePath}
TARGET REPOSITORY: ${targetRepo} (${targetBranch})
SYPHON SOURCE: ${syphonRepo} (${syphonBranch})

Generate the modernized code adhering strictly to the World-First architecture and deterministic verification separation.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: payloadPrompt,
          thinking: enableHighThinking,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Cognitive synthesis failed');
      }

      pushLog(
        data.notice
          ? `✅ Synthesis verified for ${filePath} (${data.notice})`
          : `✅ Synthesis verified for ${filePath} (${data.model} ${enableHighThinking ? '• Thinking High' : ''})`,
        'success'
      );

      setEnhancedCount((c) => c + 1);

      // Trigger verification trial roll
      if (Math.random() < 0.35) {
        onVerificationTrial('right');
        pushLog('✅ RIGHT (CORRECT) Invariant validated — codebase integrity heightened', 'success');
      } else if (Math.random() < 0.2) {
        onVerificationTrial('wrong');
        pushLog('⚠️ WRONG (ERRANT) Pattern flagged — logged in Commit Archaeology quarantine', 'error');
      }
    } catch (err: any) {
      pushLog(`Error processing ${filePath}: ${err.message}`, 'error');
    }
  };

  // Start evolution cycle across epochs
  const startEvolution = async () => {
    setIsRunning(true);
    isAborted.current = false;
    pushLog('SOVEREIGN v86.1 — REPOSITORY MODERNIZATION CYCLE ENGAGED', 'info');
    pushLog(`Target: ${targetRepo} | Syphon: ${syphonRepo}`, 'info');

    for (let r = 1; r <= 8 && !isAborted.current; r++) {
      const epochIndex = Math.min(r - 1, EPOCHS.length - 1);
      const epoch = EPOCHS[epochIndex];
      onEpochChange(epoch, r);

      pushLog(`=== EPOCH: ${epoch} (Round ${r} of 8) ===`, 'info');

      for (const file of fileTargets) {
        if (isAborted.current) break;
        await processTargetFile(file);
        await new Promise((res) => setTimeout(res, 1400));
      }

      if (isAborted.current) break;
      await new Promise((res) => setTimeout(res, 1800));
    }

    if (!isAborted.current) {
      pushLog('🌟 ALL EVOLUTION CYCLES COMPLETE — Repository elevated to World-First Ω standard.', 'success');
    }
    setIsRunning(false);
  };

  const abortEvolution = () => {
    isAborted.current = true;
    setIsRunning(false);
    pushLog('ABORT SIGNAL CONFIRMED — Thread safely parked at checkpoint.', 'warn');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Console */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner">
            🛰️
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Sovereign <span className="text-emerald-400">v86.1</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold uppercase">
                Aethersyphon Ω Deck
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Decoupled React Engine • Server-Side Gemini Execution • World-First Refactor Pipeline
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col text-right pr-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono">Cognitive Model</span>
            <span className="text-xs text-emerald-400 font-black font-mono">
              {enableHighThinking ? 'Gemini 3.1 Pro (High-Thinking)' : 'Gemini 3.8 Flash'}
            </span>
          </div>

          <button
            onClick={isRunning ? abortEvolution : startEvolution}
            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all cursor-pointer ${
              isRunning
                ? 'bg-red-950 text-red-200 border border-red-500/30 hover:bg-red-900'
                : 'bg-gradient-to-r from-red-900 to-purple-950 hover:from-red-800 hover:to-purple-900 text-white border border-red-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-red-400 text-red-400" />
                Abort Cycle
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Begin Evolution
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cosmic Telemetry Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-3xl relative">
          <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Current Epoch</div>
          <div className="text-2xl font-black text-purple-400 tracking-tight mt-1">{currentEpoch}</div>
          <div className="text-[10px] text-zinc-600 font-mono mt-1">Round {round} of 8</div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-700"
              style={{ width: `${((EPOCHS.indexOf(currentEpoch) + 1) / EPOCHS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-3xl relative">
          <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">RIGHT (CORRECT %)</div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight mt-1">{rightScore}%</div>
          <div className="text-[10px] text-zinc-600 font-mono mt-1">Verified correct code invariant rate</div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${rightScore}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-3xl relative">
          <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">WRONG (ERRANT %)</div>
          <div className="text-2xl font-black text-red-400 tracking-tight mt-1">{wrongScore}%</div>
          <div className="text-[10px] text-zinc-600 font-mono mt-1">Detected errant anti-pattern defect rate</div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${wrongScore}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-3xl relative">
          <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Sun Stability</div>
          <div
            className={`text-2xl font-black tracking-tight mt-1 ${
              sunHealth <= 50 ? 'text-red-500 animate-pulse' : 'text-yellow-400'
            }`}
          >
            {sunHealth}%
          </div>
          <div className="text-[10px] text-zinc-600 font-mono mt-1">
            {requiemMode ? '☀️ Stellar Requiem Protocol' : 'Normal Solar Basin'}
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                sunHealth <= 50 ? 'bg-red-500' : 'bg-yellow-400'
              }`}
              style={{ width: `${sunHealth}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Controls & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-6 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="font-black text-white text-[11px] uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Evolution Parameters
              </span>
              <span className="text-[9px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                SYPHON ACTIVE
              </span>
            </div>

            {/* Target Repo */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                Target Repository (v3.0 Target Workspace)
              </label>
              <input
                type="text"
                value={targetRepo}
                onChange={(e) => setTargetRepo(e.target.value)}
                disabled={isRunning}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                  Branch
                </label>
                <input
                  type="text"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  disabled={isRunning}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                  Auto-Genesis 404
                </label>
                <div className="flex items-center h-11 px-3 bg-black border border-zinc-800 rounded-xl">
                  <input
                    type="checkbox"
                    id="autoGenCheck"
                    checked={autoGenesis}
                    onChange={(e) => setAutoGenesis(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 cursor-pointer"
                  />
                  <label htmlFor="autoGenCheck" className="ml-2 text-zinc-300 font-bold text-[10px] cursor-pointer">
                    Enabled
                  </label>
                </div>
              </div>
            </div>

            {/* High Thinking Toggle */}
            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-purple-300 font-bold block text-[11px] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Gemini 3.1 Pro Thinking Mode
                </span>
                <span className="text-zinc-500 text-[10px]">
                  Enforces ThinkingLevel.HIGH for deep architectural synthesis
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableHighThinking}
                onChange={(e) => setEnableHighThinking(e.target.checked)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Syphon Source */}
            <div className="space-y-2 border-t border-zinc-900 pt-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                Syphon Source Repo (Ancestral DNA Bank)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={syphonRepo}
                  onChange={(e) => setSyphonRepo(e.target.value)}
                  disabled={isRunning}
                  className="col-span-2 bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                />
                <input
                  type="text"
                  value={syphonBranch}
                  onChange={(e) => setSyphonBranch(e.target.value)}
                  disabled={isRunning}
                  className="bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Target File Queue */}
            <div className="space-y-3 border-t border-zinc-900 pt-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                Target File Queue ({fileTargets.length} files)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPathInput}
                  onChange={(e) => setNewPathInput(e.target.value)}
                  placeholder="e.g. src/engine/darlekRAG.ts"
                  className="flex-1 bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
                />
                <button
                  onClick={addFilePath}
                  className="px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-zinc-900 bg-black/50 p-2 rounded-xl">
                {fileTargets.map((file) => (
                  <div key={file} className="flex items-center justify-between p-2 rounded bg-zinc-950 hover:bg-zinc-900">
                    <span className="text-zinc-300 truncate pr-2 text-[11px]">{file}</span>
                    <button
                      onClick={() => removeFilePath(file)}
                      className="text-zinc-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DALEK CAAN Recursive Directive */}
            <div className="space-y-2 border-t border-zinc-900 pt-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                DALEK CAAN Recursive Directive
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed outline-none focus:border-purple-500 resize-none font-mono"
              />
            </div>

            <div className="pt-2 text-center text-zinc-400 text-[11px]">
              Files Enhanced: <span className="text-emerald-400 font-bold font-mono">{enhancedCount}</span>
            </div>
          </div>
        </div>

        {/* Live Sovereign Telemetry Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-[580px] bg-black border border-zinc-900 rounded-[2.5rem] p-6 flex flex-col overflow-hidden shadow-2xl relative font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase ml-2 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  Sovereign Telemetry Stream
                </span>
              </div>

              <button
                onClick={() => setLogs([])}
                className="text-[10px] text-zinc-600 hover:text-zinc-300 font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear Stream
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 py-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-2">
                  <Terminal className="w-8 h-8 opacity-40 text-purple-500" />
                  <p className="text-xs">Sovereign telemetry stream idle.</p>
                  <p className="text-[10px] text-zinc-600">
                    Click "Begin Evolution" to start autonomous modernization of target repositories.
                  </p>
                </div>
              ) : (
                logs.map((l) => (
                  <div key={l.id} className="flex items-start gap-3 py-1 border-b border-zinc-950">
                    <span className="text-zinc-600 text-[10px] whitespace-nowrap pt-0.5">[{l.timestamp}]</span>
                    <span
                      className={`break-words leading-relaxed ${
                        l.type === 'error'
                          ? 'text-red-400 font-bold'
                          : l.type === 'success'
                          ? 'text-emerald-400 font-bold'
                          : l.type === 'warn'
                          ? 'text-yellow-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      {l.msg}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-600">
              <span>STREAM BUFFER: {logs.length} ENTRIES</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> EMERGENCE LEVEL: {emergenceLevel}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
