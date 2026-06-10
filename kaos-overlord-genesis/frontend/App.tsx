import React, { useState } from 'react';
import { StoreProvider, useStore } from './store.tsx';
import { Login } from './components/Login.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Terminal } from './components/Terminal.tsx';
import { Swarm } from './components/Swarm.tsx';
import { AegisQueue } from './components/AegisQueue.tsx';
import { Vault } from './components/Vault.tsx';
import { ViewState } from './types.ts';

const AppContent: React.FC = () => {
  const { isConfigured, isAuthenticated } = useStore();
  const [currentView, setCurrentView] = useState<ViewState>('TERMINAL');

  if (!isConfigured || !isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'TERMINAL': return <Terminal />;
      case 'SWARM': return <Swarm />;
      case 'AEGIS': return <AegisQueue />;
      case 'VAULT': return <Vault />;
      default: return <Terminal />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-kaos-bg text-gray-200 font-sans overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-full relative z-10">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
