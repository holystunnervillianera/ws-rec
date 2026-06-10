import React from 'react';
import { Terminal, Cpu, ShieldAlert, Lock, Settings } from 'lucide-react';
import { ViewState } from '../types.ts';
import { useStore } from '../store.tsx';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { swarmProjects, aegisQueue } = useStore();

  const activeSwarmCount = Object.keys(swarmProjects).length;
  const pendingAegisCount = aegisQueue.length;

  const navItems: { id: ViewState; label: string; icon: React.ElementType; alert?: number }[] = [
    { id: 'TERMINAL', label: 'Overlord Terminal', icon: Terminal },
    { id: 'SWARM', label: 'Swarm Operations', icon: Cpu, alert: activeSwarmCount },
    { id: 'AEGIS', label: 'Aegis Intercepts', icon: ShieldAlert, alert: pendingAegisCount },
    { id: 'VAULT', label: 'Phantom Vault', icon: Lock },
  ];

  return (
    <aside className="w-72 bg-kaos-panel border-r border-kaos-border flex flex-col h-screen shrink-0 z-20 relative">
      <div className="p-6 border-b border-kaos-border flex justify-between items-center">
        <div>
          <h1 className="text-kaos-cyan font-bold tracking-[3px] uppercase text-lg">KaOS</h1>
          <p className="text-[10px] text-gray-500 font-mono mt-1">M5 AIR-GAP PROTOCOL</p>
        </div>
        <Settings className="w-5 h-5 text-gray-500 hover:text-kaos-cyan cursor-pointer transition-colors" onClick={() => onViewChange('VAULT')} />
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const hasAlert = item.alert && item.alert > 0;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                isActive 
                  ? 'bg-white/5 text-kaos-cyan border border-kaos-cyan/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-kaos-cyan' : 'text-gray-500'}`} />
                {item.label}
              </div>
              {hasAlert ? (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.id === 'AEGIS' ? 'bg-kaos-red/20 text-kaos-red border border-kaos-red/50 animate-pulse' : 'bg-kaos-cyan/20 text-kaos-cyan border border-kaos-cyan/50'}`}>
                  {item.alert}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-kaos-border bg-black/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Status</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kaos-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-kaos-cyan"></span>
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-gray-500">Network</span>
            <span className="text-kaos-cyan">127.0.0.1 ONLY</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-gray-500">Telemetry</span>
            <span className="text-kaos-purple">BLACKHOLED</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-gray-500">Overwatch</span>
            <span className="text-emerald-500">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
