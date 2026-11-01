import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPortfolioData,
  updateSiteSettings,
  saveExperience,
  deleteExperience,
  saveProject,
  deleteProject,
  saveSkill,
  deleteSkill,
  saveEducation,
  deleteEducation,
  saveResearch,
  deleteResearch,
  saveCertification,
  deleteCertification,
  saveAchievement,
  deleteAchievement,
  saveSocialLink,
  getContactMessages,
  getResumeFiles,
} from '@/lib/db';

export const revalidate = 0;
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
    const portfolio = await getPortfolioData();
    if (isAuthorized(req)) {
      const messages = await getContactMessages();
      const resumes = await getResumeFiles();
      return NextResponse.json({
        portfolio,
        messages,
        resumes,
        ...portfolio,
      });
    }
    return NextResponse.json(portfolio);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, action, data, id } = body;

    let responseJson: any = { success: true };

    switch (type) {
      case 'settings':
        const updatedSettings = await updateSiteSettings(data);
        responseJson = { success: true, item: updatedSettings };
        break;

      case 'experience':
        if (action === 'delete') {
          await deleteExperience(id);
          responseJson = { success: true };
        } else {
          const exp = await saveExperience(data);
          responseJson = { success: true, item: exp };
        }
        break;

      case 'project':
        if (action === 'delete') {
          await deleteProject(id);
          responseJson = { success: true };
        } else {
          const proj = await saveProject(data);
          responseJson = { success: true, item: proj };
        }
        break;

      case 'skill':
        if (action === 'delete') {
          await deleteSkill(id);
          responseJson = { success: true };
        } else {
          const skl = await saveSkill(data);
          responseJson = { success: true, item: skl };
        }
        break;

      case 'education':
        if (action === 'delete') {
          await deleteEducation(id);
          responseJson = { success: true };
        } else {
          const edu = await saveEducation(data);
          responseJson = { success: true, item: edu };
        }
        break;

      case 'research':
        if (action === 'delete') {
          await deleteResearch(id);
          responseJson = { success: true };
        } else {
          const res = await saveResearch(data);
          responseJson = { success: true, item: res };
        }
        break;

      case 'certification':
        if (action === 'delete') {
          await deleteCertification(id);
          responseJson = { success: true };
        } else {
          const cert = await saveCertification(data);
          responseJson = { success: true, item: cert };
        }
        break;

      case 'achievement':
        if (action === 'delete') {
          await deleteAchievement(id);
          responseJson = { success: true };
        } else {
          const ach = await saveAchievement(data);
          responseJson = { success: true, item: ach };
        }
        break;

      case 'social':
        const soc = await saveSocialLink(data);
        responseJson = { success: true, item: soc };
        break;

      default:
        return NextResponse.json({ error: 'Unknown entity type' }, { status: 400 });
    }

    revalidatePath('/');
    return NextResponse.json(responseJson);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
