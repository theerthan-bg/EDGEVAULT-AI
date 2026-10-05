import type { SystemState } from '../hooks/useSystemState';
import { Panel, PanelHeader, StatusDot, CategoryBadge } from '../components/ui';
import { RefreshCw, Cloud, Check, X, AlertTriangle, Clock, RotateCw } from 'lucide-react';

interface Props {
  state: SystemState;
  onRunSync: () => void;
}

export function SyncCenter({ state, onRunSync }: Props) {
  const { syncState, syncQueue, online } = state;

  const stateColors: Record<string, string> = {
    'IDLE': 'text-slate-400',
    'SYNCING': 'text-cyan-400 animate-blink',
    'PAUSED': 'text-amber-400',
    'FAILED': 'text-red-400',
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'text-amber-400',
    'READY': 'text-cyan-400',
    'SYNCING': 'text-cyan-400 animate-blink',
    'SYNCED': 'text-emerald-400',
    'FAILED': 'text-red-400',
    'LOCAL ONLY': 'text-slate-500',
  };

  const lifecycle = ['PENDING', 'POLICY CHECK', 'READY', 'SYNCING', 'SYNCED'];
  const pendingCount = syncQueue.filter(s => s.status === 'PENDING' || s.status === 'READY').length;
  const syncedCount = syncQueue.filter(s => s.status === 'SYNCED').length;
  const failedCount = syncQueue.filter(s => s.status === 'FAILED').length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">SYNC CENTER</h2>
          <p className="text-xs font-mono-tech text-slate-500 mt-0.5">PERSISTENT SYNC QUEUE · QDRANT CLOUD</p>
        </div>
        <button
          onClick={onRunSync}
          disabled={!online || syncState === 'SYNCING' || pendingCount === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono-tech tracking-wider border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncState === 'SYNCING' ? 'animate-spin' : ''}`} />
          {syncState === 'SYNCING' ? 'SYNCING...' : 'RUN SYNC'}
        </button>
      </div>

      {/* Sync engine status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Panel className="p-4">
          <p className="text-[10px] font-mono-tech text-slate-600 tracking-wider">SYNC ENGINE</p>
          <p className={`text-lg font-mono-tech font-bold mt-1 ${stateColors[syncState]}`}>{syncState}</p>
          <div className="mt-2"><StatusDot status={syncState === 'SYNCING' ? 'online' : syncState === 'FAILED' ? 'error' : syncState === 'PAUSED' ? 'warning' : 'idle'} /></div>
        </Panel>
        <Panel className="p-4">
          <p className="text-[10px] font-mono-tech text-slate-600 tracking-wider">PENDING</p>
          <p className="text-lg font-mono-tech font-bold text-amber-400 mt-1">{pendingCount}</p>
          <p className="text-[9px] font-mono-tech text-slate-600 mt-1">QUEUED FOR SYNC</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-[10px] font-mono-tech text-slate-600 tracking-wider">SYNCED</p>
          <p className="text-lg font-mono-tech font-bold text-emerald-400 mt-1">{syncedCount}</p>
          <p className="text-[9px] font-mono-tech text-slate-600 mt-1">IN QDRANT CLOUD</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-[10px] font-mono-tech text-slate-600 tracking-wider">FAILED</p>
          <p className="text-lg font-mono-tech font-bold text-red-400 mt-1">{failedCount}</p>
          <p className="text-[9px] font-mono-tech text-slate-600 mt-1">RETRY QUEUE</p>
        </Panel>
      </div>

      {/* Lifecycle */}
      <Panel className="p-4">
        <PanelHeader title="SYNC LIFECYCLE" subtitle="PENDING → SYNCED" icon={<RefreshCw />} />
        <div className="p-4 flex items-center justify-center gap-1 flex-wrap text-[10px] font-mono-tech tracking-wider">
          {lifecycle.map((step, i, arr) => (
            <div key={step} className="flex items-center gap-1">
              <span className={`px-3 py-1.5 border rounded ${
                step === 'SYNCED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                step === 'SYNCING' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' :
                'border-slate-700 text-slate-400'
              }`}>{step}</span>
              {i < arr.length - 1 && <span className="text-cyan-500/40">→</span>}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex items-center justify-center gap-1 flex-wrap text-[10px] font-mono-tech tracking-wider">
          <span className="px-3 py-1.5 border border-red-500/30 text-red-400 bg-red-500/5 rounded">SYNCING</span>
          <span className="text-red-500/40">→</span>
          <span className="px-3 py-1.5 border border-red-500/30 text-red-400 bg-red-500/5 rounded">FAILED</span>
          <span className="text-red-500/40">→</span>
          <span className="px-3 py-1.5 border border-amber-500/30 text-amber-400 bg-amber-500/5 rounded">RETRY QUEUE</span>
        </div>
      </Panel>

      {/* Queue table */}
      <Panel>
        <PanelHeader title="SYNC QUEUE" subtitle={`${syncQueue.length} ITEMS`} icon={<Cloud />} right={
          <span className={`text-[10px] font-mono-tech ${online ? 'text-emerald-400' : 'text-amber-400'}`}>{online ? '● CLOUD REACHABLE' : '● CLOUD UNREACHABLE'}</span>
        } />
        <div className="overflow-x-auto ev-scroll">
          <table className="w-full text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-[#1a2540] text-[9px] text-slate-600 tracking-wider">
                <th className="text-left px-4 py-2.5">MEMORY</th>
                <th className="text-left px-4 py-2.5">CATEGORY</th>
                <th className="text-left px-4 py-2.5">PRIORITY</th>
                <th className="text-left px-4 py-2.5">STATUS</th>
                <th className="text-center px-4 py-2.5">RETRY</th>
                <th className="text-left px-4 py-2.5">CREATED</th>
                <th className="text-left px-4 py-2.5">LAST ATTEMPT</th>
              </tr>
            </thead>
            <tbody>
              {syncQueue.map(item => (
                <tr key={item.id} className="border-b border-[#1a2540]/50 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 max-w-[260px]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400/60 text-[9px]">{item.memoryId}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5 truncate">{item.text}</p>
                  </td>
                  <td className="px-4 py-3"><CategoryBadge category={item.category} /></td>
                  <td className="px-4 py-3">
                    <span className={
                      item.priority === 'HIGH' ? 'text-red-400' :
                      item.priority === 'MEDIUM' ? 'text-amber-400' :
                      item.priority === 'LOW' ? 'text-cyan-400' : 'text-slate-600'
                    }>{item.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 ${statusColors[item.status]}`}>
                      {item.status === 'SYNCED' && <Check className="w-3 h-3" />}
                      {item.status === 'FAILED' && <X className="w-3 h-3" />}
                      {item.status === 'SYNCING' && <RefreshCw className="w-3 h-3 animate-spin" />}
                      {item.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {item.status === 'READY' && <Cloud className="w-3 h-3" />}
                      {item.status === 'LOCAL ONLY' && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{item.retryCount}</td>
                  <td className="px-4 py-3 text-slate-500 text-[10px]">{new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-3 text-slate-500 text-[10px]">{item.lastAttempt ? new Date(item.lastAttempt).toLocaleTimeString('en-US', { hour12: false }) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {!online && (
        <Panel className="p-3 ev-glow-amber border-amber-500/20">
          <p className="text-xs font-mono-tech text-amber-400/80 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> SYNC PAUSED — CLOUD UNREACHABLE — QUEUE RETAINED LOCALLY
          </p>
        </Panel>
      )}
    </div>
  );
}
