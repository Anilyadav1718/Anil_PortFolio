'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SiteSettings,
  SocialLink,
  Experience,
  Project,
  Skill,
  Education,
  Research,
  Certification,
  Achievement,
  ContactMessage,
  ResumeFile,
} from '@/types/portfolio';
import {
  Lock,
  Unlock,
  ShieldAlert,
  BarChart3,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  BookOpen,
  Award,
  Trophy,
  FileText,
  Mail,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Users,
  Eye,
  MousePointerClick,
  Upload,
  RefreshCw,
  Globe,
  Smartphone,
  Laptop,
  Menu,
  X,
} from 'lucide-react';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'experience'
    | 'projects'
    | 'skills'
    | 'education'
    | 'research'
    | 'certifications'
    | 'achievements'
    | 'resume'
    | 'socials'
    | 'settings'
    | 'analytics'
    | 'messages'
  >('overview');

  // Data state
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Status message for saves
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const contentNavItems = [
    { id: 'experience' as const, label: 'Experience', icon: Briefcase },
    { id: 'projects' as const, label: 'Projects', icon: FolderGit2 },
    { id: 'skills' as const, label: 'Skills', icon: Cpu },
    { id: 'education' as const, label: 'Education', icon: GraduationCap },
    { id: 'research' as const, label: 'Research', icon: BookOpen },
    { id: 'certifications' as const, label: 'Certifications', icon: Award },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  const engagementNavItems = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'analytics' as const, label: 'Visitors & Traffic', icon: Users },
    { id: 'messages' as const, label: `Contact Messages (${messages.length})`, icon: Mail },
  ];

  const managementNavItems = [
    { id: 'resume' as const, label: 'Resume', icon: FileText },
    { id: 'socials' as const, label: 'Social Links', icon: Share2 },
    { id: 'settings' as const, label: 'Site Settings', icon: Settings },
  ];


  // New Experience form state
  const [showNewExpForm, setShowNewExpForm] = useState(false);
  const [newExpForm, setNewExpForm] = useState<{
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    is_published: boolean;
    tags: string[];
    bullets: string[];
  }>({
    company: '',
    role: 'Software Engineer',
    location: 'Bangalore, India',
    start_date: 'August 2025',
    end_date: 'August 2026',
    is_current: false,
    is_published: true,
    tags: ['Python', 'Generative AI', 'LLMs', 'RAG'],
    bullets: ['Built enterprise GenAI and automation workflows using Python.'],
  });

  // Check auth cookie / token on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
    fetch('/api/auth', {
      headers: token ? { 'x-admin-token': token } : {},
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
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
        loadAllData();
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

  const getAdminHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
    return token ? { 'x-admin-token': token } : {};
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [contentRes, analyticsRes] = await Promise.all([
        fetch('/api/content', { headers: getAdminHeaders() }),
        fetch('/api/analytics'),
      ]);

      if (contentRes.ok) {
        const cData = await contentRes.json();
        setSettings(cData.portfolio.settings);
        setSocials(cData.portfolio.socials);
        setExperiences(cData.portfolio.experiences);
        setProjects(cData.portfolio.projects);
        setSkills(cData.portfolio.skills);
        setEducation(cData.portfolio.education);
        setResearch(cData.portfolio.research);
        setCertifications(cData.portfolio.certifications);
        setAchievements(cData.portfolio.achievements);
        setMessages(cData.messages || []);
        setResumes(cData.resumes || []);
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalyticsData(aData);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSaveSuccess = (msg: string = 'Changes saved successfully') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // CRUD helpers
  const saveEntity = async (type: string, data: any) => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, data }),
      });
      if (res.ok) {
        showSaveSuccess('Changes saved! Live on portfolio.');
        loadAllData();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert('Save failed: ' + (errJson.error || res.statusText || 'Server error occurred'));
      }
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const deleteEntity = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, action: 'delete', id }),
      });
      if (res.ok) {
        showSaveSuccess('Record deleted');
        loadAllData();
      }
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  // Resume file upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are supported.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('set_active', 'true');

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showSaveSuccess('New resume uploaded and set as active!');
        loadAllData();
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      alert('Upload error: ' + err);
    }
  };

  const handleSetActiveResume = async (id: string) => {
    const formData = new FormData();
    formData.append('action', 'set_active');
    formData.append('id', id);

    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: formData,
    });
    if (res.ok) {
      showSaveSuccess('Active resume updated');
      loadAllData();
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Delete this resume file?')) return;
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: formData,
    });
    if (res.ok) {
      showSaveSuccess('Resume deleted');
      loadAllData();
    }
  };

  // --------------------------------------------------------------------------
  // LOCKED AUTH VIEW
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D11] text-[#E4E4E7] flex flex-col justify-center items-center p-4 font-mono">
        <div className="w-full max-w-md bg-[#16161D] border border-[#2E2E38] p-8 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-[#2E2E38] pb-4 mb-6">
            <div className="w-10 h-10 bg-[#E9470B]/10 border border-[#E9470B]/40 flex items-center justify-center text-[#E9470B]">
              <Lock size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">
                Enterprise Admin Workstation
              </h1>
              <p className="text-xs text-[#9CA3AF]">
                Private access restricted to authorized administrators
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] uppercase mb-2">
                Passcode / Authentication Token
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-3 py-2.5 bg-[#09090C] border border-[#2E2E38] text-white focus:border-[#E9470B] focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Unlock size={14} />
                  <span>Unlock Admin Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-[#23232C] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>SYSTEM_KERNEL: VERCEL_SECURE</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E9470B] flex items-center gap-1"
            >
              <span>Public Portfolio</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED WORKSTATION VIEW
  // --------------------------------------------------------------------------
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
            className="h-9 px-2.5 bg-[#1E1E26] hover:bg-[#282834] text-zinc-300 hover:text-white border border-[#2E2E38] flex items-center gap-1 text-xs font-mono transition-colors"
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
          <button
            onClick={loadAllData}
            className="p-2 text-[#9CA3AF] hover:text-white border border-[#2A2A35] min-h-[36px]"
            title="Reload Data"
          >
            <RefreshCw size={14} />
          </button>
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
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          activeTab === item.id
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </button>
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
                    const label = item.id === 'messages' ? `Contact Messages (${messages.length})` : item.label;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          activeTab === item.id
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{label}</span>
                      </button>
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
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors min-h-[44px] ${
                          activeTab === item.id
                            ? 'bg-[#E9470B] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{item.label}</span>
                      </button>
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
              <div className="pt-2 text-[10px] text-zinc-500">
                <div>Single Source: Supabase / Local</div>
                <div>Status: Operational</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#111116] border-r border-[#23232C] flex-col justify-between overflow-y-auto shrink-0 font-mono text-xs">
          <div className="p-4 space-y-6">
            {/* CONTENT SECTION */}
            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                CONTENT
              </div>
              <div className="space-y-1">
                {[
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'projects', label: 'Projects', icon: FolderGit2 },
                  { id: 'skills', label: 'Skills', icon: Cpu },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'research', label: 'Research', icon: BookOpen },
                  { id: 'certifications', label: 'Certifications', icon: Award },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ENGAGEMENT SECTION */}
            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                ENGAGEMENT
              </div>
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'analytics', label: 'Visitors & Traffic', icon: Users },
                  { id: 'messages', label: `Contact Messages (${messages.length})`, icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MANAGEMENT SECTION */}
            <div>
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-2 px-2">
                MANAGEMENT
              </div>
              <div className="space-y-1">
                {[
                  { id: 'resume', label: 'Resume', icon: FileText },
                  { id: 'socials', label: 'Social Links', icon: Share2 },
                  { id: 'settings', label: 'Site Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#E9470B] text-white font-semibold'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A22] hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </button>
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

        {/* Right Main Content Area (Unclipped, Full-Width, Independent Scroll) */}
        <main className="flex-1 bg-[#0A0A0D] overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 w-full max-w-full">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 min-w-0 w-full">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && analyticsData && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-white">System Telemetry & Overview</h2>
                  <p className="text-xs text-[#9CA3AF] font-mono mt-1">
                    Live production metrics, active sessions, and transmission logs.
                  </p>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
                  <div className="p-5 bg-[#121217] border border-[#23232C]">
                    <div className="text-xs text-[#9CA3AF] uppercase">TOTAL VISITORS</div>
                    <div className="text-3xl font-black text-white mt-2">
                      {analyticsData.overview.totalVisitors}
                    </div>
                  </div>
                  <div className="p-5 bg-[#121217] border border-[#23232C]">
                    <div className="text-xs text-[#9CA3AF] uppercase">PAGE VIEWS</div>
                    <div className="text-3xl font-black text-[#E9470B] mt-2">
                      {analyticsData.overview.totalPageViews}
                    </div>
                  </div>
                  <div className="p-5 bg-[#121217] border border-[#23232C]">
                    <div className="text-xs text-[#9CA3AF] uppercase">RESUME VIEWS</div>
                    <div className="text-3xl font-black text-[#25BFD0] mt-2">
                      {analyticsData.overview.totalResumeViews}
                    </div>
                  </div>
                  <div className="p-5 bg-[#121217] border border-[#23232C]">
                    <div className="text-xs text-[#9CA3AF] uppercase">CONTACT TRANSMISSIONS</div>
                    <div className="text-3xl font-black text-white mt-2">
                      {analyticsData.overview.totalContactSubmissions}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
                  <div className="bg-[#121217] border border-[#23232C] p-5 space-y-4">
                    <h3 className="font-bold text-white uppercase border-b border-[#23232C] pb-2">
                      Recent Visitor Sessions
                    </h3>
                    <div className="space-y-2">
                      {analyticsData.recentSessions.map((s: any) => (
                        <div
                          key={s.id}
                          className="p-2.5 bg-[#0D0D11] border border-[#1E1E26] flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[#E9470B] font-bold">{s.device_type}</span>{' '}
                            <span className="text-[#9CA3AF]">/ {s.browser}</span>
                            <div className="text-[11px] text-[#6B7280]">
                              Source: {s.referrer || 'Direct'}
                            </div>
                          </div>
                          <span className="text-[11px] text-[#6B7280]">
                            {new Date(s.last_visit).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#121217] border border-[#23232C] p-5 space-y-4">
                    <h3 className="font-bold text-white uppercase border-b border-[#23232C] pb-2">
                      Top Project Clicks
                    </h3>
                    <div className="space-y-2">
                      {analyticsData.topProjects.length > 0 ? (
                        analyticsData.topProjects.map((p: any) => (
                          <div
                            key={p.title}
                            className="p-2.5 bg-[#0D0D11] border border-[#1E1E26] flex items-center justify-between"
                          >
                            <span className="text-white font-medium">{p.title}</span>
                            <span className="px-2 py-0.5 bg-[#E9470B]/10 text-[#E9470B] font-bold">
                              {p.count} views
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[#6B7280] py-4 text-center">
                          Awaiting live project interactions...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            {/* TAB: VISITORS & TRAFFIC */}
            {activeTab === 'analytics' && analyticsData && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">Visitors & Traffic</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 break-words">
                      Live visitor sessions, devices, geographic distribution, and access logs.
                    </p>
                  </div>
                  <button
                    onClick={loadAllData}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <RefreshCw size={14} /> Refresh Sessions
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 bg-[#121217] border border-[#23232C]">
                    <div className="text-[11px] text-[#9CA3AF] uppercase">TOTAL SESSIONS</div>
                    <div className="text-2xl font-black text-white mt-1">
                      {analyticsData.overview?.totalVisitors || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-[#121217] border border-[#23232C]">
                    <div className="text-[11px] text-[#9CA3AF] uppercase">PAGE VIEWS</div>
                    <div className="text-2xl font-black text-[#E9470B] mt-1">
                      {analyticsData.overview?.totalPageViews || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-[#121217] border border-[#23232C]">
                    <div className="text-[11px] text-[#9CA3AF] uppercase">RESUME VIEWS</div>
                    <div className="text-2xl font-black text-[#25BFD0] mt-1">
                      {analyticsData.overview?.totalResumeViews || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-[#121217] border border-[#23232C]">
                    <div className="text-[11px] text-[#9CA3AF] uppercase">RETURNING</div>
                    <div className="text-2xl font-black text-white mt-1">
                      {analyticsData.overview?.returningVisitors || 0}
                    </div>
                  </div>
                </div>

                {/* Breakdown Chips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#121217] border border-[#23232C] space-y-2">
                    <h3 className="font-bold text-white text-xs uppercase border-b border-[#23232C] pb-2">Devices</h3>
                    <div className="space-y-1.5">
                      {(analyticsData.devices || []).map((d: any) => (
                        <div key={d.name} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400">{d.name}</span>
                          <span className="font-bold text-white px-2 py-0.5 bg-[#1C1C24]">{d.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#121217] border border-[#23232C] space-y-2">
                    <h3 className="font-bold text-white text-xs uppercase border-b border-[#23232C] pb-2">Browsers</h3>
                    <div className="space-y-1.5">
                      {(analyticsData.browsers || []).map((b: any) => (
                        <div key={b.name} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400">{b.name}</span>
                          <span className="font-bold text-white px-2 py-0.5 bg-[#1C1C24]">{b.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#121217] border border-[#23232C] space-y-2">
                    <h3 className="font-bold text-white text-xs uppercase border-b border-[#23232C] pb-2">Traffic Sources</h3>
                    <div className="space-y-1.5">
                      {(analyticsData.sources || []).map((s: any) => (
                        <div key={s.name} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 truncate max-w-[150px]">{s.name}</span>
                          <span className="font-bold text-white px-2 py-0.5 bg-[#1C1C24]">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visitor Session Cards List */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-sm uppercase">Active & Recent Visitor Sessions</h3>
                  {(analyticsData.recentSessions || []).length > 0 ? (
                    (analyticsData.recentSessions || []).map((s: any, idx: number) => (
                      <div
                        key={s.id || idx}
                        className="p-4 bg-[#121217] border border-[#23232C] space-y-2.5 max-w-full min-w-0"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-[#1E1E26] pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                            <span className="font-bold text-white text-xs sm:text-sm">Anonymous Visitor</span>
                            <span className="text-[#E9470B] text-xs">[{s.country || 'Global'}]</span>
                          </div>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(s.last_visit).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-zinc-600 block text-[10px] uppercase">Device</span>
                            <span className="text-white font-medium">{s.device_type || 'Desktop'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[10px] uppercase">Browser</span>
                            <span className="text-white font-medium">{s.browser || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[10px] uppercase">OS</span>
                            <span className="text-white font-medium">{s.os || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[10px] uppercase">Visits</span>
                            <span className="text-[#25BFD0] font-bold">{s.visit_count || 1}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-zinc-500 pt-1 border-t border-[#1E1E26] truncate">
                          Referrer Source: {s.referrer || 'Direct Entry'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-zinc-500 bg-[#121217] border border-[#23232C]">
                      No recorded visitor sessions yet. Telemetry listener running.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: EXPERIENCE CRUD */}
            {activeTab === 'experience' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">Experience Management</h2>
                    <p className="text-xs text-[#9CA3AF] font-mono mt-1 break-words">
                      Manage career records. Added or edited experiences immediately reflect on the live portfolio.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewExpForm(!showNewExpForm)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors min-h-[44px] shrink-0"
                  >
                    <Plus size={15} /> {showNewExpForm ? 'Close Form' : 'Add Experience'}
                  </button>
                </div>

                {/* NEW EXPERIENCE FORM MODAL/DRAWER */}
                {showNewExpForm && (
                  <div className="p-4 sm:p-6 bg-[#16161E] border-2 border-[#E9470B] space-y-4 sm:space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#2E2E38] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#E9470B] animate-pulse" />
                        <span className="text-sm font-bold text-white tracking-wide uppercase">
                          [ + CREATE NEW EXPERIENCE RECORD ]
                        </span>
                      </div>
                      <button
                        onClick={() => setShowNewExpForm(false)}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        ✕ CANCEL
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <label className="text-[11px] text-[#E9470B] uppercase font-bold block mb-1">
                          Company *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Cisco Systems, Google, AI Startup"
                          value={newExpForm.company}
                          onChange={(e) => setNewExpForm({ ...newExpForm, company: e.target.value })}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#E9470B] uppercase font-bold block mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Software Engineer, AI Engineer"
                          value={newExpForm.role}
                          onChange={(e) => setNewExpForm({ ...newExpForm, role: e.target.value })}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore, India / Remote"
                          value={newExpForm.location}
                          onChange={(e) => setNewExpForm({ ...newExpForm, location: e.target.value })}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Duration (Start – End)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="August 2025"
                            value={newExpForm.start_date}
                            onChange={(e) => setNewExpForm({ ...newExpForm, start_date: e.target.value })}
                            className="w-1/2 p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Present"
                            disabled={newExpForm.is_current}
                            value={newExpForm.is_current ? 'Present' : newExpForm.end_date}
                            onChange={(e) => setNewExpForm({ ...newExpForm, end_date: e.target.value })}
                            className="w-1/2 p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                        <input
                          type="checkbox"
                          checked={newExpForm.is_current}
                          onChange={(e) => setNewExpForm({ ...newExpForm, is_current: e.target.checked })}
                          className="accent-[#E9470B]"
                        />
                        <span>Currently working here</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Visibility:</span>
                        <button
                          type="button"
                          onClick={() => setNewExpForm({ ...newExpForm, is_published: !newExpForm.is_published })}
                          className={`px-2 py-0.5 text-[11px] font-bold border ${
                            newExpForm.is_published
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-zinc-700/20 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {newExpForm.is_published ? 'PUBLISHED (LIVE)' : 'DRAFT (HIDDEN)'}
                        </button>
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2">
                      <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                        Technical Contribution Bullets
                      </label>
                      {newExpForm.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            placeholder="e.g. Architected GenAI pipelines with FastAPI, RAG, and ChromaDB."
                            value={b}
                            onChange={(e) => {
                              const nextBullets = [...newExpForm.bullets];
                              nextBullets[bIdx] = e.target.value;
                              setNewExpForm({ ...newExpForm, bullets: nextBullets });
                            }}
                            className="flex-1 p-2.5 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none text-xs min-h-[72px] resize-y"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nextBullets = newExpForm.bullets.filter((_, i) => i !== bIdx);
                              setNewExpForm({ ...newExpForm, bullets: nextBullets });
                            }}
                            className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                            title="Remove bullet"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setNewExpForm({
                            ...newExpForm,
                            bullets: [...newExpForm.bullets, ''],
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#E9470B] hover:bg-[#E9470B]/10 border border-[#E9470B]/30 min-h-[38px]"
                      >
                        + Add another contribution bullet
                      </button>
                    </div>

                    {/* Stack Tags */}
                    <div>
                      <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                        Stack Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Python, Generative AI, LLMs, RAG, REST APIs"
                        value={newExpForm.tags.join(', ')}
                        onChange={(e) => {
                          const newTags = e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                          setNewExpForm({ ...newExpForm, tags: newTags });
                        }}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#3B3B48] text-white focus:border-[#E9470B] focus:outline-none"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-3 border-t border-[#2E2E38] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-[11px] text-zinc-400">
                        * Required fields. Clicking publish will instantly save and display on your portfolio.
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setShowNewExpForm(false)}
                          className="px-4 py-2.5 border border-[#3B3B48] text-zinc-300 hover:text-white min-h-[44px] text-xs flex items-center justify-center"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newExpForm.company.trim() || !newExpForm.role.trim()) {
                              alert('Please provide both Company name and Role title.');
                              return;
                            }
                            const record: Experience = {
                              id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
                              company: newExpForm.company.trim(),
                              role: newExpForm.role.trim(),
                              location: newExpForm.location.trim() || 'Bangalore, India',
                              start_date: newExpForm.start_date.trim() || 'August 2025',
                              end_date: newExpForm.is_current ? 'Present' : (newExpForm.end_date.trim() || 'August 2026'),
                              is_current: newExpForm.is_current,
                              display_order: experiences.length + 1,
                              is_published: newExpForm.is_published,
                              tags: newExpForm.tags.length > 0 ? newExpForm.tags : ['Python', 'Generative AI'],
                              bullets: newExpForm.bullets.filter((b) => b.trim().length > 0),
                            };
                            await saveEntity('experience', record);
                            setShowNewExpForm(false);
                            setNewExpForm({
                              company: '',
                              role: 'Software Engineer',
                              location: 'Bangalore, India',
                              start_date: 'August 2025',
                              end_date: 'August 2026',
                              is_current: false,
                              is_published: true,
                              tags: ['Python', 'Generative AI', 'LLMs', 'RAG'],
                              bullets: ['Built enterprise GenAI and automation workflows using Python.'],
                            });
                          }}
                          className="px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-2 shadow-lg min-h-[44px] text-xs w-full sm:w-auto"
                        >
                          <Save size={15} /> [ PUBLISH EXPERIENCE TO PORTFOLIO ]
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXISTING EXPERIENCES LIST */}
                <div className="space-y-6">
                  {experiences.length === 0 && !showNewExpForm && (
                    <div className="p-8 border border-dashed border-[#2E2E38] text-center text-zinc-400">
                      No experience records found. Click <strong>+ Add Experience</strong> above to create one.
                    </div>
                  )}

                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4 font-mono text-xs max-w-full min-w-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#23232C] pb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 bg-[#E9470B] shrink-0" />
                          <span className="font-bold text-white text-xs sm:text-sm truncate">{exp.company}</span>
                          <span className="text-zinc-600">/</span>
                          <span className="text-[#E9470B] text-xs truncate">{exp.role}</span>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => saveEntity('experience', exp)}
                            className="px-3 py-1.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold text-xs flex items-center gap-1 shadow-sm min-h-[36px]"
                            title="Save this experience"
                          >
                            <Save size={13} /> Save
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              saveEntity('experience', { ...exp, is_published: !exp.is_published })
                            }
                            className={`px-3 py-1.5 text-xs font-bold border min-h-[36px] ${
                              exp.is_published
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-zinc-700/20 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {exp.is_published ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntity('experience', exp.id)}
                            className="p-2 text-red-400 hover:text-red-300 min-h-[36px] min-w-[36px] flex items-center justify-center border border-transparent hover:border-red-500/30"
                            title="Delete Experience"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => {
                              const updated = { ...exp, company: e.target.value };
                              setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Role Title</label>
                          <input
                            type="text"
                            value={exp.role || ''}
                            onChange={(e) => {
                              const updated = { ...exp, role: e.target.value };
                              setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) => {
                              const updated = { ...exp, location: e.target.value };
                              setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Duration</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exp.start_date || ''}
                              onChange={(e) => {
                                const updated = { ...exp, start_date: e.target.value };
                                setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                              }}
                              className="w-1/2 p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                            />
                            <input
                              type="text"
                              value={exp.end_date || ''}
                              onChange={(e) => {
                                const updated = { ...exp, end_date: e.target.value };
                                setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                              }}
                              className="w-1/2 p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2">
                        <label className="text-[11px] text-[#6B7280] uppercase block">
                          Technical Contribution Bullets
                        </label>
                        {(exp.bullets || []).map((b, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-start">
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const nextBullets = [...(exp.bullets || [])];
                                nextBullets[bIdx] = e.target.value;
                                const updated = { ...exp, bullets: nextBullets };
                                setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                              }}
                              className="flex-1 p-2.5 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none min-h-[72px] resize-y text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextBullets = (exp.bullets || []).filter((_, i) => i !== bIdx);
                                const updated = { ...exp, bullets: nextBullets };
                                setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                              }}
                              className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                              title="Delete bullet"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...exp,
                              bullets: [...(exp.bullets || []), 'New engineering accomplishment.'],
                            };
                            setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#E9470B] hover:bg-[#E9470B]/10 border border-[#E9470B]/30 min-h-[38px]"
                        >
                          + Add bullet
                        </button>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                          Stack Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={(exp.tags || []).join(', ')}
                          onChange={(e) => {
                            const newTags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            const updated = { ...exp, tags: newTags };
                            setExperiences(experiences.map((x) => (x.id === exp.id ? updated : x)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white focus:border-[#E9470B] focus:outline-none"
                        />
                      </div>

                      <div className="pt-3 border-t border-[#1C1C24] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => deleteEntity('experience', exp.id)}
                          className="w-full sm:w-auto px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <Trash2 size={14} /> Delete Record
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEntity('experience', exp)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 shadow-md min-h-[44px]"
                        >
                          <Save size={14} /> Save Experience Record
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">Projects Management</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 break-words">
                      Manage portfolio deployments (FarmerVerify AI, CMS AI Assistant, etc.).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: Project = {
                        id: `proj-${Date.now()}`,
                        slug: `new-project-${Date.now()}`,
                        title: 'New AI System',
                        subtitle: 'Autonomous Agent Architecture',
                        system_code: 'PROJECT_GAMMA // SYS_AGENT',
                        description: 'Detailed description of the engineering project.',
                        problem: 'System performance bottleneck.',
                        solution: 'Engineered specialized pipeline.',
                        impact: 'Reduced latency by 80%.',
                        cover_image: '',
                        github_url: 'https://github.com/anilpanchitha',
                        linkedin_url: 'https://linkedin.com/in/anilpanchitha',
                        live_demo_url: '',
                        case_study_url: '',
                        display_order: projects.length + 1,
                        featured: false,
                        is_published: true,
                        tags: ['Python', 'FastAPI', 'LLMs'],
                      };
                      saveEntity('project', newProj);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px] shrink-0"
                  >
                    <Plus size={15} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4 max-w-full min-w-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#23232C] pb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <span className="w-2.5 h-2.5 bg-[#E9470B] shrink-0" />
                          <span className="font-bold text-sm text-white">{proj.title}</span>
                          <span className="text-[#E9470B] text-xs">[{proj.system_code}]</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <button
                            onClick={() =>
                              saveEntity('project', { ...proj, featured: !proj.featured })
                            }
                            className={`px-3 py-1.5 text-xs font-bold border min-h-[36px] ${
                              proj.featured
                                ? 'bg-[#E9470B]/20 text-[#E9470B] border-[#E9470B]'
                                : 'bg-[#1E1E26] text-[#6B7280] border-[#2A2A35]'
                            }`}
                          >
                            {proj.featured ? 'FEATURED' : 'STANDARD'}
                          </button>
                          <button
                            onClick={() =>
                              saveEntity('project', { ...proj, is_published: !proj.is_published })
                            }
                            className={`px-3 py-1.5 text-xs font-bold border min-h-[36px] ${
                              proj.is_published
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-zinc-700/20 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {proj.is_published ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                          <button
                            onClick={() => deleteEntity('project', proj.id)}
                            className="p-2 text-red-400 hover:text-red-300 min-h-[36px] min-w-[36px] flex items-center justify-center border border-transparent hover:border-red-500/30"
                            title="Delete Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = { ...proj, title: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={proj.subtitle}
                            onChange={(e) => {
                              const updated = { ...proj, subtitle: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">System Code</label>
                          <input
                            type="text"
                            value={proj.system_code}
                            onChange={(e) => {
                              const updated = { ...proj, system_code: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = { ...proj, description: e.target.value };
                            setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Problem</label>
                          <textarea
                            rows={2}
                            value={proj.problem}
                            onChange={(e) => {
                              const updated = { ...proj, problem: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Solution</label>
                          <textarea
                            rows={2}
                            value={proj.solution}
                            onChange={(e) => {
                              const updated = { ...proj, solution: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Impact / Result</label>
                          <textarea
                            rows={2}
                            value={proj.impact}
                            onChange={(e) => {
                              const updated = { ...proj, impact: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                          />
                        </div>
                      </div>

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">GitHub URL</label>
                          <input
                            type="text"
                            value={proj.github_url}
                            onChange={(e) => {
                              const updated = { ...proj, github_url: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">LinkedIn URL</label>
                          <input
                            type="text"
                            value={proj.linkedin_url}
                            onChange={(e) => {
                              const updated = { ...proj, linkedin_url: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Live Demo URL</label>
                          <input
                            type="text"
                            value={proj.live_demo_url}
                            onChange={(e) => {
                              const updated = { ...proj, live_demo_url: e.target.value };
                              setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={proj.tags.join(', ')}
                          onChange={(e) => {
                            const newTags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                            const updated = { ...proj, tags: newTags };
                            setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>

                      <div className="pt-3 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                        <button
                          onClick={() => saveEntity('project', proj)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 shadow-md min-h-[44px]"
                        >
                          <Save size={14} /> Save Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SKILLS CRUD */}
            {activeTab === 'skills' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">Skills Console Management</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 break-words">
                      Manage skills, disciplines, practical applications, and engineering focus.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newSkill: Skill = {
                        id: `sk-${Date.now()}`,
                        name: 'New Technical Skill',
                        category: 'AI / ML',
                        icon: 'Cpu',
                        discipline: 'Engineering Discipline',
                        practical_application: 'Production implementation details.',
                        used_in: 'Real-world pipelines.',
                        engineering_responsibility: 'System design and reliability.',
                        competency_focus: 'Core engineering competency.',
                        display_order: skills.length + 1,
                        is_published: true,
                      };
                      saveEntity('skill', newSkill);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px] shrink-0"
                  >
                    <Plus size={15} /> Add Skill
                  </button>
                </div>

                <div className="space-y-4">
                  {skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-5 bg-[#121217] border border-[#23232C] space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#23232C] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{sk.name}</span>
                          <span className="text-[#E9470B] text-xs">[{sk.category}]</span>
                        </div>
                        <button
                          onClick={() => deleteEntity('skill', sk.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Skill Name</label>
                          <input
                            type="text"
                            value={sk.name}
                            onChange={(e) => {
                              const updated = { ...sk, name: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Category</label>
                          <select
                            value={sk.category}
                            onChange={(e) => {
                              const updated = { ...sk, category: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          >
                            <option value="AI / ML">AI / ML</option>
                            <option value="LLM ENGINEERING">LLM ENGINEERING</option>
                            <option value="BACKEND">BACKEND</option>
                            <option value="ML FRAMEWORKS">ML FRAMEWORKS</option>
                            <option value="DATA">DATA</option>
                            <option value="ENGINEERING TOOLS">ENGINEERING TOOLS</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Discipline</label>
                          <input
                            type="text"
                            value={sk.discipline}
                            onChange={(e) => {
                              const updated = { ...sk, discipline: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Practical Application</label>
                          <input
                            type="text"
                            value={sk.practical_application}
                            onChange={(e) => {
                              const updated = { ...sk, practical_application: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Used In</label>
                          <input
                            type="text"
                            value={sk.used_in}
                            onChange={(e) => {
                              const updated = { ...sk, used_in: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Engineering Responsibility</label>
                          <input
                            type="text"
                            value={sk.engineering_responsibility}
                            onChange={(e) => {
                              const updated = { ...sk, engineering_responsibility: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Competency Focus</label>
                          <input
                            type="text"
                            value={sk.competency_focus}
                            onChange={(e) => {
                              const updated = { ...sk, competency_focus: e.target.value };
                              setSkills(skills.map((s) => (s.id === sk.id ? updated : s)));
                            }}
                            className="w-full p-1.5 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                        <button
                          onClick={() => saveEntity('skill', sk)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <Save size={14} /> Save Skill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: RESUME MANAGEMENT */}
            {activeTab === 'resume' && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Resume Management</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Upload, replace, set active, and manage cross-device resumes.
                  </p>
                </div>

                {/* Upload Card */}
                <div className="p-6 bg-[#121217] border border-[#23232C] space-y-4">
                  <h3 className="font-bold text-white uppercase text-sm">Upload New Resume (PDF)</h3>
                  <p className="text-[#9CA3AF] text-xs">
                    Cross-device compatible. Accepts standard PDF files up to 15MB.
                  </p>

                  <div className="pt-2">
                    <label className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold cursor-pointer w-full sm:w-auto min-h-[44px]">
                      <Upload size={15} />
                      <span>SELECT PDF FROM DEVICE</span>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Resumes List */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white uppercase text-sm">Available Resumes</h3>
                  {resumes.map((res) => (
                    <div
                      key={res.id}
                      className={`p-4 bg-[#121217] border ${
                        res.is_active ? 'border-[#E9470B]' : 'border-[#23232C]'
                      } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-full min-w-0`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs sm:text-sm break-all">{res.file_name}</span>
                          {res.is_active && (
                            <span className="px-2 py-0.5 bg-[#E9470B] text-white font-bold text-[10px]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-1">
                          Uploaded: {new Date(res.uploaded_at).toLocaleString()} | Size:{' '}
                          {Math.round(res.file_size / 1024)} KB
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <a
                          href={res.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2A2A35] min-h-[40px] flex items-center justify-center text-xs"
                        >
                          Preview
                        </a>
                        {!res.is_active && (
                          <button
                            onClick={() => handleSetActiveResume(res.id)}
                            className="px-3 py-2 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold min-h-[40px] flex items-center justify-center text-xs"
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteResume(res.id)}
                          className="p-2 text-red-400 hover:text-red-300 min-h-[40px] min-w-[40px] flex items-center justify-center border border-red-500/20"
                          title="Delete Resume"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Contact Inquiries ({messages.length})</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Incoming transmissions received via the portfolio contact form.
                  </p>
                </div>

                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-3 max-w-full min-w-0"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#23232C] pb-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="font-bold text-white text-sm">{msg.name}</span>
                            <span className="text-[#E9470B] text-xs">&lt;{msg.email}&gt;</span>
                          </div>
                          <span className="text-[11px] text-[#6B7280]">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>

                        {msg.linkedin && (
                          <div className="text-[#25BFD0]">
                            LinkedIn:{' '}
                            <a
                              href={msg.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {msg.linkedin}
                            </a>
                          </div>
                        )}

                        <div className="p-3 bg-[#0A0A0D] border border-[#1E1E26] text-white leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-[#6B7280] bg-[#121217] border border-[#23232C]">
                      No contact messages received yet. Communication socket listening.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: SITE SETTINGS */}
            {activeTab === 'settings' && settings && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Site Settings</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Hero headline, display titles, location, and status metrics.
                  </p>
                </div>

                <div className="p-6 bg-[#121217] border border-[#23232C] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Hero Typing Name
                      </label>
                      <input
                        type="text"
                        value={settings.hero_name}
                        onChange={(e) => setSettings({ ...settings, hero_name: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Protocol Header
                      </label>
                      <input
                        type="text"
                        value={settings.hero_protocol_tag}
                        onChange={(e) =>
                          setSettings({ ...settings, hero_protocol_tag: e.target.value })
                        }
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={settings.hero_title_1}
                        onChange={(e) => setSettings({ ...settings, hero_title_1: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Title Line 2 (Orange)
                      </label>
                      <input
                        type="text"
                        value={settings.hero_title_2}
                        onChange={(e) => setSettings({ ...settings, hero_title_2: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Title Line 3
                      </label>
                      <input
                        type="text"
                        value={settings.hero_title_3}
                        onChange={(e) => setSettings({ ...settings, hero_title_3: e.target.value })}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                      Hero Concise Description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.hero_description}
                      onChange={(e) =>
                        setSettings({ ...settings, hero_description: e.target.value })
                      }
                      className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Status Exp
                      </label>
                      <input
                        type="text"
                        value={settings.status_metric_exp}
                        onChange={(e) =>
                          setSettings({ ...settings, status_metric_exp: e.target.value })
                        }
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Status Projects
                      </label>
                      <input
                        type="text"
                        value={settings.status_metric_projects}
                        onChange={(e) =>
                          setSettings({ ...settings, status_metric_projects: e.target.value })
                        }
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Status Pubs
                      </label>
                      <input
                        type="text"
                        value={settings.status_metric_pubs}
                        onChange={(e) =>
                          setSettings({ ...settings, status_metric_pubs: e.target.value })
                        }
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Status Awards
                      </label>
                      <input
                        type="text"
                        value={settings.status_metric_awards}
                        onChange={(e) =>
                          setSettings({ ...settings, status_metric_awards: e.target.value })
                        }
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                    <button
                      onClick={() => saveEntity('settings', settings)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Save size={14} /> Save Site Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">Education Management</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Institute of Aeronautical Engineering, B.Tech Data Science (CGPA: 7.34).
                    </p>
                  </div>
                </div>

                {education.map((edu) => (
                  <div key={edu.id} className="p-6 bg-[#121217] border border-[#23232C] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = { ...edu, institution: e.target.value };
                            setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Degree & Field</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = { ...edu, degree: e.target.value };
                              setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                            }}
                            className="w-1/3 p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                          <input
                            type="text"
                            value={edu.field_of_study}
                            onChange={(e) => {
                              const updated = { ...edu, field_of_study: e.target.value };
                              setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                            }}
                            className="w-2/3 p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = { ...edu, location: e.target.value };
                            setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Years</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.start_year}
                            onChange={(e) => {
                              const updated = { ...edu, start_year: e.target.value };
                              setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                            }}
                            className="w-1/2 p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                          <input
                            type="text"
                            value={edu.end_year}
                            onChange={(e) => {
                              const updated = { ...edu, end_year: e.target.value };
                              setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                            }}
                            className="w-1/2 p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">CGPA</label>
                        <input
                          type="text"
                          value={edu.cgpa}
                          onChange={(e) => {
                            const updated = { ...edu, cgpa: e.target.value };
                            setEducation(education.map((x) => (x.id === edu.id ? updated : x)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                      <button
                        onClick={() => saveEntity('education', edu)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Save size={14} /> Save Education
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 9: RESEARCH */}
            {activeTab === 'research' && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Research Publications</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Springer publication (ICATECS 2024/2025, DOI: 10.1007/978-3-031-94283-9_21).
                  </p>
                </div>

                {research.map((res) => (
                  <div key={res.id} className="p-6 bg-[#121217] border border-[#23232C] space-y-4">
                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Title</label>
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const updated = { ...res, title: e.target.value };
                          setResearch(research.map((r) => (r.id === res.id ? updated : r)));
                        }}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Publisher</label>
                        <input
                          type="text"
                          value={res.publisher}
                          onChange={(e) => {
                            const updated = { ...res, publisher: e.target.value };
                            setResearch(research.map((r) => (r.id === res.id ? updated : r)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#6B7280] uppercase block mb-1">DOI</label>
                        <input
                          type="text"
                          value={res.doi}
                          onChange={(e) => {
                            const updated = { ...res, doi: e.target.value };
                            setResearch(research.map((r) => (r.id === res.id ? updated : r)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Abstract</label>
                      <textarea
                        rows={3}
                        value={res.abstract}
                        onChange={(e) => {
                          const updated = { ...res, abstract: e.target.value };
                          setResearch(research.map((r) => (r.id === res.id ? updated : r)));
                        }}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                        Areas (comma separated)
                      </label>
                      <input
                        type="text"
                        value={res.areas.join(', ')}
                        onChange={(e) => {
                          const newAreas = e.target.value.split(',').map((a) => a.trim()).filter(Boolean);
                          const updated = { ...res, areas: newAreas };
                          setResearch(research.map((r) => (r.id === res.id ? updated : r)));
                        }}
                        className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                      />
                    </div>

                    <div className="pt-3 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                      <button
                        onClick={() => saveEntity('research', res)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Save size={14} /> Save Research Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 10: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">Certifications Management</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      NPTEL, Coursera ML Specialization, Google Data Analytics, IBM Data Science.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="p-5 bg-[#121217] border border-[#23232C] space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Title</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => {
                              const updated = { ...cert, title: e.target.value };
                              setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = { ...cert, issuer: e.target.value };
                              setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Credential URL</label>
                          <input
                            type="text"
                            value={cert.credential_url}
                            onChange={(e) => {
                              const updated = { ...cert, credential_url: e.target.value };
                              setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                        <button
                          onClick={() => saveEntity('certification', cert)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <Save size={14} /> Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 11: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Achievements & Honors</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Cisco Tech Hackathon 2026, Featured by Cisco, CX Leadership Recognition.
                  </p>
                </div>

                <div className="space-y-4">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="p-5 bg-[#121217] border border-[#23232C] space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Title</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const updated = { ...ach, title: e.target.value };
                              setAchievements(achievements.map((a) => (a.id === ach.id ? updated : a)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Subtitle</label>
                          <input
                            type="text"
                            value={ach.subtitle}
                            onChange={(e) => {
                              const updated = { ...ach, subtitle: e.target.value };
                              setAchievements(achievements.map((a) => (a.id === ach.id ? updated : a)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Organization</label>
                          <input
                            type="text"
                            value={ach.organization}
                            onChange={(e) => {
                              const updated = { ...ach, organization: e.target.value };
                              setAchievements(achievements.map((a) => (a.id === ach.id ? updated : a)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#6B7280] uppercase block">Description</label>
                        <input
                          type="text"
                          value={ach.description}
                          onChange={(e) => {
                            const updated = { ...ach, description: e.target.value };
                            setAchievements(achievements.map((a) => (a.id === ach.id ? updated : a)));
                          }}
                          className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                        />
                      </div>

                      <div className="pt-2 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
                        <button
                          onClick={() => saveEntity('achievement', ach)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <Save size={14} /> Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 12: SOCIAL LINKS */}
            {activeTab === 'socials' && (
              <div className="space-y-6 font-mono text-xs">
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Social & System Links</h2>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Manage system links (GitHub, LinkedIn, Email, Resume).
                  </p>
                </div>

                <div className="space-y-4">
                  {socials.map((soc) => (
                    <div
                      key={soc.id}
                      className="p-4 sm:p-5 bg-[#121217] border border-[#23232C] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-full min-w-0"
                    >
                      <div className="w-full sm:flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Platform</label>
                          <input
                            type="text"
                            value={soc.platform}
                            disabled
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white opacity-70"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Display Label</label>
                          <input
                            type="text"
                            value={soc.label}
                            onChange={(e) => {
                              const updated = { ...soc, label: e.target.value };
                              setSocials(socials.map((s) => (s.id === soc.id ? updated : s)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B7280] uppercase block">Destination URL</label>
                          <input
                            type="text"
                            value={soc.url}
                            onChange={(e) => {
                              const updated = { ...soc, url: e.target.value };
                              setSocials(socials.map((s) => (s.id === soc.id ? updated : s)));
                            }}
                            className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => saveEntity('social', soc)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold flex items-center justify-center gap-1.5 shrink-0 sm:self-end min-h-[44px]"
                      >
                        <Save size={14} /> Save
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

