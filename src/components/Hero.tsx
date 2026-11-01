'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SiteSettings } from '@/types/portfolio';
import { ViewportReveal } from './ViewportReveal';
import { trackEvent, getAnonymousSessionId } from '@/lib/analytics';
import { ArrowDown, FileText } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  const targetText = settings.hero_name || 'ANIL_PANCHITHA //';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex < targetText.length) {
      // Typing phase: 85ms
      timeout = setTimeout(() => {
        setDisplayText(targetText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 85);
    } else if (!isDeleting && charIndex === targetText.length) {
      // Pause at full text for 12 seconds
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 12000);
    } else if (isDeleting && charIndex > 0) {
      // Deleting phase: 50ms
      timeout = setTimeout(() => {
        setDisplayText(targetText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else if (isDeleting && charIndex === 0) {
      // Restart typing after short pause
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, targetText]);

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const sessionId = getAnonymousSessionId();
    trackEvent('resume_view', { source: 'hero_button' });
    const targetUrl = `/api/resume?sessionId=${encodeURIComponent(sessionId)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN: Technical Identification & Typography */}
            <div className="lg:col-span-7 space-y-6">
              {/* Protocol tag */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono border border-theme-border bg-theme-surface text-theme-secondary">
                <span className="w-1.5 h-1.5 bg-theme-orange animate-ping" />
                <span>{settings.hero_protocol_tag || '[ INITIALIZING PROTOCOL... ]'}</span>
              </div>

              {/* Typing Animated Name */}
              <div className="font-mono text-lg sm:text-2xl text-theme-secondary flex items-center min-h-[36px]">
                <span className="tracking-wider">{displayText}</span>
                <span className="inline-block w-2.5 h-5 bg-theme-orange ml-1 animate-blink" />
              </div>

              {/* Large Geometric Display Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] select-none font-mono">
                <span className="block text-theme-text">{settings.hero_title_1 || 'AI & ML'}</span>
                <span className="block text-theme-orange">{settings.hero_title_2 || 'SYSTEMS'}</span>
                <span className="block text-theme-text">{settings.hero_title_3 || 'ENGINEER'}</span>
              </h1>

              {/* Concise Description */}
              <p className="text-sm sm:text-base text-theme-secondary font-mono max-w-xl leading-relaxed pt-2">
                {settings.hero_description ||
                  'Software Engineer with experience at Cisco Systems, specializing in Python, Generative AI, LLMs, RAG, Machine Learning, APIs and AI-driven automation.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4 font-mono">
                <a
                  href="#projects"
                  className="btn-retro-primary shadow-retro cursor-pointer"
                >
                  <ArrowDown size={15} />
                  <span>EXPLORE_FILES</span>
                </a>

                <button
                  onClick={handleResumeClick}
                  type="button"
                  className="btn-retro-outline cursor-pointer"
                  aria-label="View Resume PDF in new tab"
                >
                  <FileText size={15} />
                  <span>VIEW_RESUME.PDF</span>
                </button>
              </div>

              {/* System Specs Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-theme-muted border-t border-theme-subtle">
                <div>
                  <span className="block text-[10px] text-theme-muted uppercase">LOCATION</span>
                  <span className="text-theme-text font-medium">{settings.location || 'Hyderabad, India'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-theme-muted uppercase">SYSTEM ARCH</span>
                  <span className="text-theme-text font-medium">FastAPI / PyTorch</span>
                </div>
                <div>
                  <span className="block text-[10px] text-theme-muted uppercase">STATUS</span>
                  <span className="text-theme-orange font-medium">READY_FOR_DEPLOY</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Retro System Window with Editorial Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm sm:max-w-md retro-window border border-theme-border bg-theme-surface">
                {/* Window header */}
                <div className="retro-window-header flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-theme-orange" />
                    <span className="font-semibold tracking-wider">PORTRAIT_01.JPG</span>
                  </div>
                  <div className="flex items-center gap-2 text-theme-muted text-xs select-none">
                    <span className="hover:text-theme-text cursor-default">□</span>
                    <span className="hover:text-theme-text cursor-default">□</span>
                    <span className="text-theme-orange cursor-default">✕</span>
                  </div>
                </div>

                {/* Photo container */}
                <div className="relative p-2 bg-theme-surface">
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-theme-border bg-black/90">
                    <Image
                      src={settings.profile_photo_url || '/portrait_01.jpg'}
                      alt="Anil Panchitha - AI/ML Software Engineer"
                      fill
                      priority
                      className="object-cover object-top grayscale contrast-125 filter hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />

                    {/* Technical HUD Overlay on photo */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 text-[10px] text-theme-cyan font-mono border border-theme-cyan/40">
                      ID: AP_SYS_01
                    </div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] text-[#FFFFFF] font-mono border border-white/20">
                      SYS: 24bpp_RAW
                    </div>
                  </div>

                  {/* Window footer status */}
                  <div className="mt-2 px-2 py-1 flex items-center justify-between text-[11px] font-mono text-theme-muted border-t border-theme-subtle">
                    <span>STATUS: ACTIVE_VERIFIED</span>
                    <span className="text-theme-orange">200 OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

