import React, { useState, useEffect } from 'react';
import { Lock, Save, Skull } from 'lucide-react';
import { useStore } from '../store.tsx';

export const Vault: React.FC = () => {
  const { vaultConfig, updateVault, obliterate } = useStore();
  const [configText, setConfigText] = useState('');
  const [totp, setTotp] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfigText(JSON.stringify(vaultConfig, null, 2));
  }, [vaultConfig]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(configText);
      updateVault(parsed);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      alert("Invalid JSON format.");
    }
  };

  const handleObliterate = () => {
    if (!totp) {
      alert("Burner Phone Authenticator Code required.");
      return;
    }
    const conf = window.prompt("CRITICAL: TYPE 'OBLITERATE' TO VAPORIZE KAOS:");
    if (conf === 'OBLITERATE') {
      const success = obliterate(totp);
      if (!success) {
        alert("Cryptographic Denial: Incorrect Burner Code.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(162,0,255,0.05),transparent),#050505] p-8 overflow-y-auto items-center">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Vault Section */}
        <div className="glass-panel p-8 rounded-2xl border border-kaos-border">
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-kaos-cyan" /> Phantom Vault
          </h2>
          <p className="text-gray-500 text-xs font-mono mb-6">Update secure JSON config. Overlord is blinded to this interface.</p>
          
          <textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            className="w-full h-48 bg-black border border-kaos-border rounded-xl p-4 text-kaos-cyan font-mono text-sm focus:outline-none focus:border-kaos-cyan transition-colors mb-4 resize-none"
            spellCheck={false}
          />
          
          <button
            onClick={handleSave}
            className="w-full py-4 bg-kaos-cyan text-black rounded-xl font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            {isSaved ? 'Vault Sealed' : 'Encrypt Keys'}
          </button>
        </div>

        {/* Nuclear Protocol Section */}
        <div className="glass-panel p-8 rounded-2xl border border-kaos-red/30 bg-kaos-red/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-kaos-red/10 rounded-full blur-3xl" />
          
          <h3 className="text-xl font-bold text-kaos-red tracking-widest uppercase flex items-center gap-3 mb-6">
            <Skull className="w-6 h-6" /> Nuclear Protocol
          </h3>
          
          <div className="space-y-4 relative z-10">
            <input
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Burner Phone 6-Digit Code"
              className="w-full bg-black border border-kaos-red text-kaos-red rounded-xl p-4 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:shadow-[0_0_15px_rgba(255,0,51,0.2)] transition-shadow"
            />
            
            <button
              onClick={handleObliterate}
              className="w-full py-4 bg-gradient-to-r from-kaos-red to-[#880000] text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(255,0,51,0.4)]"
            >
              Total Obliteration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
