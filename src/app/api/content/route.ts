import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getPortfolioData,
  getExperiencesOnly,
  getProjectsOnly,
  getSkillsOnly,
  getEducationOnly,
  getResearchOnly,
  getCertificationsOnly,
  getAchievementsOnly,
  getSiteSettingsOnly,
  getSocialLinksOnly,
  getContactMessagesPaginated,
  getResumeFilesMetadataOnly,
  getAnalyticsSummary,
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

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session');
  const headerToken =
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.headers.get('x-admin-token');
  const serverPasscode = process.env.ADMIN_PASSCODE || 'admin2026';

  return Boolean(
    (cookie && cookie.value.startsWith('authenticated_token_')) ||
    (headerToken && (headerToken.startsWith('authenticated_token_') || headerToken === serverPasscode))
  );
}

export async function GET(req: NextRequest) {
  try {
    const section = req.nextUrl.searchParams.get('section') || req.nextUrl.searchParams.get('type');
    const admin = isAuthorized(req);

    // Section-specific targeted queries (blazing fast, loads ONLY the requested dataset)
    if (section) {
      switch (section) {
        case 'experience':
        case 'experiences': {
          const experiences = await getExperiencesOnly(admin);
          return NextResponse.json({ experiences });
        }
        case 'project':
        case 'projects': {
          const projects = await getProjectsOnly(admin);
          return NextResponse.json({ projects });
        }
        case 'skill':
        case 'skills': {
          const skills = await getSkillsOnly(admin);
          return NextResponse.json({ skills });
        }
        case 'education': {
          const education = await getEducationOnly();
          return NextResponse.json({ education });
        }
        case 'research': {
          const research = await getResearchOnly(admin);
          return NextResponse.json({ research });
        }
        case 'certification':
        case 'certifications': {
          const certifications = await getCertificationsOnly(admin);
          return NextResponse.json({ certifications });
        }
        case 'achievement':
        case 'achievements': {
          const achievements = await getAchievementsOnly(admin);
          return NextResponse.json({ achievements });
        }
        case 'setting':
        case 'settings': {
          const settings = await getSiteSettingsOnly();
          return NextResponse.json({ settings });
        }
        case 'social':
        case 'socials':
        case 'social-links': {
          const socials = await getSocialLinksOnly(admin);
          return NextResponse.json({ socials });
        }
        case 'message':
        case 'messages': {
          const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1'));
          const limit = Math.min(50, Math.max(5, parseInt(req.nextUrl.searchParams.get('limit') || '25')));
          const data = await getContactMessagesPaginated(page, limit);
          return NextResponse.json(data);
        }
        case 'resume':
        case 'resumes': {
          const resumes = await getResumeFilesMetadataOnly();
          return NextResponse.json({ resumes });
        }
        case 'summary':
        case 'analytics-summary': {
          const summary = await getAnalyticsSummary();
          return NextResponse.json(summary);
        }
        default:
          break;
      }
    }

    // Default full portfolio data for public portfolio homepage or legacy callers
    const portfolio = await getPortfolioData();
    if (admin) {
      const messages = await getContactMessages();
      const resumes = await getResumeFilesMetadataOnly();
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
        return NextResponse.json({ error: `Unknown entity type: ${type}` }, { status: 400 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/admin');
      if (type) revalidatePath(`/admin/${type}`);
    } catch {
      // Ignore in non-ISR runtime
    }

    return NextResponse.json(responseJson);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Mutation failed' }, { status: 500 });
  }
}
