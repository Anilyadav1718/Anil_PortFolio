'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import SectionSkeleton from '../SectionSkeleton';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [sessionsData, setSessionsData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async (targetPage = 1) => {
    setLoading(true);
    try {
      const [summaryRes, sessionsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch(`/api/analytics?sessions=true&page=${targetPage}&limit=15`),
      ]);

      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        setData(sData);
      }

      if (sessionsRes.ok) {
        const sessJson = await sessionsRes.json();
        setSessionsData(sessJson.sessions || []);
        setTotalSessions(sessJson.total || 0);
        setPage(targetPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  if (loading && !data) {
    return <SectionSkeleton title="VISITOR TELEMETRY" />;
  }

  const totalPages = Math.ceil(totalSessions / 15) || 1;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
            Visitors & Traffic
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1 break-words">
            Live visitor sessions, devices, geographic distribution, and paginated access logs.
          </p>
        </div>
        <button
          onClick={() => loadData(page)}
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
            {data?.overview?.totalVisitors || totalSessions || 0}
          </div>
        </div>
        <div className="p-4 bg-[#121217] border border-[#23232C]">
          <div className="text-[11px] text-[#9CA3AF] uppercase">PAGE VIEWS</div>
          <div className="text-2xl font-black text-[#E9470B] mt-1">
            {data?.overview?.totalPageViews || 0}
          </div>
        </div>
        <div className="p-4 bg-[#121217] border border-[#23232C]">
          <div className="text-[11px] text-[#9CA3AF] uppercase">RESUME VIEWS</div>
          <div className="text-2xl font-black text-[#25BFD0] mt-1">
            {data?.overview?.totalResumeViews || 0}
          </div>
        </div>
        <div className="p-4 bg-[#121217] border border-[#23232C]">
          <div className="text-[11px] text-[#9CA3AF] uppercase">RETURNING</div>
          <div className="text-2xl font-black text-white mt-1">
            {data?.overview?.returningVisitors || 0}
          </div>
        </div>
      </div>

      {/* Breakdown Chips */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#121217] border border-[#23232C] space-y-2">
            <h3 className="font-bold text-white text-xs uppercase border-b border-[#23232C] pb-2">Devices</h3>
            <div className="space-y-1.5">
              {(data.devices || []).map((d: any) => (
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
              {(data.browsers || []).map((b: any) => (
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
              {(data.sources || []).map((s: any) => (
                <div key={s.name} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 truncate max-w-[150px]">{s.name}</span>
                  <span className="font-bold text-white px-2 py-0.5 bg-[#1C1C24]">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visitor Session Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm uppercase">Visitor Sessions Log</h3>
          <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
        </div>

        {sessionsData.length > 0 ? (
          sessionsData.map((s: any, idx: number) => (
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

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#23232C]">
            <button
              disabled={page <= 1}
              onClick={() => loadData(page - 1)}
              className="px-4 py-2 bg-[#1A1A22] text-white border border-[#2E2E38] disabled:opacity-40 min-h-[44px]"
            >
              Previous
            </button>
            <span className="text-zinc-400 text-xs">
              Showing page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => loadData(page + 1)}
              className="px-4 py-2 bg-[#1A1A22] text-white border border-[#2E2E38] disabled:opacity-40 min-h-[44px]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
