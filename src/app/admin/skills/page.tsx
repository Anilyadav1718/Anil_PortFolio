'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, RefreshCw } from 'lucide-react';
import { Skill } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function SkillsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=skills', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      } else {
        setError('Failed to retrieve skills.');
      }
    } catch {
      setError('Connection failure loading skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const saveEntity = async (type: string, data: any) => {
    try {
      if (data.id) {
        setSkills((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      }
      showSaveSuccess('Saving...');

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, data }),
      });

      if (res.ok) {
        const resJson = await res.json();
        if (resJson.item) {
          setSkills((prev) => {
            const exists = prev.some((x) => x.id === resJson.item.id);
            if (exists) {
              return prev.map((x) => (x.id === resJson.item.id ? resJson.item : x));
            }
            return [resJson.item, ...prev];
          });
        }
        showSaveSuccess('Changes saved! Live on portfolio.');
      } else {
        showSaveSuccess('Save failed');
        alert('Save failed: Unable to persist skill.');
        loadSkills();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadSkills();
    }
  };

  const deleteEntity = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      setSkills((prev) => prev.filter((x) => x.id !== id));
      showSaveSuccess('Deleting...');

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, action: 'delete', id }),
      });

      if (res.ok) {
        showSaveSuccess('Skill deleted');
      } else {
        alert('Delete failed');
        loadSkills();
      }
    } catch (err) {
      alert('Delete failed: ' + err);
      loadSkills();
    }
  };

  if (loading && skills.length === 0) {
    return <SectionSkeleton title="TECHNICAL SKILLS" />;
  }

  if (error && skills.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadSkills}
          className="px-4 py-2 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] inline-flex items-center gap-2 min-h-[44px]"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
            Skills Console Management
          </h2>
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
            className="p-4 sm:p-5 bg-[#121217] border border-[#23232C] space-y-3 max-w-full min-w-0"
          >
            <div className="flex items-center justify-between border-b border-[#23232C] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{sk.name}</span>
                <span className="text-[#E9470B] text-xs">[{sk.category}]</span>
              </div>
              <button
                onClick={() => deleteEntity('skill', sk.id)}
                className="p-2 text-red-400 hover:text-red-300 min-h-[36px] min-w-[36px] flex items-center justify-center border border-transparent hover:border-red-500/30"
                title="Delete Skill"
              >
                <Trash2 size={16} />
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white text-xs"
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
  );
}
