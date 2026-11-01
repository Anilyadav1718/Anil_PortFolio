import fs from 'fs';
import path from 'path';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import {
  initialSiteSettings,
  initialSocials,
  initialExperiences,
  initialProjects,
  initialSkills,
  initialEducation,
  initialResearch,
  initialCertifications,
  initialAchievements,
  initialResumeFiles,
} from './initialData';
import {
  SiteSettings,
  SocialLink,
  Experience,
  Project,
  Skill,
  Education,
  Research,
  Certification,
  Achievement,
  ContactMessage,
  VisitorSession,
  AnalyticsEvent,
  ResumeFile,
  PortfolioData,
} from '@/types/portfolio';

// Local store for fallback when Supabase is not configured or during offline dev
interface LocalDataStore {
  settings: SiteSettings;
  socials: SocialLink[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  research: Research[];
  certifications: Certification[];
  achievements: Achievement[];
  contactMessages: ContactMessage[];
  visitorSessions: VisitorSession[];
  analyticsEvents: AnalyticsEvent[];
  resumeFiles: ResumeFile[];
}

// Persistence file path for local/offline runtime
const STORE_FILE_PATH = path.join(process.cwd(), 'data', 'local-portfolio-store.json');
const SIBLING_STORE_FILE_PATH = path.resolve(process.cwd(), '..', 'portfolio-admin', 'data', 'local-portfolio-store.json');

function persistLocalStore(store: LocalDataStore) {
  try {
    const dir = path.dirname(STORE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist local store to disk:', err);
  }

  // Also mirror directly to portfolio-admin if running locally in sibling folder
  try {
    if (fs.existsSync(path.dirname(SIBLING_STORE_FILE_PATH))) {
      fs.writeFileSync(SIBLING_STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Could not mirror local store to portfolio-admin sibling:', err);
  }
}

function loadLocalStoreFromDisk(): LocalDataStore | null {
  const candidatePaths = [STORE_FILE_PATH, SIBLING_STORE_FILE_PATH];
  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.experiences && parsed.projects) {
          return parsed as LocalDataStore;
        }
      }
    } catch (err) {
      console.warn(`Could not load local store from ${filePath}:`, err);
    }
  }
  return null;
}

// In-memory global singleton for server runtime with mtime tracking
const globalForData = global as unknown as { localStore?: LocalDataStore; lastMtime?: number };

const getLocalStore = (): LocalDataStore => {
  try {
    const targetFile = fs.existsSync(STORE_FILE_PATH) ? STORE_FILE_PATH : (fs.existsSync(SIBLING_STORE_FILE_PATH) ? SIBLING_STORE_FILE_PATH : null);
    if (targetFile) {
      const stats = fs.statSync(targetFile);
      if (!globalForData.localStore || globalForData.lastMtime !== stats.mtimeMs) {
        globalForData.lastMtime = stats.mtimeMs;
        const diskStore = loadLocalStoreFromDisk();
        if (diskStore) {
          globalForData.localStore = diskStore;
        }
      }
    }
  } catch (err) {
    // Continue with in-memory fallback
  }

  if (!globalForData.localStore) {
    const diskStore = loadLocalStoreFromDisk();
    if (diskStore) {
      globalForData.localStore = diskStore;
    } else {
      globalForData.localStore = {
        settings: { ...initialSiteSettings },
        socials: [...initialSocials],
        experiences: [...initialExperiences],
        projects: [...initialProjects],
        skills: [...initialSkills],
        education: [...initialEducation],
        research: [...initialResearch],
        certifications: [...initialCertifications],
        achievements: [...initialAchievements],
        contactMessages: [],
        visitorSessions: [],
        analyticsEvents: [],
        resumeFiles: [...initialResumeFiles],
      };
      persistLocalStore(globalForData.localStore);
    }
  }
  return globalForData.localStore;
};

// ============================================================================
// DATA ACCESS & SYNCHRONIZATION
// ============================================================================

export async function getPortfolioData(): Promise<PortfolioData> {
  const store = getLocalStore();

  if (isSupabaseConfigured && supabase) {
    try {
      const [
        { data: settingsData },
        { data: socialsData },
        { data: expData },
        { data: bulletsData },
        { data: projData },
        { data: skillsData },
        { data: eduData },
        { data: resData },
        { data: certData },
        { data: achData },
        { count: viewsCount },
        { count: resumeCount },
        { count: projClickCount },
      ] = await Promise.all([
        supabase.from('site_settings').select('*').single(),
        supabase.from('social_links').select('*').order('display_order'),
        supabase.from('experiences').select('*').order('display_order'),
        supabase.from('experience_bullets').select('*').order('display_order'),
        supabase.from('projects').select('*').order('display_order'),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('education').select('*').order('display_order'),
        supabase.from('research').select('*').order('display_order'),
        supabase.from('certifications').select('*').order('display_order'),
        supabase.from('achievements').select('*').order('display_order'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'resume_view'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).like('event_type', 'project_%'),
      ]);

      const formattedExperiences: Experience[] = (expData && expData.length > 0)
        ? expData.map((exp: any) => ({
            ...exp,
            bullets: bulletsData
              ? bulletsData.filter((b: any) => b.experience_id === exp.id).map((b: any) => b.content)
              : [],
          }))
        : store.experiences;

      return {
        settings: settingsData || store.settings,
        socials: socialsData && socialsData.length > 0 ? socialsData : store.socials,
        experiences: formattedExperiences,
        projects: projData && projData.length > 0 ? projData : store.projects,
        skills: skillsData && skillsData.length > 0 ? skillsData : store.skills,
        education: eduData && eduData.length > 0 ? eduData : store.education,
        research: resData && resData.length > 0 ? resData : store.research,
        certifications: certData && certData.length > 0 ? certData : store.certifications,
        achievements: achData && achData.length > 0 ? achData : store.achievements,
        metrics: {
          total_views: viewsCount || 1,
          resume_views: resumeCount || 0,
          project_clicks: projClickCount || 0,
          uptime_seconds: Math.floor(process.uptime()),
        },
      };
    } catch (err) {
      console.warn('Supabase read warning, using local store:', err);
    }
  }

  // Fallback to local store
  const totalViews = store.analyticsEvents.filter((e) => e.event_type === 'page_view').length;
  const resumeViews = store.analyticsEvents.filter((e) => e.event_type === 'resume_view').length;
  const projectClicks = store.analyticsEvents.filter((e) => e.event_type.startsWith('project_')).length;

  return {
    settings: store.settings,
    socials: store.socials.filter((s) => s.is_active),
    experiences: store.experiences.filter((e) => e.is_published),
    projects: store.projects.filter((p) => p.is_published),
    skills: store.skills.filter((s) => s.is_published),
    education: store.education,
    research: store.research.filter((r) => r.is_published),
    certifications: store.certifications.filter((c) => c.is_published),
    achievements: store.achievements.filter((a) => a.is_published),
    metrics: {
      total_views: Math.max(totalViews, 1),
      resume_views: resumeViews,
      project_clicks: projectClicks,
      uptime_seconds: Math.floor(process.uptime()),
    },
  };
}

// ============================================================================
// ADMIN CRUD OPERATIONS
// ============================================================================

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = getLocalStore();
  store.settings = { ...store.settings, ...settings, updated_at: new Date().toISOString() };
  persistLocalStore(store);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ ...store.settings, id: 'default' })
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Error saving settings to Supabase:', e);
    }
  }
  return store.settings;
}

export async function saveExperience(exp: Experience): Promise<Experience> {
  const store = getLocalStore();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let assignedId = exp.id;
  if (!assignedId || (!uuidRegex.test(assignedId) && !assignedId.startsWith('exp-'))) {
    assignedId = crypto.randomUUID();
  }

  const normalizedExp: Experience = {
    ...exp,
    id: assignedId,
    company: exp.company || 'Enterprise Organization',
    role: exp.role || 'Software Engineer',
    location: exp.location || 'Bangalore, India',
    start_date: exp.start_date || '2025',
    end_date: exp.end_date || 'Present',
    is_current: exp.is_current ?? false,
    display_order: exp.display_order ?? store.experiences.length + 1,
    is_published: exp.is_published ?? true,
    tags: Array.isArray(exp.tags) ? exp.tags : [],
    bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
  };

  const index = store.experiences.findIndex((e) => e.id === normalizedExp.id);
  if (index >= 0) {
    store.experiences[index] = normalizedExp;
  } else {
    store.experiences.push(normalizedExp);
  }
  persistLocalStore(store);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let supabaseExpId = normalizedExp.id;
      if (!uuidRegex.test(supabaseExpId)) {
        supabaseExpId = crypto.randomUUID();
        normalizedExp.id = supabaseExpId;
        store.experiences[index >= 0 ? index : store.experiences.length - 1] = normalizedExp;
        persistLocalStore(store);
      }
      const { bullets, ...expData } = normalizedExp;
      await supabaseAdmin.from('experiences').upsert({ ...expData, id: supabaseExpId });
      if (bullets && bullets.length > 0) {
        await supabaseAdmin.from('experience_bullets').delete().eq('experience_id', supabaseExpId);
        const bulletInserts = bullets.map((content, idx) => ({
          experience_id: supabaseExpId,
          content,
          display_order: idx + 1,
        }));
        await supabaseAdmin.from('experience_bullets').insert(bulletInserts);
      }
    } catch (e) {
      console.warn('Error saving experience to Supabase:', e);
    }
  }
  return normalizedExp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.experiences = store.experiences.filter((e) => e.id !== id);
  persistLocalStore(store);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('experiences').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting experience in Supabase:', e);
    }
  }
  return true;
}

export async function saveProject(project: Project): Promise<Project> {
  const store = getLocalStore();
  const index = store.projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    store.projects[index] = project;
  } else {
    store.projects.push(project);
  }
  persistLocalStore(store);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('projects').upsert(project);
    } catch (e) {
      console.warn('Error saving project to Supabase:', e);
    }
  }
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  persistLocalStore(store);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting project in Supabase:', e);
    }
  }
  return true;
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  const store = getLocalStore();
  const index = store.skills.findIndex((s) => s.id === skill.id);
  if (index >= 0) {
    store.skills[index] = skill;
  } else {
    store.skills.push(skill);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('skills').upsert(skill);
    } catch (e) {
      console.warn('Error saving skill to Supabase:', e);
    }
  }
  return skill;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.skills = store.skills.filter((s) => s.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('skills').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting skill in Supabase:', e);
    }
  }
  return true;
}

export async function saveEducation(edu: Education): Promise<Education> {
  const store = getLocalStore();
  const index = store.education.findIndex((e) => e.id === edu.id);
  if (index >= 0) {
    store.education[index] = edu;
  } else {
    store.education.push(edu);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('education').upsert(edu);
    } catch (e) {
      console.warn('Error saving education to Supabase:', e);
    }
  }
  return edu;
}

export async function deleteEducation(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.education = store.education.filter((e) => e.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('education').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting education in Supabase:', e);
    }
  }
  return true;
}

export async function saveResearch(res: Research): Promise<Research> {
  const store = getLocalStore();
  const index = store.research.findIndex((r) => r.id === res.id);
  if (index >= 0) {
    store.research[index] = res;
  } else {
    store.research.push(res);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('research').upsert(res);
    } catch (e) {
      console.warn('Error saving research to Supabase:', e);
    }
  }
  return res;
}

export async function deleteResearch(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.research = store.research.filter((r) => r.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('research').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting research in Supabase:', e);
    }
  }
  return true;
}

export async function saveCertification(cert: Certification): Promise<Certification> {
  const store = getLocalStore();
  const index = store.certifications.findIndex((c) => c.id === cert.id);
  if (index >= 0) {
    store.certifications[index] = cert;
  } else {
    store.certifications.push(cert);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('certifications').upsert(cert);
    } catch (e) {
      console.warn('Error saving certification to Supabase:', e);
    }
  }
  return cert;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.certifications = store.certifications.filter((c) => c.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('certifications').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting certification in Supabase:', e);
    }
  }
  return true;
}

export async function saveAchievement(ach: Achievement): Promise<Achievement> {
  const store = getLocalStore();
  const index = store.achievements.findIndex((a) => a.id === ach.id);
  if (index >= 0) {
    store.achievements[index] = ach;
  } else {
    store.achievements.push(ach);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('achievements').upsert(ach);
    } catch (e) {
      console.warn('Error saving achievement to Supabase:', e);
    }
  }
  return ach;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.achievements = store.achievements.filter((a) => a.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('achievements').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting achievement in Supabase:', e);
    }
  }
  return true;
}

export async function saveSocialLink(social: SocialLink): Promise<SocialLink> {
  const store = getLocalStore();
  const index = store.socials.findIndex((s) => s.id === social.id);
  if (index >= 0) {
    store.socials[index] = social;
  } else {
    store.socials.push(social);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('social_links').upsert(social);
    } catch (e) {
      console.warn('Error saving social link to Supabase:', e);
    }
  }
  return social;
}

// ============================================================================
// RESUME MANAGEMENT
// ============================================================================

export async function getResumeFiles(): Promise<ResumeFile[]> {
  const store = getLocalStore();
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from('resume_files').select('*').order('uploaded_at', { ascending: false });
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn('Error fetching resumes from Supabase:', e);
    }
  }
  return store.resumeFiles;
}

export async function addResumeFile(file: Omit<ResumeFile, 'id' | 'uploaded_at'>): Promise<ResumeFile> {
  const store = getLocalStore();
  const newResume: ResumeFile = {
    ...file,
    id: `res-${Date.now()}`,
    uploaded_at: new Date().toISOString(),
  };

  if (newResume.is_active) {
    store.resumeFiles.forEach((f) => (f.is_active = false));
    store.settings.active_resume_url = newResume.file_url;
  }

  store.resumeFiles.unshift(newResume);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      if (newResume.is_active) {
        await supabaseAdmin.from('resume_files').update({ is_active: false }).neq('id', newResume.id);
        await supabaseAdmin.from('site_settings').update({ active_resume_url: newResume.file_url }).eq('id', 'default');
      }
      await supabaseAdmin.from('resume_files').insert(newResume);
    } catch (e) {
      console.warn('Error inserting resume in Supabase:', e);
    }
  }
  return newResume;
}

export async function setActiveResume(id: string): Promise<boolean> {
  const store = getLocalStore();
  const target = store.resumeFiles.find((f) => f.id === id);
  if (!target) return false;

  store.resumeFiles.forEach((f) => (f.is_active = f.id === id));
  store.settings.active_resume_url = target.file_url;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('resume_files').update({ is_active: false }).neq('id', id);
      await supabaseAdmin.from('resume_files').update({ is_active: true }).eq('id', id);
      await supabaseAdmin.from('site_settings').update({ active_resume_url: target.file_url }).eq('id', 'default');
    } catch (e) {
      console.warn('Error updating active resume in Supabase:', e);
    }
  }
  return true;
}

export async function deleteResumeFile(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.resumeFiles = store.resumeFiles.filter((f) => f.id !== id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('resume_files').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting resume in Supabase:', e);
    }
  }
  return true;
}

// ============================================================================
// CONTACT MESSAGES
// ============================================================================

export async function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ContactMessage> {
  const store = getLocalStore();
  const messageRecord: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  store.contactMessages.unshift(messageRecord);

  if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
    try {
      const client = supabaseAdmin || supabase;
      await client?.from('contact_messages').insert(messageRecord);
    } catch (e) {
      console.warn('Error saving contact message to Supabase:', e);
    }
  }
  return messageRecord;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const store = getLocalStore();
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (data) return data;
    } catch (e) {
      console.warn('Error getting contact messages:', e);
    }
  }
  return store.contactMessages;
}

// ============================================================================
// VISITOR SESSIONS & ANALYTICS
// ============================================================================

export async function recordVisitorSession(session: Partial<VisitorSession> & { id: string }): Promise<VisitorSession> {
  const store = getLocalStore();
  const existing = store.visitorSessions.find((s) => s.id === session.id);
  const now = new Date().toISOString();

  let finalSession: VisitorSession;
  if (existing) {
    existing.last_visit = now;
    existing.visit_count += 1;
    finalSession = existing;
  } else {
    finalSession = {
      id: session.id,
      first_visit: now,
      last_visit: now,
      visit_count: 1,
      referrer: session.referrer || 'Direct',
      user_agent: session.user_agent || '',
      device_type: session.device_type || 'Desktop',
      browser: session.browser || 'Browser',
      os: session.os || 'OS',
      country: session.country || 'Global',
    };
    store.visitorSessions.push(finalSession);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('visitor_sessions').upsert(finalSession);
    } catch (e) {
      console.warn('Error saving visitor session to Supabase:', e);
    }
  }
  return finalSession;
}

export async function recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<AnalyticsEvent> {
  const store = getLocalStore();
  const eventRecord: AnalyticsEvent = {
    ...event,
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  store.analyticsEvents.push(eventRecord);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('analytics_events').insert(eventRecord);
    } catch (e) {
      console.warn('Error inserting analytics event to Supabase:', e);
    }
  }
  return eventRecord;
}

export async function getAnalyticsDashboardData() {
  const store = getLocalStore();

  let sessions = store.visitorSessions;
  let events = store.analyticsEvents;
  let contactCount = store.contactMessages.length;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const [{ data: sData }, { data: eData }, { count: cCount }] = await Promise.all([
        supabaseAdmin.from('visitor_sessions').select('*').order('last_visit', { ascending: false }).limit(200),
        supabaseAdmin.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(500),
        supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }),
      ]);
      if (sData) sessions = sData;
      if (eData) events = eData;
      if (typeof cCount === 'number') contactCount = cCount;
    } catch (e) {
      console.warn('Error loading analytics from Supabase:', e);
    }
  }

  const totalVisitors = sessions.length;
  const uniqueVisitors = sessions.length;
  const returningVisitors = sessions.filter((s) => s.visit_count > 1).length;
  const totalPageViews = events.filter((e) => e.event_type === 'page_view').length;
  const totalProjectViews = events.filter((e) => e.event_type === 'project_view').length;
  const totalResumeViews = events.filter((e) => e.event_type === 'resume_view').length;
  const totalGithubClicks = events.filter((e) => e.event_type === 'github_click' || e.event_type === 'project_github_click').length;
  const totalLinkedinClicks = events.filter((e) => e.event_type === 'linkedin_click' || e.event_type === 'project_linkedin_click').length;

  // Breakdown by devices
  const devicesCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const dev = s.device_type || 'Desktop';
    devicesCount[dev] = (devicesCount[dev] || 0) + 1;
  });

  // Breakdown by browsers
  const browsersCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const b = s.browser || 'Unknown';
    browsersCount[b] = (browsersCount[b] || 0) + 1;
  });

  // Breakdown by referrer / source
  const sourcesCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const src = s.referrer || 'Direct';
    sourcesCount[src] = (sourcesCount[src] || 0) + 1;
  });

  // Project clicks breakdown
  const projectClicksMap: Record<string, number> = {};
  events
    .filter((e) => e.event_type === 'project_view' || e.event_type === 'project_github_click')
    .forEach((e) => {
      const title = e.event_data?.project_title || e.event_data?.slug || 'Unknown Project';
      projectClicksMap[title] = (projectClicksMap[title] || 0) + 1;
    });

  return {
    overview: {
      totalVisitors: Math.max(totalVisitors, 1),
      uniqueVisitors: Math.max(uniqueVisitors, 1),
      returningVisitors,
      totalPageViews: Math.max(totalPageViews, 1),
      totalProjectViews,
      totalResumeViews,
      totalContactSubmissions: contactCount,
      totalGithubClicks,
      totalLinkedinClicks,
    },
    devices: Object.entries(devicesCount).map(([name, count]) => ({ name, count })),
    browsers: Object.entries(browsersCount).map(([name, count]) => ({ name, count })),
    sources: Object.entries(sourcesCount).map(([name, count]) => ({ name, count })),
    topProjects: Object.entries(projectClicksMap).map(([title, count]) => ({ title, count })),
    recentSessions: sessions.slice(0, 20),
    recentEvents: events.slice(0, 30),
  };
}

