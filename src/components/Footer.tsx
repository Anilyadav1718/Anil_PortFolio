'use client';

import React, { useState, useEffect } from 'react';
import { SocialLink } from '@/types/portfolio';
import { trackEvent, getAnonymousSessionId } from '@/lib/analytics';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  socials: SocialLink[];
  tagline?: string;
}

export function Footer({ socials, tagline }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (social: SocialLink) => {
    const platform = social.platform.toLowerCase();
    if (platform === 'github') trackEvent('github_click', { url: social.url });
    else if (platform === 'linkedin') trackEvent('linkedin_click', { url: social.url });
    else if (platform === 'email') trackEvent('email_click');
    else if (platform === 'resume_pdf' || platform === 'resume') {
      trackEvent('resume_view', { source: 'footer' });
    }
  };

  return (
    <footer className="pt-20 pb-12 bg-theme-bg border-t border-theme-border font-mono relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Social Links System Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pb-16 border-b border-theme-subtle">
          {socials.map((soc) => {
            const isResume = soc.platform.toLowerCase().includes('resume');
            const targetHref = isResume
              ? `/api/resume?sessionId=${encodeURIComponent(getAnonymousSessionId())}`
              : soc.url;

            return (
              <a
                key={soc.id}
                href={targetHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick(soc)}
                className="px-4 py-2 border border-theme-border bg-theme-surface hover:border-theme-orange hover:text-theme-orange text-xs font-bold tracking-wider transition-all duration-150"
              >
                {soc.label}
              </a>
            );
          })}
        </div>

        {/* Large Footer Identity */}
        <div className="pt-16 pb-8 text-center space-y-4">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-theme-text tracking-tighter select-none">
            ANIL_PANCHITHA
          </h2>

          <div className="text-xs font-bold text-theme-orange tracking-widest uppercase">
            [ SYSTEM_SHUTDOWN // 2026 ]
          </div>

          <div className="text-[11px] text-theme-muted tracking-widest uppercase">
            END_OF_PAGE
          </div>

          <p className="text-xs sm:text-sm text-theme-secondary max-w-md mx-auto pt-4 leading-relaxed font-medium">
            {tagline || 'BUILDING INTELLIGENT SYSTEMS FOR REAL-WORLD PROBLEMS.'}
          </p>
        </div>

        {/* System copyright line */}
        <div className="pt-8 mt-8 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between text-[11px] text-theme-muted gap-2">
          <span>OPERATING_SYSTEM: DUAL_KERNEL (LIGHT_OS / DARK_OS)</span>
          <span>© 2026 ANIL PANCHITHA. ALL RIGHTS RESERVED.</span>
        </div>
      </div>

      {/* Retro Square Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Back to Top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-theme-orange text-white flex items-center justify-center shadow-lg hover:bg-theme-orange/90 transition-all cursor-pointer font-mono font-bold text-lg rounded-none border border-black/20"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
}

