'use client';

import React, { useState } from 'react';
import { Project } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { trackEvent } from '@/lib/analytics';
import { ExternalLink, BookOpen, X, Terminal, ArrowRight, Trophy, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);

  const handleLinkClick = (project: Project, type: 'github' | 'linkedin' | 'demo' | 'case_study') => {
    trackEvent(`project_${type}_click` as any, {
      project_id: project.id,
      project_title: project.title,
      slug: project.slug,
    });
  };

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Header */}
          <div className="mb-12">
            <div className="text-xs font-mono text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_03 // PORTFOLIO_DEPLOYMENTS ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-theme-text">
              LATEST DEPLOYMENTS
            </h2>
          </div>

          {/* Project Cards Grid */}
          <div className="space-y-12">
            {projects.map((proj, idx) => {
              const isPrimary = proj.featured || idx === 0;

              return (
                <div
                  key={proj.id}
                  className={`retro-window border ${
                    isPrimary ? 'border-theme-orange/80' : 'border-theme-border'
                  } bg-theme-surface`}
                >
                  {/* Retro Window Header */}
                  <div className="retro-window-header flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${isPrimary ? 'bg-theme-orange' : 'bg-theme-cyan'}`} />
                      <span className="font-bold tracking-wider text-theme-text">
                        {proj.system_code || `PROJECT_0${idx + 1} // ${proj.slug.toUpperCase()}`}
                      </span>
                      {proj.slug === 'farmerverify-ai' && (
                        <span className="ml-2 px-2 py-0.5 bg-theme-orange text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-sm">
                          <Trophy size={11} /> HACKATHON WINNER
                        </span>
                      )}
                      {proj.slug === 'medha-ai' && (
                        <span className="ml-2 px-2 py-0.5 bg-theme-cyan text-black text-[10px] font-black tracking-wider flex items-center gap-1 shadow-sm">
                          🧠 AGENTIC PLATFORM
                        </span>
                      )}
                      {isPrimary && proj.slug !== 'farmerverify-ai' && (
                        <span className="ml-2 px-1.5 py-0.2 bg-theme-orange text-white text-[10px] font-bold">
                          PRIMARY_FEATURE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-theme-muted text-xs select-none">
                      <span className="hover:text-theme-text cursor-default">□</span>
                      <span className="hover:text-theme-text cursor-default">□</span>
                      <span className="text-theme-orange cursor-default">✕</span>
                    </div>
                  </div>

                  {/* Window Body */}
                  <div className="p-6 sm:p-8 space-y-6 font-mono">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 border-b border-theme-subtle pb-4">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-theme-text tracking-tight">
                          {proj.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-theme-orange font-medium mt-1">
                          {proj.subtitle}
                        </p>
                      </div>

                      {proj.impact && (
                        <div className="px-3 py-1.5 bg-theme-orange/10 border border-theme-orange/30 text-xs font-semibold text-theme-orange self-start md:self-auto">
                          RESULT: {proj.impact}
                        </div>
                      )}
                    </div>

                    {/* Description & Details */}
                    <p className="text-sm sm:text-base text-theme-secondary leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Problem / Solution Grid */}
                    {(proj.problem || proj.solution) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {proj.problem && (
                          <div className="p-4 bg-theme-bg/60 border border-theme-subtle text-xs">
                            <span className="text-theme-muted uppercase font-bold block mb-1">
                              [ SYSTEM_BOTTLENECK ]
                            </span>
                            <span className="text-theme-secondary">{proj.problem}</span>
                          </div>
                        )}
                        {proj.solution && (
                          <div className="p-4 bg-theme-bg/60 border border-theme-subtle text-xs">
                            <span className="text-theme-orange uppercase font-bold block mb-1">
                              [ APPLIED_ARCHITECTURE ]
                            </span>
                            <span className="text-theme-secondary">{proj.solution}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tech Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] text-theme-muted uppercase mb-2">
                          STACK_COMPONENTS:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-theme-bg border border-theme-border text-theme-text font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-theme-subtle flex flex-wrap gap-3 items-center">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(proj, 'github')}
                          className="btn-retro-outline text-xs"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>GITHUB</span>
                        </a>
                      )}

                      {proj.linkedin_url && (
                        <a
                          href={proj.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(proj, 'linkedin')}
                          className="btn-retro-outline text-xs"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                          <span>LINKEDIN</span>
                        </a>
                      )}

                      {proj.live_demo_url && (
                        <a
                          href={proj.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(proj, 'demo')}
                          className="btn-retro-outline text-xs"
                        >
                          <ExternalLink size={14} />
                          <span>LIVE_VIEW</span>
                        </a>
                      )}

                      <button
                        onClick={() => {
                          handleLinkClick(proj, 'case_study');
                          setActiveCaseStudy(proj);
                        }}
                        type="button"
                        className="btn-retro-outline text-xs"
                      >
                        <BookOpen size={14} />
                        <span>CASE_STUDY</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ViewportReveal>
      </div>

      {/* Case Study Modal Window */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="retro-window w-full max-w-2xl border border-theme-orange bg-theme-surface max-h-[90vh] flex flex-col font-mono">
            <div className="retro-window-header flex items-center justify-between text-xs">
              <span className="font-bold text-theme-orange">
                CASE_STUDY // {activeCaseStudy.slug.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="text-theme-muted hover:text-theme-orange p-1"
                aria-label="Close Case Study"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-theme-secondary">
              <div>
                <h4 className="text-lg font-bold text-theme-text mb-1">{activeCaseStudy.title}</h4>
                <p className="text-theme-orange text-xs">{activeCaseStudy.subtitle}</p>
              </div>

              {activeCaseStudy.slug === 'farmerverify-ai' && (
                <div className="p-3 bg-theme-orange/10 border border-theme-orange text-theme-orange font-bold text-xs flex items-center gap-2">
                  <Trophy size={16} className="shrink-0" />
                  <span>HACKATHON WINNER // 1ST PLACE AWARD FOR MULTIMODAL AI INNOVATION</span>
                </div>
              )}

              {activeCaseStudy.slug === 'medha-ai' && (
                <div className="p-3 bg-theme-cyan/10 border border-theme-cyan text-theme-cyan font-bold text-xs flex items-center gap-2">
                  <span>🧠 FULL-STACK AGENTIC ARCHITECTURE: GEMINI + GROQ FALLBACK + TAVILY SEARCH + SUPABASE PGVECTOR</span>
                </div>
              )}

              {activeCaseStudy.impact && (
                <div className="p-3 bg-theme-orange/10 border border-theme-orange/40 text-theme-orange font-bold">
                  PROVEN OUTCOME: {activeCaseStudy.impact}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                  1. ARCHITECTURAL OVERVIEW
                </span>
                <p className="leading-relaxed bg-theme-bg p-3 border border-theme-border">
                  {activeCaseStudy.description}
                </p>
              </div>

              {activeCaseStudy.problem && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                    2. PROBLEM & SYSTEM CHALLENGES
                  </span>
                  <p className="leading-relaxed bg-theme-bg p-3 border border-theme-border">
                    {activeCaseStudy.problem}
                  </p>
                </div>
              )}

              {activeCaseStudy.solution && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider block">
                    3. ENGINEERING SOLUTION & PIPELINE
                  </span>
                  <p className="leading-relaxed bg-theme-bg p-3 border border-theme-border">
                    {activeCaseStudy.solution}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="btn-retro-primary text-xs"
                >
                  CLOSE_INSPECTOR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
