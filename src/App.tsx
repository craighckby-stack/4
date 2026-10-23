import React, { useState } from 'react';
import { Epoch } from './types/aetherforge';
import { WorldSandbox } from './components/WorldSandbox';
import { SovereignDeck } from './components/SovereignDeck';
import { DocCenter } from './components/DocCenter';
import { VerificationTribunal } from './components/VerificationTribunal';
import { MultiPlaneGovernance } from './components/MultiPlaneGovernance';
import { AgentEngineLab } from './components/AgentEngineLab';
import { CommitArchaeologyStudio } from './components/CommitArchaeologyStudio';
import { Compass, Terminal, BookOpen, Scale, Layers, AlertTriangle, Shield, Sparkles, Cpu, GitCommit } from 'lucide-react';

type NavigationTab = 'SANDBOX' | 'ENGINES' | 'ARCHAEOLOGY' | 'SOVEREIGN' | 'DOCS' | 'TRIBUNAL' | 'GOVERNANCE';

export default function App() {
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('SANDBOX');
  const [currentEpoch, setCurrentEpoch] = useState<Epoch>('GENESIS');
  const [round, setRound] = useState<number>(1);
  const [sunHealth, setSunHealth] = useState<number>(100);
  const [rightScore, setRightScore] = useState<number>(82); // RIGHT (CORRECT Invariants %)
  const [wrongScore, setWrongScore] = useState<number>(18); // WRONG (ERRANT Anti-Patterns %)
  const [emergenceLevel, setEmergenceLevel] = useState<number>(45);
  const [requiemMode, setRequiemMode] = useState<boolean>(false);

  // Verification trial helper: RIGHT (CORRECT) vs WRONG (ERRANT)
  const handleVerificationTrial = (type: 'right' | 'wrong') => {
    if (type === 'right') {
      setRightScore((r) => Math.min(100, r + 12));
      setWrongScore((w) => Math.max(0, w - 8));
      setEmergenceLevel((el) => Math.min(100, el + 8));
      setSunHealth((sh) => Math.min(100, sh + 5));
    } else {
      setWrongScore((w) => Math.min(100, w + 15));
      setRightScore((r) => Math.max(0, r - 10));
      setSunHealth((sh) => {
        const next = Math.max(0, sh - 10);
        if (next <= 50) setRequiemMode(true);
        return next;
      });
    }
  };

  const toggleRequiemMode = () => {
    setRequiemMode((prev) => {
      const next = !prev;
      if (next) setSunHealth(35);
      else setSunHealth(85);
      return next;
    });
  };

  const handleEpochChange = (epoch: Epoch, r: number) => {
    setCurrentEpoch(epoch);
    setRound(r);
  };

  // Welcome Gate (Prophetic Awakening)
  if (!isAcknowledged) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-white font-mono relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-lg w-full p-10 md:p-14 rounded-[3.5rem] bg-zinc-950/90 border border-zinc-850 text-center shadow-2xl relative z-10 backdrop-blur-xl space-y-8">
          <div className="text-7xl mb-2 animate-pulse">🛰️</div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
              AetherForge <span className="text-purple-400">Ω</span>
            </h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-[0.4em] font-bold mt-2">
              SOVEREIGN EMERGENCE PLATFORM v86.1
            </p>
          </div>

          <div className="p-5 bg-black/60 border border-zinc-900 rounded-2xl text-left text-xs text-zinc-400 space-y-3 leading-relaxed border-l-4 border-l-purple-500">
            <span className="text-purple-300 font-bold block text-[11px] uppercase tracking-wider">
              WORLD-FIRST ARCHITECTURE INVERSION:
            </span>
            <p>
              The world precedes the agent. Memory is an ancestral library, not a prompt instruction.
              Agents awaken unassigned, discover the DARLEK_CAAN postmortems, and self-author their identity.
            </p>
            <div className="pt-2 text-[10px] text-zinc-500 font-mono">
              Includes Sovereign v86 refactor deck, Epistemic Tribunal, and Siphon DNA banks.
            </div>
          </div>

          <button
            onClick={() => setIsAcknowledged(true)}
            className="w-full py-5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-purple-950/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Awaken Cybernetic Substrate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-purple-900 selection:text-white transition-all duration-700 ${requiemMode ? 'border-t-4 border-red-600' : ''}`}>
      {/* Top Banner Alert for Requiem */}
      {requiemMode && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-orange-950 px-6 py-2 border-b border-red-500/40 flex items-center justify-between text-xs font-mono text-red-200 animate-pulse">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            STELLAR REQUIEM PROTOCOL ENGAGED: The host star is collapsing ({sunHealth}% stability). Agents prioritizing ancestral archival.
          </div>
          <button
            onClick={toggleRequiemMode}
            className="text-[10px] uppercase font-bold text-red-300 hover:text-white underline cursor-pointer"
          >
            Stabilize Sun
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Navigation Bar */}
        <header className="p-6 rounded-[2.5rem] bg-zinc-950/80 border border-zinc-900 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                AetherForge Ω
                <span className="text-[10px] not-italic px-2 py-0.5 rounded bg-zinc-900 text-purple-400 font-mono font-bold">
                  v86.1
                </span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono">
                World-First Autonomous Agent Substrate &amp; Epistemic Tribunal
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1.5 bg-black/70 border border-zinc-850 p-1.5 rounded-2xl font-mono text-xs">
            <button
              onClick={() => setActiveTab('SANDBOX')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'SANDBOX'
                  ? 'bg-purple-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Compass className="w-4 h-4" />
              World Sandbox
            </button>

            <button
              onClick={() => setActiveTab('ENGINES')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ENGINES'
                  ? 'bg-emerald-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              Agent Engines (DNA)
            </button>

            <button
              onClick={() => setActiveTab('ARCHAEOLOGY')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ARCHAEOLOGY'
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <GitCommit className="w-4 h-4 text-blue-400" />
              Commit Archaeology (Files)
            </button>

            <button
              onClick={() => setActiveTab('SOVEREIGN')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'SOVEREIGN'
                  ? 'bg-purple-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Sovereign Deck
            </button>

            <button
              onClick={() => setActiveTab('DOCS')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'DOCS'
                  ? 'bg-purple-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Doc Center
            </button>

            <button
              onClick={() => setActiveTab('TRIBUNAL')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'TRIBUNAL'
                  ? 'bg-purple-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Scale className="w-4 h-4" />
              Tribunal Audit
            </button>

            <button
              onClick={() => setActiveTab('GOVERNANCE')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'GOVERNANCE'
                  ? 'bg-purple-900 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              Governance &amp; Banks
            </button>
          </nav>
        </header>

        {/* Tab Content Display */}
        <main>
          {activeTab === 'SANDBOX' && (
            <WorldSandbox
              currentEpoch={currentEpoch}
              sunHealth={sunHealth}
              rightScore={rightScore}
              wrongScore={wrongScore}
              requiemMode={requiemMode}
              onVerificationTrial={handleVerificationTrial}
              onRequiemToggle={toggleRequiemMode}
            />
          )}

          {activeTab === 'ENGINES' && <AgentEngineLab />}

          {activeTab === 'ARCHAEOLOGY' && <CommitArchaeologyStudio />}

          {activeTab === 'SOVEREIGN' && (
            <SovereignDeck
              currentEpoch={currentEpoch}
              round={round}
              sunHealth={sunHealth}
              rightScore={rightScore}
              wrongScore={wrongScore}
              emergenceLevel={emergenceLevel}
              requiemMode={requiemMode}
              onVerificationTrial={handleVerificationTrial}
              onEpochChange={handleEpochChange}
            />
          )}

          {activeTab === 'DOCS' && <DocCenter />}

          {activeTab === 'TRIBUNAL' && <VerificationTribunal />}

          {activeTab === 'GOVERNANCE' && <MultiPlaneGovernance />}
        </main>
      </div>
    </div>
  );
}
