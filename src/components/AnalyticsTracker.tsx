'use client';

import { useEffect } from 'react';
import { getAnonymousSessionId, detectDeviceInfo, trackEvent } from '@/lib/analytics';

export function AnalyticsTracker() {
  useEffect(() => {
    try {
      const sessionId = getAnonymousSessionId();
      const deviceInfo = detectDeviceInfo();
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sessionInit: true,
          referrer,
          device_type: deviceInfo.device_type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
        }),
      }).then(() => {
        trackEvent('page_view', { path: window.location.pathname });
      }).catch(() => {});
    } catch (e) {
      // Non-blocking
    }
  }, []);

  return null;
}

