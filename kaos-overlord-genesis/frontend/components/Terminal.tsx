import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TermIcon } from 'lucide-react';
import { useStore } from '../store.tsx';

export const Terminal: React.FC = () => {
  const { messages, sendCommand } = useStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(162,0,255,0.05),transparent),#050505]">
      <header className="px-8 py-5 border-b border-kaos-border bg-black/40 backdrop-blur-md flex items-center gap-3">
        <TermIcon className="w-5 h-5 text-kaos-cyan" />
        <h2 className="text-lg font-bold text-white tracking-widest uppercase">Overlord Terminal</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <span className="text-[10px] text-gray-500 font-mono mb-1 px-1 uppercase tracking-wider">
              {msg.role === 'user' ? 'Kass' : msg.role === 'system' ? 'System' : 'KaOS'} • {msg.timestamp.toLocaleTimeString()}
            </span>
            <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono ${
              msg.role === 'user' 
                ? 'bg-kaos-gray text-white border border-kaos-border rounded-tr-sm' 
                : msg.role === 'system'
                ? 'bg-transparent text-gray-400 border-l-2 border-kaos-purple rounded-none py-2 px-4'
                : 'bg-kaos-cyan/5 text-gray-200 border border-kaos-cyan/20 rounded-tl-sm shadow-[0_0_15px_rgba(0,229,255,0.05)]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 bg-black/80 border-t border-kaos-border backdrop-blur-md">
        <div className="relative max-w-5xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Command Overlord..."
            className="w-full bg-[#141414] border border-kaos-border rounded-xl py-4 pl-5 pr-16 text-kaos-cyan focus:outline-none focus:border-kaos-cyan focus:ring-1 focus:ring-kaos-cyan transition-all resize-none font-mono text-sm"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 bottom-3 p-2 bg-kaos-cyan/10 text-kaos-cyan rounded-lg hover:bg-kaos-cyan hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
