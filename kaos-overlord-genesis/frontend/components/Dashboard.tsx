import React, { useMemo, useState, useEffect } from 'react';
import { Activity, Cpu, Network, Shield, Zap, Clock, ArrowRight, DollarSign, Users, Briefcase, PlayCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStore } from '../store.tsx';

// Mock data for the MRR growth chart
const mrrData = [
  { day: 'Mon', mrr: 120, leads: 45 }, { day: 'Tue', mrr: 150, leads: 60 },
  { day: 'Wed', mrr: 210, leads: 85 }, { day: 'Thu', mrr: 290, leads: 110 },
  { day: 'Fri', mrr: 340, leads: 140 }, { day: 'Sat', mrr: 410, leads: 165 },
  { day: 'Sun', mrr: 450, leads: 128 },
];

export const Dashboard: React.FC = () => {
  const { projects, logs, metrics, triggerAutonomousPulse } = useStore();
  const [timeToPulse, setTimeToPulse] = useState<string>('');

  const activeProjectsCount = projects.filter(p => p.status === 'active' || p.status === 'monetizing').length;
  const recentLogs = useMemo(() => logs.slice(0, 8), [logs]);

  // Calculate countdown to next pulse
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const next = metrics.nextPulse.getTime();
      const diff = next - now;
      
      if (diff <= 0) {
        setTimeToPulse('PULSE IMMINENT');
      } else {
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToPulse(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [metrics.nextPulse]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Enterprise Command</h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Real-time overview of autonomous wealth generation and system health.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={triggerAutonomousPulse}
            className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 border border-apex-accent/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            <PlayCircle className="w-4 h-4 text-apex-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Force Pulse</span>
          </button>
        </div>
      </header>

      {/* Quick Stats - Dark Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total MRR', value: `$${metrics.totalMRR}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
          { label: 'Leads Acquired', value: metrics.totalLeads.toString(), icon: Users, color: 'text-apex-accent', bg: 'bg-apex-accent/10', border: 'border-apex-accent/20', glow: 'group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]' },
          { label: 'Active Deployments', value: activeProjectsCount.toString(), icon: Briefcase, color: 'text-apex-purple', bg: 'bg-apex-purple/10', border: 'border-apex-purple/20', glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]' },
          { label: 'Next Auto-Pulse', value: timeToPulse, icon: Clock, color: 'text-apex-gold', bg: 'bg-apex-gold/10', border: 'border-apex-gold/20', glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]', isMono: true },
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-6 rounded-2xl border ${stat.border} transition-all duration-300 group relative overflow-hidden ${stat.glow}`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3.5 rounded-xl ${stat.bg} border ${stat.border}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black text-white tracking-tight ${stat.isMono ? 'font-mono text-xl' : ''}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-7 rounded-2xl border border-apex-border">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue & Lead Velocity</h3>
              <p className="text-xs text-slate-400 mt-1">Autonomous growth metrics over the last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> MRR ($)</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-apex-accent shadow-[0_0_10px_rgba(56,189,248,0.5)]" /> Leads</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#F8FAFC', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="leads" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="glass-card p-6 rounded-2xl border border-apex-border flex flex-col h-[420px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-apex-accent" /> Live Enterprise Stream
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {recentLogs.map((log) => {
              // Determine color based on agent/source
              let colorClass = 'text-slate-400 bg-slate-800/50 border-slate-700';
              if (log.source === 'CEO_Agent') colorClass = 'text-apex-accent bg-apex-accent/10 border-apex-accent/30';
              if (log.source === 'DevOps_Engineer') colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
              if (log.source === 'Financial_Controller' || log.level === 'revenue') colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
              if (log.source === 'Growth_Hacker') colorClass = 'text-apex-gold bg-apex-gold/10 border-apex-gold/30';
              if (log.source === 'Personal_Admin') colorClass = 'text-apex-purple bg-apex-purple/10 border-apex-purple/30';
              if (log.level === 'error') colorClass = 'text-red-400 bg-red-500/10 border-red-500/30';

              return (
                <div key={log.id} className="flex gap-3 items-start group">
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 border ${colorClass}`}>
                    {log.level === 'revenue' ? <DollarSign className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 font-medium leading-snug" title={log.message}>
                      {log.message}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider font-bold">
                      {log.timestamp.toLocaleTimeString()} • {log.source.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
