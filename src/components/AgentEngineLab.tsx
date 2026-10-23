import React, { useState } from 'react';
import { globalAgentRegistry } from '../agents/AgentEngineRegistry';
import { TournamentMatch, SiphonedEngineDefinition } from '../agents/types';
import { Cpu, Swords, GitFork, Binary, ShieldAlert, Sparkles, Play, RefreshCw, CheckCircle, AlertTriangle, Layers, ExternalLink } from 'lucide-react';

export const AgentEngineLab: React.FC = () => {
  const [selectedEngineId, setSelectedEngineId] = useState<string>('engine-1-evolution');
  const [matches, setMatches] = useState<TournamentMatch[]>(globalAgentRegistry.evolution.getMatches());
  const [tournamentAgents, setTournamentAgents] = useState(globalAgentRegistry.evolution.getAgents());
  const [generation, setGeneration] = useState<number>(globalAgentRegistry.evolution.getGeneration());
  const [generationSummary, setGenerationSummary] = useState<string>('');

  // Fleet state
  const [fleetTasks, setFleetTasks] = useState(globalAgentRegistry.fleet.getRootTasks());
  const [fleetMetrics, setFleetMetrics] = useState(globalAgentRegistry.fleet.getExecutionMetrics());
  const [fleetLog, setFleetLog] = useState<string>('Fleet standby. Click "Step Fleet Execution" to assign tasks.');

  // Memory state
  const [entropyInput, setEntropyInput] = useState<string>('api_key="sk-live-9382048102938472910398472"');
  const [computedEntropy, setComputedEntropy] = useState<number>(
    globalAgentRegistry.memory.calculateShannonEntropy('api_key="sk-live-9382048102938472910398472"')
  );

  // Tool guardrail state
  const [testToolName, setTestToolName] = useState<string>('propose_mutation');
  const [testToolArg, setTestToolArg] = useState<string>('{"file": "src/core/evolution.ts", "patch": "export const safe = true;"}');
  const [guardrailVerdict, setGuardrailVerdict] = useState<any>(null);

  // Discovery state
  const [hypotheses, setHypotheses] = useState(globalAgentRegistry.discovery.getHypotheses());
  const [discoveryCycle, setDiscoveryCycle] = useState(globalAgentRegistry.discovery.getCycle());

  const engines = globalAgentRegistry.getSiphonedDefinitions();
  const selectedEngine = engines.find((e) => e.id === selectedEngineId) || engines[0];

  // Run a live competitive tournament match
  const handleRunMatch = () => {
    const match = globalAgentRegistry.evolution.runTournamentMatch();
    setMatches([...globalAgentRegistry.evolution.getMatches()]);
    setTournamentAgents([...globalAgentRegistry.evolution.getAgents()]);
  };

  const handleBreedGeneration = () => {
    const res = globalAgentRegistry.evolution.breedNextGeneration();
    setGeneration(res.generation);
    setGenerationSummary(res.mutationSummary);
    setTournamentAgents([...globalAgentRegistry.evolution.getAgents()]);
  };

  // Step fleet execution
  const handleStepFleet = () => {
    const res = globalAgentRegistry.fleet.stepFleetExecution();
    setFleetTasks([...globalAgentRegistry.fleet.getRootTasks()]);
    setFleetMetrics(globalAgentRegistry.fleet.getExecutionMetrics());
    setFleetLog(res.stepResult);
  };

  const handleResetFleet = () => {
    globalAgentRegistry.fleet.resetFleet();
    setFleetTasks([...globalAgentRegistry.fleet.getRootTasks()]);
    setFleetMetrics(globalAgentRegistry.fleet.getExecutionMetrics());
    setFleetLog('Fleet reset to initial root tasks.');
  };

  // Calculate live entropy
  const handleComputeEntropy = (text: string) => {
    setEntropyInput(text);
    const score = globalAgentRegistry.memory.calculateShannonEntropy(text);
    setComputedEntropy(Math.round(score * 100) / 100);
  };

  // Test tool guardrail
  const handleTestGuardrail = () => {
    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(testToolArg);
    } catch {
      parsedArgs = { raw: testToolArg };
    }
    const result = globalAgentRegistry.guardrail.dispatchTool({
      id: `call_${Date.now()}`,
      toolName: testToolName,
      arguments: parsedArgs,
      callingAgentArchetype: 'TEST_AGENT'
    });
    setGuardrailVerdict(result);
  };

  // Advance discovery cycle
  const handleAdvanceDiscovery = () => {
    const newHypo = globalAgentRegistry.discovery.advanceCycle();
    setHypotheses([...globalAgentRegistry.discovery.getHypotheses()]);
    setDiscoveryCycle(globalAgentRegistry.discovery.getCycle());
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shadow-inner">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Actual Agent Engines (Cognitive DNA Bank)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                Live Executable Substrates
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Siphoned from craighckby-stack/sanitized-agent-engines • Verified Clean-Room TypeScript DNA
            </p>
          </div>
        </div>

        <a
          href="https://github.com/craighckby-stack/sanitized-agent-engines"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          sanitized-agent-engines on GitHub
        </a>
      </div>

      {/* Engine Selection Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {engines.map((eng) => {
          const isSelected = selectedEngineId === eng.id;
          return (
            <button
              key={eng.id}
              onClick={() => setSelectedEngineId(eng.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-xl'
                  : 'bg-zinc-950/80 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  Priority #{eng.priority}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{eng.name}</h4>
              <span className="text-[9px] text-zinc-500 uppercase block">{eng.category}</span>
            </button>
          );
        })}
      </div>

      {/* Active Engine Workspace */}
      <div className="p-8 bg-zinc-950/90 border border-zinc-850 rounded-[3rem] space-y-8 shadow-2xl">
        {/* Workspace Top Details */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {selectedEngine.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                {selectedEngine.status}
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed max-w-3xl">
              {selectedEngine.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black p-3 rounded-2xl border border-zinc-900">
            {Object.entries(selectedEngine.metrics).map(([k, v]) => (
              <div key={k} className="px-3 border-r last:border-r-0 border-zinc-800 text-center">
                <div className="text-[9px] uppercase text-zinc-500 font-bold">{k}</div>
                <div className="text-xs font-black text-emerald-400">{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Engine 1: Competitive Evolution Interactive Deck */}
        {selectedEngine.category === 'Evolution' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-white uppercase text-xs">
                  Generation {generation} Tournament Arena
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunMatch}
                  className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Run Tournament Trial
                </button>
                <button
                  onClick={handleBreedGeneration}
                  className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/30 text-purple-200 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Breed Next Generation
                </button>
              </div>
            </div>

            {generationSummary && (
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 text-xs">
                {generationSummary}
              </div>
            )}

            {/* Contenders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tournamentAgents.map((ag) => (
                <div key={ag.id} className="p-4 bg-black border border-zinc-850 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{ag.name}</span>
                    <span className="text-emerald-400 font-bold">{ag.fitness} pts</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic line-clamp-2">"{ag.creed}"</p>
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>W: {ag.wins} / L: {ag.losses}</span>
                    <span>NCS: {ag.narrativeCoherence}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Match Trials */}
            {matches.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Recent Tournament Log</span>
                <div className="p-4 bg-black border border-zinc-900 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>Round #{matches[0].round}: {matches[0].agentA.name} vs {matches[0].agentB.name}</span>
                    <span>Scores: {matches[0].scoreA} vs {matches[0].scoreB}</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-zinc-400">
                    {matches[0].log.map((line, idx) => (
                      <div key={idx} className="leading-relaxed">{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engine 2: Hierarchical Fleet Interactive Deck */}
        {selectedEngine.category === 'Fleet' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-white uppercase text-xs">
                  Hierarchical Task Decomposition &amp; Fleet State
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStepFleet}
                  className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Step Fleet Execution
                </button>
                <button
                  onClick={handleResetFleet}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Reset Tree
                </button>
              </div>
            </div>

            <div className="p-3 bg-black border border-zinc-900 rounded-xl text-zinc-300 text-xs">
              <span className="text-emerald-400 font-bold">Fleet Telemetry: </span>
              {fleetLog}
            </div>

            {/* Task Tree Display */}
            <div className="p-5 bg-black border border-zinc-850 rounded-2xl space-y-4">
              {fleetTasks.map((root) => (
                <div key={root.id} className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white text-xs">{root.title}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] bg-purple-950 text-purple-300 font-bold">
                      {root.status}
                    </span>
                  </div>

                  <div className="pl-6 space-y-2 border-l-2 border-zinc-800">
                    {root.children.map((sub) => (
                      <div key={sub.id} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-850 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-200 font-bold text-xs">{sub.title}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-blue-950 text-blue-300 font-bold">
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Assigned: <strong className="text-zinc-300">{sub.assigneeArchetype}</strong>
                        </div>
                        {sub.result && <div className="text-[10px] text-emerald-400">{sub.result}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engine 3: Memory Synthesis & Shannon Entropy */}
        {selectedEngine.category === 'Memory' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-white uppercase text-xs">
                Shannon Entropy &amp; Context Compaction Workspace
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400">
                Test Arbitrary Text / Code for Secret Entropy Scoring:
              </label>
              <textarea
                value={entropyInput}
                onChange={(e) => handleComputeEntropy(e.target.value)}
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 outline-none focus:border-emerald-500 font-mono resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                <span className="text-[9px] uppercase text-zinc-500 font-bold block">Shannon Entropy</span>
                <span className={`text-2xl font-black ${computedEntropy > 4.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {computedEntropy} bits/B
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  {computedEntropy > 4.5 ? '⚠️ High Entropy Secret Detected' : '✅ Safe entropy bounds (< 4.5)'}
                </span>
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                <span className="text-[9px] uppercase text-zinc-500 font-bold block">Context Compaction</span>
                <span className="text-2xl font-black text-cyan-400">
                  {globalAgentRegistry.memory.getCompactionRatio()}%
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Token budget conserved across postmortems
                </span>
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                <span className="text-[9px] uppercase text-zinc-500 font-bold block">Consolidated Chunks</span>
                <span className="text-2xl font-black text-purple-400">
                  {globalAgentRegistry.memory.getChunks().length} Chunks
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Ancestral postmortems indexed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Engine 4: Tool Guardrail & Secure Dispatcher */}
        {selectedEngine.category === 'Guardrail' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-white uppercase text-xs">
                Zero-Leak Tool Dispatcher Simulator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Tool Name:</label>
                <input
                  type="text"
                  value={testToolName}
                  onChange={(e) => setTestToolName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Parameters (JSON):</label>
                <input
                  type="text"
                  value={testToolArg}
                  onChange={(e) => setTestToolArg(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleTestGuardrail}
              className="px-6 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-black text-xs uppercase cursor-pointer"
            >
              Dispatch Through EMG Guardrail Gate
            </button>

            {guardrailVerdict && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  guardrailVerdict.allowed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[11px]">
                  Verdict: {guardrailVerdict.securityVerdict}
                </div>
                <div>{guardrailVerdict.reason}</div>
              </div>
            )}
          </div>
        )}

        {/* Engine 5: Recursive Discovery State Engine */}
        {selectedEngine.category === 'Discovery' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-white uppercase text-xs">
                  Discovery Cycle #{discoveryCycle} Hypotheses Matrix
                </span>
              </div>

              <button
                onClick={handleAdvanceDiscovery}
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                Advance Inquiry Cycle
              </button>
            </div>

            <div className="space-y-3">
              {hypotheses.map((h) => (
                <div key={h.id} className="p-4 bg-black border border-zinc-850 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{h.hypothesis}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        h.status === 'TESTED_VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400'
                          : h.status === 'FALSIFIED'
                          ? 'bg-red-950 text-red-400'
                          : 'bg-yellow-950 text-yellow-400'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Adversarial Challenge: <span className="text-zinc-400">{h.adversarialChallenge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cognitive DNA Source Code Viewer */}
        <div className="space-y-3 border-t border-zinc-900 pt-6">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
            Clean-Room Cognitive DNA Interface (TypeScript Contract)
          </span>
          <pre className="p-5 bg-black border border-zinc-900 rounded-2xl text-[11px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
            {selectedEngine.cognitiveDna}
          </pre>
        </div>
      </div>
    </div>
  );
};
