import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ShieldAlert, Terminal, Cpu, Sparkles, Command, Globe, DollarSign, Code, Users } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Message, AgentRole } from '../types.ts';
import { useStore } from '../store.tsx';

const SYSTEM_PROMPT = `You are the APEX CEO. Your mandate is autonomous wealth generation and flawless execution.
You manage elite workers: DevOps_Engineer (Code/Cloud), Personal_Admin (Scraping/Research), Financial_Controller (Stripe/Monetization), Growth_Hacker (Cold Email/Distribution).
Analyze the user's request. Respond with extreme competence, conciseness, and a tone of unwavering loyalty. 
Use markdown for formatting. If a task requires building, monetizing, and distributing, outline the plan clearly.`;

export const ChatInterface: React.FC = () => {
  const { addLog, settings } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      agentName: 'CEO_Agent',
      text: 'System initialized. **APEX Enterprise Core** online.\n\nBoard of Directors active. Awaiting your directive, Chairman.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy-key', vertexai: true });
      const session = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: settings.temperature,
        }
      });
      setChatSession(session);
      addLog({ level: 'info', source: 'System', message: 'APEX Terminal initialized and connected to CEO Agent.' });
    } catch (error) {
      console.error("Failed to initialize AI:", error);
      addLog({ level: 'error', source: 'System', message: 'Failed to initialize AI core logic.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.temperature]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const userText = textOverride || input;
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      agentName: 'User',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsLoading(true);
    setActiveAgent('CEO_Agent');
    
    addLog({ level: 'action', source: 'User', message: `Directive issued: ${userText.substring(0, 60)}...` });

    try {
      if (chatSession && process.env.API_KEY) {
        const response = await chatSession.sendMessage({ message: userText });
        const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          agentName: 'CEO_Agent',
          text: response.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
        addLog({ level: 'thought', source: 'CEO_Agent', message: 'Processed directive and formulated execution plan.' });
      } else {
        // Simulate Multi-Agent Routing if no API key
        setTimeout(() => {
          setActiveAgent('DevOps_Engineer');
          addLog({ level: 'action', source: 'CEO_Agent', message: 'Routing task to DevOps_Engineer...' });
        }, 1000);

        setTimeout(() => {
          setActiveAgent('Financial_Controller');
          addLog({ level: 'action', source: 'DevOps_Engineer', message: 'Code complete. Routing to Financial_Controller for monetization...' });
        }, 2500);

        setTimeout(() => {
          setActiveAgent(null);
          const mockMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            agentName: 'CEO_Agent',
            text: `[SIMULATED MULTI-AGENT RESPONSE]\n\nDirective received: \`${userText}\`\n\n**Execution Plan:**\n1. **DevOps_Engineer** will provision the required infrastructure.\n2. **Financial_Controller** will generate the Stripe payment links.\n3. **Growth_Hacker** will initiate the cold outreach sequence.\n\n*Note: Please provide valid API keys in the Enterprise Config to execute live operations.*`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, mockMsg]);
          addLog({ level: 'warn', source: 'System', message: 'Simulated response generated due to missing API key.' });
          setIsLoading(false);
        }, 4000);
        return;
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        agentName: 'System',
        text: `CRITICAL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      addLog({ level: 'error', source: 'System', message: `Communication error: ${error instanceof Error ? error.message : 'Unknown'}` });
    } finally {
      if (process.env.API_KEY) {
        setIsLoading(false);
        setActiveAgent(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('```') && part.endsWith('```')) {
        return (
          <pre key={i} className="bg-black/50 text-apex-accent p-4 rounded-xl my-3 overflow-x-auto font-mono text-xs border border-slate-800 shadow-inner">
            <code>{part.slice(3, -3).replace(/^[\w-]+\n/, '')}</code>
          </pre>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-800 text-apex-accent px-1.5 py-0.5 rounded-md font-mono text-xs border border-slate-700">{part.slice(1, -1)}</code>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getAgentIcon = (role?: AgentRole) => {
    switch (role) {
      case 'CEO_Agent': return <Globe className="w-6 h-6 text-white" />;
      case 'DevOps_Engineer': return <Code className="w-6 h-6 text-white" />;
      case 'Financial_Controller': return <DollarSign className="w-6 h-6 text-white" />;
      case 'Growth_Hacker': return <Users className="w-6 h-6 text-white" />;
      case 'Personal_Admin': return <Sparkles className="w-6 h-6 text-white" />;
      case 'User': return <User className="w-6 h-6 text-white" />;
      default: return <ShieldAlert className="w-6 h-6 text-white" />;
    }
  };

  const getAgentColor = (role?: AgentRole) => {
    switch (role) {
      case 'CEO_Agent': return 'from-apex-accent to-blue-600 border-apex-accent/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]';
      case 'DevOps_Engineer': return 'from-blue-500 to-blue-700 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'Financial_Controller': return 'from-emerald-500 to-emerald-700 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'Growth_Hacker': return 'from-apex-gold to-orange-600 border-apex-gold/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'Personal_Admin': return 'from-apex-purple to-purple-700 border-apex-purple/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]';
      case 'User': return 'from-slate-700 to-slate-900 border-slate-600';
      default: return 'from-red-500 to-red-700 border-red-400/50';
    }
  };

  const quickActions = [
    "Build a micro-SaaS and monetize it",
    "Scrape LinkedIn for B2B leads",
    "Deploy infrastructure via Terraform"
  ];

  return (
    <div className="flex flex-col h-full relative bg-apex-dark">
      {/* Header */}
      <header className="px-8 py-5 border-b border-apex-border flex justify-between items-center bg-apex-panel/80 backdrop-blur-xl sticky top-0 z-20 shadow-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-apex-accent/10 rounded-lg border border-apex-accent/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              <Terminal className="w-5 h-5 text-apex-accent" />
            </div>
            APEX Terminal
          </h2>
          <div className="flex items-center gap-2 mt-1.5 ml-12">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-slate-400 font-mono font-bold">Multi-Agent Swarm Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 shadow-sm">
            <Cpu className="w-4 h-4 text-slate-400" />
            {settings.model.split(' ')[0]}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-grid-pattern">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-5 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${getAgentColor(msg.agentName)}`}>
              {getAgentIcon(msg.agentName)}
            </div>
            
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
              <div className="flex items-baseline gap-3 mb-2 px-1">
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest">
                  {msg.agentName ? msg.agentName.replace('_', ' ') : 'System'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className={`p-5 rounded-3xl shadow-lg text-[15px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-100 rounded-tr-sm border border-slate-700' 
                  : msg.role === 'system'
                  ? 'bg-red-900/20 text-red-200 border border-red-500/30 rounded-tl-sm font-mono text-sm'
                  : 'glass-card text-slate-200 rounded-tl-sm'
              }`}>
                {formatMessage(msg.text)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && activeAgent && (
          <div className="flex gap-5 max-w-5xl mx-auto animate-in fade-in">
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${getAgentColor(activeAgent)}`}>
              {getAgentIcon(activeAgent)}
            </div>
            <div className="flex flex-col items-start">
              <div className="p-5 rounded-3xl rounded-tl-sm glass-card flex items-center gap-4">
                <Loader2 className={`w-5 h-5 animate-spin ${activeAgent === 'CEO_Agent' ? 'text-apex-accent' : 'text-white'}`} />
                <span className="text-sm text-slate-300 font-mono font-bold flex items-center gap-1">
                  {activeAgent.replace('_', ' ')} processing<span className="animate-pulse">...</span>
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-apex-panel/90 backdrop-blur-xl border-t border-apex-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-20">
        <div className="max-w-5xl mx-auto">
          {/* Quick Actions */}
          {messages.length < 3 && !isLoading && (
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(action)}
                  className="whitespace-nowrap px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:border-apex-accent hover:text-apex-accent hover:bg-apex-accent/10 transition-all shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {action}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-apex-accent to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition-opacity duration-500" />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-inner flex items-end overflow-hidden focus-within:border-apex-accent focus-within:ring-1 focus-within:ring-apex-accent transition-all">
              <div className="p-4 text-slate-500">
                <Command className="w-5 h-5" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Issue directive to APEX CEO..."
                className="w-full bg-transparent py-4 pr-16 text-[15px] font-medium text-white focus:outline-none resize-none max-h-48 min-h-[56px] placeholder-slate-600"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-3 p-2.5 bg-apex-accent text-slate-900 rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center px-2">
            <p className="text-[11px] text-slate-500 font-mono font-bold">Shift+Enter for new line. Multi-agent routing is automatic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
