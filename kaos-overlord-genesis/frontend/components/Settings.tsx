import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Cpu, Key, Database, Lock, Smartphone, AlertTriangle, 
  Save, CheckCircle2, ServerOff, Fingerprint, Network, Trash2, Plus, 
  Eye, EyeOff, Activity, SlidersHorizontal, DollarSign, Mail, Clock
} from 'lucide-react';
import { Modal } from './Modal.tsx';
import { useStore } from '../store.tsx';
import { Asset } from '../types.ts';

type Tab = 'agent' | 'wealth' | 'integrations' | 'network' | 'danger';

const Toggle: React.FC<{ checked: boolean; onChange: (c: boolean) => void; label: string; description?: string }> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-bold text-white">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5 font-medium">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-apex-accent focus:ring-offset-2 focus:ring-offset-slate-900 ${checked ? 'bg-apex-accent shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-700'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export const Settings: React.FC = () => {
  const { addLog, settings, updateSettings, assets, addAsset, removeAsset } = useStore();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockPin, setUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('agent');
  const [isSaved, setIsSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'api_key' as Asset['type'], value: '' });
  const [visibleAssets, setVisibleAssets] = useState<Set<string>>(new Set());

  const [isKillModalOpen, setIsKillModalOpen] = useState(false);
  const [killStep, setKillStep] = useState<1 | 2 | 3>(1);
  const [killPassword, setKillPassword] = useState('');
  const [killSmsCode, setKillSmsCode] = useState('');
  const [killConfirmText, setKillConfirmText] = useState('');
  const [isTerminated, setIsTerminated] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPin === 'admin') {
      setIsUnlocked(true);
      addLog({ level: 'info', source: 'System', message: 'Air-gapped settings panel accessed.' });
    } else {
      setUnlockError(true);
      setUnlockPin('');
      setTimeout(() => setUnlockError(false), 2000);
      addLog({ level: 'warn', source: 'System', message: 'Failed access attempt to settings panel.' });
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsSaved(true);
    addLog({ level: 'action', source: 'User', message: 'Enterprise configurations updated.' });
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.value) return;
    addAsset({ ...newAsset, projectId: 'global', isSecure: true });
    setIsAddAssetModalOpen(false);
    setNewAsset({ name: '', type: 'api_key', value: '' });
  };

  const toggleAssetVisibility = (id: string) => {
    const newSet = new Set(visibleAssets);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setVisibleAssets(newSet);
  };

  const handleKillSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (killStep === 1 && killPassword === 'admin') {
      setKillStep(2);
      addLog({ level: 'warn', source: 'System', message: 'Protocol Omega initiated. Awaiting SMS verification.' });
    } else if (killStep === 2 && killSmsCode === '000000') {
      setKillStep(3);
      addLog({ level: 'warn', source: 'System', message: 'SMS verified. Awaiting final cryptographic confirmation.' });
    } else if (killStep === 3 && killConfirmText === 'TERMINATE') {
      setIsTerminated(true);
      addLog({ level: 'error', source: 'System', message: 'PROTOCOL OMEGA EXECUTED. AGENT TERMINATED. DATA PURGED.' });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-apex-dark p-4">
        <div className="max-w-md w-full glass-card rounded-2xl border border-slate-700 shadow-2xl p-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
              <Fingerprint className="w-8 h-8 text-apex-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white text-center mb-2">Restricted Area</h2>
          <p className="text-slate-400 text-center text-sm mb-8 font-medium">
            This configuration panel is air-gapped from the agent swarm. Enter master PIN to proceed.
          </p>
          <form onSubmit={handleUnlock} className="space-y-6">
            <div>
              <input 
                type="password" 
                autoFocus
                value={unlockPin}
                onChange={e => setUnlockPin(e.target.value)}
                className={`w-full bg-slate-900 border ${unlockError ? 'border-red-500 focus:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-700 focus:ring-apex-accent'} rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:ring-2 transition-all font-mono`}
                placeholder="••••"
              />
              {unlockError && <p className="text-red-400 text-xs text-center mt-2 font-bold animate-pulse">Access Denied. Unauthorized attempt logged.</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-apex-accent hover:bg-blue-400 text-slate-900 font-black py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95"
            >
              Authenticate
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-6 font-mono font-bold">Hint: Use 'admin'</p>
        </div>
      </div>
    );
  }

  if (isTerminated) {
    return (
      <div className="h-full w-full bg-red-950 flex flex-col items-center justify-center text-red-50 p-8 animate-in fade-in duration-1000">
        <ServerOff className="w-32 h-32 text-red-500 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-5xl font-black mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-red-100 to-red-500">SYSTEM TERMINATED</h1>
        <div className="max-w-2xl bg-red-900/50 border border-red-800 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-red-200 font-mono text-center leading-relaxed font-bold">
            Protocol Omega executed successfully. All agent processes halted. Local data stores cryptographically shredded. Network connections severed. The APEX instance is no longer active.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-12 px-8 py-4 bg-red-900 hover:bg-red-800 text-red-100 rounded-xl font-mono text-sm font-black transition-all border border-red-700 hover:border-red-500 shadow-lg hover:shadow-red-900/50"
        >
          REBOOT SYSTEM (CLEAN SLATE)
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 glass-card p-6 rounded-2xl border border-apex-border shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-apex-accent/10 rounded-lg border border-apex-accent/30">
              <ShieldAlert className="w-6 h-6 text-apex-accent" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Enterprise Config</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12 font-medium">Air-gapped control panel. Agent access strictly prohibited.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">System Secure</span>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-apex-accent text-slate-900 px-6 py-2.5 rounded-xl text-sm font-black hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-900" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Config Saved' : 'Apply Changes'}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          {[
            { id: 'agent', label: 'Agent Core & Laws', icon: Cpu, desc: 'Model, autonomy, directives' },
            { id: 'wealth', label: 'Wealth Engine', icon: DollarSign, desc: 'Stripe, SMTP, Cron Pulse' },
            { id: 'integrations', label: 'Integrations & APIs', icon: Key, desc: 'External service access' },
            { id: 'network', label: 'Network & Security', icon: Network, desc: 'Telemetry, firewalls, limits' },
            { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true, desc: 'Kill switch, data purge' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? tab.danger 
                    ? 'bg-red-500/10 border-red-500/30 shadow-sm ring-1 ring-red-500/50' 
                    : 'glass-card border-apex-accent/50 shadow-[0_0_15px_rgba(56,189,248,0.1)] ring-1 ring-apex-accent/30'
                  : 'bg-transparent border-transparent hover:bg-slate-800/50 border'
              } border`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                activeTab === tab.id 
                  ? tab.danger ? 'bg-red-500/20 text-red-400' : 'bg-apex-accent/20 text-apex-accent'
                  : tab.danger ? 'bg-red-500/10 text-red-500/50' : 'bg-slate-800 text-slate-400'
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-sm font-black ${tab.danger ? 'text-red-400' : 'text-white'}`}>{tab.label}</p>
                <p className={`text-xs mt-0.5 font-medium ${tab.danger ? 'text-red-500/60' : 'text-slate-400'}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-card rounded-2xl border border-apex-border shadow-lg p-6 md:p-8 min-h-[600px]">
          
          {activeTab === 'agent' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-apex-accent" /> Core Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Active Model</label>
                    <select 
                      value={localSettings.model}
                      onChange={e => setLocalSettings({...localSettings, model: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-medium"
                    >
                      <option value="GPT-4o (APEX Core)">GPT-4o (APEX Core)</option>
                      <option value="Gemma 4 26B A4B IT (Local)">Gemma 4 26B A4B IT (Local)</option>
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Autonomy Level</label>
                    <select 
                      value={localSettings.autonomyLevel}
                      onChange={e => setLocalSettings({...localSettings, autonomyLevel: e.target.value as any})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-medium"
                    >
                      <option value="strict">Strict (Requires approval for all actions)</option>
                      <option value="supervised">Supervised (Approval for external actions)</option>
                      <option value="autonomous">Fully Autonomous (Unrestricted)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                      <span>Creativity / Temperature</span>
                      <span className="text-apex-accent font-mono">{localSettings.temperature.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" min="0" max="1" step="0.05" 
                      value={localSettings.temperature}
                      onChange={e => setLocalSettings({...localSettings, temperature: parseFloat(e.target.value)})}
                      className="w-full accent-apex-accent h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold uppercase tracking-wider">
                      <span>Precise / Analytical</span>
                      <span>Creative / Exploratory</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-white">Immutable Laws</h3>
                  <button 
                    onClick={() => setLocalSettings({...localSettings, immutableLaws: [...localSettings.immutableLaws, '']})}
                    className="text-sm text-apex-accent font-black hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Law
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-4 font-medium">Hardcoded directives the agent swarm cannot override under any circumstance. Evaluated before every action.</p>
                <div className="space-y-3">
                  {localSettings.immutableLaws.map((law, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-mono text-sm font-black border border-slate-700">
                        {index + 1}
                      </div>
                      <input 
                        type="text"
                        value={law}
                        onChange={e => {
                          const newLaws = [...localSettings.immutableLaws];
                          newLaws[index] = e.target.value;
                          setLocalSettings({...localSettings, immutableLaws: newLaws});
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-medium placeholder-slate-600"
                        placeholder="Enter immutable directive..."
                      />
                      <button 
                        onClick={() => {
                          const newLaws = localSettings.immutableLaws.filter((_, i) => i !== index);
                          setLocalSettings({...localSettings, immutableLaws: newLaws});
                        }}
                        className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wealth' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-apex-gold" /> Continuous Pulse Scheduler
                </h3>
                <p className="text-sm text-slate-400 mb-6 font-medium">Configure the background cron job that allows the CEO Agent to autonomously research, build, and monetize micro-SaaS products while you sleep.</p>
                
                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div>
                    <label className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                      <span>Pulse Interval (Hours)</span>
                      <span className="text-apex-gold font-mono">{localSettings.pulseIntervalHours}h</span>
                    </label>
                    <input 
                      type="range" min="1" max="48" step="1" 
                      value={localSettings.pulseIntervalHours}
                      onChange={e => setLocalSettings({...localSettings, pulseIntervalHours: parseInt(e.target.value)})}
                      className="w-full accent-apex-gold h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div className="h-px bg-slate-800 my-4" />
                  <Toggle 
                    label="Auto-Deploy SaaS" 
                    description="Allow DevOps_Engineer to push code to production (Vercel/GCP) without manual review."
                    checked={localSettings.autoDeploySaaS}
                    onChange={c => setLocalSettings({...localSettings, autoDeploySaaS: c})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" /> Monetization & Distribution
                </h3>
                <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <Toggle 
                    label="Enable Stripe Integration" 
                    description="Allow Financial_Controller to generate live checkout links for deployed products."
                    checked={localSettings.stripeEnabled}
                    onChange={c => setLocalSettings({...localSettings, stripeEnabled: c})}
                  />
                  <div className="h-px bg-slate-800 my-2" />
                  <Toggle 
                    label="Enable Cold Email Outreach" 
                    description="Allow Growth_Hacker to send automated pitches via SMTP to scraped leads."
                    checked={localSettings.coldEmailEnabled}
                    onChange={c => setLocalSettings({...localSettings, coldEmailEnabled: c})}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">External API Connections</h3>
                  <p className="text-sm text-slate-400 font-medium">Manage keys and credentials for services the agent swarm is authorized to use.</p>
                </div>
                <button 
                  onClick={() => setIsAddAssetModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <Plus className="w-4 h-4" /> Add Integration
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.filter(a => a.type === 'api_key' || a.type === 'credential' || a.type === 'stripe_key' || a.type === 'smtp_config').map((asset) => (
                  <div key={asset.id} className="p-5 border border-slate-700 rounded-xl bg-slate-900/50 hover:border-apex-accent/50 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                          {asset.type === 'api_key' ? <Key className="w-5 h-5 text-amber-400" /> : 
                           asset.type === 'stripe_key' ? <DollarSign className="w-5 h-5 text-emerald-400" /> :
                           asset.type === 'smtp_config' ? <Mail className="w-5 h-5 text-blue-400" /> :
                           <Lock className="w-5 h-5 text-rose-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{asset.name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{asset.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeAsset(asset.id)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                      <code className="text-xs text-slate-400 font-mono truncate mr-2">
                        {visibleAssets.has(asset.id) ? asset.value : '••••••••••••••••••••••••••••'}
                      </code>
                      <button 
                        onClick={() => toggleAssetVisibility(asset.id)}
                        className="text-slate-500 hover:text-white"
                      >
                        {visibleAssets.has(asset.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-black text-white mb-4">Security & Telemetry</h3>
                <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <Toggle 
                    label="Block All Outbound Telemetry" 
                    description="Prevents the agent and underlying models from sending usage data to third parties."
                    checked={localSettings.blockTelemetry}
                    onChange={c => setLocalSettings({...localSettings, blockTelemetry: c})}
                  />
                  <div className="h-px bg-slate-800 my-2" />
                  <Toggle 
                    label="Require 2FA for Financial Transactions" 
                    description="Intercepts and pauses agent execution for manual approval on high-risk actions."
                    checked={localSettings.requireAuthForTransactions}
                    onChange={c => setLocalSettings({...localSettings, requireAuthForTransactions: c})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-black text-white mb-4">Network Routing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'air-gapped', label: 'Air-Gapped', desc: 'No external network access. Local execution only.' },
                    { id: 'vpn-only', label: 'VPN Only', desc: 'All agent traffic routed through secure tunnel.' },
                    { id: 'open', label: 'Open Network', desc: 'Direct internet access for scraping and APIs.' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setLocalSettings({...localSettings, networkMode: mode.id as any})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        localSettings.networkMode === mode.id 
                          ? 'bg-apex-accent/10 border-apex-accent shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                          : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mb-3 ${
                        localSettings.networkMode === mode.id ? 'border-apex-accent bg-apex-accent shadow-[inset_0_0_0_2px_#0B0F19]' : 'border-slate-600'
                      }`} />
                      <p className="font-bold text-white text-sm">{mode.label}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-red-950/30 border-2 border-red-500/30 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-red-500 mb-2 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8" /> PROTOCOL OMEGA
                  </h3>
                  <p className="text-red-200/80 font-medium mb-8 max-w-2xl leading-relaxed">
                    Initiating this protocol will immediately halt all agent operations, sever all external API connections, and cryptographically shred all local memory, logs, and active project states. <strong className="text-red-400">This action is irreversible.</strong>
                  </p>
                  
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 max-w-xl">
                    <h4 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Authorization Required
                    </h4>
                    <p className="text-sm text-red-300/80 mb-6 font-medium">
                      Execution requires Master Password, 2FA confirmation via registered device (+64 22 325 1975), and final cryptographic confirmation.
                    </p>
                    <button 
                      onClick={() => setIsKillModalOpen(true)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl font-black tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    >
                      <ServerOff className="w-6 h-6" /> INITIATE TERMINATION SEQUENCE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Asset Modal */}
      <Modal isOpen={isAddAssetModalOpen} onClose={() => setIsAddAssetModalOpen(false)} title="Add Integration">
        <form onSubmit={handleAddAsset} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Service Name</label>
            <input 
              type="text" required
              value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-medium placeholder-slate-600"
              placeholder="e.g., Stripe Live Key"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Credential Type</label>
            <select 
              value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-medium"
            >
              <option value="api_key">API Key</option>
              <option value="stripe_key">Stripe API Key</option>
              <option value="smtp_config">SMTP Credentials</option>
              <option value="credential">Login Credential</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Secret Value</label>
            <input 
              type="password" required
              value={newAsset.value} onChange={e => setNewAsset({...newAsset, value: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-apex-accent outline-none font-mono placeholder-slate-600"
              placeholder="sk_live_..."
            />
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={() => setIsAddAssetModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-black text-slate-900 bg-apex-accent hover:bg-blue-400 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95 transition-all">Save Integration</button>
          </div>
        </form>
      </Modal>

      {/* Kill Switch Modal */}
      <Modal isOpen={isKillModalOpen} onClose={() => { setIsKillModalOpen(false); setKillStep(1); setKillPassword(''); setKillSmsCode(''); setKillConfirmText(''); }} title="AUTHORIZE PROTOCOL OMEGA">
        <form onSubmit={handleKillSwitchSubmit} className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-500 -z-10 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${(killStep - 1) * 50}%` }} />
            {[1, 2, 3].map(step => (
              <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors ${
                killStep >= step ? 'bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {step}
              </div>
            ))}
          </div>

          {killStep === 1 && (
            <div className="animate-in slide-in-from-right-4">
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-500/30 flex gap-3 font-medium">
                <Lock className="w-5 h-5 shrink-0" />
                <p>Enter Master Password to unlock the termination sequence.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Master Password</label>
                <input 
                  type="password" required autoFocus
                  value={killPassword} onChange={e => setKillPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-mono placeholder-slate-600"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-2 font-bold">Hint: Try 'admin'</p>
              </div>
              <button type="submit" className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white px-4 py-4 rounded-xl font-black transition-colors">
                Verify Password
              </button>
            </div>
          )}

          {killStep === 2 && (
            <div className="animate-in slide-in-from-right-4">
              <div className="bg-amber-500/10 text-amber-400 p-4 rounded-xl text-sm mb-6 border border-amber-500/30 flex gap-3 font-medium">
                <Smartphone className="w-5 h-5 shrink-0" />
                <p>A 6-digit authorization code has been sent to your registered secure device: <strong className="text-amber-300">+64 22 325 1975</strong>.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">SMS Authorization Code</label>
                <input 
                  type="text" required maxLength={6} autoFocus
                  value={killSmsCode} onChange={e => setKillSmsCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-2xl tracking-[0.5em] text-center text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-mono placeholder-slate-700"
                  placeholder="000000"
                />
                <p className="text-xs text-slate-500 mt-2 text-center font-bold">Hint: Try '000000'</p>
              </div>
              <button type="submit" disabled={killSmsCode.length !== 6} className="w-full mt-6 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white px-4 py-4 rounded-xl font-black transition-colors">
                Verify SMS Code
              </button>
            </div>
          )}

          {killStep === 3 && (
            <div className="animate-in slide-in-from-right-4">
              <div className="bg-red-500/20 text-red-300 p-4 rounded-xl text-sm mb-6 border border-red-500/50 flex gap-3 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <p><strong className="text-red-400">FINAL WARNING:</strong> This will permanently destroy the agent instance and all associated local data.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Type "TERMINATE" to confirm</label>
                <input 
                  type="text" required autoFocus
                  value={killConfirmText} onChange={e => setKillConfirmText(e.target.value)}
                  className="w-full bg-slate-900 border border-red-500/50 rounded-xl px-4 py-4 text-lg text-center text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-mono uppercase placeholder-slate-700"
                  placeholder="TERMINATE"
                />
              </div>
              <button 
                type="submit" 
                disabled={killConfirmText !== 'TERMINATE'} 
                className="w-full mt-6 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-4 rounded-xl font-black tracking-widest transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:shadow-none"
              >
                <ServerOff className="w-5 h-5" /> EXECUTE PURGE
              </button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
