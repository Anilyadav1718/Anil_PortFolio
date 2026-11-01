'use client';

import React from 'react';
import { Research } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { trackEvent } from '@/lib/analytics';
import { ExternalLink, BookCheck, ShieldAlert } from 'lucide-react';

interface ResearchSectionProps {
  research: Research[];
}

export function ResearchSection({ research }: ResearchSectionProps) {
  const handlePaperClick = (paper: Research, type: 'paper' | 'doi') => {
    trackEvent('publication_click', {
      title: paper.title,
      type,
      doi: paper.doi,
    });
  };

  return (
    <section id="research" className="py-20 md:py-28 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Header */}
          <div className="mb-12">
            <div className="text-xs font-mono text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_05 // RESEARCH_ARCHIVE ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-theme-text">
              PEER-REVIEWED RESEARCH
            </h2>
          </div>

          <div className="space-y-8 font-mono">
            {research.map((pub) => (
              <div
                key={pub.id}
                className="retro-window border border-theme-border bg-theme-surface"
              >
                {/* Window header */}
                <div className="retro-window-header flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-theme-orange" />
                    <span className="font-bold text-theme-text">{pub.publisher}</span>
                  </div>
                  <div className="text-xs text-theme-orange font-semibold">
                    DOI: {pub.doi}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-theme-text tracking-tight mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-theme-secondary font-medium">
                      Author: <span className="text-theme-text font-bold">Anil Panchitha</span> et al.
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed bg-theme-bg p-4 border border-theme-border">
                    {pub.abstract}
                  </p>

                  {/* Focus Areas */}
                  {pub.areas && pub.areas.length > 0 && (
                    <div>
                      <div className="text-[10px] text-theme-muted uppercase tracking-wider mb-2 font-bold">
                        RESEARCH_DOMAINS & ARCHITECTURES:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pub.areas.map((area) => (
                          <span
                            key={area}
                            className="px-2.5 py-1 text-xs bg-theme-surface border border-theme-border text-theme-text font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-4 border-t border-theme-subtle flex flex-wrap gap-3">
                    <a
                      href={pub.paper_url || `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePaperClick(pub, 'paper')}
                      className="btn-retro-primary text-xs"
                    >
                      <BookCheck size={14} />
                      <span>VIEW_PAPER</span>
                    </a>

                    <a
                      href={pub.doi_url || `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePaperClick(pub, 'doi')}
                      className="btn-retro-outline text-xs"
                    >
                      <ExternalLink size={14} />
                      <span>VIEW_DOI</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

