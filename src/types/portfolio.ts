export interface SiteSettings {
  id: string;
  hero_name: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_title_3: string;
  hero_protocol_tag: string;
  hero_description: string;
  profile_photo_url: string;
  active_resume_url: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  tagline: string;
  status_metric_exp: string;
  status_metric_projects: string;
  status_metric_pubs: string;
  status_metric_awards: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'email' | 'resume_pdf' | string;
  label: string;
  url: string;
  display_order: number;
  is_active: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  display_order: number;
  is_published: boolean;
  tags: string[];
  bullets: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  system_code: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  cover_image: string;
  github_url: string;
  linkedin_url: string;
  live_demo_url: string;
  case_study_url: string;
  display_order: number;
  featured: boolean;
  is_published: boolean;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'AI / ML' | 'LLM ENGINEERING' | 'BACKEND' | 'ML FRAMEWORKS' | 'DATA' | 'ENGINEERING TOOLS' | string;
  icon?: string;
  discipline: string;
  practical_application: string;
  used_in: string;
  engineering_responsibility: string;
  competency_focus: string;
  display_order: number;
  is_published: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  location: string;
  start_year: string;
  end_year: string;
  cgpa: string;
  description: string;
  logo?: string;
  display_order: number;
}

export interface Research {
  id: string;
  title: string;
  publisher: string;
  doi: string;
  paper_url: string;
  doi_url: string;
  areas: string[];
  abstract: string;
  display_order: number;
  is_published: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  display_order: number;
  is_published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  organization: string;
  year: string;
  description: string;
  external_url: string;
  display_order: number;
  is_published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  linkedin?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface VisitorSession {
  id: string;
  first_visit: string;
  last_visit: string;
  visit_count: number;
  referrer?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'project_view'
  | 'project_github_click'
  | 'project_linkedin_click'
  | 'resume_view'
  | 'linkedin_click'
  | 'github_click'
  | 'email_click'
  | 'publication_click'
  | 'contact_submit'
  | 'skill_interaction';

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  event_type: AnalyticsEventType;
  event_data: Record<string, any>;
  created_at: string;
}

export interface ResumeFile {
  id: string;
  file_name: string;
  storage_path: string;
  file_url: string;
  file_size: number;
  is_active: boolean;
  uploaded_at: string;
}

export interface PortfolioData {
  settings: SiteSettings;
  socials: SocialLink[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  research: Research[];
  certifications: Certification[];
  achievements: Achievement[];
  metrics: {
    total_views: number;
    resume_views: number;
    project_clicks: number;
    uptime_seconds: number;
  };
}

