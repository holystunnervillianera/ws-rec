import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Message, SwarmProject, AegisIntercept, VaultConfig } from './types.ts';

interface StoreContextType {
  isConfigured: boolean;
  isAuthenticated: boolean;
  setupSystem: (password: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
  
  messages: Message[];
  sendCommand: (cmd: string) => void;
  
  swarmProjects: Record<string, SwarmProject>;
  
  aegisQueue: AegisIntercept[];
  resolveAegis: (id: string, action: 'approve' | 'deny', reason: string, auth?: string) => boolean;
  
  vaultConfig: VaultConfig;
  updateVault: (config: VaultConfig) => void;
  obliterate: (totp: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DESTRUCTIVE_KEYWORDS = ["rm ", "rmdir", "kill ", "drop ", "delete", "wipe", "uninstall", "format"];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'system', content: '🌌 KaOS Overlord Online. Ad-Hoc Network Encrypted.\nSystem ready for directives.', timestamp: new Date() }
  ]);
  
  const [swarmProjects, setSwarmProjects] = useState<Record<string, SwarmProject>>({});
  const [aegisQueue, setAegisQueue] = useState<AegisIntercept[]>([]);
  const [vaultConfig, setVaultConfig] = useState<VaultConfig>({});

  const addMessage = useCallback((role: Message['role'], content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role, content, timestamp: new Date() }]);
  }, []);

  const setupSystem = useCallback((password: string) => {
    setMasterPassword(password);
    setIsConfigured(true);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback((password: string) => {
    if (password === masterPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [masterPassword]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const sendCommand = useCallback((cmd: string) => {
    addMessage('user', cmd);
    
    const lowerCmd = cmd.toLowerCase();
    
    // Check for Aegis Intercept
    if (DESTRUCTIVE_KEYWORDS.some(kw => lowerCmd.includes(kw))) {
      const id = Math.random().toString(36).substring(2, 10);
      setAegisQueue(prev => [...prev, { id, command: cmd, timestamp: new Date() }]);
      setTimeout(() => {
        addMessage('system', `⚠️ Aegis Intercept Triggered. Status: Pending Kass Approval. Command queued.`);
      }, 500);
      return;
    }

    // Simulate Swarm Spawn
    if (lowerCmd.includes('spawn') || lowerCmd.includes('deploy')) {
      setTimeout(() => {
        const projId = `proj-${Date.now()}`;
        const managerId = Math.random().toString(36).substring(2, 8);
        setSwarmProjects(prev => ({
          ...prev,
          [projId]: {
            id: projId,
            name: `Operation ${managerId.toUpperCase()}`,
            managers: {
              [managerId]: {
                id: managerId,
                task: cmd,
                status: 'Executing',
                workers: 3,
                env: 'GCP Cloud'
              }
            }
          }
        }));
        addMessage('system', `⚡ OVERLORD DIRECTIVE: {"tool": "spawn_swarm_workforce"}`);
        
        // Simulate completion after 5 seconds
        setTimeout(() => {
          setSwarmProjects(prev => {
            const updated = { ...prev };
            if (updated[projId] && updated[projId].managers[managerId]) {
              updated[projId].managers[managerId].status = 'Completed';
            }
            return updated;
          });
          addMessage('system', `✅ Swarm Manager '${managerId}' completed deployment.`);
        }, 5000);
      }, 600);
      return;
    }

    // Generic Response
    setTimeout(() => {
      addMessage('model', `Directive acknowledged. Executing background analysis for: \`${cmd}\`\n\nAll systems nominal. No anomalies detected in local airspace.`);
    }, 800);

  }, [addMessage]);

  const resolveAegis = useCallback((id: string, action: 'approve' | 'deny', reason: string, auth?: string) => {
    if (action === 'approve' && auth !== masterPassword) {
      return false;
    }

    setAegisQueue(prev => prev.filter(item => item.id !== id));
    
    const intercept = aegisQueue.find(i => i.id === id);
    if (intercept) {
      if (action === 'approve') {
        addMessage('system', `AEGIS UPDATE: Deletion '${intercept.command}' is APPROVED. Executing...`);
        setTimeout(() => addMessage('system', `SHELL: Command executed successfully.`), 1000);
      } else {
        addMessage('system', `AEGIS UPDATE: Deletion '${intercept.command}' DENIED by Kass. Instruction: ${reason || 'None'}`);
      }
    }
    return true;
  }, [aegisQueue, masterPassword, addMessage]);

  const updateVault = useCallback((config: VaultConfig) => {
    setVaultConfig(config);
  }, []);

  const obliterate = useCallback((totp: string) => {
    // Mock TOTP validation
    if (totp.length === 6) {
      setIsConfigured(false);
      setIsAuthenticated(false);
      setMessages([]);
      setSwarmProjects({});
      setAegisQueue([]);
      setVaultConfig({});
      return true;
    }
    return false;
  }, []);

  return (
    <StoreContext.Provider value={{
      isConfigured, isAuthenticated, setupSystem, login, logout,
      messages, sendCommand,
      swarmProjects,
      aegisQueue, resolveAegis,
      vaultConfig, updateVault, obliterate
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
