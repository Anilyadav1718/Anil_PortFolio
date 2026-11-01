import { NextRequest, NextResponse } from 'next/server';
import { saveContactMessage, recordAnalyticsEvent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, linkedin, message, sessionId } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Required fields missing: IDENTIFIER [NAME], RETURN_ADDRESS [EMAIL], and PAYLOAD [MESSAGE] are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Invalid RETURN_ADDRESS format.' }, { status: 400 });
    }

    const saved = await saveContactMessage({
      name: name.trim(),
      email: email.trim(),
      linkedin: (linkedin || '').trim(),
      message: message.trim(),
    });

    if (sessionId) {
      await recordAnalyticsEvent({
        session_id: sessionId,
        event_type: 'contact_submit',
        event_data: { name: name.trim(), email: email.trim() },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Transmission acknowledged. Signal received successfully.',
      data: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transmission failed.' }, { status: 500 });
  }
}

