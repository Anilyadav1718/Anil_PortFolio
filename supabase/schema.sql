-- ============================================================================
-- ANIL PANCHITHA PORTFOLIO - SUPABASE DATABASE SCHEMA
-- Retro Engineering OS × Next.js Dynamic Portfolio
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SITE SETTINGS
create table if not exists site_settings (
  id text primary key default 'default',
  hero_name text not null default 'ANIL_PANCHITHA //',
  hero_title_1 text not null default 'AI & ML',
  hero_title_2 text not null default 'SYSTEMS',
  hero_title_3 text not null default 'ENGINEER',
  hero_protocol_tag text not null default '[ INITIALIZING PROTOCOL... ]',
  hero_description text not null default 'Software Engineer with experience at Cisco Systems, specializing in Python, Generative AI, LLMs, RAG, Machine Learning, APIs and AI-driven automation.',
  profile_photo_url text default '/portrait_01.jpg',
  active_resume_url text default '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
  location text default 'Hyderabad, India',
  email text default 'anilpanchitha@gmail.com',
  github_url text default 'https://github.com/anilpanchitha',
  linkedin_url text default 'https://linkedin.com/in/anilpanchitha',
  tagline text default 'BUILDING INTELLIGENT SYSTEMS FOR REAL-WORLD PROBLEMS.',
  status_metric_exp text default '01',
  status_metric_projects text default '02',
  status_metric_pubs text default '01',
  status_metric_awards text default '01',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SOCIAL LINKS
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null, -- github, linkedin, email, resume_pdf
  label text not null,
  url text not null,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. EXPERIENCES
create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  company text not null default 'Cisco Systems',
  role text not null default 'Software Engineer',
  location text not null default 'Bangalore, India',
  start_date text not null default 'August 2025',
  end_date text not null default 'August 2026',
  is_current boolean default false,
  display_order int default 0,
  is_published boolean default true,
  tags text[] default array['Python', 'Generative AI', 'LLMs', 'RAG', 'REST APIs', 'Meraki', 'ServiceNow'],
  created_at timestamptz default now()
);

-- 4. EXPERIENCE BULLETS
create table if not exists experience_bullets (
  id uuid primary key default uuid_generate_v4(),
  experience_id uuid references experiences(id) on delete cascade,
  content text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 5. PROJECTS
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text not null,
  system_code text default 'PROJECT_ALPHA',
  description text not null,
  problem text,
  solution text,
  impact text,
  cover_image text,
  github_url text,
  linkedin_url text,
  live_demo_url text,
  case_study_url text,
  display_order int default 0,
  featured boolean default false,
  is_published boolean default true,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- 6. PROJECT LINKS
create table if not exists project_links (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  label text not null,
  url text not null,
  type text default 'link',
  created_at timestamptz default now()
);

-- 7. SKILLS
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null, -- AI / ML, LLM ENGINEERING, BACKEND, ML FRAMEWORKS, DATA, ENGINEERING TOOLS
  icon text,
  discipline text not null,
  practical_application text not null,
  used_in text not null,
  engineering_responsibility text not null,
  competency_focus text not null,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 8. PROJECT SKILLS (many-to-many junction)
create table if not exists project_skills (
  project_id uuid references projects(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  primary key (project_id, skill_id)
);

-- 9. EDUCATION
create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  institution text not null default 'Institute of Aeronautical Engineering',
  degree text not null default 'B.Tech',
  field_of_study text not null default 'Data Science',
  location text not null default 'Hyderabad, India',
  start_year text not null default '2021',
  end_year text not null default '2024',
  cgpa text not null default '7.34',
  description text default 'Comprehensive curriculum focusing on Data Science, Machine Learning, Statistical Analysis, Algorithms and Deep Learning architectures.',
  logo text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 10. RESEARCH
create table if not exists research (
  id uuid primary key default uuid_generate_v4(),
  title text not null default 'Diabetic Retinopathy Detection Using Deep Learning',
  publisher text not null default 'Springer — ICATECS 2024/2025',
  doi text not null default '10.1007/978-3-031-94283-9_21',
  paper_url text default 'https://doi.org/10.1007/978-3-031-94283-9_21',
  doi_url text default 'https://doi.org/10.1007/978-3-031-94283-9_21',
  areas text[] default array['EfficientNet-B1', 'Transfer Learning', 'IDRiD Dataset', 'ResNet50', 'InceptionResNetV2', 'Grad-CAM', 'Explainable AI'],
  abstract text default 'Evaluated transfer learning deep learning models for automated diabetic retinopathy classification and grading using the IDRiD dataset. Integrated Grad-CAM explainable AI to visualize pathological retinal lesions.',
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 11. CERTIFICATIONS
create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text not null,
  issue_date text,
  credential_url text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 12. ACHIEVEMENTS
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text not null,
  organization text not null,
  year text default '2026',
  description text,
  external_url text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 13. CONTACT MESSAGES
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  linkedin text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 14. VISITOR SESSIONS
create table if not exists visitor_sessions (
  id text primary key, -- anonymous session UUID
  first_visit timestamptz default now(),
  last_visit timestamptz default now(),
  visit_count int default 1,
  referrer text,
  user_agent text,
  device_type text,
  browser text,
  os text,
  country text default 'Global',
  created_at timestamptz default now()
);

-- 15. ANALYTICS EVENTS
create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  session_id text,
  event_type text not null, -- page_view, project_view, project_github_click, project_linkedin_click, resume_view, linkedin_click, github_click, email_click, publication_click, contact_submit, skill_interaction
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 16. RESUME FILES
create table if not exists resume_files (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null,
  file_url text not null,
  file_size bigint default 0,
  is_active boolean default true,
  uploaded_at timestamptz default now()
);

-- 17. ADMIN USERS
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  passcode_hash text not null,
  created_at timestamptz default now()
);

-- ============================================================================
-- INDEXES FOR FAST RETRIEVAL & ANALYTICS
-- ============================================================================
create index if not exists idx_projects_order on projects(display_order);
create index if not exists idx_experiences_order on experiences(display_order);
create index if not exists idx_skills_category on skills(category, display_order);
create index if not exists idx_analytics_event_type on analytics_events(event_type, created_at desc);
create index if not exists idx_analytics_session on analytics_events(session_id);
create index if not exists idx_contact_messages_date on contact_messages(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table experiences enable row level security;
alter table experience_bullets enable row level security;
alter table projects enable row level security;
alter table project_links enable row level security;
alter table skills enable row level security;
alter table project_skills enable row level security;
alter table education enable row level security;
alter table research enable row level security;
alter table certifications enable row level security;
alter table achievements enable row level security;
alter table contact_messages enable row level security;
alter table visitor_sessions enable row level security;
alter table analytics_events enable row level security;
alter table resume_files enable row level security;
alter table admin_users enable row level security;

-- Public READ access for published portfolio content
create policy "Allow public read site_settings" on site_settings for select using (true);
create policy "Allow public read social_links" on social_links for select using (is_active = true);
create policy "Allow public read experiences" on experiences for select using (is_published = true);
create policy "Allow public read experience_bullets" on experience_bullets for select using (true);
create policy "Allow public read projects" on projects for select using (is_published = true);
create policy "Allow public read project_links" on project_links for select using (true);
create policy "Allow public read skills" on skills for select using (is_published = true);
create policy "Allow public read education" on education for select using (true);
create policy "Allow public read research" on research for select using (is_published = true);
create policy "Allow public read certifications" on certifications for select using (is_published = true);
create policy "Allow public read achievements" on achievements for select using (is_published = true);
create policy "Allow public read resume_files" on resume_files for select using (is_active = true);

-- Public INSERT for contact form and anonymous analytics
create policy "Allow public insert contact_messages" on contact_messages for insert with check (true);
create policy "Allow public insert visitor_sessions" on visitor_sessions for insert with check (true);
create policy "Allow public update visitor_sessions" on visitor_sessions for update using (true);
create policy "Allow public insert analytics_events" on analytics_events for insert with check (true);

-- Storage bucket for resume files
insert into storage.buckets (id, name, public) 
values ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

create policy "Public Access to Resumes" on storage.objects for select using (bucket_id = 'resumes');
create policy "Allow Service Upload to Resumes" on storage.objects for insert with check (bucket_id = 'resumes');

