'use client';

import React from 'react';
import { Experience } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { Terminal, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 md:py-28 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Header */}
          <div className="mb-12">
            <div className="text-xs font-mono text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_02 // CHRONOLOGICAL_LOGS ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-theme-text">
              JOURNEY // HISTORY
            </h2>
          </div>

          <div className="space-y-8 font-mono">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="retro-window border border-theme-border bg-theme-surface"
              >
                {/* Header */}
                <div className="retro-window-header flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-theme-orange" />
                    <span className="font-bold text-theme-text">{exp.company}</span>
                    <span className="text-theme-muted">/</span>
                    <span className="text-theme-orange font-semibold">{exp.role}</span>
                  </div>

                  <div className="flex items-center gap-4 text-theme-secondary text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-theme-muted" />
                      {exp.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-theme-orange font-medium">
                      <Calendar size={12} />
                      {exp.start_date} – {exp.end_date}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Bullets */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {exp.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-theme-secondary flex items-start gap-3 leading-relaxed"
                        >
                          <span className="text-theme-orange font-bold text-sm select-none">›</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="pt-4 border-t border-theme-subtle flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] text-theme-muted uppercase tracking-wider mr-2">
                        SYS_STACK:
                      </span>
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-theme-bg border border-theme-border text-theme-text font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

