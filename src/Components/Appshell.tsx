import { type ReactNode } from 'react';
import type { Page } from '../types';
import { LayoutDashboard, Database, Search, RefreshCw, GitBranch, Activity, Network, Settings, Zap } from 'lucide-react';
import { StatusDot } from './ui';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
  online: boolean;
  lastSync: number | null;
  syncState: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  children: ReactNode;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'command', label: 'COMMAND CENTER', icon: LayoutDashboard },
  { id: 'memory', label: 'MEMORY EXPLORER', icon: Database },
  { id: 'search', label: 'SEMANTIC SEARCH', icon: Search },
  { id: 'sync', label: 'SYNC CENTER', icon: RefreshCw },
  { id: 'conflicts', label: 'CONFLICTS', icon: GitBranch },
  { id: 'activity', label: 'ACTIVITY LOG', icon: Activity },
  { id: 'architecture', label: 'ARCHITECTURE', icon: Network },
  { id: 'system', label: 'SYSTEM', icon: Settings },
];

function timeAgo(ts: number | null): string {
  if (!ts) return 'NEVER';
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'JUST NOW';
  if (min < 60) return `${min}m AGO`;
  const hr = Math.floor(min / 60);
  return `${hr}h AGO`;
}

export function AppShell({ current, onNavigate, online, lastSync, syncState, sidebarOpen, onToggleSidebar, onCloseSidebar, children }: Props) {
  return (
    <div className="min-h-screen bg-[#05080f] ev-grid-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onCloseSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-60 ev-panel-solid border-r border-[#1a2540] z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[#1a2540]">
          <div className="w-9 h-9 border border-cyan-500/40 rounded-lg flex items-center justify-center ev-glow-cyan">
            <Zap className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-200">EDGEVAULT</h1>
            <p className="text-[9px] font-mono-tech text-cyan-500/70 tracking-widest">AI PLATFORM</p>
          </div>
        </div>

        <nav className="px-2 py-3 space-y-0.5">
          {navItems.map(item => {
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onCloseSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono-tech tracking-wider transition-all ${
                  active
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border-l-2 border-transparent'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#1a2540]">
          <div className="text-[9px] font-mono-tech text-slate-600 tracking-wider space-y-1">
            <div>v2.1.0 · CODE CUBICLE 6.0</div>
            <div className="text-slate-700">DEVELOPED BY THEERTHAN BG</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 ev-panel-solid border-b border-[#1a2540] flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleSidebar()}
              className="md:hidden text-slate-400 hover:text-cyan-400"
              aria-label="Toggle navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <span className="text-sm font-mono-tech tracking-wider text-slate-300">EDGEVAULT AI</span>
            <span className="hidden md:inline text-[10px] font-mono-tech text-slate-600">/ EDGE INTELLIGENCE PLATFORM</span>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-500">
              <span className="text-slate-600">NODE</span>
              <span className="text-cyan-400">EDGE-NODE-01</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-500">
              <span className="text-slate-600">LAST SYNC</span>
              <span className="text-slate-300">{timeAgo(lastSync)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-500">
              <span className="text-slate-600">SYNC</span>
              <span className={syncState === 'SYNCING' ? 'text-cyan-400' : syncState === 'FAILED' ? 'text-red-400' : 'text-slate-300'}>{syncState}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status={online ? 'online' : 'offline'} />
              <span className="text-[10px] font-mono-tech tracking-wider text-slate-400">{online ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
