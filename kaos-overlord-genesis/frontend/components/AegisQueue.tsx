import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';
import { useStore } from '../store.tsx';

export const AegisQueue: React.FC = () => {
  const { aegisQueue, resolveAegis } = useStore();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const handleResolve = (id: string, action: 'approve' | 'deny') => {
    let auth = undefined;
    if (action === 'approve') {
      auth = window.prompt("Aegis Intercept: Enter Master Password to authorize destructive action:");
      if (!auth) return;
    }
    
    const success = resolveAegis(id, action, reasons[id] || '', auth);
    if (!success && action === 'approve') {
      alert("Authorization Failed. Invalid Master Password.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(255,0,51,0.05),transparent),#050505] p-8 overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-kaos-red tracking-widest uppercase flex items-center gap-3">
          <ShieldAlert className="w-6 h-6" /> Aegis Intercepts
        </h2>
        <p className="text-gray-500 text-sm font-mono mt-2">Destructive commands quarantined pending Kass authorization.</p>
      </header>

      {aegisQueue.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-kaos-border rounded-2xl">
          <p className="text-gray-500 font-mono text-sm">No pending approvals.</p>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          {aegisQueue.map(item => (
            <div key={item.id} className="bg-kaos-red/5 border border-kaos-red/50 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-kaos-red animate-pulse" />
              
              <div className="flex items-center gap-2 text-kaos-red mb-4">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Quarantined Command</span>
                <span className="ml-auto text-[10px] text-gray-500 font-mono">{item.timestamp.toLocaleTimeString()}</span>
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg border border-kaos-red/20 font-mono text-sm text-gray-300 mb-4 break-all">
                {item.command}
              </div>

              <input
                type="text"
                value={reasons[item.id] || ''}
                onChange={(e) => setReasons(prev => ({ ...prev, [item.id]: e.target.value }))}
                placeholder="Instruction if Denying (Optional)..."
                className="w-full bg-black/50 border border-kaos-border rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-kaos-red mb-4"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => handleResolve(item.id, 'deny')}
                  className="flex-1 py-3 bg-[#330000] text-[#ff4444] border border-[#ff4444]/30 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#440000] transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Deny / Kill
                </button>
                <button
                  onClick={() => handleResolve(item.id, 'approve')}
                  className="flex-1 py-3 bg-kaos-red text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(255,0,51,0.3)] flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Authorize
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
