import type { SystemState } from '../hooks/useSystemState';
import { edgeNodes, connections } from '../lib/mockData';
import { WorldMap } from '../components/WorldMap';
import { Panel, PanelHeader, MetricCard, StatusDot } from '../components/ui';
import { Database, Cloud, RefreshCw, Lock, GitBranch, Gauge, Cpu, HardDrive, Brain, Wifi, Activity, Zap, Play, Network, Search } from 'lucide-react';

interface Props {
  state: SystemState;
  reducedMotion: boolean;
  onToggleOnline: () => void;
  onRunSync: () => void;
  onStartDemo: () => void;
}

export function CommandCenter({ state, reducedMotion, onToggleOnline, onRunSync, onStartDemo }: Props) {
  const { online, syncState, memories, syncQueue, conflicts, lastSync, searchLatency } = state;

  const localCount = memories.length;
  const cloudCount = memories.filter(m => m.syncStatus === 'SYNCED').length;
  const pendingCount = syncQueue.filter(s => s.status === 'PENDING' || s.status === 'READY').length;
  const privateCount = memories.filter(m => m.category === 'PRIVATE').length;
  const conflictCount = conflicts.filter(c => c.status === 'UNRESOLVED').length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Offline banner */}
      {!online && (
        <div className="ev-panel ev-glow-amber p-3 flex items-center justify-between animate-slide-up border-amber-500/30">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-tech text-amber-400 tracking-wider">OFFLINE MODE — LOCAL INTELLIGENCE ACTIVE — NO CLOUD REQUESTS</span>
          </div>
          <span className="text-[10px] font-mono-tech text-amber-400/60 hidden sm:inline">Network unavailable — continuing with local intelligence.</span>
        </div>
      )}

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="LOCAL MEMORIES" value={localCount} icon={<Database className="w-4 h-4" />} accent="cyan" />
        <MetricCard label="CLOUD MEMORIES" value={cloudCount} icon={<Cloud className="w-4 h-4" />} accent="cyan" />
        <MetricCard label="PENDING SYNC" value={pendingCount} icon={<RefreshCw className="w-4 h-4" />} accent="amber" trend={pendingCount > 0 ? 'QUEUED' : 'EMPTY'} />
        <MetricCard label="PRIVATE MEMORIES" value={privateCount} icon={<Lock className="w-4 h-4" />} accent="violet" trend="LOCAL ONLY" />
        <MetricCard label="CONFLICTS" value={String(conflictCount).padStart(2, '0')} icon={<GitBranch className="w-4 h-4" />} accent={conflictCount > 0 ? 'red' : 'emerald'} />
        <MetricCard label="SEARCH LATENCY" value={searchLatency} unit="ms" icon={<Gauge className="w-4 h-4" />} accent="emerald" trend="QDRANT EDGE" />
      </div>

      {/* World map + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2 overflow-hidden">
          <PanelHeader
            title="EDGE NETWORK MAP"
            subtitle="DISTRIBUTED MEMORY INFRASTRUCTURE"
            icon={<Network />}
            right={
              <span className={`text-[10px] font-mono-tech tracking-wider ${online ? 'text-emerald-400' : 'text-amber-400'}`}>
                {online ? '● NETWORK ACTIVE' : '● LOCAL ONLY'}
              </span>
            }
          />
          <div className="relative">
            <WorldMap
              online={online}
              syncing={syncState === 'SYNCING'}
              nodes={edgeNodes}
              connections={connections}
              height={380}
              reducedMotion={reducedMotion}
            />
            {!online && (
              <div className="absolute top-3 left-3 ev-panel px-3 py-1.5">
                <span className="text-[10px] font-mono-tech text-amber-400 tracking-wider">LOCAL INTELLIGENCE ACTIVE</span>
              </div>
            )}
            {syncState === 'SYNCING' && (
              <div className="absolute top-3 left-3 ev-panel px-3 py-1.5 ev-glow-cyan">
                <span className="text-[10px] font-mono-tech text-cyan-400 tracking-wider animate-blink">SYNCING TO CLOUD...</span>
              </div>
            )}
          </div>
        </Panel>

        {/* Edge Node Status */}
        <Panel>
          <PanelHeader title="EDGE NODE STATUS" subtitle="EDGE-NODE-01" icon={<Cpu />} right={<StatusDot status="online" />} />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1a2540]">
              <div className="relative">
                <div className="w-10 h-10 border border-cyan-500/30 rounded-lg flex items-center justify-center ev-glow-cyan animate-heartbeat">
                  <Cpu className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <p className="text-sm font-mono-tech text-slate-200">EDGE-NODE-01</p>
                <p className="text-[10px] font-mono-tech text-emerald-400">STATUS: ONLINE</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono-tech">
              {[
                { label: 'VECTOR DATABASE', value: 'QDRANT EDGE', icon: Database, status: 'online' as const },
                { label: 'EMBEDDING ENGINE', value: 'FASTEMBED', icon: Brain, status: 'online' as const },
                { label: 'LOCAL STORAGE', value: 'HEALTHY', icon: HardDrive, status: 'online' as const },
                { label: 'SEARCH ENGINE', value: 'ACTIVE', icon: Search, status: 'online' as const },
                { label: 'NETWORK', value: online ? 'CONNECTED' : 'DISCONNECTED', icon: Wifi, status: online ? 'online' as const : 'offline' as const },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <row.icon className="w-3.5 h-3.5" />
                    <span>{row.label}</span>
                  </div>
                  <span className={row.status === 'online' ? 'text-cyan-400' : 'text-amber-400'}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Controls + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel>
          <PanelHeader title="SYSTEM CONTROLS" subtitle="OPERATOR ACTIONS" icon={<Zap />} />
          <div className="p-4 space-y-3">
            <button
              onClick={onToggleOnline}
              className={`w-full py-2.5 text-xs font-mono-tech tracking-wider border rounded transition-all ${
                online
                  ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              {online ? 'SIMULATE OFFLINE' : 'RESTORE CONNECTION'}
            </button>
            <button
              onClick={onRunSync}
              disabled={!online || syncState === 'SYNCING' || pendingCount === 0}
              className="w-full py-2.5 text-xs font-mono-tech tracking-wider border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {syncState === 'SYNCING' ? 'SYNCING...' : 'RUN SYNC NOW'}
            </button>
            <button
              onClick={onStartDemo}
              className="w-full py-2.5 text-xs font-mono-tech tracking-wider border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/15 rounded transition-all ev-glow-cyan flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              START LIVE DEMO
            </button>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="RECENT SYSTEM EVENTS" subtitle="LIVE EVENT STREAM" icon={<Activity />} right={<span className="text-[10px] font-mono-tech text-slate-600">{state.activity.length} TOTAL</span>} />
          <div className="p-3 max-h-72 overflow-y-auto ev-scroll space-y-1.5">
            {state.activity.slice(0, 8).map(entry => (
              <div key={entry.id} className="flex items-center gap-3 text-[10px] font-mono-tech py-1.5 px-2 hover:bg-white/[0.02] rounded">
                <span className="text-slate-600 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                <span className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  entry.status === 'SUCCESS' ? 'bg-emerald-400' :
                  entry.status === 'WARNING' ? 'bg-amber-400' :
                  entry.status === 'ERROR' ? 'bg-red-500' : 'bg-cyan-400'
                }`} />
                <span className="text-cyan-400 flex-shrink-0 w-32 truncate">{entry.event}</span>
                <span className="text-slate-500 truncate">{entry.message}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
