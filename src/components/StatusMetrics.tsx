'use client';

import React from 'react';
import { ViewportReveal } from './ViewportReveal';

interface StatusMetricsProps {
  metrics: {
    exp: string;
    projects: string;
    pubs: string;
    awards: string;
    totalViews: number;
  };
}

export function StatusMetrics({ metrics }: StatusMetricsProps) {
  const metricItems = [
    { value: metrics.exp || '01', label: 'YEAR EXPERIENCE' },
    { value: metrics.projects || '03', label: 'FEATURED AI PROJECTS' },
    { value: metrics.pubs || '01', label: 'SPRINGER PUBLICATION' },
    { value: metrics.awards || '01', label: 'HACKATHON WIN' },
    { value: metrics.totalViews > 0 ? metrics.totalViews.toString().padStart(2, '0') : '01', label: 'PAGE_VIEWS' },
  ];

  return (
    <div className="border-b border-theme-border bg-theme-surface/50 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <ViewportReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-theme-subtle">
            {metricItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col justify-center ${index > 0 ? 'pt-3 md:pt-0 md:pl-6' : ''}`}
              >
                <div className="text-3xl sm:text-4xl font-black text-theme-orange tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs tracking-wider text-theme-secondary font-medium uppercase mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </div>
    </div>
  );
}

