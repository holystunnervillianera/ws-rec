import React, { useState } from 'react';
import { Plus, MoreVertical, Clock, ArrowRight, FolderKanban, CheckCircle2, Circle, Tag, Play, DollarSign, ExternalLink } from 'lucide-react';
import { useStore } from '../store.tsx';
import { Modal } from './Modal.tsx';
import { Project } from '../types.ts';

export const Projects: React.FC = () => {
  const { projects, addProject, toggleTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'planning' as Project['status'], tags: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    addProject({
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      tags: newProject.tags.split(',').map(t => t.trim()).filter(t => t)
    });
    setIsModalOpen(false);
    setNewProject({ name: '', description: '', status: 'planning', tags: '' });
  };

  const getStatusStyles = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500/10 text-blue-400 border-blue-500/30 ring-blue-500/20';
      case 'planning': return 'bg-slate-500/10 text-slate-400 border-slate-500/30 ring-slate-500/20';
      case 'review': return 'bg-amber-500/10 text-amber-400 border-amber-500/30 ring-amber-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-emerald-500/20';
      case 'monetizing': return 'bg-apex-gold/10 text-apex-gold border-apex-gold/30 ring-apex-gold/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30 ring-slate-500/20';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 glass-card p-6 rounded-2xl border border-apex-border shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-apex-accent/10 rounded-lg border border-apex-accent/30">
              <FolderKanban className="w-6 h-6 text-apex-accent" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Active Operations</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12 font-medium">Manage, monitor, and direct autonomous agent projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-apex-accent text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Issue Directive
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass-card rounded-2xl border border-apex-border shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all duration-300 flex flex-col group overflow-hidden relative">
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              project.status === 'active' ? 'bg-blue-500' : 
              project.status === 'review' ? 'bg-amber-500' : 
              project.status === 'completed' ? 'bg-emerald-500' : 
              project.status === 'monetizing' ? 'bg-apex-gold shadow-[0_0_10px_#F59E0B]' : 'bg-slate-600'
            }`} />
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ring-1 ${getStatusStyles(project.status)}`}>
                  {project.status}
                </span>
                <button className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 leading-tight">{project.name}</h3>
              <p className="text-sm text-slate-400 mb-5 flex-1 line-clamp-3 font-medium leading-relaxed">{project.description}</p>
              
              {/* Financials / Links if Monetizing */}
              {project.status === 'monetizing' && (
                <div className="mb-5 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1"><DollarSign className="w-3.5 h-3.5"/> MRR Generated</span>
                    <span className="text-lg font-black text-emerald-400">${project.mrr}/mo</span>
                  </div>
                  {project.stripeLink && (
                    <a href="#" className="text-[11px] font-mono text-apex-accent hover:text-blue-400 flex items-center gap-1 truncate">
                      <ExternalLink className="w-3 h-3 shrink-0" /> {project.stripeLink}
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Tasks Preview */}
              {project.tasks && project.tasks.length > 0 && (
                <div className="mb-6 space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Agent Sub-Routines</p>
                  {project.tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-start gap-2 group/task cursor-pointer" onClick={() => toggleTask(project.id, task.id)}>
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 group-hover/task:text-apex-accent shrink-0 mt-0.5 transition-colors" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">{task.assignedTo.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                  {project.tasks.length > 3 && (
                    <p className="text-xs text-slate-500 font-bold pl-6">+{project.tasks.length - 3} more routines...</p>
                  )}
                </div>
              )}
              
              {/* Progress */}
              <div className="space-y-2.5 mt-auto">
                <div className="flex justify-between text-sm items-end">
                  <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Completion</span>
                  <span className="text-white font-black text-lg leading-none">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                      project.progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-gradient-to-r from-apex-accent to-blue-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  >
                    {project.progress > 0 && project.progress < 100 && (
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[scanline_1s_linear_infinite]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                {project.updatedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex gap-2">
                {project.status === 'planning' && (
                  <button className="p-1.5 text-apex-accent hover:bg-apex-accent/10 rounded-md transition-colors" title="Deploy">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button className="text-slate-400 hover:text-apex-accent text-sm font-black flex items-center gap-1 transition-colors uppercase tracking-wider">
                  Manage <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue New Directive">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Directive Name</label>
            <input 
              type="text" required autoFocus
              value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none transition-all font-medium placeholder-slate-600"
              placeholder="e.g., Automated Code Review"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Description & Parameters</label>
            <textarea 
              required rows={4}
              value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none transition-all resize-none font-medium placeholder-slate-600"
              placeholder="Define the scope and objectives for the agent swarm..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Initial Status</label>
              <select 
                value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value as Project['status']})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none transition-all font-medium"
              >
                <option value="planning">Planning (Draft)</option>
                <option value="active">Active (Deploy Immediately)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5">Tags (Comma separated)</label>
              <input 
                type="text" 
                value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none transition-all font-medium placeholder-slate-600"
                placeholder="e.g., DevOps, High Priority"
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-black text-slate-900 bg-apex-accent hover:bg-blue-400 rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95">
              Deploy Directive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
