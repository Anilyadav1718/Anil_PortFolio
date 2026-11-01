'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, RefreshCw } from 'lucide-react';
import { ResumeFile } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function ResumePage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?section=resumes', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are supported.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('set_active', 'true');

    try {
      showSaveSuccess('Uploading resume...');
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showSaveSuccess('New resume uploaded and set as active!');
        loadResumes();
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      alert('Upload error: ' + err);
    }
  };

  const handleSetActiveResume = async (id: string) => {
    const formData = new FormData();
    formData.append('action', 'set_active');
    formData.append('id', id);

    showSaveSuccess('Setting active resume...');
    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: formData,
    });
    if (res.ok) {
      showSaveSuccess('Active resume updated');
      loadResumes();
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Delete this resume file?')) return;
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    showSaveSuccess('Deleting resume...');
    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: formData,
    });
    if (res.ok) {
      showSaveSuccess('Resume deleted');
      loadResumes();
    }
  };

  if (loading && resumes.length === 0) {
    return <SectionSkeleton title="RESUME CV" />;
  }

  return (
    <div className="space-y-6 font-mono text-xs">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
          Resume Management
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          Upload, replace, set active, and manage cross-device resumes.
        </p>
      </div>

      <div className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-4">
        <h3 className="font-bold text-white uppercase text-sm">Upload New Resume (PDF)</h3>
        <p className="text-[#9CA3AF] text-xs">
          Cross-device compatible. Accepts standard PDF files up to 15MB.
        </p>

        <div className="pt-2">
          <label className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold cursor-pointer w-full sm:w-auto min-h-[44px]">
            <Upload size={15} />
            <span>SELECT PDF FROM DEVICE</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-white uppercase text-sm">Available Resumes</h3>
        {resumes.map((res) => (
          <div
            key={res.id}
            className={`p-4 bg-[#121217] border ${
              res.is_active ? 'border-[#E9470B]' : 'border-[#23232C]'
            } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-full min-w-0`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-xs sm:text-sm break-all">{res.file_name}</span>
                {res.is_active && (
                  <span className="px-2 py-0.5 bg-[#E9470B] text-white font-bold text-[10px]">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#6B7280] mt-1">
                Uploaded: {new Date(res.uploaded_at).toLocaleString()} | Size:{' '}
                {Math.round(res.file_size / 1024)} KB
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <a
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2A2A35] min-h-[40px] flex items-center justify-center text-xs"
              >
                Preview
              </a>
              {!res.is_active && (
                <button
                  onClick={() => handleSetActiveResume(res.id)}
                  className="px-3 py-2 bg-[#E9470B] hover:bg-[#D43E08] text-white font-bold min-h-[40px] flex items-center justify-center text-xs"
                >
                  Set Active
                </button>
              )}
              <button
                onClick={() => handleDeleteResume(res.id)}
                className="p-2 text-red-400 hover:text-red-300 min-h-[40px] min-w-[40px] flex items-center justify-center border border-red-500/20"
                title="Delete Resume"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
