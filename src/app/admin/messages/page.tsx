'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ContactMessage } from '@/types/portfolio';
import { useAdmin } from '../AdminContext';
import SectionSkeleton from '../SectionSkeleton';

export default function MessagesPage() {
  const { getAdminHeaders } = useAdmin();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadMessages = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?section=messages&page=${targetPage}&limit=15`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTotal(data.total || 0);
        setPage(targetPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(1);
  }, []);

  if (loading && messages.length === 0) {
    return <SectionSkeleton title="TRANSMISSIONS" />;
  }

  const totalPages = Math.ceil(total / 15) || 1;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans break-words">
            Contact Inquiries ({total})
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1 break-words">
            Incoming transmissions received via the portfolio contact form.
          </p>
        </div>
        <button
          onClick={() => loadMessages(page)}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#1E1E26] hover:bg-[#282834] text-white border border-[#2E2E38] flex items-center justify-center gap-2 min-h-[44px]"
        >
          <RefreshCw size={14} /> Refresh Messages
        </button>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 sm:p-6 bg-[#121217] border border-[#23232C] space-y-3 max-w-full min-w-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#23232C] pb-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-bold text-white text-sm">{msg.name}</span>
                  <span className="text-[#E9470B] text-xs">&lt;{msg.email}&gt;</span>
                </div>
                <span className="text-[11px] text-[#6B7280]">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>

              {msg.linkedin && (
                <div className="text-[#25BFD0]">
                  LinkedIn:{' '}
                  <a
                    href={msg.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all"
                  >
                    {msg.linkedin}
                  </a>
                </div>
              )}

              <div className="p-3 bg-[#0A0A0D] border border-[#1E1E26] text-white leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-[#6B7280] bg-[#121217] border border-[#23232C]">
            No contact messages received yet. Communication socket listening.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#23232C]">
            <button
              disabled={page <= 1}
              onClick={() => loadMessages(page - 1)}
              className="px-4 py-2 bg-[#1A1A22] text-white border border-[#2E2E38] disabled:opacity-40 min-h-[44px]"
            >
              Previous
            </button>
            <span className="text-zinc-400 text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => loadMessages(page + 1)}
              className="px-4 py-2 bg-[#1A1A22] text-white border border-[#2E2E38] disabled:opacity-40 min-h-[44px]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
