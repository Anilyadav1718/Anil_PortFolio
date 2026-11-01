'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Certification } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function CertificationsPage() {
  const { showSaveSuccess, getAdminHeaders } = useAdmin();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/content?section=certifications', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
      } else {
        setError('Failed to retrieve certifications.');
      }
    } catch {
      setError('Connection failure loading certifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
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
        showSaveSuccess('Certification saved!');
      } else {
        alert('Save failed');
        loadCertifications();
      }
    } catch (err) {
      alert('Save failed: ' + err);
      loadCertifications();
    }
  };

  if (loading && certifications.length === 0) {
    return <SectionSkeleton title="ACCREDITATIONS" />;
  }

  if (error && certifications.length === 0) {
    return (
      <div className="p-8 bg-[#16161D] border border-red-500/30 text-center space-y-4 font-mono">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={loadCertifications}
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
          Certifications Management
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 break-words">
          NPTEL, Coursera ML Specialization, Google Data Analytics, IBM Data Science.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="p-4 sm:p-5 bg-[#121217] border border-[#23232C] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#6B7280] uppercase block">Title</label>
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) => {
                    const updated = { ...cert, title: e.target.value };
                    setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#6B7280] uppercase block">Issuer</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => {
                    const updated = { ...cert, issuer: e.target.value };
                    setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#6B7280] uppercase block">Credential URL</label>
                <input
                  type="text"
                  value={cert.credential_url}
                  onChange={(e) => {
                    const updated = { ...cert, credential_url: e.target.value };
                    setCertifications(certifications.map((c) => (c.id === cert.id ? updated : c)));
                  }}
                  className="w-full p-2 bg-[#0A0A0D] border border-[#23232C] text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C1C24] flex flex-col sm:flex-row justify-end">
              <button
                onClick={() => saveEntity('certification', cert)}
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
