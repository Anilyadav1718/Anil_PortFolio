'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Menu, X, Terminal, Volume2, VolumeX } from 'lucide-react';
import { CommandTerminal } from './CommandTerminal';
import { initAudio, toggleAudio, getAudioEnabled, playBlipSound } from '@/lib/audio';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [seconds, setSeconds] = useState(343); // Realistic base startup counter
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  useEffect(() => {
    initAudio();
    setAudioActive(getAudioEnabled());

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const handleGlobalKey = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, []);

  const handleAudioToggle = () => {
    const isNowOn = toggleAudio();
    setAudioActive(isNowOn);
  };

  const formatUptime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'RESEARCH', href: '#research' },
    { label: 'ACHIEVEMENTS', href: '#achievements' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-theme-border bg-theme-bg/95 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left side: System Brand, Theme Toggle & Terminal Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="font-bold tracking-wider text-sm sm:text-base hover:text-theme-orange transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 bg-theme-orange inline-block" />
              ANIL.REF
            </Link>

            <button
              onClick={() => {
                toggleTheme();
                playBlipSound();
              }}
              type="button"
              className="px-2 py-0.5 text-xs font-mono font-medium border border-theme-border hover:border-theme-orange hover:text-theme-orange transition-all duration-150 uppercase"
              aria-label="Toggle Operating System Theme"
            >
              {theme === 'LIGHT_OS' ? '[ DARK_OS ]' : '[ LIGHT_OS ]'}
            </button>

            {/* Interactive CLI Terminal Trigger */}
            <button
              onClick={() => setTerminalOpen(true)}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-medium border border-theme-orange text-theme-orange bg-theme-orange/10 hover:bg-theme-orange hover:text-white transition-all uppercase"
              title="Open Command Line Terminal (Shortcut: T)"
            >
              <Terminal size={12} />
              <span>TERMINAL [T]</span>
            </button>
          </div>

          {/* Center: Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-theme-secondary hover:text-theme-orange hover:underline underline-offset-4 decoration-theme-orange transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: Audio Synthesizer, System Metrics & Mobile Menu Button */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              type="button"
              className={`p-1 border text-xs flex items-center gap-1 transition-colors ${
                audioActive
                  ? 'border-theme-orange text-theme-orange bg-theme-orange/10'
                  : 'border-theme-border text-theme-muted hover:text-theme-text'
              }`}
              title={audioActive ? 'Audio Synthesizer: ON' : 'Audio Synthesizer: MUTED'}
              aria-label="Toggle Audio Synthesizer"
            >
              {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span className="text-[10px] hidden sm:inline">{audioActive ? 'AUDIO: ON' : 'AUDIO: MUTED'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 text-theme-muted">
              <span className="text-theme-secondary">
                SYS_UP: <span className="text-theme-orange">{formatUptime(seconds)}</span>
              </span>
              <span className="text-theme-border">|</span>
              <span className="text-theme-secondary">UI_LOAD: 08%</span>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 border border-theme-border text-theme-secondary hover:text-theme-orange"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-theme-border bg-theme-surface px-4 py-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-theme-subtle text-theme-muted">
              <span>SYS_UP: {formatUptime(seconds)}</span>
              <button
                onClick={() => {
                  setTerminalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-0.5 border border-theme-orange text-theme-orange font-bold text-[11px]"
              >
                OPEN TERMINAL
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 border border-theme-subtle hover:border-theme-orange hover:text-theme-orange transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Interactive CLI Terminal Drawer Component */}
      <CommandTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
}

