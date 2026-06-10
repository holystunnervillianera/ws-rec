import React from 'react';
import { Cpu, Server, CheckCircle2, Loader2 } from 'lucide-react';
import { useStore } from '../store.tsx';

export const Swarm: React.FC = () => {
  const { swarmProjects } = useStore();
  const projects = Object.values(swarmProjects);

  return (
    <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(162,0,255,0.05),transparent),#050505] p-8 overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <Cpu className="w-6 h-6 text-kaos-cyan" /> Swarm Operations
        </h2>
        <p className="text-gray-500 text-sm font-mono mt-2">Monitoring active GCP and Local Docker workloads.</p>
      </header>

      {projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-kaos-border rounded-2xl">
          <p className="text-gray-500 font-mono text-sm">No active operations in the swarm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map(proj => (
            <div key={proj.id} className="glass-panel rounded-xl p-6 border border-kaos-border">
              <h3 className="text-white font-bold uppercase tracking-wider mb-4 pb-3 border-b border-kaos-border">
                {proj.name}
              </h3>
              <div className="space-y-3">
                {Object.values(proj.managers).map(task => (
                  <div key={task.id} className="bg-[#111] border border-[#222] p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-300 text-sm font-mono">{task.task}</span>
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        task.status === 'Executing' ? 'bg-kaos-cyan/10 text-kaos-cyan border border-kaos-cyan/30' : 'bg-white/5 text-gray-500 border border-gray-700'
                      }`}>
                        {task.status === 'Executing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                      <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5" /> {task.workers} Nodes</span>
                      <span>Env: {task.env}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
