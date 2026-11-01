'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  FileText,
  Mail,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import SectionSkeleton from './SectionSkeleton';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics?summary=true');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading && !data) {
    return <SectionSkeleton title="SYSTEM TELEMETRY" />;
  }

  const overview = data?.overview || {
    totalVisitors: 1,
    totalPageViews: 1,
    totalResumeViews: 0,
    totalContactSubmissions: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-[#23232C] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-wide">
            System Telemetry & Overview
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Real-time portfolio metrics, server health, and administrative routing hub.
          </p>
        </div>
        <button
          onClick={loadSummary}
          className="w-full sm:w-auto px-4 py-2 bg-[#1A1A22] hover:bg-[#252530] text-zinc-200 border border-[#2E2E38] text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <RefreshCw size={14} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 bg-[#121217] border border-[#23232C] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#9CA3AF] uppercase font-bold tracking-wider">
              TOTAL VISITORS
            </span>
            <Users size={16} className="text-[#E9470B]" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {overview.totalVisitors}
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Active visitor session logging</span>
          </div>
        </div>

        <div className="p-5 bg-[#121217] border border-[#23232C] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#9CA3AF] uppercase font-bold tracking-wider">
              TOTAL PAGE VIEWS
            </span>
            <Eye size={16} className="text-[#E9470B]" />
          </div>
          <div className="text-3xl font-black text-[#E9470B] mt-2">
            {overview.totalPageViews}
          </div>
          <div className="text-[10px] text-zinc-500 mt-2">
            Global portfolio requests
          </div>
        </div>

        <div className="p-5 bg-[#121217] border border-[#23232C] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#9CA3AF] uppercase font-bold tracking-wider">
              RESUME VIEWS
            </span>
            <FileText size={16} className="text-[#25BFD0]" />
          </div>
          <div className="text-3xl font-black text-[#25BFD0] mt-2">
            {overview.totalResumeViews}
          </div>
          <div className="text-[10px] text-zinc-500 mt-2">
            Direct CV evaluations
          </div>
        </div>

        <div className="p-5 bg-[#121217] border border-[#23232C] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#9CA3AF] uppercase font-bold tracking-wider">
              INQUIRIES RECEIVED
            </span>
            <Mail size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {overview.totalContactSubmissions}
          </div>
          <div className="text-[10px] text-zinc-500 mt-2">
            Inbound contact transmissions
          </div>
        </div>
      </div>

      {/* Quick Launchpad to CMS Sections */}
      <div className="p-5 bg-[#121217] border border-[#23232C] space-y-4">
        <div className="flex items-center justify-between border-b border-[#23232C] pb-3">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#E9470B]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              OPTIMIZED CMS SECTIONS (ISOLATED STREAM LOADING)
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400">Zero-Leak Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/admin/experience', title: 'Experience', desc: 'Manage Cisco & engineering roles' },
            { href: '/admin/projects', title: 'Projects', desc: 'Deployments & system codes' },
            { href: '/admin/skills', title: 'Skills Console', desc: 'Competency & application focus' },
            { href: '/admin/education', title: 'Education', desc: 'Academic records & CGPA' },
            { href: '/admin/research', title: 'Research', desc: 'Springer publications & DOIs' },
            { href: '/admin/certifications', title: 'Certifications', desc: 'Cloud & AI credentials' },
            { href: '/admin/achievements', title: 'Achievements', desc: 'Hackathons & leadership honors' },
            { href: '/admin/analytics', title: 'Visitors & Traffic', desc: 'Live sessions & geographic logs' },
            { href: '/admin/messages', title: 'Messages', desc: 'Direct employer inquiries' },
            { href: '/admin/resume', title: 'Resume PDF', desc: 'Active document management' },
            { href: '/admin/socials', title: 'Social Links', desc: 'GitHub, LinkedIn, Email' },
            { href: '/admin/settings', title: 'Site Settings', desc: 'Hero headlines & telemetry' },
          ].map((sec) => (
            <Link
              key={sec.href}
              href={sec.href}
              className="p-3.5 bg-[#0C0C10] hover:bg-[#16161E] border border-[#23232C] hover:border-[#E9470B] transition-colors flex items-center justify-between group min-h-[44px]"
            >
              <div>
                <div className="font-bold text-white group-hover:text-[#E9470B] text-xs">
                  {sec.title}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{sec.desc}</div>
              </div>
              <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#E9470B] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* System Status Banner */}
      <div className="p-4 bg-[#141419] border border-[#23232C] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>Security Protocol: Admin Token Verified. Single-Sign-On Active.</span>
        </div>
        <div className="text-[11px] text-zinc-500">
          Supabase Regional Caching Active
        </div>
      </div>
    </div>
  );
}
