import React, { useState, useEffect } from 'react';
import { BookOpen, FileCode, Copy, Check, Download, Sparkles, RefreshCw, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  title: string;
  summary: string;
}

const DOCS: DocItem[] = [
  {
    id: 'README.md',
    name: 'README.md',
    title: 'AetherForge Ω: World-First Substrate & Core System',
    summary: 'Replaces the 1 billion agent swarm with singular self-originating agents discovering specialization in a pre-populated world.',
  },
  {
    id: 'PHILOSOPHY.md',
    name: 'PHILOSOPHY.md',
    title: 'Section 5: When the Agent Authors Its Own Genesis',
    summary: 'Explains why hardcoded specialist roles are brittle, and how hermeneutic interpretation yields durable behavioral coherence.',
  },
  {
    id: 'APPLICATIONS.md',
    name: 'APPLICATIONS.md',
    title: 'Empirical Applications & Narrative Coherence Probes',
    summary: 'Testing agent self-origination, measuring the Narrative Coherence Score (NCS), and gating external mutations.',
  },
  {
    id: 'ARCHITECTURE.md',
    name: 'ARCHITECTURE.md',
    title: 'Technical Inversion Matrix & Genesis Pseudocode',
    summary: 'Side-by-side comparison, technical diagrams, initialization lifecycle pseudocode, and 3 concrete emergence scenarios.',
  },
];

export const DocCenter: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>('README.md');
  const [content, setContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'RENDERED' | 'RAW' | 'DIFF'>('RENDERED');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEvolving, setIsEvolving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    fetchDoc(selectedDoc);
  }, [selectedDoc]);

  const fetchDoc = async (docName: string) => {
    try {
      const res = await fetch(`/api/docs/${docName}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/docs/${selectedDoc}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setSaveStatus('Saved successfully to repository!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err: any) {
      setSaveStatus('Error saving: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedDoc;
    a.click();
    URL.revokeObjectURL(url);
  };

  // AI Modernize using Gemini 3.1 Pro High-Thinking
  const handleAiModernize = async () => {
    setIsEvolving(true);
    try {
      const prompt = `
You are the Lead Systems Architect of AetherForge Ω.
Modernize and deepen the following documentation module (${selectedDoc}) according to the new branding guidelines and "world-first, self-originating agents" architecture.
Maintain the poetic, philosophical, and formally precise tone.
Strengthen the contrast between the old model (hardcoded roles, 1B shallow swarm) and the new model (world pre-populated with DARLEK postmortems, agents self-author identity, emergent specialization).

CURRENT CONTENT:
${content}

Return the complete, updated markdown document.
      `;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          thinking: true, // ThinkingLevel.HIGH
        }),
      });

      const data = await res.json();
      if (data.text) {
        setContent(data.text);
        setSaveStatus(
          data.notice
            ? `Modernized (${data.notice})`
            : `Modernized via ${data.model || 'Gemini 3.1 Pro'}!`
        );
        setTimeout(() => setSaveStatus(''), 3500);
      }
    } catch (err: any) {
      setSaveStatus('AI modernization failed: ' + err.message);
    } finally {
      setIsEvolving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Doc Header */}
      <div className="p-8 rounded-[3rem] bg-zinc-950/90 border border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400 text-3xl shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                Modernized Core Documentation Suite
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-bold uppercase">
                AetherForge Ω v3.0 Spec
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Aligned with sanitized-agent-engines • World-First Architecture • Narrative Self-Authorship
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold font-mono flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold font-mono flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={handleAiModernize}
            disabled={isEvolving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900 border border-blue-500/40 text-white text-xs font-black uppercase font-mono flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isEvolving ? 'animate-spin' : ''}`} />
            {isEvolving ? 'Deepening via Gemini 3.1 Pro...' : 'Evolve with Gemini 3.1 Pro'}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-emerald-500/40 text-white text-xs font-black uppercase font-mono flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 font-mono text-xs text-center font-bold">
          {saveStatus}
        </div>
      )}

      {/* Document Selector Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOCS.map((doc) => {
          const isSelected = selectedDoc === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500/50 shadow-xl'
                  : 'bg-zinc-950/80 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-black ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`}>
                  {doc.name}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>}
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h4>
              <p className="text-[11px] text-zinc-500 font-mono line-clamp-2 leading-relaxed">{doc.summary}</p>
            </button>
          );
        })}
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('RENDERED')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              viewMode === 'RENDERED'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Formatted Reading View
          </button>
          <button
            onClick={() => setViewMode('RAW')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              viewMode === 'RAW'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Raw Markdown Editor
          </button>
          <button
            onClick={() => setViewMode('DIFF')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              viewMode === 'DIFF'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Architecture Inversion Matrix (Diff)
          </button>
        </div>

        <span className="text-[10px] font-mono text-zinc-600">
          Target File: <code className="text-zinc-400 font-bold">/{selectedDoc}</code>
        </span>
      </div>

      {/* Main Document Content Container */}
      <div className="p-8 bg-black/90 border border-zinc-900 rounded-[2.5rem] shadow-2xl relative">
        {viewMode === 'RAW' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="w-full bg-black font-mono text-xs text-zinc-300 p-4 rounded-xl border border-zinc-900 outline-none focus:border-blue-500/50 leading-relaxed resize-y"
          />
        )}

        {viewMode === 'RENDERED' && (
          <div className="prose prose-invert max-w-none font-sans text-sm text-zinc-300 leading-relaxed space-y-4">
            <pre className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          </div>
        )}

        {viewMode === 'DIFF' && (
          <div className="space-y-6 font-mono text-xs">
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Structural Architecture Inversion Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Model */}
              <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-3">
                <span className="text-red-400 font-black text-xs uppercase tracking-wider block">
                  OLD MODEL (AetherForge v2.0)
                </span>
                <ul className="space-y-2 text-zinc-400 text-xs list-disc pl-4 leading-relaxed">
                  <li><strong>Swarm Scale:</strong> Attempted to orchestrate 1 billion different agent types.</li>
                  <li><strong>Role Imposition:</strong> External prompts assigned rigid roles ("You are Architect", "You are Coder").</li>
                  <li><strong>Brittleness:</strong> When environment shifted, agents panicked or hallucinated outside their label.</li>
                  <li><strong>Memory Bus:</strong> Centralized RAG used purely as an unstructured data cache.</li>
                  <li><strong>World Order:</strong> World generated as an afterthought around requested tasks.</li>
                </ul>
              </div>

              {/* New Model */}
              <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3">
                <span className="text-emerald-400 font-black text-xs uppercase tracking-wider block">
                  NEW MODEL (AetherForge Ω v3.0)
                </span>
                <ul className="space-y-2 text-zinc-300 text-xs list-disc pl-4 leading-relaxed">
                  <li><strong>Coherent Singularity:</strong> Fewer, vastly more coherent agents with rich internal lives.</li>
                  <li><strong>Self-Authorship:</strong> Agents born unassigned, read ancestral ruins, and write their own creed.</li>
                  <li><strong>Emergent Specialization:</strong> Role emerges from lived interaction and self-selected memory.</li>
                  <li><strong>Ancestral Library:</strong> DARLEK_CAAN ledger holds chained postmortems read during Genesis.</li>
                  <li><strong>World First:</strong> Pre-populated substrate with physical ruins and constraints precedes the agent.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
