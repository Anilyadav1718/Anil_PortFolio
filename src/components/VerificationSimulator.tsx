'use client';

import React, { useState } from 'react';
import { playBlipSound, playSuccessSound, playKeySound } from '@/lib/audio';
import { ShieldCheck, ShieldAlert, Play, CheckCircle2, Loader2, Sparkles, Trophy } from 'lucide-react';

interface SampleDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  hasTampering: boolean;
  expectedOutcome: string;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'doc-1',
    name: 'TELANGANA_LAND_PATTA_RECORD.PDF',
    type: 'Official Land Title Record',
    size: '1.8 MB',
    hasTampering: false,
    expectedOutcome: 'VALIDATED // PASSED ALL AUDIT CHECKS',
  },
  {
    id: 'doc-2',
    name: 'GOVT_ID_ALTERED_SIGNATURE.PNG',
    type: 'Identity Proof (Tampered Sample)',
    size: '640 KB',
    hasTampering: true,
    expectedOutcome: 'FRAUD_FLAGGED // PIXEL COMPRESSION ANOMALY',
  },
  {
    id: 'doc-3',
    name: 'KISAN_CREDIT_DOC_SCAN.TIFF',
    type: 'Multi-Page Financial Application',
    size: '3.2 MB',
    hasTampering: false,
    expectedOutcome: 'VALIDATED // CROSS-REFERENCED WITH CADASTRE',
  },
];

export function VerificationSimulator() {
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(SAMPLE_DOCS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<{
    status: 'passed' | 'failed';
    confidence: string;
    processingTime: string;
    details: string[];
  } | null>(null);

  const steps = [
    '1/4: Running adaptive thresholding & OCR text/seal segmentation...',
    '2/4: Multimodal GPT-4.1 Vision verifying official seals & signatures...',
    '3/4: Embedding vector extraction & ChromaDB cross-index deduplication...',
    '4/4: Fraud scoring, pixel tamper detection & structured audit issuance...',
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setResult(null);
    setCurrentStep(0);
    playKeySound();

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      playBlipSound();

      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          playSuccessSound();

          if (selectedDoc.hasTampering) {
            setResult({
              status: 'failed',
              confidence: '99.4%',
              processingTime: '1.24s (vs 14-day manual backlog)',
              details: [
                'ALERT: Non-uniform JPEG compression block grid detected in signature field.',
                'Cadastral vector distance exceeds variance threshold (Cosine Sim: 0.42).',
                'Recommended Action: Route to human supervisor with flagged anomaly coordinates.',
              ],
            });
          } else {
            setResult({
              status: 'passed',
              confidence: '98.8%',
              processingTime: '0.98s (vs 14-day manual backlog)',
              details: [
                'Government seal hash matched authentic jurisdictional authority registry.',
                'Semantic cross-check with state land records confirmed ownership tenure.',
                'Structured JSON compliance envelope generated and cryptographically signed.',
              ],
            });
          }
        }, 400);
      }
    }, 600);
  };

  return (
    <div className="mt-6 p-5 sm:p-6 bg-theme-bg/80 border border-theme-orange/40 font-mono text-xs space-y-5">
      {/* Simulator Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-theme-orange animate-pulse" />
          <span className="font-bold text-sm text-theme-text uppercase tracking-wider">
            FARMERVERIFY AI // LIVE PIPELINE SIMULATOR
          </span>
          <span className="px-2 py-0.5 bg-theme-orange/15 text-theme-orange font-bold text-[10px] flex items-center gap-1">
            <Trophy size={11} /> HACKATHON WINNER ENGINE
          </span>
        </div>
        <div className="text-[11px] text-theme-muted">
          INTERACTIVE TELEMETRY LAB
        </div>
      </div>

      <p className="text-theme-secondary text-xs leading-relaxed">
        Test the verification engine in real time. Choose an incoming document packet and execute the automated verification pipeline to see how the system reduced verification from 14 days to under 2 hours.
      </p>

      {/* Document Selection Grid */}
      <div className="space-y-2">
        <div className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">
          SELECT INCOMING DOCUMENT PAYLOAD:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_DOCS.map((doc) => {
            const isSelected = selectedDoc.id === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setSelectedDoc(doc);
                  setResult(null);
                  playKeySound();
                }}
                disabled={isRunning}
                className={`p-3 text-left border transition-all ${
                  isSelected
                    ? 'border-theme-orange bg-theme-orange/10 text-theme-text shadow-sm'
                    : 'border-theme-border bg-theme-surface text-theme-secondary hover:border-theme-orange/50'
                }`}
              >
                <div className="font-bold text-[11px] truncate">{doc.name}</div>
                <div className="text-[10px] text-theme-muted mt-1">{doc.type}</div>
                <div className="text-[10px] text-theme-orange font-semibold mt-1">
                  Size: {doc.size}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Execute Button */}
      <div>
        <button
          type="button"
          onClick={runSimulation}
          disabled={isRunning}
          className="btn-retro-primary w-full py-2.5 text-xs font-bold tracking-wider cursor-pointer"
        >
          {isRunning ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>PROCESSING MULTIMODAL PIPELINE...</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>RUN VERIFICATION SIMULATION [{selectedDoc.name}]</span>
            </>
          )}
        </button>
      </div>

      {/* Running Progress Telemetry */}
      {isRunning && (
        <div className="p-4 bg-theme-surface border border-theme-orange space-y-2">
          <div className="flex items-center justify-between text-[11px] text-theme-orange font-bold">
            <span>EXECUTING PIPELINE</span>
            <span>STEP {currentStep + 1} OF 4</span>
          </div>
          <div className="text-theme-text text-xs animate-pulse">
            › {steps[currentStep] || 'Finalizing audit trail...'}
          </div>
          <div className="w-full bg-theme-bg h-1.5 border border-theme-border overflow-hidden">
            <div
              className="bg-theme-orange h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div
          className={`p-4 border ${
            result.status === 'passed'
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-red-500 bg-red-500/10'
          } space-y-3`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.status === 'passed' ? (
                <ShieldCheck size={18} className="text-emerald-400" />
              ) : (
                <ShieldAlert size={18} className="text-red-400" />
              )}
              <span
                className={`font-black text-sm tracking-wide ${
                  result.status === 'passed' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {result.status === 'passed' ? 'VERIFICATION PASSED' : 'SECURITY TAMPER ALERT'}
              </span>
            </div>

            <div className="text-right text-[11px] text-theme-text font-bold">
              <div>CONFIDENCE: {result.confidence}</div>
              <div className="text-theme-orange">LATENCY: {result.processingTime}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
            {result.details.map((item, idx) => (
              <div key={idx} className="text-[11px] text-theme-secondary flex items-start gap-2">
                <span className="text-theme-orange">›</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] text-theme-muted flex items-center justify-between">
            <span>AUDIT HASH: SHA256_{Date.now().toString(16)}</span>
            <span className="text-theme-orange font-bold">14 DAYS → &lt; 2 HOURS PROVEN</span>
          </div>
        </div>
      )}
    </div>
  );
}

