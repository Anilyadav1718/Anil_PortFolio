'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SocialLink } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function SocialsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSocials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?section=socials', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSocials(data.socials || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
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
        showSaveSuccess('Social link saved!');
      } else {
        alert('Save failed');
        loadSocials();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadSocials();
    }
  };

  if (loading && socials.length === 0) {
    return <SectionSkeleton title="NETWORK HUBS" />;
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
          Social & System Links
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
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
  );
}
