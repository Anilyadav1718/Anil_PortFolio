'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, RefreshCw } from 'lucide-react';
import { Experience } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function ExperiencePage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewExpForm, setShowNewExpForm] = useState(false);
  const [newExpForm, setNewExpForm] = useState({
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

  const loadExperienceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=experience', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experiences || []);
      } else {
        setError('Failed to retrieve experience data.');
      }
    } catch {
      setError('Connection failure loading experience records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperienceData();
  }, []);

  const saveEntity = async (type: string, data: any) => {
    try {
      // Optimistic local update
      if (data.id) {
        setExperiences((prev) => prev.map((item) => (item.id === data.id ? data : item)));
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
          setExperiences((prev) => {
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
        alert('Save failed: Unable to persist record.');
        loadExperienceData();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadExperienceData();
    }
  };

  const deleteEntity = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      // Optimistic delete
      setExperiences((prev) => prev.filter((x) => x.id !== id));
      showSaveSuccess('Deleting...');

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, action: 'delete', id }),
      });

      if (res.ok) {
        showSaveSuccess('Record deleted');
      } else {
        alert('Delete failed');
        loadExperienceData();
      }
    } catch (err) {
      alert('Delete failed: ' + err);
      loadExperienceData();
    }
  };

  if (loading && experiences.length === 0) {
    return <SectionSkeleton title="CAREER EXPERIENCE" />;
  }

  if (error && experiences.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadExperienceData}
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
            Experience Management
          </h2>
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
  );
}
