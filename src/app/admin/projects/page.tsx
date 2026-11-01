'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, RefreshCw } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function ProjectsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=projects', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        setError('Failed to retrieve projects.');
      }
    } catch {
      setError('Connection failure loading projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const saveEntity = async (type: string, data: any) => {
    try {
      if (data.id) {
        setProjects((prev) => prev.map((item) => (item.id === data.id ? data : item)));
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
          setProjects((prev) => {
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
        alert('Save failed: Unable to persist project.');
        loadProjects();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadProjects();
    }
  };

  const deleteEntity = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setProjects((prev) => prev.filter((x) => x.id !== id));
      showSaveSuccess('Deleting...');

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ type, action: 'delete', id }),
      });

      if (res.ok) {
        showSaveSuccess('Project deleted');
      } else {
        alert('Delete failed');
        loadProjects();
      }
    } catch (err) {
      alert('Delete failed: ' + err);
      loadProjects();
    }
  };

  if (loading && projects.length === 0) {
    return <SectionSkeleton title="ENGINEERING PROJECTS" />;
  }

  if (error && projects.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadProjects}
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
            Projects Management
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1 break-words">
            Manage portfolio deployments (FarmerVerify AI, Medha AI, CMS AI Assistant, etc.).
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
              github_url: 'https://github.com/Anilyadav1718',
              linkedin_url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Problem</label>
                <textarea
                  rows={2}
                  value={proj.problem || ''}
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
                  value={proj.solution || ''}
                  onChange={(e) => {
                    const updated = { ...proj, solution: e.target.value };
                    setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">Impact</label>
                <textarea
                  rows={2}
                  value={proj.impact || ''}
                  onChange={(e) => {
                    const updated = { ...proj, impact: e.target.value };
                    setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-[11px] text-[#6B7280] uppercase block mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={proj.github_url || ''}
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
                  value={proj.linkedin_url || ''}
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
                  value={proj.live_demo_url || ''}
                  onChange={(e) => {
                    const updated = { ...proj, live_demo_url: e.target.value };
                    setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#6B7280] uppercase block mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={(proj.tags || []).join(', ')}
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
  );
}
