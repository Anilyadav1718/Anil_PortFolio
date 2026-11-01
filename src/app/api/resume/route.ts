import { NextRequest, NextResponse } from 'next/server';
import {
  getPortfolioData,
  recordAnalyticsEvent,
  getResumeFiles,
  addResumeFile,
  setActiveResume,
  deleteResumeFile,
} from '@/lib/db';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest) {
  const cookie = req.cookies.get('admin_session');
  const headerToken =
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.headers.get('x-admin-token');
  const serverPasscode = process.env.ADMIN_PASSCODE || 'admin2026';

  return (
    (cookie && cookie.value.startsWith('authenticated_token_')) ||
    (headerToken && (headerToken.startsWith('authenticated_token_') || headerToken === serverPasscode))
  );
}

export async function GET(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.get('list') === 'true' && isAuthorized(req)) {
      const resumes = await getResumeFiles();
      return NextResponse.json(resumes);
    }

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

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const action = formData.get('action') as string | null;

    if (action === 'set_active') {
      const id = formData.get('id') as string;
      await setActiveResume(id);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      await deleteResumeFile(id);
      return NextResponse.json({ success: true });
    }

    // Handle Upload
    const file = formData.get('resume') as File | null;
    const setActive = formData.get('set_active') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `resumes/${timestamp}_${safeName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileUrl = `/uploads/resumes/${timestamp}_${safeName}`;

    // Upload to Supabase Storage if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error: uploadErr } = await supabaseAdmin.storage
          .from('resumes')
          .upload(storagePath, buffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (!uploadErr) {
          const { data: pubData } = supabaseAdmin.storage
            .from('resumes')
            .getPublicUrl(storagePath);
          if (pubData?.publicUrl) {
            fileUrl = pubData.publicUrl;
          }
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback to local:', e);
      }
    }

    // Save locally as well
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, `${timestamp}_${safeName}`), buffer);
    } catch (e) {
      console.warn('Local file write fallback:', e);
    }

    const newResume = await addResumeFile({
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
      storage_path: storagePath,
      is_active: setActive,
    });

    return NextResponse.json({ success: true, resume: newResume });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
