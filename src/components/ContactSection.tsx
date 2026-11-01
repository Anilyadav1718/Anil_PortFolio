'use client';

import React, { useState } from 'react';
import { ViewportReveal } from './ViewportReveal';
import { getAnonymousSessionId } from '@/lib/analytics';
import { playSuccessSound, playKeySound } from '@/lib/audio';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    linkedin: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setErrorMessage('MISSING REQUIRED PACKETS: Identifier, Return Address, and Payload are required.');
      return;
    }

    setStatus('transmitting');
    setErrorMessage('');

    try {
      const sessionId = getAnonymousSessionId();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sessionId }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Transmission failed.');
      }

      setStatus('success');
      playSuccessSound();
      setForm({ name: '', email: '', linkedin: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Signal drop. Transmission packet lost.');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-b border-theme-border font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ViewportReveal>
          {/* Header */}
          <div className="mb-12">
            <div className="text-xs text-theme-orange uppercase tracking-wider mb-2">
              [ SEC_07 // COMMUNICATION_PORT ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-text">
              INITIATE PING [ CONTACT_ME ]
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Short message & instructions */}
            <div className="lg:col-span-5 space-y-6 text-xs sm:text-sm text-theme-secondary">
              <div className="p-6 border border-theme-border bg-theme-surface space-y-4">
                <div className="flex items-center gap-2 text-theme-orange font-bold text-xs uppercase">
                  <span className="w-2 h-2 bg-theme-orange animate-ping" />
                  <span>TRANSMISSION_PROTOCOL // OPEN</span>
                </div>

                <p className="leading-relaxed">
                  Direct communication link for technical consultations, engineering opportunities, Generative AI collaborations, or architectural inquiries.
                </p>

                <p className="leading-relaxed text-theme-muted">
                  Transmissions are logged securely to the central data bus. Expect an encrypted response to your return address within standard business cycles.
                </p>

                <div className="pt-2 border-t border-theme-subtle text-[11px] text-theme-muted space-y-1">
                  <div>LATENCY: &lt; 50ms</div>
                  <div>SECURITY: ENCRYPTED_TLS</div>
                  <div>STATUS: LISTENING_ON_PORT_443</div>
                </div>
              </div>
            </div>

            {/* Right Column: Technical Contact Form */}
            <div className="lg:col-span-7">
              <div className="retro-window border border-theme-border bg-theme-surface">
                <div className="retro-window-header flex items-center justify-between text-xs">
                  <span className="font-bold text-theme-text">PACKET_TRANSMITTER.EXE</span>
                  <span className="text-[10px] text-theme-orange font-bold">SOCKET_OPEN</span>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
                  {/* Status Banner */}
                  {status === 'success' && (
                    <div className="p-4 bg-theme-orange/10 border border-theme-orange text-theme-orange flex items-start gap-3">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold uppercase">TRANSMISSION ACKNOWLEDGED</div>
                        <div className="text-[11px] opacity-90 mt-0.5">
                          Packet successfully delivered to Anil Panchitha. Verification hash logged.
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 flex items-start gap-3">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold uppercase">TRANSMISSION FAILED</div>
                        <div className="text-[11px] opacity-90 mt-0.5">{errorMessage}</div>
                      </div>
                    </div>
                  )}

                  {/* Field 1: Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-theme-text uppercase">
                      IDENTIFIER [NAME] <span className="text-theme-orange">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Engineering Lead / Recruiter"
                      className="w-full p-2.5 bg-theme-bg border border-theme-border text-theme-text focus:border-theme-orange focus:outline-none transition-colors text-xs"
                    />
                  </div>

                  {/* Field 2: Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-theme-text uppercase">
                      RETURN_ADDRESS [EMAIL] <span className="text-theme-orange">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. name@company.com"
                      className="w-full p-2.5 bg-theme-bg border border-theme-border text-theme-text focus:border-theme-orange focus:outline-none transition-colors text-xs"
                    />
                  </div>

                  {/* Field 3: LinkedIn */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-theme-text uppercase">
                      LINKEDIN <span className="text-theme-muted">[OPTIONAL]</span>
                    </label>
                    <input
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full p-2.5 bg-theme-bg border border-theme-border text-theme-text focus:border-theme-orange focus:outline-none transition-colors text-xs"
                    />
                  </div>

                  {/* Field 4: Message */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-theme-text uppercase">
                      PAYLOAD [MESSAGE] <span className="text-theme-orange">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="State technical requirements, project parameters, or conversation brief..."
                      className="w-full p-2.5 bg-theme-bg border border-theme-border text-theme-text focus:border-theme-orange focus:outline-none transition-colors text-xs resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'transmitting'}
                      className="btn-retro-primary w-full py-3 text-xs tracking-wider cursor-pointer"
                    >
                      {status === 'transmitting' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>TRANSMITTING PACKETS...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>EXECUTE TRANSMISSION</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ViewportReveal>
      </div>
    </section>
  );
}

