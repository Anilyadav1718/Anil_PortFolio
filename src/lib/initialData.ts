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
  ResumeFile,
} from '@/types/portfolio';

export const initialSiteSettings: SiteSettings = {
  id: 'default',
  hero_name: 'ANIL_PANCHITHA //',
  hero_title_1: 'AI & ML',
  hero_title_2: 'SYSTEMS',
  hero_title_3: 'ENGINEER',
  hero_protocol_tag: '[ INITIALIZING PROTOCOL... ]',
  hero_description:
    'Software Engineer with experience at Cisco Systems, specializing in Python, Generative AI, LLMs, RAG, Machine Learning, APIs and AI-driven automation.',
  profile_photo_url: '/portrait_01.jpg',
  active_resume_url: '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
  location: 'Hyderabad, India',
  email: 'imanilyadav12@gmail.com',
  github_url: 'https://github.com/Anilyadav1718',
  linkedin_url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
  tagline: 'BUILDING INTELLIGENT SYSTEMS FOR REAL-WORLD PROBLEMS.',
  status_metric_exp: '01',
  status_metric_projects: '03',
  status_metric_pubs: '01',
  status_metric_awards: '01',
};

export const initialSocials: SocialLink[] = [
  {
    id: 'soc-1',
    platform: 'github',
    label: '[ GITHUB ]',
    url: 'https://github.com/Anilyadav1718',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'soc-2',
    platform: 'linkedin',
    label: '[ LINKEDIN ]',
    url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'soc-3',
    platform: 'email',
    label: '[ EMAIL ]',
    url: 'mailto:imanilyadav12@gmail.com',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'soc-4',
    platform: 'resume_pdf',
    label: '[ RESUME_PDF ]',
    url: '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
    display_order: 4,
    is_active: true,
  },
];

export const initialExperiences: Experience[] = [
  {
    id: 'exp-cisco',
    company: 'Cisco Systems',
    role: 'Software Engineer',
    location: 'Bangalore, India',
    start_date: 'August 2025',
    end_date: 'August 2026',
    is_current: false,
    display_order: 1,
    is_published: true,
    tags: [
      'Python',
      'Generative AI',
      'LLMs',
      'RAG',
      'REST APIs',
      'Meraki',
      'ServiceNow',
    ],
    bullets: [
      'Built and supported GenAI and RAG-based enterprise knowledge solutions using Python, LLMs, embeddings and vector retrieval.',
      'Developed Python and REST API automation integrating Cisco Meraki APIs and ServiceNow workflows.',
      'Supported enterprise automation for Hilton and Wells Fargo including validation, configuration, reporting and notifications.',
      'Performed production troubleshooting, debugging and root-cause analysis across automation and AI-assisted workflows.',
    ],
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-farmerverify',
    slug: 'farmerverify-ai',
    title: 'FarmerVerify AI',
    subtitle: 'AI-Powered Document Verification System',
    system_code: 'PROJECT_ALPHA // FARMERVERIFY_AI',
    description:
      'Automated multimodal document processing system utilizing OCR preprocessing, GPT-4.1 Vision, embeddings, vector search and structured validation pipelines for tamper-proof verification.',
    problem:
      'Manual agricultural onboarding and loan documentation required up to 14 days of tedious manual scrutiny across varied formats, regional languages, and degraded document scans.',
    solution:
      'Engineered an end-to-end multimodal pipeline combining OCR text extraction, vision-language model parsing, embedding-based semantic cross-referencing, and rule-based fraud detection.',
    impact:
      'Reduced onboarding time from 14 days to less than 2 hours with automated compliance checks and audit logging.',
    cover_image: '',
    github_url: 'https://github.com/Anilyadav1718',
    linkedin_url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
    live_demo_url: 'https://farmerverify-ai.vercel.app',
    case_study_url: '#farmerverify-case-study',
    display_order: 1,
    featured: true,
    is_published: true,
    tags: [
      'Python',
      'LLMs',
      'RAG',
      'FastAPI',
      'GPT-4.1 Vision',
      'NLP',
      'OCR',
      'Embeddings',
      'Vector Search',
      'REST APIs',
    ],
  },
  {
    id: 'proj-medha-ai',
    slug: 'medha-ai',
    title: 'Medha AI',
    subtitle: '🧠 Agentic AI · Multimodal Intelligence · Hybrid RAG · Real-Time Web Search',
    system_code: 'PROJECT_BETA // MEDHA_AI [AGENTIC_PLATFORM]',
    description:
      'Full-stack intelligent AI assistant combining multi-provider LLM routing (Gemini + Groq fallback), real-time Tavily web intelligence, multimodal vision understanding, document Hybrid RAG with Supabase pgvector, response caching, and persistent conversation memory.',
    problem:
      'Standard chat interfaces suffer from single-provider rate limits, outdated static training cutoffs, inability to ground reasoning on private PDF documents, and redundant costly LLM API invocations.',
    solution:
      'Architected a resilient provider-routing pipeline with automatic Groq fallback, on-demand Tavily web searching, a Supabase pgvector Hybrid RAG pipeline for PDF document extraction, Gemini multimodal vision parsing, and an intelligent Supabase-backed response cache.',
    impact:
      'Engineered an end-to-end autonomous assistant delivering sub-second cached responses, continuous uptime through provider failover, and accurate document-grounded answers without hallucination.',
    cover_image: '',
    github_url: 'https://github.com/Anilyadav1718/medha-ai',
    linkedin_url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
    live_demo_url: 'https://medha-ai-seven.vercel.app/',
    case_study_url: '#medha-ai-case-study',
    display_order: 2,
    featured: true,
    is_published: true,
    tags: [
      'Agentic AI',
      'Hybrid RAG',
      'Multimodal Vision',
      'Gemini API',
      'Groq Fallback',
      'Tavily Web Search',
      'Supabase pgvector',
      'Next.js',
      'TypeScript',
      'Response Caching',
    ],
  },
  {
    id: 'proj-cms-assistant',
    slug: 'cms-ai-assistant',
    title: 'CMS AI Assistant',
    subtitle: 'Enterprise GenAI Knowledge Assistant',
    system_code: 'PROJECT_GAMMA // ENTERPRISE_RAG',
    description:
      'Enterprise knowledge retrieval assistant leveraging LangChain, vector embeddings in ChromaDB, semantic search, reranking mechanisms, and grounded response synthesis for technical documentation.',
    problem:
      'Enterprise engineers spent excessive manual hours navigating distributed technical repositories and configuration manuals to resolve complex troubleshooting incidents.',
    solution:
      'Architected a RAG pipeline utilizing document chunking strategies, dense vector embeddings in ChromaDB, semantic reranking, and grounded response generation with source citations.',
    impact:
      'Accelerated incident triage and knowledge accessibility across engineering documentation repositories with hallucination-checked outputs.',
    cover_image: '',
    github_url: 'https://github.com/Anilyadav1718',
    linkedin_url: 'https://www.linkedin.com/in/anil-panchitha-507694241/',
    live_demo_url: '',
    case_study_url: '#cms-case-study',
    display_order: 3,
    featured: false,
    is_published: true,
    tags: [
      'LangChain',
      'RAG',
      'ChromaDB',
      'Embeddings',
      'Semantic Retrieval',
      'Reranking',
      'Python',
    ],
  },
];

export const initialSkills: Skill[] = [
  // AI / ML
  {
    id: 'sk-ml',
    name: 'Machine Learning',
    category: 'AI / ML',
    icon: 'Cpu',
    discipline: 'Applied Statistical Modeling & Predictive Systems',
    practical_application:
      'Supervised and unsupervised classification, regression, and clustering pipelines.',
    used_in: 'Enterprise risk assessment, anomaly detection, automated verification.',
    engineering_responsibility:
      'Architecting reproducible training, feature engineering, and cross-validation pipelines.',
    competency_focus: 'Model selection, bias-variance tradeoff, evaluation metrics.',
    display_order: 1,
    is_published: true,
  },
  {
    id: 'sk-dl',
    name: 'Deep Learning',
    category: 'AI / ML',
    icon: 'Layers',
    discipline: 'Neural Network Architectures & Representation Learning',
    practical_application:
      'Convolutional and sequence networks for computer vision and unstructured data.',
    used_in: 'Diabetic retinopathy detection, image classification, Grad-CAM interpretability.',
    engineering_responsibility:
      'Design, hyperparameter tuning, transfer learning, and gradient inspection.',
    competency_focus: 'CNN backbones, loss functions, optimization, gradient stability.',
    display_order: 2,
    is_published: true,
  },
  {
    id: 'sk-nlp',
    name: 'NLP',
    category: 'AI / ML',
    icon: 'FileText',
    discipline: 'Natural Language Processing & Text Understanding',
    practical_application:
      'Tokenization, syntax parsing, semantic similarity, and document categorization.',
    used_in: 'Document parsing in FarmerVerify AI, sentiment and intent extraction.',
    engineering_responsibility:
      'Building robust text preprocessing, token-level extraction, and entity recognition.',
    competency_focus: 'Embeddings, attention mechanisms, language representation.',
    display_order: 3,
    is_published: true,
  },
  {
    id: 'sk-genai',
    name: 'Generative AI',
    category: 'AI / ML',
    icon: 'Sparkles',
    discipline: 'Generative Modeling & Multimodal Intelligence',
    practical_application:
      'Synthesizing context-aware text, document interpretation, multimodal reasoning.',
    used_in: 'FarmerVerify AI document audit, enterprise synthesis engines.',
    engineering_responsibility:
      'Integrating frontier LLM APIs with structured schemas and deterministic output validation.',
    competency_focus: 'Multimodal grounding, temperature tuning, synthetic reasoning.',
    display_order: 4,
    is_published: true,
  },
  {
    id: 'sk-llms',
    name: 'LLMs',
    category: 'AI / ML',
    icon: 'Bot',
    discipline: 'Large Language Model Engineering',
    practical_application:
      'Instruction tuning, context window orchestration, tool calling, JSON schema enforcement.',
    used_in: 'Automated decision engines, technical doc assistants, agentic routines.',
    engineering_responsibility:
      'Designing deterministic prompt contracts, schema enforcement, latency optimization.',
    competency_focus: 'Context management, inference optimization, output guardrails.',
    display_order: 5,
    is_published: true,
  },
  {
    id: 'sk-rag',
    name: 'RAG',
    category: 'AI / ML',
    icon: 'Search',
    discipline: 'Retrieval-Augmented Generation Architecture',
    practical_application:
      'Dense vector retrieval, document chunking, hybrid keyword/semantic search, context injection.',
    used_in: 'CMS AI Assistant, enterprise internal documentation query engines.',
    engineering_responsibility:
      'Building end-to-end ingest pipelines, chunking heuristics, vector index tuning, reranking.',
    competency_focus: 'Chunking strategies, embedding distance metrics, factual grounding.',
    display_order: 6,
    is_published: true,
  },
  {
    id: 'sk-prompt',
    name: 'Prompt Engineering',
    category: 'AI / ML',
    icon: 'Terminal',
    discipline: 'Systemic Prompt Design & Context Calibration',
    practical_application:
      'Few-shot prompting, chain-of-thought elicitation, structured output enforcement.',
    used_in: 'Document validation pipelines, enterprise QA bots.',
    engineering_responsibility:
      'Creating versioned, unit-tested prompt templates with rigorous JSON output guarantees.',
    competency_focus: 'Few-shot exemplar design, hallucination minimization, prompt evaluation.',
    display_order: 7,
    is_published: true,
  },

  // LLM ENGINEERING
  {
    id: 'sk-langchain',
    name: 'LangChain',
    category: 'LLM ENGINEERING',
    icon: 'Workflow',
    discipline: 'LLM Application Framework & Chains',
    practical_application:
      'Chaining retrievers, prompt templates, output parsers, and custom tool callbacks.',
    used_in: 'CMS AI Assistant retrieval pipeline and agentic query workflows.',
    engineering_responsibility:
      'Constructing robust modular chains, error handling fallbacks, memory handlers.',
    competency_focus: 'Modular chain design, memory management, LCEL expressions.',
    display_order: 8,
    is_published: true,
  },
  {
    id: 'sk-openai',
    name: 'OpenAI API',
    category: 'LLM ENGINEERING',
    icon: 'Zap',
    discipline: 'Commercial LLM Integration & Inference',
    practical_application:
      'Integrating GPT-4o, GPT-4.1 Vision, embeddings, structured outputs, function calling.',
    used_in: 'Multimodal image auditing in FarmerVerify AI, reasoning pipelines.',
    engineering_responsibility:
      'Managing API rate limits, streaming responses, exponential backoff, token budgeting.',
    competency_focus: 'Token management, structured JSON schema outputs, streaming UX.',
    display_order: 9,
    is_published: true,
  },
  {
    id: 'sk-chromadb',
    name: 'ChromaDB',
    category: 'LLM ENGINEERING',
    icon: 'Database',
    discipline: 'Vector Database & Embedding Storage',
    practical_application:
      'Persistent vector indexing, metadata filtering, cosine similarity distance lookups.',
    used_in: 'CMS AI Assistant vector knowledge base.',
    engineering_responsibility:
      'Configuring persistent collections, indexing configurations, fast nearest-neighbor queries.',
    competency_focus: 'Vector index maintenance, metadata querying, batch upserts.',
    display_order: 10,
    is_published: true,
  },
  {
    id: 'sk-embeddings',
    name: 'Embeddings',
    category: 'LLM ENGINEERING',
    icon: 'Fingerprint',
    discipline: 'Dense Vector Representation',
    practical_application:
      'Text and document embedding generation using text-embedding-3-small and open-source models.',
    used_in: 'Semantic similarity matching, duplicate document detection, retrieval.',
    engineering_responsibility:
      'Selecting appropriate dimensional representations, normalizing vectors, measuring cosine similarity.',
    competency_focus: 'High-dimensional geometry, semantic clustering, metric optimization.',
    display_order: 11,
    is_published: true,
  },
  {
    id: 'sk-vector-search',
    name: 'Vector Search',
    category: 'LLM ENGINEERING',
    icon: 'Compass',
    discipline: 'Approximate Nearest Neighbor (ANN) Retrieval',
    practical_application:
      'Fast semantic lookups across multi-thousand chunk repositories.',
    used_in: 'Knowledge retrieval and cross-document verification.',
    engineering_responsibility:
      'Tuning top-k parameters, threshold filtering, similarity calibration.',
    competency_focus: 'ANN indexing, similarity thresholds, recall optimization.',
    display_order: 12,
    is_published: true,
  },
  {
    id: 'sk-reranking',
    name: 'Reranking',
    category: 'LLM ENGINEERING',
    icon: 'SlidersHorizontal',
    discipline: 'Post-Retrieval Relevance Optimization',
    practical_application:
      'Cross-encoder reranking to prioritize highest-relevance context chunks prior to generation.',
    used_in: 'Enterprise document search pipelines.',
    engineering_responsibility:
      'Implementing second-stage ranking to maximize context relevance within limited token windows.',
    competency_focus: 'Cross-encoder scoring, MRR optimization, context compaction.',
    display_order: 13,
    is_published: true,
  },

  // BACKEND
  {
    id: 'sk-python',
    name: 'Python',
    category: 'BACKEND',
    icon: 'Code',
    discipline: 'Core Systems & Backend Engineering Language',
    practical_application:
      'High-performance scripting, data pipelines, asynchronous APIs, AI orchestration.',
    used_in: 'Production automation at Cisco, FastAPI microservices, ML model inference.',
    engineering_responsibility:
      'Writing type-hinted, maintainable, object-oriented and async Python adhering to PEP 8.',
    competency_focus: 'Asyncio, typing, generators, memory management, testing with pytest.',
    display_order: 14,
    is_published: true,
  },
  {
    id: 'sk-fastapi',
    name: 'FastAPI',
    category: 'BACKEND',
    icon: 'Gauge',
    discipline: 'Modern Asynchronous Web API Framework',
    practical_application:
      'Building high-throughput REST microservices with automatic OpenAPI generation.',
    used_in: 'FarmerVerify AI backend service, verification endpoints, document processing APIs.',
    engineering_responsibility:
      'Creating Pydantic validation schemas, dependency injection, async request handling.',
    competency_focus: 'Pydantic v2 validation, asynchronous route handlers, OpenAPI contracts.',
    display_order: 15,
    is_published: true,
  },
  {
    id: 'sk-rest-apis',
    name: 'REST APIs',
    category: 'BACKEND',
    icon: 'Network',
    discipline: 'Stateless HTTP API Design & Integration',
    practical_application:
      'Designing predictable HTTP endpoints, status codes, payload contracts, authentication.',
    used_in: 'Cisco Meraki and ServiceNow enterprise integrations, portfolio microservices.',
    engineering_responsibility:
      'Contract-first API development, header management, JSON serialization, security.',
    competency_focus: 'HTTP semantics, idempotency, rate limiting, error responses.',
    display_order: 16,
    is_published: true,
  },
  {
    id: 'sk-json',
    name: 'JSON',
    category: 'BACKEND',
    icon: 'Braces',
    discipline: 'Structured Data Serialization Format',
    practical_application:
      'Payload serialization, schema validation, configuration exchange across services.',
    used_in: 'Inter-service communication, LLM structured schema responses.',
    engineering_responsibility:
      'Validating strict schemas, parsing deeply nested trees, serialization speed.',
    competency_focus: 'Schema specification, zero-copy parsing, serialization performance.',
    display_order: 17,
    is_published: true,
  },

  // ML FRAMEWORKS
  {
    id: 'sk-tensorflow',
    name: 'TensorFlow',
    category: 'ML FRAMEWORKS',
    icon: 'Boxes',
    discipline: 'Deep Learning & Neural Network Framework',
    practical_application:
      'Constructing convolutional networks, transfer learning pipelines, and exportable graphs.',
    used_in: 'Diabetic Retinopathy Detection research model training and evaluation.',
    engineering_responsibility:
      'Designing model graphs, custom data generators, checkpointing, and evaluation.',
    competency_focus: 'Keras Functional API, custom callbacks, tensor manipulation, GPU training.',
    display_order: 18,
    is_published: true,
  },
  {
    id: 'sk-scikit-learn',
    name: 'Scikit-learn',
    category: 'ML FRAMEWORKS',
    icon: 'GitBranch',
    discipline: 'Classical Machine Learning & Statistical Library',
    practical_application:
      'Pipeline creation, preprocessing, cross-validation, dimensionality reduction, classifiers.',
    used_in: 'Feature engineering, baseline modeling, classification metric reporting.',
    engineering_responsibility:
      'Constructing automated scikit-learn Pipelines, ColumnTransformers, model tuning.',
    competency_focus: 'Pipeline composition, feature scaling, model selection metrics.',
    display_order: 19,
    is_published: true,
  },

  // DATA
  {
    id: 'sk-sql',
    name: 'SQL',
    category: 'DATA',
    icon: 'Database',
    discipline: 'Relational Database Query Language',
    practical_application:
      'Complex joins, aggregations, window functions, indexing, and schema design.',
    used_in: 'Supabase PostgreSQL database layer, relational analytics queries.',
    engineering_responsibility:
      'Designing normalized database schemas, writing optimized queries, managing constraints.',
    competency_focus: 'Indexing strategies, relational integrity, execution plan inspection.',
    display_order: 20,
    is_published: true,
  },
  {
    id: 'sk-pandas',
    name: 'Pandas',
    category: 'DATA',
    icon: 'Table',
    discipline: 'Tabular Data Analysis & Transformation',
    practical_application:
      'Data cleaning, feature transformation, tabular inspection, time-series manipulation.',
    used_in: 'Automated reporting pipelines, research dataset preparation and cleaning.',
    engineering_responsibility:
      'Vectorized operations, handling missing data, grouping, merging large dataframes.',
    competency_focus: 'Vectorized computing, memory optimization, exploratory data analysis.',
    display_order: 21,
    is_published: true,
  },
  {
    id: 'sk-numpy',
    name: 'NumPy',
    category: 'DATA',
    icon: 'Grid',
    discipline: 'Numerical & Multidimensional Matrix Computation',
    practical_application:
      'Array slicing, tensor operations, linear algebra computations, image matrix preprocessing.',
    used_in: 'Image matrix transformations in computer vision pipelines, metric calculations.',
    engineering_responsibility:
      'Efficient array manipulation, broadcasting, mathematical operations without loops.',
    competency_focus: 'Broadcasting rules, multidimensional slicing, memory buffer layouts.',
    display_order: 22,
    is_published: true,
  },

  // ENGINEERING TOOLS
  {
    id: 'sk-git',
    name: 'Git',
    category: 'ENGINEERING TOOLS',
    icon: 'GitPullRequest',
    discipline: 'Distributed Version Control & Source Code Management',
    practical_application:
      'Branching workflows, semantic commits, PR reviews, merge conflict resolution.',
    used_in: 'Daily engineering workflows, production repository maintenance.',
    engineering_responsibility:
      'Maintaining clean Git histories, managing feature branches, collaborative PR reviews.',
    competency_focus: 'Git internals, rebasing, release tagging, submodules.',
    display_order: 23,
    is_published: true,
  },
  {
    id: 'sk-postman',
    name: 'Postman',
    category: 'ENGINEERING TOOLS',
    icon: 'Send',
    discipline: 'API Testing & Lifecycle Management',
    practical_application:
      'Automating API regression tests, mocking endpoints, validating authentication tokens.',
    used_in: 'Validating Cisco Meraki API payloads, testing FastAPI endpoints.',
    engineering_responsibility:
      'Constructing environment variables, automated pre-request scripts, test assertions.',
    competency_focus: 'Test collection automation, contract verification, CI integration.',
    display_order: 24,
    is_published: true,
  },
];

export const initialEducation: Education[] = [
  {
    id: 'edu-iare',
    institution: 'Institute of Aeronautical Engineering',
    degree: 'B.Tech',
    field_of_study: 'Data Science',
    location: 'Hyderabad, India',
    start_year: '2021',
    end_year: '2024',
    cgpa: '7.34',
    description:
      'Comprehensive study in Data Science, Machine Learning algorithms, Deep Learning, Statistical Analysis, Algorithms, and Database Architecture.',
    display_order: 1,
  },
];

export const initialResearch: Research[] = [
  {
    id: 'res-springer',
    title: 'Diabetic Retinopathy Detection Using Deep Learning',
    publisher: 'Springer — ICATECS 2024/2025',
    doi: '10.1007/978-3-031-94283-9_21',
    paper_url: 'https://doi.org/10.1007/978-3-031-94283-9_21',
    doi_url: 'https://doi.org/10.1007/978-3-031-94283-9_21',
    areas: [
      'EfficientNet-B1',
      'Transfer Learning',
      'IDRiD Dataset',
      'ResNet50',
      'InceptionResNetV2',
      'Grad-CAM',
      'Explainable AI',
    ],
    abstract:
      'Evaluated deep transfer learning architectures including EfficientNet-B1, ResNet50, and InceptionResNetV2 for automated diabetic retinopathy classification and grading using the Indian Diabetic Retinopathy Image Dataset (IDRiD). Incorporated Grad-CAM visual explanations to highlight pathological microaneurysms and hemorrhages.',
    display_order: 1,
    is_published: true,
  },
];

export const initialCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'NPTEL Data Science Domain Scholar',
    issuer: 'NPTEL / IIT',
    issue_date: 'Verified',
    credential_url: 'https://nptel.ac.in',
    display_order: 1,
    is_published: true,
  },
  {
    id: 'cert-2',
    title: 'Machine Learning Specialization',
    issuer: 'Coursera — DeepLearning.AI & Stanford',
    issue_date: 'Verified',
    credential_url: 'https://coursera.org',
    display_order: 2,
    is_published: true,
  },
  {
    id: 'cert-3',
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google',
    issue_date: 'Verified',
    credential_url: 'https://coursera.org',
    display_order: 3,
    is_published: true,
  },
  {
    id: 'cert-4',
    title: 'IBM Data Science Professional Certificate',
    issuer: 'IBM',
    issue_date: 'Verified',
    credential_url: 'https://coursera.org',
    display_order: 4,
    is_published: true,
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Cisco Tech Hackathon 2026',
    subtitle: 'Winner — You Amaze Award',
    organization: 'Cisco Systems',
    year: '2026',
    description:
      'Awarded top honor for engineering an innovative AI-driven automation pipeline that resolved operational bottlenecks across enterprise workflows.',
    external_url: 'https://cisco.com',
    display_order: 1,
    is_published: true,
  },
  {
    id: 'ach-2',
    title: 'Featured by Cisco',
    subtitle: 'Corporate Spotlight on Cisco LinkedIn and Cisco X',
    organization: 'Cisco Systems',
    year: '2026',
    description:
      'Recognized on Cisco corporate social platforms for technical leadership, dedication, and impactful contributions to GenAI automation.',
    external_url: 'https://linkedin.com/company/cisco',
    display_order: 2,
    is_published: true,
  },
  {
    id: 'ach-3',
    title: 'Executive CX Leadership Recognition',
    subtitle: 'Innovation and Operational Excellence',
    organization: 'Cisco CX Executive Leadership',
    year: '2026',
    description:
      'Commended by CX leadership for spearheading engineering automation and delivering operational stability across enterprise client services.',
    external_url: 'https://cisco.com',
    display_order: 3,
    is_published: true,
  },
];

export const initialResumeFiles: ResumeFile[] = [
  {
    id: 'res-file-1',
    file_name: 'Anil_Panchitha_Software_Engineer_CV.pdf',
    storage_path: 'resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
    file_url: '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
    file_size: 233029,
    is_active: true,
    uploaded_at: '2026-11-01T00:00:00Z',
  },
];

