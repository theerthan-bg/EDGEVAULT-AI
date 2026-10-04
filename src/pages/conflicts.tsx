import type { SystemState } from '../hooks/useSystemState';
import { Panel, PanelHeader } from '../components/ui';
import { GitBranch, Check, Cloud, Cpu, ArrowRight, AlertTriangle, Info } from 'lucide-react';

interface Props {
  state: SystemState;
  onResolve: (id: string, resolution: 'LOCAL' | 'CLOUD' | 'MERGE') => void;
}

export function Conflicts({ state, onResolve }: Props) {
  const unresolved = state.conflicts.filter(c => c.status === 'UNRESOLVED');
  const resolved = state.conflicts.filter(c => c.status === 'RESOLVED');

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-slate-200">CONFLICT CENTER</h2>
        <p className="text-xs font-mono-tech text-slate-500 mt-0.5">LOCAL vs CLOUD VERSION DIVERGENCE DETECTION</p>
      </div>

      <Panel className="p-3 border-amber-500/20">
        <p className="text-[10px] font-mono-tech text-amber-400/70 tracking-wider flex items-center gap-2">
          <Info className="w-3.5 h-3.5" /> DEMO CONFLICT DATA — Simulated for demonstration. Real conflicts will appear when Qdrant Cloud sync is connected.
        </p>
      </Panel>

      {unresolved.length === 0 && resolved.length === 0 ? (
        <Panel className="p-8 text-center">
          <Check className="w-8 h-8 text-emerald-400/60 mx-auto mb-3" />
          <p className="text-xs font-mono-tech text-slate-500">NO CONFLICTS DETECTED</p>
          <p className="text-[10px] font-mono-tech text-slate-600 mt-1">Local and cloud versions are in sync</p>
        </Panel>
      ) : (
        <>
          {unresolved.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-mono-tech text-red-400 tracking-wider">UNRESOLVED CONFLICTS · {unresolved.length}</h3>
              </div>

              {unresolved.map(c => (
                <Panel key={c.id} className="ev-glow-red border-red-500/20 animate-slide-up">
                  <PanelHeader title="CONFLICT DETECTED" subtitle={`${c.id} · MEMORY ${c.memoryId}`} icon={<GitBranch />} right={
                    <span className="text-[10px] font-mono-tech text-red-400 animate-blink">● UNRESOLVED</span>
                  } />
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {/* Local version */}
                      <div className="ev-panel p-3 border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[10px] font-mono-tech text-cyan-400 tracking-wider">LOCAL VERSION</span>
                        </div>
                        <p className="text-xs text-slate-300">{c.localVersion}</p>
                        <div className="mt-2 pt-2 border-t border-[#1a2540] text-[9px] font-mono-tech text-slate-600 space-y-0.5">
                          <div>DEVICE: {c.device}</div>
                          <div>FIELD: {c.field}</div>
                          <div>TS: {new Date(c.timestamp).toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Cloud version */}
                      <div className="ev-panel p-3 border-violet-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Cloud className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-[10px] font-mono-tech text-violet-400 tracking-wider">CLOUD VERSION</span>
                        </div>
                        <p className="text-xs text-slate-300">{c.remoteVersion}</p>
                        <div className="mt-2 pt-2 border-t border-[#1a2540] text-[9px] font-mono-tech text-slate-600 space-y-0.5">
                          <div>SOURCE: QDRANT CLOUD</div>
                          <div>FIELD: {c.field}</div>
                          <div>TS: {new Date(c.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onResolve(c.id, 'LOCAL')}
                        className="py-2 text-[10px] font-mono-tech tracking-wider border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded transition-all flex items-center justify-center gap-1.5"
                      >
                        <Cpu className="w-3 h-3" /> KEEP LOCAL
                      </button>
                      <button
                        onClick={() => onResolve(c.id, 'CLOUD')}
                        className="py-2 text-[10px] font-mono-tech tracking-wider border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded transition-all flex items-center justify-center gap-1.5"
                      >
                        <Cloud className="w-3 h-3" /> KEEP CLOUD
                      </button>
                      <button
                        onClick={() => onResolve(c.id, 'MERGE')}
                        className="py-2 text-[10px] font-mono-tech tracking-wider border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded transition-all flex items-center justify-center gap-1.5"
                      >
                        <GitBranch className="w-3 h-3" /> MERGE
                      </button>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}

          {resolved.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-mono-tech text-emerald-400 tracking-wider">RESOLVED · {resolved.length}</h3>
              {resolved.map(c => (
                <Panel key={c.id} className="p-3 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono-tech text-slate-500">{c.id} · MEMORY {c.memoryId}</span>
                    </div>
                    <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                      RESOLVED <ArrowRight className="w-3 h-3" /> KEEP {c.resolution}
                    </span>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
