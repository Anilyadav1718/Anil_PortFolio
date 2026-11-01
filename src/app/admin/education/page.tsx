'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Education } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function EducationPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEducation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=education', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setEducation(data.education || []);
      } else {
        setError('Failed to retrieve education records.');
      }
    } catch {
      setError('Connection failure loading education.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
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
        showSaveSuccess('Education records saved!');
      } else {
        alert('Save failed');
        loadEducation();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadEducation();
    }
  };

  if (loading && education.length === 0) {
    return <SectionSkeleton title="ACADEMIC BACKGROUND" />;
  }

  if (error && education.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadEducation}
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
          Education Management
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          Institute of Aeronautical Engineering, B.Tech Data Science (CGPA: 7.34).
        </p>
      </div>

      {education.map((edu) => (
        <div key={edu.id} className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4">
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
  );
}
