'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Research } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function ResearchPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=research', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setResearch(data.research || []);
      } else {
        setError('Failed to retrieve research publications.');
      }
    } catch {
      setError('Connection failure loading research.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResearch();
  }, []);

  const saveEntity = async (type: string, data: any) => {
    try {
      showSaveSuccess('Saving...');
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, data }),
      });
      if (res.ok) {
        showSaveSuccess('Research publication saved!');
      } else {
        alert('Save failed');
        loadResearch();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadResearch();
    }
  };

  if (loading && research.length === 0) {
    return <SectionSkeleton title="PUBLICATIONS" />;
  }

  if (error && research.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadResearch}
          className="px-4 py-2 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] inline-flex items-center gap-2 min-h-[44px]"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
          Research Publications
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          Springer publication (ICATECS 2024/2025, DOI: 10.1007/978-3-031-94283-9_21).
        </p>
      </div>

      {research.map((res) => (
        <div key={res.id} className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4">
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
  );
}
