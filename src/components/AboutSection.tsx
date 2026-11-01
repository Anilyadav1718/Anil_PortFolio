'use client';

import React from 'react';
import { ViewportReveal } from './ViewportReveal';
import { Bot, Server, Workflow } from 'lucide-react';

export function AboutSection() {
  const domains = [
    {
      num: '01',
      title: 'AI ENGINEERING',
      desc: 'LLMs, RAG pipelines, dense embeddings, vector retrieval, and deterministic prompt engineering systems for grounded reasoning.',
      icon: Bot,
      color: 'border-l-4 border-l-theme-orange',
    },
    {
      num: '02',
      title: 'BACKEND & APIs',
      desc: 'Production-grade Python architectures, high-throughput asynchronous FastAPI endpoints, structured REST APIs, and SQL data modeling.',
      icon: Server,
      color: 'border-l-4 border-l-theme-cyan',
    },
    {
      num: '03',
      title: 'ENTERPRISE AUTOMATION',
      desc: 'Automated operational workflows, Cisco Meraki & ServiceNow integrations, document validation routines, audit reporting, and notifications.',
      icon: Workflow,
      color: 'border-l-4 border-l-theme-orange',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Section Header */}
          <div className="mb-12">
            <div className="text-xs font-mono text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_01 // USER_PROFILE_LOGS ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-theme-text flex items-center gap-3">
              <span className="text-theme-orange font-bold">$</span> WHO AM I
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: 2 Concise Paragraphs */}
            <div className="lg:col-span-6 space-y-6 text-sm sm:text-base font-mono text-theme-secondary leading-relaxed">
              <p className="p-4 border border-theme-border bg-theme-surface">
                I am a Software Engineer based in Hyderabad, India, with engineering experience at Cisco Systems. My technical work focuses on designing and implementing practical machine learning, Generative AI, Retrieval-Augmented Generation (RAG), and high-throughput Python backends.
              </p>
              <p className="p-4 border border-theme-border bg-theme-surface">
                Rather than treating AI as isolated models, I treat it as an engineered software system—integrating vector databases, robust REST APIs, strict schema validation, and automated pipelines that deliver tangible, reliable outcomes in production environments.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-theme-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-theme-orange" /> PRODUCTION_READY
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-theme-cyan" /> FULL_SYSTEM_TRACING
                </span>
              </div>
            </div>

            {/* Right: Three Rectangular Panels */}
            <div className="lg:col-span-6 space-y-4 font-mono">
              {domains.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.num}
                    className={`p-5 bg-theme-surface border border-theme-border ${item.color} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-theme-orange flex items-center gap-2">
                        <span>{item.num} {'//'}</span>
                        <span className="tracking-wider text-theme-text text-sm">{item.title}</span>
                      </div>
                      <IconComponent size={18} className="text-theme-muted" />
                    </div>
                    <p className="text-xs sm:text-sm text-theme-secondary leading-normal">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

