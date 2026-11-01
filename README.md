# Anil_PortFolio // Engineering Operating System

> **Software Engineer | AI/ML | Generative AI | LLMs | RAG | Python | FastAPI**  
> Hyderabad, India · Cisco Systems

A production-ready technical portfolio styled as a retro engineering operating system with dual theme support (`LIGHT_OS` and `DARK_OS`), real-time analytics, modular architecture, and headless CMS capabilities.

---

## Architecture Overview

```
My_PortFolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/        # Visitor session telemetry & metric tracking
│   │   │   ├── contact/          # Inbound message processing
│   │   │   ├── content/          # Dynamic portfolio content serving
│   │   │   ├── resume/           # Dynamic PDF resume routing & download tracking
│   │   │   └── revalidate/       # On-demand cache invalidation
│   │   ├── globals.css           # CRT scanlines, grid styling, retro UI tokens
│   │   ├── layout.tsx            # Global metadata, SEO, and font configuration
│   │   ├── page.tsx              # Force-dynamic server component composition
│   │   ├── robots.ts             # SEO robots policy
│   │   └── sitemap.ts            # Dynamic search engine sitemap
│   ├── components/
│   │   ├── AboutSection.tsx      # Terminal-style profile & technical background
│   │   ├── AnalyticsTracker.tsx  # Client-side anonymous telemetry tracker
│   │   ├── CommandTerminal.tsx   # Interactive CLI terminal (`help`, `projects`, etc.)
│   │   ├── ContactSection.tsx    # Monospace dispatch form with validation
│   │   ├── CredentialsSection.tsx# Certifications, Hackathon accolades, Education
│   │   ├── ExperienceSection.tsx # Chronological Cisco & engineering history
│   │   ├── Footer.tsx            # System kernel info and verified social links
│   │   ├── Hero.tsx              # CRT typewriting hero with primary CTAs
│   │   ├── Navbar.tsx            # System uptime ticker, clock, dual-theme switcher
│   │   ├── ProjectsSection.tsx   # Detailed modal case studies (Medha AI, FarmerVerify AI)
│   │   ├── SkillsSection.tsx     # Filterable engineering stack with SVG icons
│   │   ├── StatusMetrics.tsx     # Dynamic KPI counters
│   │   ├── ThemeProvider.tsx     # LIGHT_OS / DARK_OS local persistence
│   │   └── ViewportReveal.tsx    # Intersection observer reveal effects
│   ├── lib/
│   │   ├── analytics.ts          # Client telemetry dispatch helper
│   │   ├── db.ts                 # Dual Supabase / local JSON storage layer
│   │   ├── initialData.ts        # Default structured seed data
│   │   └── supabase.ts           # Supabase client instantiation
│   └── types/
│       └── portfolio.ts          # TypeScript type definitions
├── scripts/
│   └── postbuild.js              # Next.js App Router chunk mirror & manifest sync
├── supabase/
│   └── schema.sql                # Complete PostgreSQL & pgvector schema
└── vercel.json                   # Production headers & cache policy
```

---

## Key Features

- **Dual Technical Theme**: Switch seamlessly between `LIGHT_OS` (warm technical off-white `#F5F4F0` with orange `#E9470B` and cyan `#25BFD0` accents) and `DARK_OS` (deep slate `#09090A` with subtle CRT scanlines and engineering grid).
- **Interactive Terminal**: Built-in CLI command emulator supporting `help`, `skills`, `projects`, `hackathons`, `contact`, `clear`, and `matrix`.
- **Verified Experience**: Software Engineer at Cisco Systems (August 2025 – August 2026), featuring enterprise GenAI, RAG, Python automation, and Meraki / ServiceNow integrations.
- **Featured Projects**:
  - **Medha AI**: Full-stack Agentic AI platform featuring Gemini + Groq fallback, Tavily real-time web search, multimodal image intelligence, and Hybrid RAG with Supabase `pgvector`.
  - **FarmerVerify AI**: Multimodal agricultural fraud verification engine and hackathon winner.
- **Decoupled Architecture**: Clean public portfolio with zero exposed administrative endpoints, paired with an independent standalone CMS workstation (`portfolio-admin`).
- **Telemetry & Visitor Analytics**: Automated visitor tracking, page view counters, and resume view telemetry.

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v18.18.0 or higher
- **npm** / **yarn** / **pnpm**

### 2. Installation

```bash
git clone https://github.com/Anilyadav1718/Anil_PortFolio.git
cd Anil_PortFolio
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# SUPABASE CONFIGURATION (Optional - falls back to local JSON store if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PASSCODE (Used for admin workstation verification)
ADMIN_PASSCODE=your-secure-admin-passcode

# APP PRODUCTION URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Test

```bash
npx tsc --noEmit
npm run build
npm start
```

---

## Author

**Anil Panchitha**  
- **LinkedIn**: [anil-panchitha-507694241](https://www.linkedin.com/in/anil-panchitha-507694241/)  
- **GitHub**: [@Anilyadav1718](https://github.com/Anilyadav1718)  
- **Email**: [imanilyadav12@gmail.com](mailto:imanilyadav12@gmail.com)  
