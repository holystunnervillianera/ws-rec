import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Terminal, Mail, Filter, AlertCircle, Info, Zap, BrainCircuit, Pause, Play, Download, DollarSign } from 'lucide-react';
import { useStore } from '../store.tsx';
import { LogEntry } from '../types.ts';

type FilterLevel = 'all' | LogEntry['level'];

export const Logs: React.FC = () => {
  const { logs } = useStore();
  const [showToast, setShowToast] = useState(false);
  const [filter, setFilter] = useState<FilterLevel>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    let result = filter === 'all' ? logs : logs.filter(log => log.level === filter);
    // Sort ascending for terminal view (oldest top, newest bottom)
    return [...result].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [logs, filter]);

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'warn': return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'action': return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'thought': return <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />;
      case 'revenue': return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-apex-accent/10 rounded-lg border border-apex-accent/30">
              <Terminal className="w-6 h-6 text-apex-accent" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">System Logs</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12 font-medium">Immutable record of all agent thoughts, actions, and system events.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-sm">
            {(['all', 'info', 'action', 'thought', 'revenue', 'warn', 'error'] as FilterLevel[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                  filter === f 
                    ? 'bg-apex-accent text-slate-900 shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-slate-800 border border-slate-700 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-5 z-50">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <p className="text-sm font-bold">Logs successfully queued for backup to genuiskass@proton.me</p>
        </div>
      )}

      <div className="flex-1 bg-[#050810] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-mono text-sm relative">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs select-none">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            </div>
            <span className="font-bold tracking-wider text-slate-500">root@apex-omni:/var/log/syslog</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">{filteredLogs.length} entries</span>
            <button 
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${autoScroll ? 'text-apex-accent bg-apex-accent/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
            </button>
          </div>
        </div>
        
        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1.5 custom-scrollbar">
          {filteredLogs.map(log => {
            let sourceColor = 'text-slate-500';
            if (log.source === 'CEO_Agent') sourceColor = 'text-apex-accent';
            if (log.source === 'DevOps_Engineer') sourceColor = 'text-blue-400';
            if (log.source === 'Financial_Controller') sourceColor = 'text-emerald-400';
            if (log.source === 'Growth_Hacker') sourceColor = 'text-apex-gold';
            if (log.source === 'Personal_Admin') sourceColor = 'text-apex-purple';

            return (
              <div key={log.id} className="flex gap-4 hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-colors group">
                <span className="text-slate-600 shrink-0 select-none font-medium">
                  {log.timestamp.toISOString().replace('T', ' ').substring(0, 19)}
                </span>
                <span className={`shrink-0 w-28 uppercase text-[11px] font-black tracking-widest flex items-center gap-2 ${
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'warn' ? 'text-amber-400' :
                  log.level === 'action' ? 'text-blue-400' : 
                  log.level === 'thought' ? 'text-purple-400' : 
                  log.level === 'revenue' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {getLevelIcon(log.level)} [{log.level}]
                </span>
                <span className={`shrink-0 w-40 select-none font-bold ${sourceColor}`}>
                  {log.source}:
                </span>
                <div className="flex-1 text-slate-300 break-words leading-relaxed">
                  {log.message}
                  {log.details && (
                    <div className="mt-2 text-slate-400 text-xs bg-slate-900/80 p-3 rounded-md border border-slate-800 shadow-inner">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredLogs.length === 0 && (
            <div className="text-center text-slate-600 py-12 font-bold">
              No logs found matching the current filter.
            </div>
          )}
          <div ref={logsEndRef} className="h-2" />
        </div>
      </div>
    </div>
  );
};
