import React, { useState } from 'react';
import { Lock, Key, FileText, Eye, EyeOff, Plus, Shield, Copy, Check, Clock } from 'lucide-react';
import { useStore } from '../store.tsx';
import { Modal } from './Modal.tsx';
import { Asset } from '../types.ts';

export const Assets: React.FC = () => {
  const { assets, projects, addAsset, recordAssetAccess } = useStore();
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newAsset, setNewAsset] = useState({
    name: '', type: 'credential' as Asset['type'], projectId: 'global', value: '', isSecure: true
  });

  const toggleVisibility = (id: string) => {
    const newSet = new Set(visibleValues);
    if (newSet.has(id)) newSet.delete(id);
    else {
      newSet.add(id);
      recordAssetAccess(id);
    }
    setVisibleValues(newSet);
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    recordAssetAccess(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name.trim() || !newAsset.value.trim()) return;
    addAsset(newAsset);
    setIsModalOpen(false);
    setNewAsset({ name: '', type: 'credential', projectId: 'global', value: '', isSecure: true });
  };

  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'credential': return <Lock className="w-4 h-4 text-rose-500" />;
      case 'api_key': return <Key className="w-4 h-4 text-amber-500" />;
      case 'instruction': return <FileText className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Shield className="w-6 h-6 text-brand-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Vault</h2>
          </div>
          <p className="text-slate-500 text-sm ml-12 font-medium">Encrypted local storage for agent credentials, API keys, and core instructions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Secret
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="p-5 pl-6">Asset Name</th>
                <th className="p-5">Type</th>
                <th className="p-5">Scope</th>
                <th className="p-5">Value</th>
                <th className="p-5">Last Accessed</th>
                <th className="p-5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map(asset => {
                const project = projects.find(p => p.id === asset.projectId);
                const scopeName = asset.projectId === 'global' ? 'Global' : (project?.name || 'Unknown Project');
                const isVisible = visibleValues.has(asset.id);
                
                return (
                  <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                          {getIcon(asset.type)}
                        </div>
                        <span className="font-bold text-slate-900">{asset.name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                        {asset.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600 max-w-[200px] truncate" title={scopeName}>
                      {scopeName}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-mono border border-slate-200 shadow-inner">
                          {asset.isSecure && !isVisible ? '••••••••••••••••••••' : asset.value}
                        </code>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {asset.lastAccessed ? asset.lastAccessed.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Never'}
                      </div>
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopy(asset.id, asset.value)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Copy to Clipboard"
                        >
                          {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {asset.isSecure && (
                          <button 
                            onClick={() => toggleVisibility(asset.id)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title={isVisible ? "Hide Value" : "Reveal Value"}
                          >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-sm font-medium">
                    Vault is empty. Add credentials to enable agent operations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Store New Secret">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Asset Name</label>
            <input 
              type="text" required autoFocus
              value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
              placeholder="e.g., Production DB Password"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
              <select 
                value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as Asset['type']})}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white font-medium"
              >
                <option value="credential">Login Credential</option>
                <option value="api_key">API Key</option>
                <option value="instruction">Core Instruction</option>
                <option value="document">Secure Document</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Scope</label>
              <select 
                value={newAsset.projectId} onChange={e => setNewAsset({...newAsset, projectId: e.target.value})}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white font-medium"
              >
                <option value="global">Global (All Projects)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Secret Value</label>
            <textarea 
              required rows={3}
              value={newAsset.value} onChange={e => setNewAsset({...newAsset, value: e.target.value})}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none font-mono"
              placeholder="Enter the secret value..."
            />
          </div>
          <div className="flex items-center gap-3 pt-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input 
              type="checkbox" id="isSecure"
              checked={newAsset.isSecure} onChange={e => setNewAsset({...newAsset, isSecure: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <label htmlFor="isSecure" className="text-sm font-bold text-slate-900 block">Secure Storage</label>
              <p className="text-xs text-slate-500">Mask value in UI and require interaction to reveal.</p>
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Encrypt & Store
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
