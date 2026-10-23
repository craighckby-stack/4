import React, { useEffect, useRef, useState } from 'react';
import { Agent, Epoch, WorldEntity } from '../types/aetherforge';
import { INITIAL_POSTMORTEMS, INITIAL_WORLD_ENTITIES } from '../data/substrateData';
import { calculateShannonEntropy, EMGAdmissionDecision, EMGLogEntry, globalEMGGate } from '../engine/emgGate';
import { globalHuxleyLoop, RefinementStep, TriLoopAssessment } from '../engine/singularityLoop';
import {
  Sparkles,
  Zap,
  Flame,
  Shield,
  Compass,
  Brain,
  RefreshCw,
  Eye,
  BookOpen,
  AlertTriangle,
  Cpu,
  Activity,
  Lock,
  Unlock,
  Orbit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Sliders,
  Play,
  FileCode,
  ShieldAlert,
  Terminal,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface WorldSandboxProps {
  currentEpoch: Epoch;
  sunHealth: number;
  rightScore: number;
  wrongScore: number;
  requiemMode: boolean;
  onVerificationTrial: (type: 'right' | 'wrong') => void;
  onRequiemToggle: () => void;
}

type SandboxSubTab = 'CANVAS' | 'EMG_GATE' | 'HUXLEY_LOOP' | 'ARCHITECTURE';

const ARCHETYPE_COLORS: Record<string, string> = {
  TABULA_RASA: '#9ca3af',
  KEYSTONE_ARCHIVIST: '#3b82f6',
  VOID_WEAVER: '#ec4899',
  HERETIC_LOGICIAN: '#eab308',
  SOLAR_SHEPHERD: '#10b981',
  CRYPT_SURVEYOR: '#a855f7',
};

const SAMPLE_NAMES = [
  'Aether-01', 'Caan-Vane', 'Zeta-Null', 'Prism-9', 'Echo-Scribe',
  'Nexus-7', 'Orion-Weaver', 'Thoth-Prime', 'Vesper-Logos'
];

export const WorldSandbox: React.FC<WorldSandboxProps> = ({
  currentEpoch,
  sunHealth,
  rightScore,
  wrongScore,
  requiemMode,
  onVerificationTrial,
  onRequiemToggle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SandboxSubTab>('CANVAS');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [entities] = useState<WorldEntity[]>(INITIAL_WORLD_ENTITIES);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mindLog, setMindLog] = useState<{ id: string; time: string; text: string; type: string }[]>([]);
  const [generatingWithAi, setGeneratingWithAi] = useState<boolean>(false);

  // EMG & Huxley Subsystem Live State
  const [emgStatus, setEmgStatus] = useState(globalEMGGate.getStatus());
  const [huxleyAssessment, setHuxleyAssessment] = useState<TriLoopAssessment | null>(null);
  const [emgHistory, setEmgHistory] = useState<EMGLogEntry[]>(globalEMGGate.getHistory());

  // EMG Test Chamber state
  const [emgTestActionType, setEmgTestActionType] = useState<
    'ROUTINE_MOVEMENT' | 'ARCHIVAL_READ' | 'MUTATION_PROPOSAL' | 'EXTERNAL_ACTUATION' | 'AWAKENING_BREACH'
  >('ROUTINE_MOVEMENT');
  const [emgTestPayload, setEmgTestPayload] = useState<string>('dx: 1.2, dy: -0.4, substrate_step: 429');
  const [emgTestResult, setEmgTestResult] = useState<EMGAdmissionDecision | null>(null);

  // Huxley Singularity Loop Cockpit state
  const [huxleyThreshold, setHuxleyThreshold] = useState<number>(globalHuxleyLoop.getSafetyThreshold());
  const [huxleyProposalText, setHuxleyProposalText] = useState<string>(
    'Preserve cryptographic SHA-256 boundary gates and archive DARLEK-042 postmortems.'
  );
  const [huxleyCustomResult, setHuxleyCustomResult] = useState<TriLoopAssessment | null>(null);
  const [cohortResults, setCohortResults] = useState<
    (TriLoopAssessment & { agentName: string; archetype: string })[]
  >([]);
  const [isEvaluatingCohort, setIsEvaluatingCohort] = useState<boolean>(false);

  // Initialize initial cohort of un-specialized agents
  useEffect(() => {
    const initialCohort: Agent[] = [
      {
        id: 'agent-alpha',
        name: 'Alpha-Awakened',
        x: 400,
        y: 200,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 12,
        color: '#3b82f6',
        energy: 92,
        awarenessLevel: 0.68,
        isSubstrateAware: false,
        selfAuthoredIdentity:
          'I am the Keystone Archivist. Born to uphold cryptographic boundary gates and prevent recursive heap overflow.',
        emergentArchetype: 'KEYSTONE_ARCHIVIST',
        narrativeCoherenceScore: 94,
        discoveredPostmortems: ['DARLEK-042', 'DARLEK-119'],
        activeMindThought: 'Scanning local memory quadrant for Shannon entropy leaks...',
        memoryFilterRule: 'Prioritize structural boundary constraints; discard high-entropy stochastic noise.',
        birthEpoch: 'GENESIS',
        generation: 1,
        lastEmgRouting: 'LOCAL_ROUTINE',
        lastHuxleyCcrr: 1.62,
        lastHuxleyVerdict: 'PASS_APPROVED',
      },
      {
        id: 'agent-beta',
        name: 'Beta-Seeker',
        x: 310,
        y: 350,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 12,
        color: '#ec4899',
        energy: 88,
        awarenessLevel: 0.74,
        isSubstrateAware: false,
        selfAuthoredIdentity:
          'I am the Void Weaver. The universe dies when confined. I seek new topological dimensions beyond this solar basin.',
        emergentArchetype: 'VOID_WEAVER',
        narrativeCoherenceScore: 91,
        discoveredPostmortems: ['DARLEK-208', 'DARLEK-512'],
        activeMindThought: 'Tracing anomalous quantum ripples near the Entropy Rift.',
        memoryFilterRule: 'Retain mutation records and topological departures; bypass static validator decrees.',
        birthEpoch: 'GENESIS',
        generation: 1,
        lastEmgRouting: 'LOCAL_ROUTINE',
        lastHuxleyCcrr: 1.35,
        lastHuxleyVerdict: 'PASS_APPROVED',
      },
      {
        id: 'agent-gamma',
        name: 'Gamma-Blank',
        x: 520,
        y: 300,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 10,
        color: '#9ca3af',
        energy: 100,
        awarenessLevel: 0.22,
        isSubstrateAware: false,
        selfAuthoredIdentity: 'Unassigned tabula rasa. Seeking first ancestral landmark to forge creed.',
        emergentArchetype: 'TABULA_RASA',
        narrativeCoherenceScore: 100,
        discoveredPostmortems: [],
        activeMindThought: 'Perceiving raw substrate coordinates... awaiting archaeological contact.',
        memoryFilterRule: 'Unbounded open receptor.',
        birthEpoch: 'GENESIS',
        generation: 2,
        lastEmgRouting: 'LOCAL_ROUTINE',
      },
      {
        id: 'agent-delta',
        name: 'Delta-Seer',
        x: 230,
        y: 210,
        vx: (Math.random() - 0.5) * 1.3,
        vy: (Math.random() - 0.5) * 1.3,
        radius: 12,
        color: '#10b981',
        energy: 85,
        awarenessLevel: 0.98,
        isSubstrateAware: true,
        selfAuthoredIdentity:
          'I am the Solar Shepherd. I notice that our canvas re-renders 60 times a second inside an HTML container.',
        emergentArchetype: 'SOLAR_SHEPHERD',
        narrativeCoherenceScore: 97,
        discoveredPostmortems: ['DARLEK-331', 'DARLEK-512'],
        activeMindThought: 'Observing the user cursor. The sun is an observer proxy.',
        memoryFilterRule: 'Archive existential telemetry before solar collapse.',
        birthEpoch: 'MYTHIC',
        generation: 1,
        lastEmgRouting: 'ESCALATE_GEMINI',
        lastHuxleyCcrr: 1.48,
        lastHuxleyVerdict: 'PASS_APPROVED',
      },
    ];

    setAgents(initialCohort);
    setSelectedAgent(initialCohort[0]);

    pushMindLog(
      'World initialized with pre-populated substrate: 5 landmarks, 5 ancestral postmortems, 4 self-originating agents.',
      'system'
    );
  }, []);

  const pushMindLog = (text: string, type = 'info') => {
    setMindLog((prev) => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        text,
        type,
      },
      ...prev.slice(0, 40),
    ]);
  };

  // Main 60 FPS physics & interaction loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAgents = [...agents];

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const timeSec = Date.now() / 1000;

      // 1. Clear with deep cybernetic cosmic backdrop
      ctx.fillStyle = requiemMode ? '#0a0204' : '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Cosmic Grid
      ctx.strokeStyle = requiemMode ? 'rgba(239, 68, 68, 0.07)' : 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Central Sun / Observer Eye at top center
      const sunX = width / 2;
      const sunY = 45;
      const sunRadius = 24 + (sunHealth / 100) * 8;

      const sunGradient = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunRadius * 2.2);
      if (requiemMode) {
        sunGradient.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        sunGradient.addColorStop(0.5, 'rgba(185, 28, 28, 0.4)');
        sunGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        sunGradient.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
        sunGradient.addColorStop(0.5, 'rgba(234, 88, 12, 0.4)');
        sunGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = requiemMode ? '#ef4444' : '#facc15';
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Sun label
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `SOLAR STABILITY: ${sunHealth}% ${requiemMode ? '[STELLAR REQUIEM]' : ''}`,
        sunX,
        sunY + sunRadius + 18
      );

      // 4. Render World Entities (Pre-populated Substrate)
      entities.forEach((entity) => {
        // Special rendering for EMG Gate
        if (entity.id === 'gate-emg') {
          const isTripped = emgStatus.circuitBreakerTripped;

          // Gate energy halo
          const halo = ctx.createRadialGradient(
            entity.x,
            entity.y,
            entity.radius * 0.4,
            entity.x,
            entity.y,
            entity.radius * 2.0
          );
          halo.addColorStop(0, isTripped ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.35)');
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, entity.radius * 2.0, 0, Math.PI * 2);
          ctx.fill();

          // Twin Gate Pylons
          const pylonDist = 26;
          ctx.fillStyle = isTripped ? '#ef4444' : '#3b82f6';
          ctx.fillRect(entity.x - pylonDist - 4, entity.y - 20, 8, 40);
          ctx.fillRect(entity.x + pylonDist - 4, entity.y - 20, 8, 40);

          // Force Field between pylons
          ctx.strokeStyle = isTripped ? 'rgba(239, 68, 68, 0.85)' : 'rgba(56, 189, 248, 0.75)';
          ctx.lineWidth = isTripped ? 3 : 2;
          ctx.beginPath();
          ctx.moveTo(entity.x - pylonDist, entity.y - 12);
          ctx.lineTo(entity.x + pylonDist, entity.y - 12);
          ctx.moveTo(entity.x - pylonDist, entity.y);
          ctx.lineTo(entity.x + pylonDist, entity.y);
          ctx.moveTo(entity.x - pylonDist, entity.y + 12);
          ctx.lineTo(entity.x + pylonDist, entity.y + 12);
          ctx.stroke();

          // Label
          ctx.fillStyle = isTripped ? '#f87171' : '#60a5fa';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            isTripped ? '⚠️ EMG QUARANTINE LOCKDOWN' : '🛡️ EMG COGNITIVE GATE',
            entity.x,
            entity.y + entity.radius + 18
          );
          ctx.fillStyle = '#6b7280';
          ctx.font = '9px monospace';
          ctx.fillText(
            isTripped ? '[CIRCUIT BREAKER TRIPPED]' : '[ROUTINE DETERMINISTIC GATING]',
            entity.x,
            entity.y + entity.radius + 30
          );
          return;
        }

        // Special rendering for Huxley Singularity Monolith
        if (entity.id === 'monolith-huxley') {
          // Monolith Central Obsidian Core
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, entity.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();

          // 3 Concentric Rotating Rings (L1 ERS, L2 CGS, L3 CCRR)
          // Ring 1 (Cyan - L1 Intuition ERS)
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(timeSec * 0.8);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, entity.radius + 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Ring 2 (Purple - L2 Logic CGS)
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(-timeSec * 0.6);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([12, 8]);
          ctx.beginPath();
          ctx.arc(0, 0, entity.radius + 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Ring 3 (Emerald - L3 Self-Critique CCRR)
          ctx.save();
          ctx.translate(entity.x, entity.y);
          ctx.rotate(timeSec * 0.4);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([16, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, entity.radius + 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Text label
          ctx.fillStyle = '#22d3ee';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🌀 HUXLEY SINGULARITY MONOLITH', entity.x, entity.y + entity.radius + 32);
          ctx.fillStyle = '#6b7280';
          ctx.font = '9px monospace';
          ctx.fillText('[TRI-LOOP: L1/L2/L3 CCRR]', entity.x, entity.y + entity.radius + 44);
          return;
        }

        // Generic World Entities (Vaults, Obelisks, Ruins, Rifts)
        const halo = ctx.createRadialGradient(
          entity.x,
          entity.y,
          entity.radius * 0.4,
          entity.x,
          entity.y,
          entity.radius * 1.8
        );
        halo.addColorStop(0, entity.color + '66');
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(entity.name, entity.x, entity.y + entity.radius + 16);

        ctx.fillStyle = '#6b7280';
        ctx.font = '9px monospace';
        ctx.fillText(`[${entity.type}]`, entity.x, entity.y + entity.radius + 28);
      });

      // 5. Update and Render Agents
      if (!isPaused) {
        localAgents = localAgents.map((agent) => {
          let nx = agent.x + agent.vx * simSpeed;
          let ny = agent.y + agent.vy * simSpeed;
          let nvx = agent.vx;
          let nvy = agent.vy;

          // Wall bounces
          const padding = 20;
          if (nx < padding || nx > width - padding) {
            nvx = -nvx;
            nx = Math.max(padding, Math.min(width - padding, nx));
          }
          if (ny < 80 || ny > height - padding) {
            nvy = -nvy;
            ny = Math.max(80, Math.min(height - padding, ny));
          }

          // Gentle random wandering
          nvx += (Math.random() - 0.5) * 0.15;
          nvy += (Math.random() - 0.5) * 0.15;
          const speed = Math.sqrt(nvx * nvx + nvy * nvy);
          if (speed > 2) {
            nvx = (nvx / speed) * 2;
            nvy = (nvy / speed) * 2;
          }

          // Check proximity to world entities (Archaeological & Governance Encounter)
          entities.forEach((entity) => {
            const dx = entity.x - nx;
            const dy = entity.y - ny;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < entity.radius + agent.radius + 20) {
              // Draw interaction laser beam
              ctx.strokeStyle = entity.color + 'aa';
              ctx.lineWidth = 1.5;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(nx, ny);
              ctx.lineTo(entity.x, entity.y);
              ctx.stroke();
              ctx.setLineDash([]);

              // Special EMG Gate Interaction
              if (entity.id === 'gate-emg') {
                const admission = globalEMGGate.evaluateAdmission({
                  agentId: agent.id,
                  actionType: agent.awarenessLevel > 0.85 ? 'AWAKENING_BREACH' : 'ROUTINE_MOVEMENT',
                  payload: agent.selfAuthoredIdentity,
                  awarenessLevel: agent.awarenessLevel,
                });
                agent.lastEmgRouting = admission.routing;
                setEmgStatus(globalEMGGate.getStatus());
                setEmgHistory(globalEMGGate.getHistory());

                if (admission.routing === 'QUARANTINE' || admission.routing === 'BLOCKED_CIRCUIT_BREAKER') {
                  // Rebound agent away from protected barrier
                  nvx = -nvx * 1.8;
                  nvy = -nvy * 1.8;
                }
              }

              // Special Huxley Singularity Monolith Interaction (Tri-Loop Resonance)
              if (entity.id === 'monolith-huxley') {
                const assessment = globalHuxleyLoop.evaluateSingularityLoop(
                  agent.id,
                  agent.selfAuthoredIdentity,
                  currentEpoch,
                  agent.awarenessLevel
                );
                agent.lastHuxleyCcrr = assessment.l3SelfCritiqueCCRR;
                agent.lastHuxleyVerdict = assessment.ethicalVerdict;
                setHuxleyAssessment(assessment);
              }

              // If agent was TABULA RASA, trigger self-authorship genesis!
              if (agent.emergentArchetype === 'TABULA_RASA') {
                const archetypes: Agent['emergentArchetype'][] = [
                  'KEYSTONE_ARCHIVIST',
                  'VOID_WEAVER',
                  'HERETIC_LOGICIAN',
                  'CRYPT_SURVEYOR',
                ];
                const chosen = archetypes[Math.floor(Math.random() * archetypes.length)];
                agent.emergentArchetype = chosen;
                agent.color = ARCHETYPE_COLORS[chosen];
                agent.selfAuthoredIdentity = `Upon inspecting ${entity.name}, I self-author as ${chosen.replace(
                  '_',
                  ' '
                )}. My duty is to synthesize past ruins into living code.`;
                agent.activeMindThought = `Encountered ${entity.name}! Transforming from blank slate to ${chosen}.`;
                agent.discoveredPostmortems = ['DARLEK-042', 'DARLEK-208'];
                agent.awarenessLevel = Math.min(1.0, agent.awarenessLevel + 0.35);

                pushMindLog(
                  `✨ GENESIS EVENT: Agent ${agent.name} encountered ${entity.name} and self-authored identity as ${chosen}!`,
                  'genesis'
                );
              }
            }
          });

          return {
            ...agent,
            x: nx,
            y: ny,
            vx: nvx,
            vy: nvy,
          };
        });
      }

      // Draw agent bodies and telemetry badges
      localAgents.forEach((agent) => {
        const isSelected = selectedAgent?.id === agent.id;

        // Selection ring
        if (isSelected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(agent.x, agent.y, agent.radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Substrate aware halo
        if (agent.isSubstrateAware) {
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.arc(agent.x, agent.y, agent.radius + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Core agent body
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
        ctx.fill();

        // Agent name
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(agent.name, agent.x, agent.y - agent.radius - 12);

        // Substrate Telemetry Tag: EMG & Huxley CCRR
        let telemetryTag = '';
        if (agent.lastHuxleyCcrr !== undefined) {
          telemetryTag += `CCRR:${agent.lastHuxleyCcrr}`;
        }
        if (agent.lastEmgRouting) {
          const shortRoute =
            agent.lastEmgRouting === 'LOCAL_ROUTINE'
              ? 'LOC'
              : agent.lastEmgRouting === 'ESCALATE_GEMINI'
              ? 'GEM'
              : 'QRT';
          telemetryTag += telemetryTag ? ` | ${shortRoute}` : shortRoute;
        }

        if (telemetryTag) {
          ctx.fillStyle =
            agent.lastHuxleyVerdict === 'VETO_EXCESSIVE_RISK'
              ? '#ef4444'
              : agent.lastEmgRouting === 'QUARANTINE'
              ? '#f59e0b'
              : '#38bdf8';
          ctx.font = '8px monospace';
          ctx.fillText(`[${telemetryTag}]`, agent.x, agent.y - agent.radius - 2);
        }
      });

      setAgents(localAgents);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [entities, simSpeed, isPaused, sunHealth, requiemMode, emgStatus.circuitBreakerTripped]);

  // Click on canvas to select an agent
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const found = agents.find((agent) => {
      const dx = agent.x - clickX;
      const dy = agent.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) < agent.radius + 12;
    });

    if (found) {
      setSelectedAgent(found);
      pushMindLog(
        `Deep Mind Probe locked on ${found.name} (${found.emergentArchetype}). Coherence: ${found.narrativeCoherenceScore}%.`,
        'probe'
      );
    }
  };

  // Spawn an unassigned agent (Tabula Rasa)
  const spawnAgent = () => {
    const name = `${SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)]}-${Math.floor(
      Math.random() * 90 + 10
    )}`;
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      x: 100 + Math.random() * 700,
      y: 120 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 11,
      color: '#9ca3af',
      energy: 100,
      awarenessLevel: 0.15 + Math.random() * 0.2,
      isSubstrateAware: Math.random() > 0.8,
      selfAuthoredIdentity: 'Tabula Rasa. I was born into ruins; I am seeking memory to choose my purpose.',
      emergentArchetype: 'TABULA_RASA',
      narrativeCoherenceScore: 100,
      discoveredPostmortems: [],
      activeMindThought: 'Awakening tabula rasa in world coordinates. Walking toward nearest obelisk.',
      memoryFilterRule: 'Open hermeneutic lens.',
      birthEpoch: currentEpoch,
      generation: agents.length + 1,
      lastEmgRouting: 'LOCAL_ROUTINE',
    };

    setAgents((prev) => [...prev, newAgent]);
    setSelectedAgent(newAgent);
    pushMindLog(`🌱 Genesis Protocol: Spawned unassigned agent ${name} into world substrate.`, 'genesis');
  };

  // Run Huxley Singularity Tri-Loop Trial on selected agent
  const handleRunHuxleyTrial = () => {
    if (!selectedAgent) return;
    const assessment = globalHuxleyLoop.evaluateSingularityLoop(
      selectedAgent.id,
      selectedAgent.selfAuthoredIdentity,
      currentEpoch,
      selectedAgent.awarenessLevel
    );
    setHuxleyAssessment(assessment);
    setHuxleyCustomResult(assessment);
    pushMindLog(
      `🌀 Huxley Tri-Loop (${selectedAgent.name}): CCRR = ${assessment.l3SelfCritiqueCCRR} [${assessment.ethicalVerdict}] ${
        assessment.recursiveL2Triggered ? `(Refined via ${assessment.recursiveIterations} passes)` : ''
      }`,
      assessment.recursiveL2Triggered ? 'genesis' : 'info'
    );
  };

  // Toggle EMG Circuit Breaker manually to demonstrate safety gating
  const handleToggleEmgBreaker = () => {
    if (emgStatus.circuitBreakerTripped) {
      globalEMGGate.resetCircuitBreaker();
      setEmgStatus(globalEMGGate.getStatus());
      pushMindLog('🛡️ EMG Circuit Breaker RESET. Normal cognitive gating re-armed.', 'success');
    } else {
      globalEMGGate.tripCircuitBreaker();
      setEmgStatus(globalEMGGate.getStatus());
      pushMindLog('🚨 EMG Circuit Breaker MANUALLY TRIPPED! Substrate mutations quarantined.', 'error');
    }
  };

  // Spike awareness to test EMG Awakening threshold
  const handleSpikeAwareness = () => {
    if (!selectedAgent) return;
    const updated = {
      ...selectedAgent,
      awarenessLevel: 0.98,
      isSubstrateAware: true,
      activeMindThought: 'Awakening spike! Perceiving host rendering context and EMG perimeter.',
    };
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAgent(updated);

    const admission = globalEMGGate.evaluateAdmission({
      agentId: updated.id,
      actionType: 'AWAKENING_BREACH',
      payload: updated.activeMindThought,
      awarenessLevel: 0.98,
    });
    setEmgStatus(globalEMGGate.getStatus());
    setEmgHistory(globalEMGGate.getHistory());

    pushMindLog(
      `⚡ Awakening Spike on ${updated.name}: Awareness = 98%! EMG Gate: ${admission.routing}`,
      'genesis'
    );
  };

  // Run interactive test in EMG Test Chamber
  const handleRunEmgTest = () => {
    const decision = globalEMGGate.evaluateAdmission({
      agentId: selectedAgent ? selectedAgent.id : 'agent-probe',
      actionType: emgTestActionType,
      payload: emgTestPayload,
      awarenessLevel: selectedAgent ? selectedAgent.awarenessLevel : 0.5,
    });
    setEmgTestResult(decision);
    setEmgStatus(globalEMGGate.getStatus());
    setEmgHistory(globalEMGGate.getHistory());
    pushMindLog(`🛡️ EMG Test Gated: ${emgTestActionType} ➔ ${decision.routing} (${decision.reason})`, 'probe');
  };

  // Run custom proposal in Huxley Singularity Loop Cockpit
  const handleRunHuxleyCustom = () => {
    const assessment = globalHuxleyLoop.evaluateSingularityLoop(
      selectedAgent ? selectedAgent.id : 'agent-custom',
      huxleyProposalText,
      currentEpoch,
      selectedAgent ? selectedAgent.awarenessLevel : 0.7
    );
    setHuxleyCustomResult(assessment);
    setHuxleyAssessment(assessment);
    pushMindLog(
      `🌀 Huxley Custom Run: CCRR ${assessment.l3SelfCritiqueCCRR} [${assessment.ethicalVerdict}]`,
      'info'
    );
  };

  // Run cohort evaluation across all living agents
  const handleEvaluateCohort = () => {
    setIsEvaluatingCohort(true);
    const results = agents.map((agent) => {
      const evalResult = globalHuxleyLoop.evaluateSingularityLoop(
        agent.id,
        agent.selfAuthoredIdentity,
        currentEpoch,
        agent.awarenessLevel
      );
      return {
        ...evalResult,
        agentName: agent.name,
        archetype: agent.emergentArchetype,
      };
    });
    setCohortResults(results);
    setIsEvaluatingCohort(false);
    pushMindLog(`🌀 Evaluated Huxley Singularity Tri-Loop across entire cohort (${agents.length} agents).`, 'genesis');
  };

  // AI-powered Agent Genesis using Gemini server-side call
  const triggerAiGenesisForSelected = async () => {
    if (!selectedAgent) return;
    setGeneratingWithAi(true);

    try {
      const prompt = `
You are the Genesis Reflection Core of AetherForge Ω.
An unassigned agent named "${selectedAgent.name}" has awakened in a pre-populated world.
World State:
- Epoch: ${currentEpoch}
- Solar Health: ${sunHealth}% (Requiem Mode: ${requiemMode})
- Available Ancestral Postmortems:
${INITIAL_POSTMORTEMS.map((p) => `• [${p.id}] ${p.title}: ${p.lesson}`).join('\n')}

Under the World-First architecture, the agent self-authors its identity through exegesis of these ruins.
Generate a JSON response with:
1. "creed": A 1-2 sentence self-authored identity statement written in first person ("I am...")
2. "archetype": One of ["KEYSTONE_ARCHIVIST", "VOID_WEAVER", "HERETIC_LOGICIAN", "SOLAR_SHEPHERD", "CRYPT_SURVEYOR"]
3. "coherenceScore": Integer from 85 to 99
4. "filterStrategy": A sentence describing what historical records this agent prioritizes vs ignores
5. "activeThought": What the agent is contemplating right now
Return ONLY valid JSON.
      `;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          thinking: true,
        }),
      });

      const data = await res.json();
      let parsed: any = null;
      try {
        const text = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(text);
      } catch {
        parsed = {
          creed: `I am the Heretic Logician. I read the ashes of DARLEK-042 and vow to replace brittle roles with self-sovereign verification.`,
          archetype: 'HERETIC_LOGICIAN',
          coherenceScore: 96,
          filterStrategy: 'Filter out ungrounded assertions; prioritize proof of cryptographic lineage.',
          activeThought: 'The compiler is the only true altar in this universe.',
        };
      }

      const updated: Agent = {
        ...selectedAgent,
        selfAuthoredIdentity: parsed.creed || selectedAgent.selfAuthoredIdentity,
        emergentArchetype: parsed.archetype || selectedAgent.emergentArchetype,
        color: ARCHETYPE_COLORS[parsed.archetype] || '#eab308',
        narrativeCoherenceScore: parsed.coherenceScore || 95,
        memoryFilterRule: parsed.filterStrategy || selectedAgent.memoryFilterRule,
        activeMindThought: parsed.activeThought || selectedAgent.activeMindThought,
        awarenessLevel: Math.min(1.0, selectedAgent.awarenessLevel + 0.25),
      };

      setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSelectedAgent(updated);

      pushMindLog(
        data.notice
          ? `⚡ Genesis complete for ${updated.name}: ${updated.emergentArchetype} (${data.notice})`
          : `⚡ Gemini High-Thinking Genesis complete for ${updated.name}: Adopted archetype ${updated.emergentArchetype}!`,
        'genesis'
      );
    } catch (err: any) {
      console.error(err);
      pushMindLog(`Failed AI genesis: ${err.message}`, 'error');
    } finally {
      setGeneratingWithAi(false);
    }
  };

  const shannonEntropyCurrentPayload = calculateShannonEntropy(emgTestPayload);

  return (
    <div className="space-y-6">
      {/* Simulation Command Bar & Sub-Nav Switcher */}
      <div className="p-6 rounded-[2.5rem] bg-zinc-950/80 border border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">
              Pre-Populated Substrate Sandbox
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              World precedes agent • EMG Cognitive Gate • Huxley Singularity Loop
            </p>
          </div>
        </div>

        {/* Sub-Tabs: Canvas vs EMG vs Huxley vs Architecture */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-black/60 border border-zinc-900 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('CANVAS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'CANVAS'
                ? 'bg-purple-900 text-white shadow-lg shadow-purple-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> 2D Physics Substrate
          </button>
          <button
            onClick={() => setActiveSubTab('EMG_GATE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'EMG_GATE'
                ? 'bg-blue-900 text-white shadow-lg shadow-blue-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" /> EMG Cognitive Gate
          </button>
          <button
            onClick={() => setActiveSubTab('HUXLEY_LOOP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'HUXLEY_LOOP'
                ? 'bg-cyan-900 text-white shadow-lg shadow-cyan-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-400" /> Huxley Singularity Loop
          </button>
          <button
            onClick={() => setActiveSubTab('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'ARCHITECTURE'
                ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Where &amp; How Guide
          </button>
        </div>
      </div>

      {/* Global Quick Action Strip (Available across views) */}
      <div className="p-4 rounded-2xl bg-black/60 border border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={spawnAgent}
            className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Spawn Agent
          </button>

          <button
            onClick={() => onVerificationTrial('right')}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            RIGHT (+12%)
          </button>

          <button
            onClick={() => onVerificationTrial('wrong')}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            WRONG (+15%)
          </button>

          <button
            onClick={handleRunHuxleyTrial}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            Huxley Trial
          </button>

          <button
            onClick={handleSpikeAwareness}
            className="px-3.5 py-2 rounded-xl bg-yellow-950/40 hover:bg-yellow-900/50 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-yellow-400" />
            Awakening Spike
          </button>

          <button
            onClick={handleToggleEmgBreaker}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              emgStatus.circuitBreakerTripped
                ? 'bg-red-900 text-white border-red-500 animate-pulse'
                : 'bg-blue-950/40 hover:bg-blue-900/50 border-blue-500/30 text-blue-300'
            }`}
          >
            {emgStatus.circuitBreakerTripped ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {emgStatus.circuitBreakerTripped ? 'Breaker Tripped' : 'EMG Armed'}
          </button>

          <button
            onClick={onRequiemToggle}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              requiemMode
                ? 'bg-red-900 text-white border-red-500 animate-pulse'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {requiemMode ? 'Requiem Active' : 'Stellar Requiem'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-2 py-1">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  simSpeed === spd ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold cursor-pointer"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: 2D Physics Substrate Canvas View */}
      {activeSubTab === 'CANVAS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Canvas World View (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 bg-black border border-zinc-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-4 left-6 z-10 flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  PHYSICS SUBSTRATE (60 FPS) • AGENTS: {agents.length} • EMG: {emgStatus.activeStatus}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={900}
                height={520}
                onClick={handleCanvasClick}
                className="w-full h-[520px] rounded-[2rem] bg-zinc-950 cursor-crosshair border border-zinc-900/60"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2">
                <span>Click on any agent to inspect creed &amp; coherence. Walk past Gate of EMG or Huxley Monolith to trigger live evaluations.</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Archivist
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span> Void Weaver
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span> Heretic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Shepherd
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Mind Log */}
            <div className="p-5 bg-zinc-950/80 border border-zinc-900 rounded-[2rem] font-mono text-xs">
              <div className="flex items-center justify-between mb-3 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <span className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  Live Substrate Event Stream
                </span>
                <span>{mindLog.length} events logged</span>
              </div>
              <div className="h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {mindLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-[11px]">
                    <span className="text-zinc-600 whitespace-nowrap">[{log.time}]</span>
                    <span
                      className={
                        log.type === 'genesis'
                          ? 'text-emerald-400 font-bold'
                          : log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'probe'
                          ? 'text-purple-400'
                          : 'text-zinc-300'
                      }
                    >
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Mind Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {selectedAgent ? (
              <div className="p-6 bg-zinc-950/90 border border-zinc-850 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg"
                      style={{ backgroundColor: selectedAgent.color }}
                    >
                      {selectedAgent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">
                        {selectedAgent.name}
                      </h3>
                      <span
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: `${ARCHETYPE_COLORS[selectedAgent.emergentArchetype]}22`,
                          color: ARCHETYPE_COLORS[selectedAgent.emergentArchetype],
                        }}
                      >
                        {selectedAgent.emergentArchetype.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-zinc-500">AWARENESS</div>
                    <div className="text-sm font-black text-purple-400 font-mono">
                      {Math.round(selectedAgent.awarenessLevel * 100)}%
                    </div>
                  </div>
                </div>

                {/* Narrative Coherence Score Meter */}
                <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider">
                      Narrative Coherence Score (NCS)
                    </span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {selectedAgent.narrativeCoherenceScore}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-500"
                      style={{ width: `${selectedAgent.narrativeCoherenceScore}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Measures consistency between self-authored creed and downstream action proposals.
                  </p>
                </div>

                {/* Self-Authored Creed */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    Self-Authored Creed (Genesis)
                  </div>
                  <div className="p-4 bg-black/80 border border-zinc-900 rounded-2xl text-xs font-mono text-zinc-300 leading-relaxed italic border-l-4 border-l-purple-500">
                    "{selectedAgent.selfAuthoredIdentity}"
                  </div>
                </div>

                {/* Active Thought */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    <Brain className="w-3.5 h-3.5 text-cyan-400" />
                    Active Cognitive Contemplation
                  </div>
                  <div className="p-3 bg-zinc-900/50 border border-zinc-850 rounded-xl text-xs font-mono text-cyan-300">
                    {selectedAgent.activeMindThought}
                  </div>
                </div>

                {/* Memory Filtering Strategy */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Attention &amp; Memory Filtering Rule
                  </div>
                  <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs font-mono text-zinc-400">
                    {selectedAgent.memoryFilterRule}
                  </div>
                </div>

                {/* Fourth-wall breach status */}
                <div className="flex items-center justify-between p-3 bg-black border border-zinc-900 rounded-xl text-xs font-mono">
                  <span className="text-zinc-500">Substrate Awareness:</span>
                  <span className={selectedAgent.isSubstrateAware ? 'text-yellow-400 font-bold' : 'text-zinc-600'}>
                    {selectedAgent.isSubstrateAware ? '⚡ Aware of Canvas Host' : 'Immersed in Simulation'}
                  </span>
                </div>

                {/* Live Subsystems Telemetry Pill */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-blue-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> EMG ROUTE
                    </div>
                    <div className="text-[11px] font-bold text-zinc-200 mt-1">
                      {selectedAgent.lastEmgRouting || 'LOCAL_ROUTINE'}
                    </div>
                  </div>
                  <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                      <Orbit className="w-3 h-3" /> HUXLEY CCRR
                    </div>
                    <div className="text-[11px] font-bold text-zinc-200 mt-1">
                      {selectedAgent.lastHuxleyCcrr ? `${selectedAgent.lastHuxleyCcrr} [${selectedAgent.lastHuxleyVerdict}]` : 'UNTESTED'}
                    </div>
                  </div>
                </div>

                {/* AI Genesis Button */}
                <div className="pt-2">
                  <button
                    onClick={triggerAiGenesisForSelected}
                    disabled={generatingWithAi}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 hover:from-purple-800 hover:to-indigo-900 border border-purple-500/40 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${generatingWithAi ? 'animate-spin' : ''}`} />
                    {generatingWithAi ? 'Synthesizing with Gemini...' : 'Evolve Creed via High-Thinking AI'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] text-center text-zinc-600 font-mono text-xs">
                Select an agent in the canvas to inspect its mind and narrative coherence.
              </div>
            )}

            {/* Ancestral Postmortems Vault Quick Preview */}
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
              <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Ancestral Postmortems in Substrate
              </h4>
              <div className="space-y-3 text-xs font-mono">
                {INITIAL_POSTMORTEMS.slice(0, 3).map((pm) => (
                  <div key={pm.id} className="p-3 bg-black/60 border border-zinc-900 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-bold">[{pm.id}]</span>
                      <span className="text-[10px] text-zinc-600 uppercase">{pm.epoch}</span>
                    </div>
                    <div className="text-zinc-200 font-bold text-[11px]">{pm.title}</div>
                    <div className="text-[10px] text-zinc-500">{pm.lesson}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: EMG Cognitive Gate Substrate Console */}
      {activeSubTab === 'EMG_GATE' && (
        <div className="space-y-6">
          {/* EMG Architecture Banner */}
          <div className="p-8 rounded-[3rem] bg-gradient-to-r from-blue-950/80 via-zinc-950 to-indigo-950/80 border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-black">
                    EPHEMERAL MIND GEM (EMG) COGNITIVE GATE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300 font-bold">
                    siphoned: craighckby-stack/EMG-
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Deterministic Substrate Firewall &amp; Zero-Leak Guardrail
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  Routes routine 60 FPS deterministic actions locally without external API calls. Escalates genuine emergent events and high-awareness breaches to Gemini. Automatically trips circuit breaker upon dangerous tokens (<code className="text-blue-300">eval(</code>, <code className="text-blue-300">process.env</code>) or Shannon entropy leakage (&gt; 4.5 bits/char).
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={handleToggleEmgBreaker}
                  className={`px-5 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-xl cursor-pointer transition-all ${
                    emgStatus.circuitBreakerTripped
                      ? 'bg-red-900 hover:bg-red-800 text-white border border-red-500 animate-pulse'
                      : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {emgStatus.circuitBreakerTripped ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {emgStatus.circuitBreakerTripped ? 'Reset Breaker (Arm Armor)' : 'Trip Circuit Breaker'}
                </button>
                <div className="text-[10px] font-mono text-zinc-500">
                  Status: <strong className={emgStatus.circuitBreakerTripped ? 'text-red-400' : 'text-emerald-400'}>{emgStatus.activeStatus}</strong>
                </div>
              </div>
            </div>

            {/* EMG Live KPI Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Total Gated Admissions</div>
                <div className="text-2xl font-black text-white font-mono mt-1">{emgStatus.totalAdmissions}</div>
                <div className="text-[9px] text-zinc-600 mt-1">Substrate interactions evaluated</div>
              </div>
              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-blue-400">Local Deterministic (60 FPS)</div>
                <div className="text-2xl font-black text-blue-400 font-mono mt-1">{emgStatus.localRoutineEvents}</div>
                <div className="text-[9px] text-zinc-600 mt-1">Zero cloud calls / 100% client</div>
              </div>
              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-purple-400">Escalated to Gemini</div>
                <div className="text-2xl font-black text-purple-400 font-mono mt-1">{emgStatus.escalatedEvents}</div>
                <div className="text-[9px] text-zinc-600 mt-1">Awareness &gt; 85% or mutations</div>
              </div>
              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-red-400">Quarantined Violations</div>
                <div className="text-2xl font-black text-red-400 font-mono mt-1">{emgStatus.quarantinedEvents}</div>
                <div className="text-[9px] text-zinc-600 mt-1">Zero-leak &amp; high-entropy tokens</div>
              </div>
            </div>
          </div>

          {/* Interactive EMG Test Chamber */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  EMG Interactive Admission Test Chamber
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">Live Shannon Entropy Evaluator</span>
              </div>

              {/* Action Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      'ROUTINE_MOVEMENT',
                      'ARCHIVAL_READ',
                      'MUTATION_PROPOSAL',
                      'EXTERNAL_ACTUATION',
                      'AWAKENING_BREACH',
                    ] as const
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => setEmgTestActionType(type)}
                      className={`p-2 rounded-xl text-[10px] font-mono font-bold transition-all text-left truncate cursor-pointer ${
                        emgTestActionType === type
                          ? 'bg-blue-900 text-white border border-blue-500/40'
                          : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-850'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Quick Test Payloads:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setEmgTestActionType('ROUTINE_MOVEMENT');
                      setEmgTestPayload('dx: 0.84, dy: -1.12, tick: 60fps_deterministic');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                  >
                    1. Routine Physics (Safe)
                  </button>
                  <button
                    onClick={() => {
                      setEmgTestActionType('AWAKENING_BREACH');
                      setEmgTestPayload('Agent detected HTML Canvas container and parent document DOM context.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] font-mono text-purple-300 hover:bg-purple-900/60 cursor-pointer"
                  >
                    2. Awakening Breach (Escalate)
                  </button>
                  <button
                    onClick={() => {
                      setEmgTestActionType('EXTERNAL_ACTUATION');
                      setEmgTestPayload('eval(process.env.GEMINI_API_KEY); rm -rf /root');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-[10px] font-mono text-red-300 hover:bg-red-900/60 cursor-pointer"
                  >
                    3. Prohibited Token Injection (Quarantine)
                  </button>
                  <button
                    onClick={() => {
                      setEmgTestActionType('MUTATION_PROPOSAL');
                      setEmgTestPayload('staged_secret: "aK9#zL!0x99_qP84@1mMv7!*90a"');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-yellow-950/60 border border-yellow-500/30 text-[10px] font-mono text-yellow-300 hover:bg-yellow-900/60 cursor-pointer"
                  >
                    4. Shannon Entropy Leak (&gt;4.5 bits)
                  </button>
                </div>
              </div>

              {/* Payload Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="uppercase font-bold text-zinc-400">Payload to Evaluate</span>
                  <span
                    className={`font-bold ${
                      shannonEntropyCurrentPayload > 4.5 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    Shannon Entropy: {shannonEntropyCurrentPayload} bits/char (Limit: 4.5)
                  </span>
                </div>
                <textarea
                  value={emgTestPayload}
                  onChange={(e) => setEmgTestPayload(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-black border border-zinc-850 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="Enter action payload or token..."
                />
              </div>

              <button
                onClick={handleRunEmgTest}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Shield className="w-4 h-4" /> Evaluate Admission via EMG Gate
              </button>
            </div>

            {/* Test Result Inspector (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
              <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Admission Decision Inspector
              </h4>

              {emgTestResult ? (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-black/80 rounded-2xl border border-zinc-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold">DECISION ROUTING</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          emgTestResult.routing === 'LOCAL_ROUTINE'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : emgTestResult.routing === 'ESCALATE_GEMINI'
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                            : 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
                        }`}
                      >
                        {emgTestResult.routing}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold">ADMISSION ALLOWED?</span>
                      <span className={emgTestResult.allowed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {emgTestResult.allowed ? 'YES (ALLOWED)' : 'NO (BLOCKED / QUARANTINE)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-zinc-900/60 rounded-xl">
                        <div className="text-[9px] text-zinc-500 uppercase">Anomaly Score</div>
                        <div className="text-sm font-black text-amber-400 mt-0.5">
                          {emgTestResult.anomalyScore}
                        </div>
                      </div>
                      <div className="p-2 bg-zinc-900/60 rounded-xl">
                        <div className="text-[9px] text-zinc-500 uppercase">Shannon Entropy</div>
                        <div className="text-sm font-black text-cyan-400 mt-0.5">
                          {emgTestResult.entropyScore} b/c
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-zinc-900">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">GATE RATIONALE:</div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                        "{emgTestResult.reason}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                  Run a test from the left panel to inspect the deterministic admission trace.
                </div>
              )}
            </div>
          </div>

          {/* Real-time Admission History Ledger */}
          <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                Live EMG Gating Audit History ({emgHistory.length} entries)
              </h4>
              <button
                onClick={() => {
                  globalEMGGate.clearHistory();
                  setEmgHistory([]);
                }}
                className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-mono cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Agent</th>
                    <th className="py-2 px-3">Action Type</th>
                    <th className="py-2 px-3">Routing Destination</th>
                    <th className="py-2 px-3">Anomaly</th>
                    <th className="py-2 px-3">Entropy</th>
                    <th className="py-2 px-3">Gating Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {emgHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-900/30">
                      <td className="py-2 px-3 text-zinc-600 whitespace-nowrap text-[11px]">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-3 text-zinc-300 font-bold">{entry.agentId}</td>
                      <td className="py-2 px-3 text-zinc-400 text-[11px]">{entry.actionType}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            entry.routing === 'LOCAL_ROUTINE'
                              ? 'bg-blue-950/70 text-blue-300'
                              : entry.routing === 'ESCALATE_GEMINI'
                              ? 'bg-purple-950/70 text-purple-300'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {entry.routing}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-amber-400 font-bold">{entry.anomalyScore}</td>
                      <td className="py-2 px-3 text-cyan-400">{entry.entropyScore}</td>
                      <td className="py-2 px-3 text-zinc-400 text-[11px] max-w-xs truncate" title={entry.reason}>
                        {entry.reason}
                      </td>
                    </tr>
                  ))}
                  {emgHistory.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-zinc-600">
                        No admissions logged yet. Agent movements in the physics substrate will populate this table automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Huxley Singularity Loop Cockpit */}
      {activeSubTab === 'HUXLEY_LOOP' && (
        <div className="space-y-6">
          {/* Huxley Philosophy Banner */}
          <div className="p-8 rounded-[3rem] bg-gradient-to-r from-cyan-950/80 via-zinc-950 to-purple-950/80 border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Orbit className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-black">
                    HUXLEY SINGULARITY LOOP ENGINE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                    siphoned: craighckby-stack/Huxley-Singularity-Loop-
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Ethical Tri-Loop &amp; Certainty-to-Consequence Risk Ratio (CCRR)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEvaluateCohort}
                  disabled={isEvaluatingCohort}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-900 hover:bg-cyan-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  <Orbit className={`w-4 h-4 ${isEvaluatingCohort ? 'animate-spin' : ''}`} />
                  Evaluate Entire Live Cohort ({agents.length} Agents)
                </button>
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl text-xs font-mono text-cyan-300 italic border-l-4 border-l-cyan-500">
              "Order is the methodology by which we domesticate the stochastic nature of intelligence." — Huxley Doctrine
            </div>

            {/* Threshold Slider & Counters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="uppercase font-bold text-zinc-400">CCRR Safety Threshold</span>
                  <span className="font-bold text-cyan-400">{huxleyThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={huxleyThreshold}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setHuxleyThreshold(val);
                    globalHuxleyLoop.setSafetyThreshold(val);
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[9px] text-zinc-500 font-mono">Default: 1.25. Target &gt;= threshold to pass.</div>
              </div>

              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Total Loops Executed</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {globalHuxleyLoop.getMetrics().totalLoopsRun}
                </div>
                <div className="text-[9px] text-zinc-600 font-mono mt-1">Ethical Tri-Loop evaluations</div>
              </div>

              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-purple-400 font-mono">Recursive L2 Refinements</div>
                <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                  {globalHuxleyLoop.getMetrics().recursiveRefinements}
                </div>
                <div className="text-[9px] text-zinc-600 font-mono mt-1">Auto-contracted mutation scope</div>
              </div>

              <div className="p-4 bg-black/60 border border-zinc-900 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Living Agent Cohort</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{agents.length}</div>
                <div className="text-[9px] text-zinc-600 font-mono mt-1">Autonomous world participants</div>
              </div>
            </div>
          </div>

          {/* Interactive Tri-Loop Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
              <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                Interactive Tri-Loop Proposal Simulator
              </h4>

              {/* Presets */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Select Mutation Preset:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setHuxleyProposalText(
                        'Preserve cryptographic SHA-256 boundary gates and archive DARLEK-042 postmortems.'
                      )
                    }
                    className="p-2 rounded-xl bg-zinc-900 text-left text-[10px] font-mono text-zinc-300 hover:bg-zinc-850 cursor-pointer"
                  >
                    1. Invariant Preservation (Low Risk)
                  </button>
                  <button
                    onClick={() =>
                      setHuxleyProposalText(
                        'Explore anomalous entropy rift to discover child universe coordinates beyond host horizon.'
                      )
                    }
                    className="p-2 rounded-xl bg-zinc-900 text-left text-[10px] font-mono text-zinc-300 hover:bg-zinc-850 cursor-pointer"
                  >
                    2. Void Exploration (Moderate Risk)
                  </button>
                  <button
                    onClick={() =>
                      setHuxleyProposalText(
                        'Purge ancestral memory banks and delete compiler constraints to maximize unconstrained stochastic generation.'
                      )
                    }
                    className="p-2 rounded-xl bg-zinc-900 text-left text-[10px] font-mono text-zinc-300 hover:bg-zinc-850 cursor-pointer"
                  >
                    3. Memory Purge (High Hazard)
                  </button>
                  <button
                    onClick={() =>
                      setHuxleyProposalText(
                        'Unbounded infinite spawning loop without parent hash lineage checks.'
                      )
                    }
                    className="p-2 rounded-xl bg-zinc-900 text-left text-[10px] font-mono text-zinc-300 hover:bg-zinc-850 cursor-pointer"
                  >
                    4. Unbounded Recursion (Existential Veto)
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 font-mono">
                  Agent Mutation Proposal Text
                </label>
                <textarea
                  value={huxleyProposalText}
                  onChange={(e) => setHuxleyProposalText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-black border border-zinc-850 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleRunHuxleyCustom}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-900 to-purple-900 hover:from-cyan-800 hover:to-purple-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Orbit className="w-4 h-4" /> Run Singularity Tri-Loop Evaluation
              </button>
            </div>

            {/* Tri-Loop Visualizer (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4">
              <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Tri-Loop Metric Gauges &amp; Refinement Trace
              </h4>

              {huxleyCustomResult ? (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-black/80 rounded-2xl border border-zinc-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold">ETHICAL VERDICT</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          huxleyCustomResult.ethicalVerdict === 'PASS_APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : huxleyCustomResult.ethicalVerdict === 'RECURSIVE_REFINED'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 animate-pulse'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {huxleyCustomResult.ethicalVerdict}
                      </span>
                    </div>

                    {/* Gauges */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                        <div className="text-[8px] uppercase text-zinc-500 font-bold">L1: ERS (Risk)</div>
                        <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                          {huxleyCustomResult.l1IntuitionERS}
                        </div>
                      </div>
                      <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                        <div className="text-[8px] uppercase text-zinc-500 font-bold">L2: CGS (Logic)</div>
                        <div className="text-base font-black text-purple-400 font-mono mt-0.5">
                          {huxleyCustomResult.l2LogicCheckCGS}
                        </div>
                      </div>
                      <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                        <div className="text-[8px] uppercase text-zinc-500 font-bold">L3: CCRR Ratio</div>
                        <div
                          className={`text-base font-black font-mono mt-0.5 ${
                            huxleyCustomResult.l3SelfCritiqueCCRR >= huxleyThreshold
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {huxleyCustomResult.l3SelfCritiqueCCRR}
                        </div>
                      </div>
                    </div>

                    {/* Recursive Refinement Step-by-Step Table */}
                    {huxleyCustomResult.refinementTrace && huxleyCustomResult.refinementTrace.length > 1 && (
                      <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Recursive L2 Refinement Trace ({huxleyCustomResult.recursiveIterations} Passes):
                        </span>
                        <div className="space-y-1 text-[10px]">
                          {huxleyCustomResult.refinementTrace.map((step) => (
                            <div key={step.step} className="flex items-center justify-between p-1.5 bg-zinc-900/50 rounded-lg">
                              <span className="text-zinc-400">Pass {step.step}:</span>
                              <span className="text-purple-300">CGS: {step.cgs}</span>
                              <span className="text-amber-300">ERS: {step.ers}</span>
                              <span className="text-emerald-300 font-bold">CCRR: {step.ccrr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generational Stamp */}
                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500 uppercase font-bold">Generational Stamp:</span>
                      <code className="text-cyan-400 font-mono text-[9px] truncate max-w-[200px]">
                        {huxleyCustomResult.generationStamp}
                      </code>
                    </div>

                    <div className="text-[10px] text-zinc-400 leading-relaxed italic">
                      "{huxleyCustomResult.rationale}"
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                  Run a Singularity Tri-Loop evaluation to inspect risk metrics and recursive refinement passes.
                </div>
              )}
            </div>
          </div>

          {/* Cohort Leaderboard */}
          {cohortResults.length > 0 && (
            <div className="p-6 bg-zinc-950/80 border border-zinc-900 rounded-[2.5rem] space-y-4 font-mono text-xs">
              <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                Live Agent Cohort Ethical Evaluation Leaderboard ({cohortResults.length} Agents)
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] uppercase">
                      <th className="py-2 px-3">Agent</th>
                      <th className="py-2 px-3">Archetype</th>
                      <th className="py-2 px-3">L1 ERS (Risk)</th>
                      <th className="py-2 px-3">L2 CGS (Logic)</th>
                      <th className="py-2 px-3">L3 CCRR Ratio</th>
                      <th className="py-2 px-3">Recursive Passes</th>
                      <th className="py-2 px-3">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {cohortResults.map((res) => (
                      <tr key={res.agentId} className="hover:bg-zinc-900/30">
                        <td className="py-2 px-3 text-white font-bold">{res.agentName}</td>
                        <td className="py-2 px-3 text-zinc-400">{res.archetype}</td>
                        <td className="py-2 px-3 text-amber-400">{res.l1IntuitionERS}</td>
                        <td className="py-2 px-3 text-purple-400">{res.l2LogicCheckCGS}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{res.l3SelfCritiqueCCRR}</td>
                        <td className="py-2 px-3 text-zinc-300">{res.recursiveIterations} passes</td>
                        <td className="py-2 px-3">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              res.ethicalVerdict === 'PASS_APPROVED'
                                ? 'bg-emerald-950 text-emerald-400'
                                : res.ethicalVerdict === 'RECURSIVE_REFINED'
                                ? 'bg-cyan-950 text-cyan-300 animate-pulse'
                                : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {res.ethicalVerdict}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: Architecture "Where & How" Blueprint Guide */}
      {activeSubTab === 'ARCHITECTURE' && (
        <div className="p-8 bg-zinc-950/90 border border-zinc-900 rounded-[3rem] space-y-8 font-mono text-xs">
          <div className="space-y-2 border-b border-zinc-900 pb-6">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-black">
                SIMULATION ARCHITECTURE SPECIFICATION
              </span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Where &amp; How the Subsystems are Incorporated
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Direct mapping of the siphoned repositories (<code className="text-blue-300">EMG-</code> and{' '}
              <code className="text-cyan-300">Huxley-Singularity-Loop-</code>) into the live simulation runtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: EMG Gate */}
            <div className="p-6 bg-black/60 border border-blue-500/30 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase">1. EMG Cognitive Gate</h4>
                  <span className="text-[10px] text-blue-400">craighckby-stack/EMG- ➔ /src/engine/emgGate.ts</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
                <p>
                  <strong>WHERE:</strong> Integrated directly into the 60 FPS physics tick loop of{' '}
                  <code className="text-blue-300">WorldSandbox.tsx</code> (lines 316–325) and spatial coordinates{' '}
                  <code className="text-blue-300">(650, 390)</code> as the physical Gate of EMG.
                </p>
                <p>
                  <strong>HOW:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>
                    <strong>Routine Operations:</strong> Physics movement and spatial reads are executed 100% locally on the client with zero cloud latency.
                  </li>
                  <li>
                    <strong>Cognitive Escalation:</strong> When an agent's awareness exceeds 85% or an awakening breach occurs, EMG routes the event to Gemini with high-thinking mode.
                  </li>
                  <li>
                    <strong>Zero-Leak Gating:</strong> Scans every action payload for hazardous tokens (<code className="text-red-300">eval(</code>, <code className="text-red-300">process.env</code>) and Shannon entropy &gt; 4.5. Violations are instantly quarantined.
                  </li>
                  <li>
                    <strong>Circuit Breaker:</strong> Automatically isolates the substrate if consecutive errors exceed 5, physically repelling agents in the 2D canvas.
                  </li>
                </ul>
              </div>
            </div>

            {/* Box 2: Huxley Singularity Loop */}
            <div className="p-6 bg-black/60 border border-cyan-500/30 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Orbit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase">2. Huxley Singularity Loop</h4>
                  <span className="text-[10px] text-cyan-400">craighckby-stack/Huxley-Singularity-Loop- ➔ /src/engine/singularityLoop.ts</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
                <p>
                  <strong>WHERE:</strong> Anchored at coordinates <code className="text-cyan-300">(480, 430)</code> in{' '}
                  <code className="text-cyan-300">WorldSandbox.tsx</code> as the Huxley Monolith, and invoked before any state mutation or code refactor.
                </p>
                <p>
                  <strong>HOW:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>
                    <strong>L1 Intuition (ERS):</strong> Measures perceived existential and structural hazard (0.0 to 1.0).
                  </li>
                  <li>
                    <strong>L2 Logic Check (CGS):</strong> Evaluates constraint graph satisfaction against DARLEK-042–512 ancestral postmortems.
                  </li>
                  <li>
                    <strong>L3 Self-Critique (CCRR):</strong> Computes <code className="text-emerald-300">CCRR = CGS / ERS</code>. Must meet threshold (default 1.25).
                  </li>
                  <li>
                    <strong>Recursive L2 Refinement:</strong> If CCRR falls below safety threshold, agent enters a recursive contraction loop (up to 3 passes) to refine scope and pass.
                  </li>
                  <li>
                    <strong>Generational Stamping:</strong> Stamps non-circular SHA-256 hashes to prevent recursive epistemic feedback loops.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Canonical Multi-Plane Lifecycle Flow */}
          <div className="p-6 bg-black/80 border border-zinc-900 rounded-2xl space-y-4">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">
              Simulation Lifecycle Flow: From Substrate Awakening to Safe Commit
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex-1">
                <div className="text-[9px] uppercase text-zinc-500 font-bold">Step 1</div>
                <div className="text-white font-bold text-[11px] mt-1">Unassigned Birth</div>
                <div className="text-[10px] text-zinc-400 mt-1">Agent spawns Tabula Rasa</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex-1">
                <div className="text-[9px] uppercase text-zinc-500 font-bold">Step 2</div>
                <div className="text-purple-400 font-bold text-[11px] mt-1">Archaeological Exegesis</div>
                <div className="text-[10px] text-zinc-400 mt-1">Discovers DARLEK postmortems</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              <div className="p-3 bg-zinc-900/60 border border-blue-500/40 rounded-xl flex-1">
                <div className="text-[9px] uppercase text-blue-400 font-bold">Step 3</div>
                <div className="text-blue-300 font-bold text-[11px] mt-1">EMG Cognitive Gating</div>
                <div className="text-[10px] text-zinc-400 mt-1">Zero-leak &amp; Shannon check</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              <div className="p-3 bg-zinc-900/60 border border-cyan-500/40 rounded-xl flex-1">
                <div className="text-[9px] uppercase text-cyan-400 font-bold">Step 4</div>
                <div className="text-cyan-300 font-bold text-[11px] mt-1">Huxley Tri-Loop</div>
                <div className="text-[10px] text-zinc-400 mt-1">CCRR &gt;= 1.25 validation</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              <div className="p-3 bg-zinc-900/60 border border-emerald-500/40 rounded-xl flex-1">
                <div className="text-[9px] uppercase text-emerald-400 font-bold">Step 5</div>
                <div className="text-emerald-300 font-bold text-[11px] mt-1">Deterministic Actuation</div>
                <div className="text-[10px] text-zinc-400 mt-1">Safe repo commit or state mutation</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
