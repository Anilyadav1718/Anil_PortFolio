import { AnalyticsEventType } from '@/types/portfolio';

export function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('anil_sys_sid');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem('anil_sys_sid', sid);
  }
  return sid;
}

export function detectDeviceInfo() {
  if (typeof window === 'undefined') return { device_type: 'Desktop', browser: 'Unknown', os: 'Unknown' };

  const ua = navigator.userAgent;
  let device_type = 'Desktop';
  if (/mobile/i.test(ua)) device_type = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device_type = 'Tablet';

  let browser = 'Unknown';
  if (/chrome|crios/i.test(ua) && !/edge|opr/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr/i.test(ua)) browser = 'Opera';

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { device_type, browser, os };
}

export async function trackEvent(eventType: AnalyticsEventType, eventData: Record<string, any> = {}) {
  try {
    const sessionId = getAnonymousSessionId();
    if (!sessionId) return;

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        eventType,
        eventData,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch (err) {
    // Non-blocking silent fail
  }
}

