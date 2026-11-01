import React from 'react';
import { getPortfolioData } from '@/lib/db';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { StatusMetrics } from '@/components/StatusMetrics';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ResearchSection } from '@/components/ResearchSection';
import { CredentialsSection } from '@/components/CredentialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export const revalidate = 0; // Dynamic data
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <ThemeProvider>
      <AnalyticsTracker />
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          {/* 1. HERO */}
          <Hero settings={data.settings} />

          {/* 2. STATUS METRICS */}
          <StatusMetrics
            metrics={{
              exp: data.settings.status_metric_exp,
              projects: data.settings.status_metric_projects,
              pubs: data.settings.status_metric_pubs,
              awards: data.settings.status_metric_awards,
              totalViews: data.metrics.total_views,
            }}
          />

          {/* 3. ABOUT */}
          <AboutSection />

          {/* 4. PROJECTS */}
          <ProjectsSection projects={data.projects} />

          {/* 5. EXPERIENCE */}
          <ExperienceSection experiences={data.experiences} />

          {/* 6. SKILLS */}
          <SkillsSection skills={data.skills} />

          {/* 7. RESEARCH */}
          <ResearchSection research={data.research} />

          {/* 8. CERTIFICATIONS, ACHIEVEMENTS, EDUCATION */}
          <CredentialsSection
            certifications={data.certifications}
            achievements={data.achievements}
            education={data.education}
          />

          {/* 9. CONTACT */}
          <ContactSection />
        </main>

        {/* 10. FOOTER & SOCIALS */}
        <Footer socials={data.socials} tagline={data.settings.tagline} />
      </div>
    </ThemeProvider>
  );
}
