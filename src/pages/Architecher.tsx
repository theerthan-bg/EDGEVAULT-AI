import type { SystemState } from '../hooks/useSystemState';
import { Panel, PanelHeader } from '../components/ui';
import { User, Monitor, Brain, Box, Database, Shield, RefreshCw, Cloud, Cpu, ArrowDown, Wifi, WifiOff, ArrowRight } from 'lucide-react';

interface Props {
  state: SystemState;
}

export function Architecture({ state }: Props) {
  const { online } = state;

  const localSteps = [
    { label: 'USER', icon: User, desc: 'Operator Interface' },
    { label: 'EDGEVAULT UI', icon: Monitor, desc: 'React Frontend' },
    { label: 'AI MEMORY AGENT', icon: Brain, desc: 'Memory Orchestrator' },
    { label: 'FASTEMBED', icon: Box, desc: 'BAAI/bge-small-en-v1.5' },
    { label: 'QDRANT EDGE', icon: Database, desc: 'Local Vector Store' },
    { label: 'MEMORY POLICY ENGINE', icon: Shield, desc: 'Governance & Rules' },
    { label: 'SYNC QUEUE', icon: RefreshCw, desc: 'Persistent Queue' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-slate-200">ARCHITECTURE VISUALIZER</h2>
        <p className="text-xs font-mono-tech text-slate-500 mt-0.5">SYSTEM DATA FLOW · LOCAL EDGE → REMOTE CLOUD</p>
      </div>

      {/* Online/offline indicator */}
      <Panel className={`p-3 ${online ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {online ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
            <span className={`text-xs font-mono-tech tracking-wider ${online ? 'text-emerald-400' : 'text-amber-400'}`}>
              {online ? 'ONLINE — FULL ARCHITECTURE OPERATIONAL' : 'OFFLINE — LOCAL EDGE OPERATIONAL · CLOUD UNAVAILABLE'}
            </span>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LOCAL EDGE */}
        <Panel glow={online || !online} className={online ? '' : 'ev-glow-cyan'}>
          <PanelHeader title="LOCAL EDGE" subtitle="ALWAYS OPERATIONAL" icon={<Cpu />} right={
            <span className="text-[10px] font-mono-tech text-emerald-400">● ACTIVE</span>
          } />
          <div className="p-6 space-y-2">
            {localSteps.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center gap-3 p-3 ev-panel border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                  <div className="w-9 h-9 border border-cyan-500/30 rounded-lg flex items-center justify-center ev-glow-cyan flex-shrink-0">
                    <step.icon className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono-tech text-slate-200 tracking-wider">{step.label}</p>
                    <p className="text-[9px] font-mono-tech text-slate-600">{step.desc}</p>
                  </div>
                </div>
                {i < localSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-cyan-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>

        {/* REMOTE CLOUD */}
        <Panel className={!online ? 'opacity-40' : ''}>
          <PanelHeader title="REMOTE CLOUD" subtitle={online ? 'QDRANT SERVER / CLOUD' : 'UNAVAILABLE'} icon={<Cloud />} right={
            <span className={`text-[10px] font-mono-tech ${online ? 'text-emerald-400' : 'text-amber-400'}`}>
              {online ? '● CONNECTED' : '● DISCONNECTED'}
            </span>
          } />
          <div className="p-6">
            {/* Sync arrow */}
            <div className="flex flex-col items-center mb-4">
              <div className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                online ? 'border-cyan-500/30 text-cyan-400 ev-glow-cyan' : 'border-slate-700 text-slate-600'
              }`}>
                <RefreshCw className={`w-4 h-4 ${online ? 'animate-pulse-slow' : ''}`} />
                <span className="text-xs font-mono-tech tracking-wider">SYNCHRONIZATION</span>
              </div>
              <ArrowDown className={`w-5 h-5 mt-2 ${online ? 'text-cyan-500/40' : 'text-slate-700'}`} />
            </div>

            {/* Cloud node */}
            <div className={`p-4 border rounded-lg transition-all ${
              online ? 'border-violet-500/20 ev-panel' : 'border-slate-700 ev-panel-solid'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${
                  online ? 'border-violet-500/30' : 'border-slate-700'
                }`}>
                  <Cloud className={`w-5 h-5 ${online ? 'text-violet-400' : 'text-slate-600'}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className={`text-sm font-mono-tech tracking-wider ${online ? 'text-slate-200' : 'text-slate-600'}`}>QDRANT CLOUD</p>
                  <p className={`text-[10px] font-mono-tech ${online ? 'text-violet-400' : 'text-slate-700'}`}>{online ? 'SYNC TARGET' : 'UNREACHABLE'}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-[10px] font-mono-tech">
                {[
                  { label: 'VECTOR DB', value: 'Qdrant Server' },
                  { label: 'DISTANCE', value: 'Cosine' },
                  { label: 'COLLECTION', value: 'edge_memories' },
                  { label: 'STATUS', value: online ? 'REACHABLE' : 'UNREACHABLE' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className={online ? 'text-slate-600' : 'text-slate-700'}>{row.label}</span>
                    <span className={online ? 'text-slate-400' : 'text-slate-700'}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline message */}
            {!online && (
              <div className="mt-4 p-3 border border-amber-500/20 rounded-lg text-center">
                <p className="text-[10px] font-mono-tech text-amber-400/70 tracking-wider">
                  LOCAL EDGE REMAINS OPERATIONAL<br />
                  CLOUD SYNC WILL RESUME WHEN CONNECTION RESTORES
                </p>
              </div>
            )}

            {/* Data flow when online */}
            {online && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-mono-tech text-slate-600 tracking-wider mb-2">DATA FLOW</p>
                {['ELIGIBLE MEMORIES', 'POLICY CHECK', 'BATCH UPLOAD', 'CONFIRMATION'].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono-tech border border-emerald-500/20 text-emerald-400/80 bg-emerald-500/5 rounded">{step}</span>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-emerald-500/40" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
