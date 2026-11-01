'use client';

import React, { useState, useMemo } from 'react';
import { Skill } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { SkillIcon } from './SkillIcons';
import { trackEvent } from '@/lib/analytics';
import { playKeySound, playBlipSound } from '@/lib/audio';
import { Search, Filter, Terminal, ShieldCheck, Info } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = [
    'AI / ML',
    'LLM ENGINEERING',
    'BACKEND',
    'ML FRAMEWORKS',
    'DATA',
    'ENGINEERING TOOLS',
  ];

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    playKeySound();
    trackEvent('skill_interaction', { skill_name: skill.name, category: skill.category });
  };

  const filteredSkills = useMemo(() => {
    return skills.filter((sk) => {
      const matchesCategory = activeFilter === 'ALL' || sk.category === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sk.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sk.used_in.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, activeFilter, searchQuery]);

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Header */}
          <div className="mb-8">
            <div className="text-xs font-mono text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_04 // SKILLS_CONSOLE ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-theme-text flex items-center gap-2">
              SYSTEM_CONSOLE.EXE
            </h2>
            <p className="text-xs font-mono text-theme-muted mt-2">
              INSPECT COMPETENCY TELEMETRY — SEARCH, FILTER, OR TAP A MODULE FOR ARCHITECTURAL BREAKDOWN.
            </p>
          </div>

          {/* Interactive Search & Category Filter Toolbar */}
          <div className="mb-8 font-mono text-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3 bg-theme-surface border border-theme-border">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-2.5 text-theme-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FILTER_MODULES: (e.g. RAG, Python, LangChain, SQL)..."
                className="w-full pl-9 pr-3 py-2 bg-theme-bg border border-theme-border text-theme-text focus:border-theme-orange focus:outline-none text-xs"
              />
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('ALL');
                  playBlipSound();
                }}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                  activeFilter === 'ALL'
                    ? 'bg-theme-orange text-white border-theme-orange'
                    : 'bg-theme-bg text-theme-secondary border-theme-border hover:border-theme-orange'
                }`}
              >
                ALL ({skills.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveFilter(cat);
                    playBlipSound();
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                    activeFilter === cat
                      ? 'bg-theme-orange text-white border-theme-orange'
                      : 'bg-theme-bg text-theme-secondary border-theme-border hover:border-theme-orange'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono">
            {/* Left: Category Modules */}
            <div className="lg:col-span-7 space-y-6">
              {categories.map((category) => {
                const categorySkills = filteredSkills.filter((s) => s.category === category);
                if (categorySkills.length === 0) return null;

                return (
                  <div
                    key={category}
                    className="border border-theme-border bg-theme-surface p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-theme-muted border-b border-theme-subtle pb-2 mb-3">
                      <span className="text-theme-orange tracking-wider">
                        {'// '}{category}
                      </span>
                      <span className="text-[11px] text-theme-secondary font-mono">
                        [{categorySkills.length} MODULES]
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((sk) => {
                        const isSelected = selectedSkill?.id === sk.id;
                        return (
                          <button
                            key={sk.id}
                            type="button"
                            onClick={() => handleSelectSkill(sk)}
                            onMouseEnter={() => setSelectedSkill(sk)}
                            className={`px-3 py-1.5 text-xs font-medium border flex items-center gap-2 transition-all duration-150 ${
                              isSelected
                                ? 'bg-theme-orange text-white border-theme-orange shadow-sm translate-y-[-1px]'
                                : 'bg-theme-bg/60 border-theme-border text-theme-text hover:border-theme-orange hover:text-theme-orange'
                            }`}
                          >
                            <SkillIcon name={sk.name} className="w-3.5 h-3.5" />
                            <span>{sk.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredSkills.length === 0 && (
                <div className="p-8 text-center text-xs text-theme-muted border border-theme-border bg-theme-surface">
                  NO MODULE MATCHES "{searchQuery.toUpperCase()}". RESETTING FILTER...
                </div>
              )}
            </div>

            {/* Right: Retro Skill Telemetry Inspector */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="retro-window border border-theme-orange bg-theme-surface">
                {/* Header */}
                <div className="retro-window-header flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-theme-orange animate-pulse" />
                    <span className="font-bold text-theme-text">TELEMETRY_INSPECTOR.SYS</span>
                  </div>
                  <span className="text-[10px] text-theme-orange font-bold">LIVE</span>
                </div>

                {/* Body */}
                {selectedSkill ? (
                  <div className="p-6 space-y-5 text-xs">
                    <div className="border-b border-theme-subtle pb-4">
                      <div className="flex items-center gap-2">
                        <SkillIcon name={selectedSkill.name} className="w-5 h-5" />
                        <h3 className="text-lg font-black text-theme-text tracking-tight">
                          {selectedSkill.name}
                        </h3>
                      </div>
                      <div className="text-[10px] text-theme-orange uppercase mt-1 font-semibold">
                        CATEGORY: {selectedSkill.category}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold mb-1">
                          DISCIPLINE:
                        </div>
                        <div className="text-theme-text p-2.5 bg-theme-bg border border-theme-border leading-relaxed">
                          {selectedSkill.discipline}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold mb-1">
                          PRACTICAL_APPLICATION:
                        </div>
                        <div className="text-theme-secondary p-2.5 bg-theme-bg border border-theme-border leading-relaxed">
                          {selectedSkill.practical_application}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold mb-1">
                          USED_IN:
                        </div>
                        <div className="text-theme-secondary p-2.5 bg-theme-bg border border-theme-border leading-relaxed">
                          {selectedSkill.used_in}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold mb-1">
                          ENGINEERING_RESPONSIBILITY:
                        </div>
                        <div className="text-theme-secondary p-2.5 bg-theme-bg border border-theme-border leading-relaxed">
                          {selectedSkill.engineering_responsibility}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-wider font-bold mb-1">
                          COMPETENCY_FOCUS:
                        </div>
                        <div className="text-theme-orange p-2.5 bg-theme-orange/5 border border-theme-orange/30 font-semibold leading-relaxed">
                          {selectedSkill.competency_focus}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-theme-muted">
                    SELECT A SKILL MODULE TO VIEW ARCHITECTURAL SPECIFICATIONS.
                  </div>
                )}
              </div>
            </div>
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

