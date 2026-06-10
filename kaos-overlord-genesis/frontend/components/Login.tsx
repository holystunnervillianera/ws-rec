import React, { useState, useEffect } from 'react';
import { useStore } from '../store.tsx';
import { ShieldAlert, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const { isConfigured, setupSystem, login } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mockTotp, setMockTotp] = useState('');

  useEffect(() => {
    if (!isConfigured) {
      // Generate a mock base32 secret for display
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let secret = '';
      for (let i = 0; i < 16; i++) secret += chars.charAt(Math.floor(Math.random() * chars.length));
      setMockTotp(secret);
    }
  }, [isConfigured]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    if (!isConfigured) {
      setupSystem(password);
    } else {
      const success = login(password);
      if (!success) {
        setError('CRYPTOGRAPHIC DENIAL: INVALID KEY');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-kaos-bg">
        <div className="glass-panel p-10 rounded-2xl w-full max-w-md border border-kaos-border shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          <h2 className="text-kaos-cyan text-2xl font-bold text-center tracking-[4px] uppercase mb-8 flex items-center justify-center gap-3">
            <ShieldAlert className="w-6 h-6" /> KaOS Genesis
          </h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Master Password"
              className="w-full p-4 mb-6 bg-black/50 border border-kaos-border text-kaos-cyan rounded-lg outline-none focus:border-kaos-cyan transition-colors"
              autoFocus
            />
            
            <div className="bg-[#111] p-4 rounded-lg border border-dashed border-kaos-cyan text-center mb-6">
              <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
                1. Download 'Aegis Authenticator' on Offline Burner Device.<br/>
                2. Add manually & enter this 2FA secret:
              </div>
              <div className="font-mono text-kaos-purple text-lg tracking-[2px] my-3 select-all">
                {mockTotp}
              </div>
              <div className="text-[11px] text-kaos-red font-bold">
                Write this down. It authorizes System Obliteration.
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full p-4 bg-gradient-to-r from-kaos-cyan to-kaos-purple text-white border-none rounded-lg font-bold cursor-pointer uppercase tracking-[2px] hover:opacity-90 transition-opacity"
            >
              Ignite Overlord Core
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen w-full bg-kaos-bg relative z-50">
      <div className="w-full max-w-sm">
        <h2 className="text-kaos-cyan text-center tracking-[8px] mb-10 text-3xl font-bold animate-pulse-fast">
          KaOS
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kaos-cyan/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="AWAITING CORE KEY..."
              className={`w-full p-5 pl-12 bg-[#0a0a0a] border ${error ? 'border-kaos-red text-kaos-red' : 'border-kaos-cyan text-kaos-cyan'} rounded-xl outline-none text-center text-lg tracking-[2px] transition-colors shadow-[0_0_15px_rgba(0,229,255,0.1)] focus:shadow-[0_0_25px_rgba(0,229,255,0.3)]`}
              autoFocus
            />
          </div>
          {error && <p className="text-kaos-red text-xs text-center mt-4 font-mono uppercase tracking-widest animate-glitch">{error}</p>}
        </form>
      </div>
    </div>
  );
};
