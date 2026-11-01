-- ============================================================================
-- ANIL PANCHITHA PORTFOLIO - INITIAL SEED DATA
-- ============================================================================

-- Site Settings
insert into site_settings (
  id, hero_name, hero_title_1, hero_title_2, hero_title_3,
  hero_protocol_tag, hero_description, profile_photo_url,
  active_resume_url, location, email, github_url, linkedin_url,
  tagline, status_metric_exp, status_metric_projects,
  status_metric_pubs, status_metric_awards
) values (
  'default',
  'ANIL_PANCHITHA //',
  'AI & ML',
  'SYSTEMS',
  'ENGINEER',
  '[ INITIALIZING PROTOCOL... ]',
  'Software Engineer with experience at Cisco Systems, specializing in Python, Generative AI, LLMs, RAG, Machine Learning, APIs and AI-driven automation.',
  '/portrait_01.jpg',
  '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf',
  'Hyderabad, India',
  'imanilyadav12@gmail.com',
  'https://github.com/Anilyadav1718',
  'https://www.linkedin.com/in/anil-panchitha-507694241/',
  'BUILDING INTELLIGENT SYSTEMS FOR REAL-WORLD PROBLEMS.',
  '01',
  '03',
  '01',
  '01'
) on conflict (id) do update set
  hero_name = excluded.hero_name,
  hero_title_1 = excluded.hero_title_1,
  hero_title_2 = excluded.hero_title_2,
  hero_title_3 = excluded.hero_title_3,
  hero_description = excluded.hero_description,
  profile_photo_url = excluded.profile_photo_url,
  active_resume_url = excluded.active_resume_url;

-- Social Links
insert into social_links (platform, label, url, display_order) values
  ('github', 'GITHUB', 'https://github.com/Anilyadav1718', 1),
  ('linkedin', 'LINKEDIN', 'https://www.linkedin.com/in/anil-panchitha-507694241/', 2),
  ('email', 'EMAIL', 'mailto:imanilyadav12@gmail.com', 3),
  ('resume_pdf', 'RESUME_PDF', '/uploads/resumes/Anil_Panchitha_Software_Engineer_CV.pdf', 4);

-- Cisco Systems Experience
with exp as (
  insert into experiences (
    company, role, location, start_date, end_date, is_current, display_order, is_published, tags
  ) values (
    'Cisco Systems',
    'Software Engineer',
    'Bangalore, India',
    'August 2025',
    'August 2026',
    false,
    1,
    true,
    array['Python', 'Generative AI', 'LLMs', 'RAG', 'REST APIs', 'Meraki', 'ServiceNow']
  ) returning id
)
insert into experience_bullets (experience_id, content, display_order)
select id, 'Built and supported GenAI and RAG-based enterprise knowledge solutions using Python, LLMs, embeddings and vector retrieval.', 1 from exp
union all
select id, 'Developed Python and REST API automation integrating Cisco Meraki APIs and ServiceNow workflows.', 2 from exp
union all
select id, 'Supported enterprise automation for Hilton and Wells Fargo including validation, configuration, reporting and notifications.', 3 from exp
union all
select id, 'Performed production troubleshooting, debugging and root-cause analysis across automation and AI-assisted workflows.', 4 from exp;

-- Projects
insert into projects (
  slug, title, subtitle, system_code, description, problem, solution, impact,
  cover_image, github_url, linkedin_url, live_demo_url, case_study_url, display_order, featured, is_published, tags
) values (
  'farmerverify-ai',
  'FarmerVerify AI',
  'AI-Powered Document Verification System',
  'PROJECT_ALPHA // FARMERVERIFY_AI',
  'Automated multimodal document processing system utilizing OCR preprocessing, GPT-4.1 Vision, embeddings, vector search and structured validation pipelines for tamper-proof verification.',
  'Manual agricultural onboarding and loan documentation required up to 14 days of tedious manual scrutiny across varied formats, languages, and low-quality document scans.',
  'Engineered an end-to-end multimodal pipeline combining OCR text extraction, vision-language model parsing, embedding-based semantic cross-referencing, and rule-based fraud detection.',
  'Reduced onboarding turnaround time from 14 days to less than 2 hours with automated compliance checks and audit logging.',
  '/projects/farmerverify.png',
  'https://github.com/Anilyadav1718',
  'https://www.linkedin.com/in/anil-panchitha-507694241/',
  'https://farmerverify-ai.vercel.app',
  '#case-study-farmerverify',
  1,
  true,
  true,
  array['Python', 'LLMs', 'RAG', 'FastAPI', 'GPT-4.1 Vision', 'NLP', 'OCR', 'Embeddings', 'Vector Search', 'REST APIs']
),
(
  'medha-ai',
  'Medha AI',
  '🧠 Agentic AI · Multimodal Intelligence · Hybrid RAG · Real-Time Web Search',
  'PROJECT_BETA // MEDHA_AI [AGENTIC_PLATFORM]',
  'Full-stack intelligent AI assistant combining multi-provider LLM routing (Gemini + Groq fallback), real-time Tavily web intelligence, multimodal vision understanding, document Hybrid RAG with Supabase pgvector, response caching, and persistent conversation memory.',
  'Standard chat interfaces suffer from single-provider rate limits, outdated static training cutoffs, inability to ground reasoning on private PDF documents, and redundant costly LLM API invocations.',
  'Architected a resilient provider-routing pipeline with automatic Groq fallback, on-demand Tavily web searching, a Supabase pgvector Hybrid RAG pipeline for PDF document extraction, Gemini multimodal vision parsing, and an intelligent Supabase-backed response cache.',
  'Engineered an end-to-end autonomous assistant delivering sub-second cached responses, continuous uptime through provider failover, and accurate document-grounded answers without hallucination.',
  '/projects/medha-ai.png',
  'https://github.com/Anilyadav1718/medha-ai',
  'https://www.linkedin.com/in/anil-panchitha-507694241/',
  'https://medha-ai-seven.vercel.app/',
  '#case-study-medha-ai',
  2,
  true,
  true,
  array['Agentic AI', 'Hybrid RAG', 'Multimodal Vision', 'Gemini API', 'Groq Fallback', 'Tavily Web Search', 'Supabase pgvector', 'Next.js', 'TypeScript', 'Response Caching']
),
(
  'cms-ai-assistant',
  'CMS AI Assistant',
  'Enterprise GenAI Knowledge Assistant',
  'PROJECT_GAMMA // ENTERPRISE_RAG',
  'Enterprise knowledge retrieval assistant leveraging LangChain, vector embeddings in ChromaDB, semantic search, reranking mechanisms, and grounded response synthesis for technical documentation.',
  'Enterprise engineers spent excessive manual hours navigating distributed technical repositories and configuration manuals to resolve complex troubleshooting incidents.',
  'Architected a RAG pipeline utilizing document chunking strategies, dense vector embeddings in ChromaDB, semantic reranking, and grounded response generation with source citations.',
  'Accelerated incident triage and knowledge accessibility across engineering documentation repositories with hallucination-checked outputs.',
  '/projects/cms-assistant.png',
  'https://github.com/Anilyadav1718',
  'https://www.linkedin.com/in/anil-panchitha-507694241/',
  '',
  '#case-study-cms-assistant',
  3,
  false,
  true,
  array['LangChain', 'RAG', 'ChromaDB', 'Embeddings', 'Semantic Retrieval', 'Reranking', 'Python']
);

-- Education
insert into education (
  institution, degree, field_of_study, location, start_year, end_year, cgpa, description, display_order
) values (
  'Institute of Aeronautical Engineering',
  'B.Tech',
  'Data Science',
  'Hyderabad, India',
  '2021',
  '2024',
  '7.34',
  'Specialized in Data Science, Machine Learning algorithms, Deep Learning, Statistical Analysis, Neural Architectures, and Database Systems.',
  1
);

-- Research
insert into research (
  title, publisher, doi, paper_url, doi_url, areas, abstract, display_order, is_published
) values (
  'Diabetic Retinopathy Detection Using Deep Learning',
  'Springer — ICATECS 2024/2025',
  '10.1007/978-3-031-94283-9_21',
  'https://doi.org/10.1007/978-3-031-94283-9_21',
  'https://doi.org/10.1007/978-3-031-94283-9_21',
  array['EfficientNet-B1', 'Transfer Learning', 'IDRiD Dataset', 'ResNet50', 'InceptionResNetV2', 'Grad-CAM', 'Explainable AI'],
  'Evaluated deep transfer learning architectures including EfficientNet-B1, ResNet50, and InceptionResNetV2 for automated diabetic retinopathy classification and grading using the Indian Diabetic Retinopathy Image Dataset (IDRiD). Incorporated Grad-CAM visual explanations to highlight pathological microaneurysms and hemorrhages.',
  1,
  true
);

-- Certifications
insert into certifications (title, issuer, issue_date, credential_url, display_order, is_published) values
  ('NPTEL Data Science Domain Scholar', 'NPTEL / IIT', 'Verified', 'https://nptel.ac.in', 1, true),
  ('Machine Learning Specialization', 'Coursera — DeepLearning.AI & Stanford', 'Verified', 'https://coursera.org', 2, true),
  ('Google Data Analytics Professional Certificate', 'Google', 'Verified', 'https://coursera.org', 3, true),
  ('IBM Data Science Professional Certificate', 'IBM', 'Verified', 'https://coursera.org', 4, true);

-- Achievements
insert into achievements (title, subtitle, organization, year, description, external_url, display_order, is_published) values
  ('Cisco Tech Hackathon 2026', 'Winner — You Amaze Award', 'Cisco Systems', '2026', 'Awarded highest recognition in internal enterprise hackathon for developing innovative AI-driven operational workflows.', 'https://cisco.com', 1, true),
  ('Featured by Cisco', 'Official Recognition on Cisco LinkedIn and Cisco X', 'Cisco Systems', '2026', 'Spotlighted on corporate channels for engineering excellence, technical leadership, and contributions to GenAI automation.', 'https://linkedin.com/company/cisco', 2, true),
  ('Executive CX Leadership Recognition', 'Innovation and Operational Excellence', 'Cisco CX Executive Leadership', '2026', 'Commended by executive leadership for impactful engineering automation delivering stability across enterprise workflows.', 'https://cisco.com', 3, true);

-- Skills (with deep technical inspection fields for the interactive console)
insert into skills (name, category, icon, discipline, practical_application, used_in, engineering_responsibility, competency_focus, display_order, is_published) values
  ('Machine Learning', 'AI / ML', 'Cpu', 'Applied Statistical Modeling & Predictive Systems', 'Supervised and unsupervised classification, regression, and clustering pipelines.', 'Enterprise risk assessment, anomaly detection, automated verification.', 'Architecting reproducible training, feature engineering, and cross-validation pipelines.', 'Model selection, bias-variance tradeoff, evaluation metrics.', 1, true),
  ('Deep Learning', 'AI / ML', 'Layers', 'Neural Network Architectures & Representation Learning', 'Convolutional and sequence networks for computer vision and unstructured data.', 'Diabetic retinopathy detection, image classification, Grad-CAM interpretability.', 'Design, hyperparameter tuning, transfer learning, and gradient inspection.', 'CNN backbones, loss functions, optimization, gradient stability.', 2, true),
  ('NLP', 'AI / ML', 'FileText', 'Natural Language Processing & Text Understanding', 'Tokenization, syntax parsing, semantic similarity, and document categorization.', 'Document parsing in FarmerVerify AI, sentiment and intent extraction.', 'Building robust text preprocessing, token-level extraction, and entity recognition.', 'Embeddings, attention mechanisms, language representation.', 3, true),
  ('Generative AI', 'AI / ML', 'Sparkles', 'Generative Modeling & Multimodal Intelligence', 'Synthesizing context-aware text, document interpretation, multimodal reasoning.', 'FarmerVerify AI document audit, enterprise synthesis engines.', 'Integrating frontier LLM APIs with structured schemas and deterministic output validation.', 'Multimodal grounding, temperature tuning, synthetic reasoning.', 4, true),
  ('LLMs', 'AI / ML', 'Bot', 'Large Language Model Engineering', 'Instruction tuning, context window orchestration, tool calling, JSON schema enforcement.', 'Automated decision engines, technical doc assistants, agentic routines.', 'Designing deterministic prompt contracts, schema enforcement, latency optimization.', 'Context management, inference optimization, output guardrails.', 5, true),
  ('RAG', 'AI / ML', 'Search', 'Retrieval-Augmented Generation Architecture', 'Dense vector retrieval, document chunking, hybrid keyword/semantic search, context injection.', 'CMS AI Assistant, enterprise internal documentation query engines.', 'Building end-to-end ingest pipelines, chunking heuristics, vector index tuning, reranking.', 'Chunking strategies, embedding distance metrics, factual grounding.', 6, true),
  ('Prompt Engineering', 'AI / ML', 'Terminal', 'Systemic Prompt Design & Context Calibration', 'Few-shot prompting, chain-of-thought elicitation, structured output enforcement.', 'Document validation pipelines, enterprise QA bots.', 'Creating versioned, unit-tested prompt templates with rigorous JSON output guarantees.', 'Few-shot exemplar design, hallucination minimization, prompt evaluation.', 7, true),

  ('LangChain', 'LLM ENGINEERING', 'Workflow', 'LLM Application Framework & Chains', 'Chaining retrievers, prompt templates, output parsers, and custom tool callbacks.', 'CMS AI Assistant retrieval pipeline and agentic query workflows.', 'Constructing robust modular chains, error handling fallbacks, memory handlers.', 'Modular chain design, memory management, LCEL expressions.', 8, true),
  ('OpenAI API', 'LLM ENGINEERING', 'Zap', 'Commercial LLM Integration & Inference', 'Integrating GPT-4o, GPT-4.1 Vision, embeddings, structured outputs, function calling.', 'Multimodal image auditing in FarmerVerify AI, reasoning pipelines.', 'Managing API rate limits, streaming responses, exponential backoff, token budgeting.', 'Token management, structured JSON schema outputs, streaming UX.', 9, true),
  ('ChromaDB', 'LLM ENGINEERING', 'Database', 'Vector Database & Embedding Storage', 'Persistent vector indexing, metadata filtering, cosine similarity distance lookups.', 'CMS AI Assistant vector knowledge base.', 'Configuring persistent collections, indexing configurations, fast nearest-neighbor queries.', 'Vector index maintenance, metadata querying, batch upserts.', 10, true),
  ('Embeddings', 'LLM ENGINEERING', 'Fingerprint', 'Dense Vector Representation', 'Text and document embedding generation using text-embedding-3-small and open-source models.', 'Semantic similarity matching, duplicate document detection, retrieval.', 'Selecting appropriate dimensional representations, normalizing vectors, measuring cosine similarity.', 'High-dimensional geometry, semantic clustering, metric optimization.', 11, true),
  ('Vector Search', 'LLM ENGINEERING', 'Compass', 'Approximate Nearest Neighbor (ANN) Retrieval', 'Fast semantic lookups across multi-thousand chunk repositories.', 'Knowledge retrieval and cross-document verification.', 'Tuning top-k parameters, threshold filtering, similarity calibration.', 'ANN indexing, similarity thresholds, recall optimization.', 12, true),
  ('Reranking', 'LLM ENGINEERING', 'SlidersHorizontal', 'Post-Retrieval Relevance Optimization', 'Cross-encoder reranking to prioritize highest-relevance context chunks prior to generation.', 'Enterprise document search pipelines.', 'Implementing second-stage ranking to maximize context relevance within limited token windows.', 'Cross-encoder scoring, MRR optimization, context compaction.', 13, true),

  ('Python', 'BACKEND', 'Code', 'Core Systems & Backend Engineering Language', 'High-performance scripting, data pipelines, asynchronous APIs, AI orchestration.', 'Production automation at Cisco, FastAPI microservices, ML model inference.', 'Writing type-hinted, maintainable, object-oriented and async Python adhering to PEP 8.', 'Asyncio, typing, generators, memory management, testing with pytest.', 14, true),
  ('FastAPI', 'BACKEND', 'Gauge', 'Modern Asynchronous Web API Framework', 'Building high-throughput REST microservices with automatic OpenAPI generation.', 'FarmerVerify AI backend service, verification endpoints, document processing APIs.', 'Creating Pydantic validation schemas, dependency injection, async request handling.', 'Pydantic v2 validation, asynchronous route handlers, OpenAPI contracts.', 15, true),
  ('REST APIs', 'BACKEND', 'Network', 'Stateless HTTP API Design & Integration', 'Designing predictable HTTP endpoints, status codes, payload contracts, authentication.', 'Cisco Meraki and ServiceNow enterprise integrations, portfolio microservices.', 'Contract-first API development, header management, JSON serialization, security.', 'HTTP semantics, idempotency, rate limiting, error responses.', 16, true),
  ('JSON', 'BACKEND', 'Braces', 'Structured Data Serialization Format', 'Payload serialization, schema validation, configuration exchange across services.', 'Inter-service communication, LLM structured schema responses.', 'Validating strict schemas, parsing deeply nested trees, serialization speed.', 'Schema specification, zero-copy parsing, serialization performance.', 17, true),

  ('TensorFlow', 'ML FRAMEWORKS', 'Boxes', 'Deep Learning & Neural Network Framework', 'Constructing convolutional networks, transfer learning pipelines, and exportable graphs.', 'Diabetic Retinopathy Detection research model training and evaluation.', 'Designing model graphs, custom data generators, checkpointing, and evaluation.', 'Keras Functional API, custom callbacks, tensor manipulation, GPU training.', 18, true),
  ('Scikit-learn', 'ML FRAMEWORKS', 'GitBranch', 'Classical Machine Learning & Statistical Library', 'Pipeline creation, preprocessing, cross-validation, dimensionality reduction, classifiers.', 'Feature engineering, baseline modeling, classification metric reporting.', 'Constructing automated scikit-learn Pipelines, ColumnTransformers, model tuning.', 'Pipeline composition, feature scaling, model selection metrics.', 19, true),

  ('SQL', 'DATA', 'Database', 'Relational Database Query Language', 'Complex joins, aggregations, window functions, indexing, and schema design.', 'Supabase PostgreSQL database layer, relational analytics queries.', 'Designing normalized database schemas, writing optimized queries, managing constraints.', 'Indexing strategies, relational integrity, execution plan inspection.', 20, true),
  ('Pandas', 'DATA', 'Table', 'Tabular Data Analysis & Transformation', 'Data cleaning, feature transformation, tabular inspection, time-series manipulation.', 'Automated reporting pipelines, research dataset preparation and cleaning.', 'Vectorized operations, handling missing data, grouping, merging large dataframes.', 'Vectorized computing, memory optimization, exploratory data analysis.', 21, true),
  ('NumPy', 'DATA', 'Grid', 'Numerical & Multidimensional Matrix Computation', 'Array slicing, tensor operations, linear algebra computations, image matrix preprocessing.', 'Image matrix transformations in computer vision pipelines, metric calculations.', 'Efficient array manipulation, broadcasting, mathematical operations without loops.', 'Broadcasting rules, multidimensional slicing, memory buffer layouts.', 22, true),

  ('Git', 'ENGINEERING TOOLS', 'GitPullRequest', 'Distributed Version Control & Source Code Management', 'Branching workflows, semantic commits, PR reviews, merge conflict resolution.', 'Daily engineering workflows, production repository maintenance.', 'Maintaining clean Git histories, managing feature branches, collaborative PR reviews.', 'Git internals, rebasing, release tagging, submodules.', 23, true),
  ('Postman', 'ENGINEERING TOOLS', 'Send', 'API Testing & Lifecycle Management', 'Automating API regression tests, mocking endpoints, validating authentication tokens.', 'Validating Cisco Meraki API payloads, testing FastAPI endpoints.', 'Constructing environment variables, automated pre-request scripts, test assertions.', 'Test collection automation, contract verification, CI integration.', 24, true);

