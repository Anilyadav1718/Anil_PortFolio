-- ============================================================================
-- HIGH-PERFORMANCE DATABASE INDEXES FOR ADMIN CMS & LIVE TELEMETRY
-- Reduces query latency from seconds to milliseconds
-- ============================================================================

-- Experiences
create index if not exists idx_experiences_order on experiences(display_order);
create index if not exists idx_experiences_published on experiences(is_published);
create index if not exists idx_experience_bullets_exp_id on experience_bullets(experience_id, display_order);

-- Projects
create index if not exists idx_projects_order on projects(display_order);
create index if not exists idx_projects_published on projects(is_published);
create index if not exists idx_projects_slug on projects(slug);

-- Skills
create index if not exists idx_skills_category on skills(category, display_order);
create index if not exists idx_skills_published on skills(is_published);

-- Education & Research & Certifications & Achievements
create index if not exists idx_education_order on education(display_order);
create index if not exists idx_research_order on research(display_order);
create index if not exists idx_research_published on research(is_published);
create index if not exists idx_certifications_order on certifications(display_order);
create index if not exists idx_certifications_published on certifications(is_published);
create index if not exists idx_achievements_order on achievements(display_order);
create index if not exists idx_achievements_published on achievements(is_published);
create index if not exists idx_social_links_order on social_links(display_order);
create index if not exists idx_social_links_active on social_links(is_active);

-- Resumes
create index if not exists idx_resume_files_active on resume_files(is_active, uploaded_at desc);

-- Real-time Telemetry & Visitors
create index if not exists idx_visitor_sessions_last_visit on visitor_sessions(last_visit desc);
create index if not exists idx_analytics_event_type on analytics_events(event_type, created_at desc);
create index if not exists idx_analytics_session on analytics_events(session_id);

-- Contact Inquiries
create index if not exists idx_contact_messages_date on contact_messages(created_at desc);
create index if not exists idx_contact_messages_is_read on contact_messages(is_read, created_at desc);
