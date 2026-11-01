'use client';

import React from 'react';
import { Certification, Achievement, Education } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { Award, GraduationCap, CheckCircle2, Trophy, Star, Sparkles } from 'lucide-react';

interface CredentialsSectionProps {
  certifications: Certification[];
  achievements: Achievement[];
  education: Education[];
}

export function CredentialsSection({ certifications, achievements, education }: CredentialsSectionProps) {
  return (
    <div className="border-b border-theme-border font-mono">
      {/* 1. ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-20 md:py-24 border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ViewportReveal>
            <div className="mb-12">
              <div className="text-xs text-theme-orange uppercase tracking-wider mb-2">
                [ SEC_06 // SYSTEM_EVENTS ]
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-text">
                HONORS & SYSTEM RECOGNITIONS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="retro-window border border-theme-border bg-theme-surface p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-theme-muted border-b border-theme-subtle pb-2">
                      <span className="text-theme-orange font-bold uppercase">{ach.organization}</span>
                      <span className="px-1.5 py-0.5 bg-theme-bg border border-theme-subtle text-[11px]">
                        {ach.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-theme-text leading-snug">
                      {ach.title}
                    </h3>

                    <div className="text-xs font-semibold text-theme-orange flex items-center gap-1.5">
                      <Trophy size={14} />
                      <span>{ach.subtitle}</span>
                    </div>

                    {ach.description && (
                      <p className="text-xs text-theme-secondary leading-relaxed pt-1">
                        {ach.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center gap-1 text-[11px] text-theme-muted">
                    <CheckCircle2 size={12} className="text-theme-orange" />
                    <span>VERIFIED_CREDENTIAL</span>
                  </div>
                </div>
              ))}
            </div>
          </ViewportReveal>
        </div>
      </section>

      {/* 2. CERTIFICATIONS & EDUCATION GRID */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ViewportReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Certifications */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="text-xs text-theme-orange uppercase tracking-wider mb-2">
                    [ RECORD_LOG // CERTIFICATION_LOGS ]
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-text">
                    LICENSES & CERTIFICATIONS
                  </h2>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-theme-border bg-theme-surface flex items-center justify-between gap-4 hover:border-theme-orange transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-theme-orange font-bold">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-theme-text">
                            {cert.title}
                          </h4>
                          <span className="text-[11px] text-theme-secondary">
                            {cert.issuer}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase px-2 py-1 bg-theme-bg border border-theme-border text-theme-orange font-semibold whitespace-nowrap">
                        {cert.issue_date || 'VERIFIED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Academic Log (Education) */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="text-xs text-theme-orange uppercase tracking-wider mb-2">
                    [ ACADEMIC_LOG // HIGHER_ED ]
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-text">
                    FORMAL EDUCATION
                  </h2>
                </div>

                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="retro-window border border-theme-border bg-theme-surface p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs text-theme-muted border-b border-theme-subtle pb-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-theme-orange" />
                        <span className="font-bold text-theme-text">{edu.degree} — {edu.field_of_study}</span>
                      </div>
                      <span className="text-theme-orange font-bold">
                        {edu.start_year} – {edu.end_year}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-theme-text">
                        {edu.institution}
                      </h3>
                      <p className="text-xs text-theme-secondary mt-0.5">
                        {edu.location}
                      </p>
                    </div>

                    <div className="p-3 bg-theme-bg border border-theme-border flex items-center justify-between text-xs">
                      <span className="text-theme-secondary">CUMULATIVE GRADE POINT (CGPA):</span>
                      <span className="text-theme-orange font-black text-sm">{edu.cgpa} / 10.0</span>
                    </div>

                    {edu.description && (
                      <p className="text-xs text-theme-secondary leading-relaxed pt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ViewportReveal>
        </div>
      </section>
    </div>
  );
}

