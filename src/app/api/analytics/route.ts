import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import {
  recordVisitorSession,
  recordAnalyticsEvent,
  getAnalyticsDashboardData,
  getAnalyticsSummary,
  getVisitorSessionsPaginated,
} from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, sessionInit, eventType, eventData, referrer, device_type, browser, os } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Register / update visitor session
    if (sessionInit) {
      const country = req.headers.get('x-vercel-ip-country') || 'Global';
      await recordVisitorSession({
        id: sessionId,
        referrer: referrer || 'Direct',
        user_agent: req.headers.get('user-agent') || '',
        device_type: device_type || 'Desktop',
        browser: browser || 'Unknown',
        os: os || 'Unknown',
        country,
      });
      return NextResponse.json({ success: true, session: 'initialized' });
    }

    // Record an analytics event
    if (eventType) {
      const event = await recordAnalyticsEvent({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData || {},
      });
      return NextResponse.json({ success: true, event });
    }

    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analytics failure' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const isSummary = req.nextUrl.searchParams.get('summary') === 'true';
    const isSessions = req.nextUrl.searchParams.get('sessions') === 'true';

    if (isSummary) {
      const summary = await getAnalyticsSummary();
      return NextResponse.json(summary);
    }

    if (isSessions) {
      const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1'));
      const limit = Math.min(50, Math.max(5, parseInt(req.nextUrl.searchParams.get('limit') || '25')));
      const data = await getVisitorSessionsPaginated(page, limit);
      return NextResponse.json(data);
    }

    const data = await getAnalyticsDashboardData();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
