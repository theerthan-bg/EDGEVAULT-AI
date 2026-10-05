import type { SystemState } from '../hooks/useSystemState';
import { Panel, PanelHeader } from '../components/ui';
import { Activity, Filter } from 'lucide-react';
import { useState } from 'react';

interface Props {
  state: SystemState;
}

const eventColors: Record<string, string> = {
  'MEMORY_CREATED': 'text-cyan-400',
  'EMBEDDING_GENERATED': 'text-violet-400',
  'LOCAL_VECTOR_INSERTED': 'text-cyan-400',
  'SEMANTIC_SEARCH': 'text-blue-400',
  'NETWORK_OFFLINE': 'text-amber-400',
  'NETWORK_ONLINE': 'text-emerald-400',
  'SYNC_QUEUED': 'text-amber-400',
  'SYNC_STARTED': 'text-cyan-400',
  'SYNC_COMPLETED': 'text-emerald-400',
  'SYNC_FAILED': 'text-red-400',
  'CONFLICT_DETECTED': 'text-red-400',
  'POLICY_EVALUATED': 'text-violet-400',
  'CONNECTION_RESTORED': 'text-emerald-400',
};

const statusDot: Record<string, string> = {
  'INFO': 'bg-cyan-400',
  'SUCCESS': 'bg-emerald-400',
  'WARNING': 'bg-amber-400',
  'ERROR': 'bg-red-500',
};

export function ActivityLog({ state }: Props) {
  const [filter, setFilter] = useState<string>('ALL');

  const events = [
    'ALL', 'MEMORY_CREATED', 'EMBEDDING_GENERATED', 'LOCAL_VECTOR_INSERTED',
    'SEMANTIC_SEARCH', 'NETWORK_OFFLINE', 'NETWORK_ONLINE', 'SYNC_QUEUED',
    'SYNC_STARTED', 'SYNC_COMPLETED', 'SYNC_FAILED', 'CONFLICT_DETECTED', 'POLICY_EVALUATED', 'CONNECTION_RESTORED',
  ];

  const filtered = filter === 'ALL' ? state.activity : state.activity.filter(a => a.event === filter);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-slate-200">ACTIVITY LOG</h2>
        <p className="text-xs font-mono-tech text-slate-500 mt-0.5">SYSTEM EVENT STREAM · INFRASTRUCTURE LOG</p>
      </div>

      {/* Filter */}
      <Panel className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          {events.map(ev => (
            <button
              key={ev}
              onClick={() => setFilter(ev)}
              className={`px-2.5 py-1 text-[9px] font-mono-tech tracking-wider border rounded transition-all ${
                filter === ev
                  ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
                  : 'border-[#1a2540] text-slate-500 hover:border-slate-600'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>
      </Panel>

      {/* Log stream */}
      <Panel>
        <PanelHeader title="EVENT STREAM" subtitle={`${filtered.length} EVENTS`} icon={<Activity />} right={
          <span className="text-[10px] font-mono-tech text-slate-600">LIVE</span>
        } />
        <div className="max-h-[600px] overflow-y-auto ev-scroll">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs font-mono-tech text-slate-600">NO EVENTS MATCH FILTER</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1a2540]/30">
              {filtered.map(entry => (
                <div key={entry.id} className="px-4 py-2.5 hover:bg-white/[0.02] transition-colors animate-fade-in-fast">
                  <div className="flex items-center gap-3 text-[10px] font-mono-tech">
                    <span className="text-slate-600 flex-shrink-0 w-16">{new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[entry.status]}`} />
                    <span className={`flex-shrink-0 w-36 truncate ${eventColors[entry.event] || 'text-slate-400'}`}>{entry.event}</span>
                    <span className="text-slate-600 flex-shrink-0 w-24 truncate hidden sm:inline">{entry.device}</span>
                    {entry.memoryId && <span className="text-slate-700 flex-shrink-0 hidden md:inline">{entry.memoryId}</span>}
                    <span className="text-slate-500 truncate flex-1 min-w-0">{entry.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
