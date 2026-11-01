'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Achievement } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function AchievementsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=achievements', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements || []);
      } else {
        setError('Failed to retrieve achievements.');
      }
    } catch {
      setError('Connection failure loading achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
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
        showSaveSuccess('Achievement saved!');
      } else {
        alert('Save failed');
        loadAchievements();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadAchievements();
    }
  };

  if (loading && achievements.length === 0) {
    return <SectionSkeleton title="HONORS & ACHIEVEMENTS" />;
  }

  if (error && achievements.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadAchievements}
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
          Achievements & Honors
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          Cisco Tech Hackathon 2026, Featured by Cisco, CX Leadership Recognition.
        </p>
      </div>

      <div className="space-y-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="p-4 sm:p-5 bg-[#121217] border border-[#23232C] space-y-3">
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
  );
}
