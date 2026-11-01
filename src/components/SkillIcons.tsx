import React from 'react';
import {
  Cpu,
  Layers,
  FileText,
  Sparkles,
  Bot,
  Search,
  Terminal,
  Workflow,
  Zap,
  Database,
  Fingerprint,
  Compass,
  SlidersHorizontal,
  Code,
  Gauge,
  Network,
  Braces,
  Boxes,
  GitBranch,
  Table,
  Grid,
  GitPullRequest,
  Send,
  HelpCircle,
} from 'lucide-react';

export function SkillIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalized) {
    case 'python':
      return <Code className={`${className} text-[#3776AB]`} />;
    case 'fastapi':
      return <Gauge className={`${className} text-[#009688]`} />;
    case 'openaiapi':
    case 'openai':
      return <Zap className={`${className} text-theme-orange`} />;
    case 'langchain':
      return <Workflow className={`${className} text-[#1C3C3C] dark:text-[#25BFD0]`} />;
    case 'chromadb':
      return <Database className={`${className} text-theme-orange`} />;
    case 'tensorflow':
      return <Boxes className={`${className} text-[#FF6F00]`} />;
    case 'scikitlearn':
      return <GitBranch className={`${className} text-[#F7931E]`} />;
    case 'pandas':
      return <Table className={`${className} text-[#150458] dark:text-[#25BFD0]`} />;
    case 'numpy':
      return <Grid className={`${className} text-[#013243] dark:text-[#4DABCF]`} />;
    case 'git':
      return <GitPullRequest className={`${className} text-[#F05032]`} />;
    case 'postman':
      return <Send className={`${className} text-[#FF6C37]`} />;
    case 'sql':
      return <Database className={`${className} text-theme-cyan`} />;
    case 'machinelearning':
      return <Cpu className={`${className} text-theme-orange`} />;
    case 'deeplearning':
      return <Layers className={`${className} text-theme-cyan`} />;
    case 'nlp':
      return <FileText className={`${className} text-theme-text`} />;
    case 'generativeai':
      return <Sparkles className={`${className} text-theme-orange`} />;
    case 'llms':
      return <Bot className={`${className} text-theme-cyan`} />;
    case 'rag':
      return <Search className={`${className} text-theme-orange`} />;
    case 'promptengineering':
      return <Terminal className={`${className} text-theme-text`} />;
    case 'embeddings':
      return <Fingerprint className={`${className} text-theme-cyan`} />;
    case 'vectorsearch':
      return <Compass className={`${className} text-theme-orange`} />;
    case 'reranking':
      return <SlidersHorizontal className={`${className} text-theme-cyan`} />;
    case 'restapis':
      return <Network className={`${className} text-theme-orange`} />;
    case 'json':
      return <Braces className={`${className} text-theme-text`} />;
    default:
      return <HelpCircle className={className} />;
  }
}

