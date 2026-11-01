'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  BookOpen,
  Award,
  Trophy,
  BarChart3,
  Mail,
  Settings,
  Share2,
  FileText,
  LogOut,
  ExternalLink,
  RefreshCw,
  Check,
  Lock,
  ShieldAlert,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { AdminProvider, useAdmin } from './AdminContext';

const contentNavItems = [
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/skills', label: 'Skills', icon: Cpu },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/research', label: 'Research', icon: BookOpen },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
];

const engagementNavItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/analytics', label: 'Visitors & Traffic', icon: Activity },
  { href: '/admin/messages', label: 'Contact Messages', icon: Mail },
];

const managementNavItems = [
  { href: '/admin/resume', label: 'Resume', icon: FileText },
  { href: '/admin/socials', label: 'Social Links', icon: Share2 },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

function WorkstationContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { saveStatus } = useAdmin();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Authenticate ONCE on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
    fetch('/api/auth', {
      headers: token ? { 'x-admin-token': token } : {},
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          sessionStorage.setItem('admin_token', data.token);
        }
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode token.');
      }
    } catch {
      setAuthError('Connection error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_token');
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // Loading initial auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0C0C0F] text-[#E4E4E7] flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="w-2.5 h-2.5 bg-[#E9470B] animate-ping" />
          <span>INITIALIZING ADMINISTRATIVE SECURITY SHELL...</span>
        </div>
      </div>
    );
  }

  // Locked Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D11] text-[#E4E4E7] flex flex-col justify-center items-center p-4 font-mono">
        <div className="w-full max-w-md bg-[#16161D] border border-[#2E2E38] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-[#2E2E38] pb-4 mb-6">
            <div className="w-10 h-10 bg-[#E9470B]/10 border border-[#E9470B]/40 flex items-center justify-center text-[#E9470B]">
              <Lock size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white">
                ADMIN ACCESS CONSOLE
              </h1>
              <p className="text-[11px] text-[#A1A1AA]">
                SINGLE-SIGN-ON // ANIL PANCHITHA
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-2 font-semibold">
                SYSTEM PASSCODE TOKEN
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access passcode..."
                autoFocus
                className="w-full px-3 py-2.5 bg-[#0D0D11] border border-[#3E3E4C] text-white focus:outline-none focus:border-[#E9470B] text-xs min-h-[44px]"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {authLoading ? 'VERIFYING SECURITY TOKEN...' : 'INITIALIZE WORKSTATION'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#23232C] text-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <span>Return to Public Portfolio</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isNavActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0C0C0F] text-[#E4E4E7] flex flex-col font-sans">
      {/* Mobile Top Bar (< 1024px) */}
      <header className="flex lg:hidden h-14 bg-[#141419] border-b border-[#23232C] px-3 sm:px-4 items-center justify-between shrink-0 font-mono sticky top-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#1E1E26] border border-[#2E2E38] shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 bg-[#E9470B] shrink-0" />
            <span className="font-bold text-white text-xs tracking-wider truncate">
              ADMIN WORKSTATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {saveStatus && (
            <span className="text-emerald-400 text-[10px] hidden sm:flex items-center gap-1 font-semibold animate-pulse">
              <Check size={12} /> Saved
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-3 bg-[#1E1E26] hover:bg-[#282834] text-zinc-300 hover:text-white border border-[#2E2E38] flex items-center gap-1 text-xs font-mono transition-colors min-h-[44px]"
            title="Open Public Site"
          >
            <span>Site</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* Desktop Top Bar (>= 1024px) */}
      <header className="hidden lg:flex h-14 bg-[#141419] border-b border-[#23232C] px-6 items-center justify-between shrink-0 font-mono sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#E9470B]" />
          <span className="font-bold text-white text-sm tracking-wider">
            ANIL PANCHITHA // ADMIN WORKSTATION
          </span>
          <span className="text-xs px-2 py-0.5 bg-[#E9470B]/10 border border-[#E9470B]/30 text-[#E9470B] font-semibold">
            SECURE_SESSION
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {saveStatus && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
              <Check size={14} /> {saveStatus}
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] flex items-center gap-1.5 transition-colors min-h-[36px]"
          >
            <span>Open Public Portfolio</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors min-h-[36px]"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay (< 1024px) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden font-mono">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[min(84vw,320px)] h-[100dvh] bg-[#111116] border-r border-[#23232C] shadow-2xl flex flex-col justify-between overflow-y-auto z-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] animate-in slide-in-from-left duration-200">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between border-b border-[#23232C] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#E9470B]" />
                  <span className="font-bold text-white text-xs tracking-wider">
                    NAVIGATION
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#1E1E26] rounded"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                  CONTENT
                </div>
                <div className="space-y-1">
                  {contentNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          active
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                  ENGAGEMENT
                </div>
                <div className="space-y-1">
                  {engagementNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          active
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                  MANAGEMENT
                </div>
                <div className="space-y-1">
                  {managementNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          active
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#23232C] space-y-2 shrink-0">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-3 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] text-xs min-h-[44px] transition-colors"
              >
                <span>Open Public Portfolio</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-between px-3 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs min-h-[44px] transition-colors"
              >
                <span>Logout</span>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar (Desktop >= 1024px) */}
        <aside className="hidden lg:flex w-64 bg-[#111116] border-r border-[#23232C] flex-col justify-between overflow-y-auto shrink-0 font-mono text-xs">
          <div className="p-4 space-y-6">
            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                CONTENT
              </div>
              <div className="space-y-1">
                {contentNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        active
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                ENGAGEMENT
              </div>
              <div className="space-y-1">
                {engagementNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        active
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                MANAGEMENT
              </div>
              <div className="space-y-1">
                {managementNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        active
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#23232C] text-[11px] text-[#6B7280]">
            <div>Single Source: Supabase / Local</div>
            <div>Status: Operational</div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 bg-[#0A0A0D] overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 w-full max-w-full">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 min-w-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <WorkstationContent>{children}</WorkstationContent>
    </AdminProvider>
  );
}
