import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, recordAnalyticsEvent } from '@/lib/db';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const data = await getPortfolioData();
    const resumeUrl = data.settings.active_resume_url || '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf';

    const sessionId = req.nextUrl.searchParams.get('sessionId') || '';
    if (sessionId) {
      await recordAnalyticsEvent({
        session_id: sessionId,
        event_type: 'resume_view',
        event_data: { resumeUrl },
      });
    }

    // If external URL (e.g. Supabase storage public URL), redirect to it
    if (resumeUrl.startsWith('http')) {
      return NextResponse.redirect(resumeUrl);
    }

    // If local path in public folder, serve with inline header
    try {
      const cleanPath = resumeUrl.startsWith('/') ? resumeUrl.slice(1) : resumeUrl;
      const filePath = path.join(process.cwd(), 'public', cleanPath);
      const fileBuffer = await readFile(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Anil_Panchitha_Software_Engineer_CV.pdf"',
          'Cache-Control': 'no-store, must-revalidate',
        },
      });
    } catch {
      // Fallback redirect to the static path
      return NextResponse.redirect(new URL(resumeUrl, req.url));
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Resume unavailable' }, { status: 500 });
  }
}

