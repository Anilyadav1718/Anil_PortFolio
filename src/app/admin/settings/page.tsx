'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SiteSettings } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function SettingsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?section=settings', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
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
        showSaveSuccess('Site settings saved! Live on portfolio.');
      } else {
        alert('Save failed');
        loadSettings();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadSettings();
    }
  };

  if (loading && !settings) {
    return <SectionSkeleton title="CONFIGURATION" />;
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">Site Settings</h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          Hero headline, display titles, location, and status metrics.
        </p>
      </div>

      <div className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4">
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
  );
}
