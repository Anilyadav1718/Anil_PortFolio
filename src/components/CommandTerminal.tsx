'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { playKeySound, playBlipSound, playSuccessSound, toggleAudio, getAudioEnabled } from '@/lib/audio';
import { getAnonymousSessionId, trackEvent } from '@/lib/analytics';
import { Terminal, X, CornerDownLeft, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface CommandOutput {
  id: string;
  command: string;
  response: React.ReactNode;
}

export function CommandTerminal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: 'sys_init',
      response: (
        <div className="space-y-1 text-theme-muted">
          <p className="text-theme-orange font-bold">ANIL_ENGINEER_OS v2.6.0 [x86_64-fastapi-pytorch]</p>
          <p>Welcome to Anil Panchitha&apos;s Interactive Command Console.</p>
          <p className="text-theme-secondary">
            Type <span className="text-theme-orange font-bold">help</span> to view commands, or press <span className="text-theme-orange">ESC</span> to exit.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      playBlipSound();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  // Handle global keyboard trigger for 'T' or 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const executeCommand = (cmd: string) => {
    const rawCmd = cmd.trim();
    const cleanCmd = rawCmd.toLowerCase();
    playKeySound();

    if (!rawCmd) return;

    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIdx(-1);

    let response: React.ReactNode = null;

    switch (cleanCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-theme-secondary">
            <p className="text-theme-orange font-bold mb-1">AVAILABLE SYSTEM COMMANDS:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-theme-orange font-bold">whoami</span> - Identity & core positioning</div>
              <div><span className="text-theme-orange font-bold">skills</span> - All 24 technical modules</div>
              <div><span className="text-theme-orange font-bold">projects</span> - Production deployments</div>
              <div><span className="text-theme-orange font-bold">hackathons</span> - Hackathon victory records</div>
              <div><span className="text-theme-orange font-bold">cisco</span> - Cisco Software Engineer logs</div>
              <div><span className="text-theme-orange font-bold">research</span> - Springer publication & DOI</div>
              <div><span className="text-theme-orange font-bold">resume</span> - View active resume in tab</div>
              <div><span className="text-theme-orange font-bold">contact</span> - Jump to transmission port</div>
              <div><span className="text-theme-orange font-bold">theme dark/light</span> - Switch OS theme</div>
              <div><span className="text-theme-orange font-bold">audio on/off</span> - Toggle audio synthesizers</div>
              <div><span className="text-theme-orange font-bold">clear</span> - Flush terminal buffer</div>
              <div><span className="text-theme-orange font-bold">exit</span> - Close terminal window</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="space-y-1 text-theme-secondary">
            <p className="text-theme-text font-bold">NAME: Anil Panchitha</p>
            <p className="text-theme-orange">TITLE: Software Engineer | AI/ML | Generative AI</p>
            <p>LOCATION: Hyderabad, India</p>
            <p>STACK: Python, FastAPI, PyTorch, LLMs, RAG, ChromaDB, LangChain</p>
            <p className="text-theme-muted">
              Software Engineer with experience at Cisco Systems, specializing in Python, Generative AI, LLMs, RAG, Machine Learning, APIs and AI-driven automation.
            </p>
          </div>
        );
        break;

      case 'hackathons':
      case 'awards':
        playSuccessSound();
        response = (
          <div className="space-y-2 text-theme-secondary">
            <p className="text-theme-orange font-bold">🏆 VERIFIED HACKATHON ACCOLADE:</p>
            <div className="p-2.5 bg-theme-bg border border-theme-orange/40">
              <span className="text-theme-orange font-bold">Cisco Tech Hackathon 2026 — Winner (You Amaze Award)</span>
              <p className="text-xs text-theme-muted mt-0.5">
                Awarded top recognition for engineering an innovative AI-driven automation pipeline that resolved operational bottlenecks across enterprise workflows at Cisco Systems.
              </p>
            </div>
          </div>
        );
        break;

      case 'cisco':
      case 'experience':
        response = (
          <div className="space-y-1 text-theme-secondary">
            <p className="text-theme-text font-bold">CISCO SYSTEMS — Software Engineer</p>
            <p className="text-theme-muted text-xs">Bangalore, India (August 2025 – August 2026)</p>
            <p className="text-xs text-theme-secondary mt-1">
              › Built and supported GenAI and RAG-based enterprise knowledge solutions using Python, LLMs, embeddings and vector retrieval.<br />
              › Developed Python and REST API automation integrating Cisco Meraki APIs and ServiceNow workflows.<br />
              › Supported enterprise automation for Hilton and Wells Fargo.<br />
              › Production troubleshooting, debugging and root-cause analysis across automation workflows.
            </p>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-2 text-theme-secondary">
            <p className="text-theme-orange font-bold">DEPLOYED SYSTEM REPOSITORIES:</p>
            <div className="p-2 bg-theme-bg border border-theme-border">
              <p className="text-theme-text font-bold">
                1. FarmerVerify AI
              </p>
              <p className="text-xs text-theme-muted">
                Multimodal verification, OCR, GPT-4.1 Vision, embeddings, vector search. Reduced onboarding from 14 days to &lt; 2 hours.
              </p>
            </div>
            <div className="p-2 bg-theme-bg border border-theme-border">
              <p className="text-theme-text font-bold">
                2. Medha AI [AGENTIC INTELLIGENCE PLATFORM]
              </p>
              <p className="text-xs text-theme-muted">
                Full-stack agentic assistant: Multimodal Vision, Tavily real-time web search, Supabase pgvector Hybrid RAG, Gemini + Groq provider routing, persistent memory. (Live: medha-ai-seven.vercel.app)
              </p>
            </div>
            <div className="p-2 bg-theme-bg border border-theme-border">
              <p className="text-theme-text font-bold">
                3. CMS AI Assistant [ENTERPRISE RAG]
              </p>
              <p className="text-xs text-theme-muted">
                Enterprise GenAI knowledge retrieval with LangChain, ChromaDB, semantic reranking.
              </p>
            </div>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-1 text-theme-secondary">
            <p className="text-theme-orange font-bold">CORE TECHNICAL ARSENAL (24 MODULES):</p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">AI/ML:</span> Machine Learning, Deep Learning, NLP, Generative AI, LLMs, RAG, Prompt Engineering
            </p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">LLM ENG:</span> LangChain, OpenAI API, ChromaDB, Embeddings, Vector Search, Reranking
            </p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">BACKEND:</span> Python, FastAPI, REST APIs, JSON
            </p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">ML LIBS:</span> TensorFlow, Scikit-learn
            </p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">DATA:</span> SQL, Pandas, NumPy
            </p>
            <p className="text-xs text-theme-text">
              <span className="text-theme-orange font-bold">TOOLS:</span> Git, Postman
            </p>
          </div>
        );
        break;

      case 'research':
      case 'paper':
        response = (
          <div className="space-y-1 text-theme-secondary">
            <p className="text-theme-text font-bold">
              Diabetic Retinopathy Detection Using Deep Learning
            </p>
            <p className="text-theme-orange text-xs">Springer — ICATECS 2024/2025</p>
            <p className="text-xs text-theme-muted">DOI: 10.1007/978-3-031-94283-9_21</p>
            <p className="text-xs">
              Architectures: EfficientNet-B1, Transfer Learning, IDRiD Dataset, ResNet50, InceptionResNetV2, Grad-CAM Explainable AI.
            </p>
          </div>
        );
        break;

      case 'medha':
      case 'medha-ai':
        trackEvent('project_view', { project_title: 'Medha AI', slug: 'medha-ai' });
        window.open('https://medha-ai-seven.vercel.app/', '_blank', 'noopener,noreferrer');
        response = (
          <p className="text-theme-orange">
            [OK] Medha AI live platform opened in new tab: https://medha-ai-seven.vercel.app/
          </p>
        );
        break;

      case 'resume':
        trackEvent('resume_view', { source: 'cli_terminal' });
        window.open('/api/resume', '_blank', 'noopener,noreferrer');
        response = (
          <p className="text-emerald-400">
            [OK] Active resume opened in new browser tab.
          </p>
        );
        break;

      case 'contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
        return;

      case 'theme dark':
        setTheme('DARK_OS');
        response = <p className="text-theme-orange">[OK] Kernel theme set to DARK_OS.</p>;
        break;

      case 'theme light':
        setTheme('LIGHT_OS');
        response = <p className="text-theme-orange">[OK] Kernel theme set to LIGHT_OS.</p>;
        break;

      case 'audio on':
      case 'audio off':
      case 'audio':
        const newState = toggleAudio();
        response = (
          <p className="text-theme-orange">
            [OK] Web Audio Synthesizer: {newState ? 'ENABLED' : 'MUTED'}
          </p>
        );
        break;

      case 'clear':
        setOutputs([]);
        setInputVal('');
        return;

      case 'date':
      case 'time':
        response = <p className="text-theme-secondary">{new Date().toString()}</p>;
        break;

      case 'exit':
      case 'quit':
        onClose();
        return;

      case 'sudo':
        response = (
          <p className="text-red-400">
            [SECURITY ALERT] User &apos;visitor&apos; is not in the sudoers file. This incident has been logged.
          </p>
        );
        break;

      default:
        response = (
          <p className="text-red-400">
            Command not recognized: &apos;{rawCmd}&apos;. Type &apos;help&apos; for available commands.
          </p>
        );
    }

    setOutputs((prev) => [
      ...prev,
      {
        id: `out-${Date.now()}`,
        command: rawCmd,
        response,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[history.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="retro-window w-full max-w-3xl border border-theme-orange bg-theme-surface shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="retro-window-header flex items-center justify-between text-xs bg-theme-bg border-b border-theme-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-theme-orange animate-pulse" />
            <span className="font-bold text-theme-text tracking-wider">
              SYS_CLI.EXE — ANIL_ENGINEER_SHELL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-theme-muted hidden sm:inline">
              ESC TO CLOSE | TYPE &apos;HELP&apos;
            </span>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-orange p-1 select-none"
              aria-label="Close Terminal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Terminal Output Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 text-xs leading-relaxed">
          {outputs.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-theme-muted">
                <span className="text-theme-orange font-bold">anil@os:~$</span>
                <span className="text-theme-text font-semibold">{item.command}</span>
              </div>
              <div className="pl-3 sm:pl-4 border-l border-theme-subtle">
                {item.response}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Prompt */}
        <div className="p-3 bg-theme-bg border-t border-theme-border flex items-center gap-2 text-xs">
          <span className="text-theme-orange font-bold select-none shrink-0">
            anil@os:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Type command ('help', 'hackathons', 'skills', 'projects')..."
            className="flex-1 bg-transparent text-theme-text focus:outline-none placeholder:text-theme-muted/50 text-xs font-mono"
            autoFocus
          />
          <button
            type="button"
            onClick={() => executeCommand(inputVal)}
            className="px-2 py-1 bg-theme-orange text-white text-[11px] font-bold hover:bg-theme-orange/90 flex items-center gap-1 shrink-0"
          >
            <CornerDownLeft size={12} />
            <span>RUN</span>
          </button>
        </div>
      </div>
    </div>
  );
}

