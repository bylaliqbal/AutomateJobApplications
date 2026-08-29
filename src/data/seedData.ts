import {
  ProfileFacts,
  CoreCVFile,
  WeightedKeyword,
  SearchCriteria,
  Company,
  MasterJob,
  PlatformNotification
} from '../types';

export const INITIAL_CORE_CV_RAW = `
BILAL IQBAL
Al Barsha, Dubai, UAE | bylal.iqbal@gmail.com | +971559534191 | linkedin.com/in/bilal-iqbal-92395210/
Digital Product Lead | C-Level Commercial Partner | Growth Intelligence | Revenue Analytics | Data Platforms | Digital Transformation

SUMMARY
17+ years of experience across telecom, digital products, customer lifecycle management, and large-scale transformation programs. Proven track record of leveraging customer intelligence, predictive analytics, and data-driven decisioning to deliver 169% revenue growth, 63% acquisition uplift, 30% YoY revenue growth, and measurable improvements in customer engagement, retention, and monetization.

SKILLS & TOOLS
- Growth Analytics, Consumer Intelligence, CVM
- Commercial Analytics, Churn & Retention Analytics
- Revenue Optimization, Personalization, Decisioning
- Product Analytics, Monetization, Reporting
- PEGA CDH, Emagine, Oracle, Jira, Confluence, SQL
- Geneva R&B, Siebel, Visio, Power BI, Miro

ACHIEVEMENTS
- Awarded Employee of the Quarter for rolling out UAE's first 5GSA in Commercial Townhall
- Awarded Employee of the Quarter for driving 63% B2B growth through CVM in Commercial Townhall
- Recognized in the du Annual Product gathering for delivering continuous success
- BBC recognized my efforts for digitizing Communicable disease surveillance on national level
- Successfully swapped legacy CVM with Omni Channel PEGA CDH with 99.9% accuracy delivering 1.8 million B2B incremental revenue

WORK EXPERIENCE

Du Telecom, UAE | Product Lead – CVM & Growth | 2020 – Present
- Led migration of the enterprise CVM platform to PEGA CDH, transitioning 6M+ subscribers and 150+ campaigns, delivering ~30% YoY revenue uplift.
- Built customer intelligence frameworks leveraging behavioral analytics, segmentation, propensity modeling, and next-best-action decisioning.
- Developed executive KPI dashboards and performance frameworks using PEGA CDH and Oracle BI, enabling data-driven investment decisions and reducing CPA by 12% YoY.
- Led personalization and growth initiatives that delivered 169% revenue growth and 63% acquisition growth across targeted customer segments.
- Designed predictive decisioning and optimization strategies resulting in 2% MoM conversion uplift and 12% recurring revenue growth.
- Established A/B testing methodologies, and performance measurement models to optimize customer journeys and campaign effectiveness.
- Delivered actionable insights on churn risk, retention opportunities, customer behavior shifts, and revenue leakages to senior leadership.
- Partnered with Data, BI, Product, Marketing, and Technology teams to build scalable analytics capabilities and lifecycle management frameworks.
- Presented growth intelligence, monetization opportunities, and commercial recommendations to C-level governance forums.

PITB | Head of Digital Transformation - HealthTech | 2016 – 2019
- Led Digital transformation initiatives across Healthcare, Defense, and citizen services impacting 30M+ citizens across multiple provinces using web and mobile channels.
- Managed cross-functional delivery teams, vendors, and government stakeholders for large-scale data-driven digital transformation programs.
- Developed centralized reporting and monitoring frameworks integrating healthcare, surveillance, and citizen engagement data.
- Drove platform modernization initiatives aligned with Pakistan’s broader digital transformation vision.
- Collaborated with WHO and government stakeholders to translate data insights into operational and policy decisions.
- Implemented performance measurement frameworks to improve Digital adoption, compliance, and service delivery effectiveness.

Jazz Telecom | Project Manager – Solution Delivery | 2008 – 2016
- Delivered and managed $3.2M digital transformation programs across CRM, billing and customer engagement platforms.
- Managed roadmap planning, feature prioritization, and stakeholder alignment across cross functional teams.
- Supported development of digital selfcare platforms improving customer lifecycle management and operational efficiency.

CERTIFICATIONS
- Product Owner Product Manager - SAFe
- PSPO - Scrum.org
- Design Thinking - Informa
- PEGA Decisioning Consultant - Pega
- PEGA Customer Decision Hub Foundation - Pega
- Project Management Professional - PMBOK
- DOC1 Designer - PBS

EDUCATION
- MBA (Marketing & Finance) – LSE, Pakistan (2010 - 2012)
- BSc Computer Science – UET Lahore, Pakistan (2004 - 2008)
`;

export const INITIAL_CORE_CV_FILE: CoreCVFile = {
  id: 'cv_core_v1',
  filename: 'Bilal_Iqbal_Core_CV_2026.docx',
  fileSize: 52400,
  uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  version: 1,
  rawText: INITIAL_CORE_CV_RAW.trim(),
  isAuthoritative: true,
};

export const INITIAL_PROFILE_FACTS: ProfileFacts = {
  fullName: 'Bilal Iqbal',
  email: 'bylal.iqbal@gmail.com',
  phone: '+971559534191',
  location: 'Al Barsha, Dubai, UAE',
  linkedInUrl: 'https://linkedin.com/in/bilal-iqbal-92395210/',
  githubUrl: '',
  portfolioUrl: '',
  headline: 'Digital Product Lead | C-Level Commercial Partner | Growth Intelligence | Revenue Analytics | Data Platforms',
  professionalSummary: '17+ years of experience across telecom, digital products, customer lifecycle management, and large-scale transformation programs. Proven track record of leveraging customer intelligence, predictive analytics, and data-driven decisioning to deliver 169% revenue growth, 63% acquisition uplift, 30% YoY revenue growth, and measurable improvements in customer engagement, retention, and monetization.',
  yearsOfExperience: 17,
  achievements: [
    "Awarded Employee of the Quarter for rolling out UAE's first 5GSA in Commercial Townhall",
    "Awarded Employee of the Quarter for driving 63% B2B growth through CVM in Commercial Townhall",
    "Recognized in the du Annual Product gathering for delivering continuous success",
    "BBC recognized my efforts for digitizing Communicable disease surveillance on national level",
    "Successfully swapped legacy CVM with Omni Channel PEGA CDH with 99.9% accuracy delivering 1.8 million B2B incremental revenue"
  ],
  experiences: [
    {
      id: 'exp_1',
      company: 'Du Telecom, UAE',
      role: 'Product Lead – CVM & Growth',
      location: 'Dubai, UAE',
      startDate: '2020',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Led migration of the enterprise CVM platform to PEGA CDH, transitioning 6M+ subscribers and 150+ campaigns, delivering ~30% YoY revenue uplift.',
        'Built customer intelligence frameworks leveraging behavioral analytics, segmentation, propensity modeling, and next-best-action decisioning.',
        'Developed executive KPI dashboards and performance frameworks using PEGA CDH and Oracle BI, enabling data-driven investment decisions and reducing CPA by 12% YoY.',
        'Led personalization and growth initiatives that delivered 169% revenue growth and 63% acquisition growth across targeted customer segments.',
        'Designed predictive decisioning and optimization strategies resulting in 2% MoM conversion uplift and 12% recurring revenue growth.',
        'Established A/B testing methodologies, and performance measurement models to optimize customer journeys and campaign effectiveness.',
        'Delivered actionable insights on churn risk, retention opportunities, customer behavior shifts, and revenue leakages to senior leadership.',
        'Partnered with Data, BI, Product, Marketing, and Technology teams to build scalable analytics capabilities and lifecycle management frameworks.',
        'Presented growth intelligence, monetization opportunities, and commercial recommendations to C-level governance forums.'
      ],
      skillsUsed: ['PEGA CDH', 'Growth Analytics', 'CVM', 'Predictive Decisioning', 'Personalization', 'Oracle BI', 'SQL', 'A/B Testing']
    },
    {
      id: 'exp_2',
      company: 'PITB',
      role: 'Head of Digital Transformation - HealthTech',
      location: 'Lahore, Pakistan',
      startDate: '2016',
      endDate: '2019',
      isCurrent: false,
      highlights: [
        'Led Digital transformation initiatives across Healthcare, Defense, and citizen services impacting 30M+ citizens across multiple provinces using web and mobile channels.',
        'Managed cross-functional delivery teams, vendors, and government stakeholders for large-scale data-driven digital transformation programs.',
        'Developed centralized reporting and monitoring frameworks integrating healthcare, surveillance, and citizen engagement data.',
        'Drove platform modernization initiatives aligned with Pakistan’s broader digital transformation vision.',
        'Collaborated with WHO and government stakeholders to translate data insights into operational and policy decisions.',
        'Implemented performance measurement frameworks to improve Digital adoption, compliance, and service delivery effectiveness.'
      ],
      skillsUsed: ['Digital Transformation', 'Data Platforms', 'Stakeholder Management', 'Analytics', 'Healthcare IT', 'Cross-Functional Leadership']
    },
    {
      id: 'exp_3',
      company: 'Jazz Telecom',
      role: 'Project Manager – Solution Delivery',
      location: 'Islamabad, Pakistan',
      startDate: '2008',
      endDate: '2016',
      isCurrent: false,
      highlights: [
        'Delivered and managed $3.2M digital transformation programs across CRM, billing and customer engagement platforms.',
        'Managed roadmap planning, feature prioritization, and stakeholder alignment across cross functional teams.',
        'Supported development of digital selfcare platforms improving customer lifecycle management and operational efficiency.'
      ],
      skillsUsed: ['CRM', 'Billing Systems', 'Solution Delivery', 'Project Management', 'Customer Lifecycle Management']
    }
  ],
  educations: [
    {
      id: 'edu_1',
      institution: 'Lahore School of Economics (LSE)',
      degree: 'MBA (Marketing & Finance)',
      fieldOfStudy: 'Marketing & Finance',
      graduationYear: '2012',
      honors: '2010 - 2012'
    },
    {
      id: 'edu_2',
      institution: 'UET Lahore',
      degree: 'BSc Computer Science',
      fieldOfStudy: 'Computer Science',
      graduationYear: '2008',
      honors: '2004 - 2008'
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Product Owner Product Manager - SAFe',
      issuingOrganization: 'Scaled Agile Framework (SAFe)',
      issueDate: '2023'
    },
    {
      id: 'cert_2',
      name: 'PSPO (Professional Scrum Product Owner)',
      issuingOrganization: 'Scrum.org',
      issueDate: '2022'
    },
    {
      id: 'cert_3',
      name: 'Design Thinking',
      issuingOrganization: 'Informa',
      issueDate: '2022'
    },
    {
      id: 'cert_4',
      name: 'PEGA Decisioning Consultant',
      issuingOrganization: 'Pegasystems',
      issueDate: '2021'
    },
    {
      id: 'cert_5',
      name: 'PEGA Customer Decision Hub Foundation',
      issuingOrganization: 'Pegasystems',
      issueDate: '2021'
    },
    {
      id: 'cert_6',
      name: 'Project Management Professional - PMBOK',
      issuingOrganization: 'PMI',
      issueDate: '2020'
    },
    {
      id: 'cert_7',
      name: 'DOC1 Designer',
      issuingOrganization: 'PBS',
      issueDate: '2019'
    }
  ],
  skills: [
    { name: 'Growth Analytics', category: 'Analytics', proficiency: 'Expert', weight: 10 },
    { name: 'Consumer Intelligence', category: 'Analytics', proficiency: 'Expert', weight: 10 },
    { name: 'CVM (Customer Value Management)', category: 'Domain', proficiency: 'Expert', weight: 10 },
    { name: 'PEGA CDH', category: 'Platforms', proficiency: 'Expert', weight: 10 },
    { name: 'Predictive Decisioning', category: 'Analytics', proficiency: 'Expert', weight: 10 },
    { name: 'Personalization', category: 'Domain', proficiency: 'Expert', weight: 9 },
    { name: 'Commercial Analytics', category: 'Analytics', proficiency: 'Expert', weight: 9 },
    { name: 'Churn & Retention Analytics', category: 'Analytics', proficiency: 'Expert', weight: 9 },
    { name: 'Revenue Optimization', category: 'Domain', proficiency: 'Expert', weight: 9 },
    { name: 'Product Analytics', category: 'Analytics', proficiency: 'Expert', weight: 9 },
    { name: 'SQL', category: 'Tools', proficiency: 'Expert', weight: 8 },
    { name: 'Oracle BI', category: 'Platforms', proficiency: 'Expert', weight: 8 },
    { name: 'Power BI', category: 'Platforms', proficiency: 'Intermediate', weight: 8 },
    { name: 'Jira & Confluence', category: 'Tools', proficiency: 'Expert', weight: 8 },
    { name: 'Digital Transformation', category: 'Domain', proficiency: 'Expert', weight: 10 }
  ],
  languages: ['English (Fluent)', 'Urdu (Native)', 'Arabic (Professional)']
};

export const INITIAL_KEYWORDS: WeightedKeyword[] = [
  { id: 'kw_1', name: 'PEGA CDH', weight: 10, source: 'Combined', cvCount: 14, linkedInCount: 18, combinedCount: 32, lastUpdated: '2026-08-25' },
  { id: 'kw_2', name: 'Customer Value Management (CVM)', weight: 10, source: 'Combined', cvCount: 12, linkedInCount: 20, combinedCount: 32, lastUpdated: '2026-08-25' },
  { id: 'kw_3', name: 'Growth Analytics', weight: 10, source: 'Combined', cvCount: 11, linkedInCount: 22, combinedCount: 33, lastUpdated: '2026-08-25' },
  { id: 'kw_4', name: 'Digital Transformation', weight: 10, source: 'Combined', cvCount: 10, linkedInCount: 24, combinedCount: 34, lastUpdated: '2026-08-25' },
  { id: 'kw_5', name: 'Predictive Decisioning', weight: 9, source: 'Combined', cvCount: 8, linkedInCount: 15, combinedCount: 23, lastUpdated: '2026-08-25' },
  { id: 'kw_6', name: 'Personalization', weight: 9, source: 'Combined', cvCount: 7, linkedInCount: 16, combinedCount: 23, lastUpdated: '2026-08-25' },
  { id: 'kw_7', name: 'Next-Best-Action (NBA)', weight: 10, source: 'Combined', cvCount: 6, linkedInCount: 17, combinedCount: 23, lastUpdated: '2026-08-25' },
  { id: 'kw_8', name: 'Customer Intelligence & Propensity Modeling', weight: 9, source: 'Combined', cvCount: 8, linkedInCount: 19, combinedCount: 27, lastUpdated: '2026-08-25' },
  { id: 'kw_9', name: 'Revenue Analytics & Optimization', weight: 9, source: 'Combined', cvCount: 9, linkedInCount: 14, combinedCount: 23, lastUpdated: '2026-08-25' },
  { id: 'kw_10', name: 'Product Management & Lifecycle', weight: 9, source: 'Combined', cvCount: 8, linkedInCount: 26, combinedCount: 34, lastUpdated: '2026-08-25' },
  { id: 'kw_11', name: 'Oracle BI & SQL', weight: 8, source: 'Combined', cvCount: 7, linkedInCount: 12, combinedCount: 19, lastUpdated: '2026-08-25' },
  { id: 'kw_12', name: 'Churn & Retention Analytics', weight: 9, source: 'Combined', cvCount: 6, linkedInCount: 15, combinedCount: 21, lastUpdated: '2026-08-25' },
  { id: 'kw_13', name: 'A/B Testing & Experimentation', weight: 8, source: 'Combined', cvCount: 5, linkedInCount: 11, combinedCount: 16, lastUpdated: '2026-08-25' },
  { id: 'kw_14', name: 'Executive Dashboards & KPI Reporting', weight: 8, source: 'Combined', cvCount: 6, linkedInCount: 13, combinedCount: 19, lastUpdated: '2026-08-25' },
  { id: 'kw_15', name: 'Omni Channel Engagement', weight: 8, source: 'Combined', cvCount: 5, linkedInCount: 9, combinedCount: 14, lastUpdated: '2026-08-25' },
  { id: 'kw_16', name: 'Power BI & Visual Analytics', weight: 8, source: 'Combined', cvCount: 4, linkedInCount: 10, combinedCount: 14, lastUpdated: '2026-08-25' },
  { id: 'kw_17', name: 'Jira & Confluence', weight: 7, source: 'Combined', cvCount: 4, linkedInCount: 8, combinedCount: 12, lastUpdated: '2026-08-25' },
  { id: 'kw_18', name: '5G SA Commercial Launch', weight: 8, source: 'Combined', cvCount: 3, linkedInCount: 6, combinedCount: 9, lastUpdated: '2026-08-25' },
  { id: 'kw_19', name: 'Stakeholder & C-Level Governance', weight: 9, source: 'Combined', cvCount: 5, linkedInCount: 14, combinedCount: 19, lastUpdated: '2026-08-25' },
  { id: 'kw_20', name: 'Healthcare IT & Public Sector Platforms', weight: 8, source: 'Combined', cvCount: 4, linkedInCount: 7, combinedCount: 11, lastUpdated: '2026-08-25' },
  { id: 'kw_21', name: 'Telecom CRM & Billing (Geneva R&B / Siebel)', weight: 7, source: 'Combined', cvCount: 4, linkedInCount: 8, combinedCount: 12, lastUpdated: '2026-08-25' },
  { id: 'kw_22', name: 'Agile (SAFe POPM / PSPO)', weight: 9, source: 'Combined', cvCount: 4, linkedInCount: 16, combinedCount: 20, lastUpdated: '2026-08-25' },
  { id: 'kw_23', name: 'Design Thinking & Customer Journey Mapping', weight: 8, source: 'Combined', cvCount: 3, linkedInCount: 9, combinedCount: 12, lastUpdated: '2026-08-25' },
  { id: 'kw_24', name: 'Solution Delivery & Vendor Management', weight: 8, source: 'Combined', cvCount: 4, linkedInCount: 10, combinedCount: 14, lastUpdated: '2026-08-25' }
];

export const INITIAL_SEARCH_CRITERIA: SearchCriteria = {
  id: 'crit_default',
  name: 'Digital Product Lead & CVM Growth Roles',
  targetTitles: [
    'Digital Product Lead',
    'Product Lead – CVM & Growth',
    'Head of Product / Growth',
    'Director of Customer Value Management',
    'Head of Digital Transformation',
    'Senior Product Manager - Data & Growth'
  ],
  weightedSkills: [
    { name: 'PEGA CDH', weight: 10 },
    { name: 'CVM', weight: 10 },
    { name: 'Growth Analytics', weight: 10 },
    { name: 'Predictive Decisioning', weight: 9 },
    { name: 'Personalization', weight: 9 },
    { name: 'Digital Transformation', weight: 9 },
    { name: 'Revenue Optimization', weight: 8 },
    { name: 'Oracle BI & SQL', weight: 8 }
  ],
  industries: ['Telecommunications', 'Fintech', 'HealthTech', 'Digital Platforms', 'Enterprise SaaS'],
  seniorityLevels: ['LEAD', 'DIRECTOR', 'EXECUTIVE'],
  employmentTypes: ['FULL_TIME'],
  workplaceTypes: ['HYBRID', 'REMOTE', 'ON_SITE'],
  countries: ['United Arab Emirates', 'Saudi Arabia', 'United Kingdom', 'United States'],
  cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'London', 'Remote'],
  isWorldwide: true,
  postingAgeHours: 72, // 3 days
  matchThreshold: 50,
  weights: {
    title: 30,
    skills: 35,
    experience: 15,
    industry: 10,
    location: 5,
    workplace: 5
  },
  notificationRules: {
    notifyNewDiscovered: true,
    notifyHighMatch: true,
    notifyPriorityCompanies: true,
    channel: 'both'
  }
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_1',
    name: 'Stripe',
    domain: 'stripe.com',
    careersUrl: 'https://stripe.com/jobs',
    status: 'permanently_monitored',
    notes: 'Tier-1 target. Strong distributed systems and TypeScript stack.',
    referrals: [
      {
        id: 'ref_1',
        name: 'Marcus Brody',
        role: 'Staff Infrastructure Engineer',
        email: 'mbrody.referral@example.com',
        linkedInUrl: 'https://linkedin.com/in/marcusbrody-eng',
        companyName: 'Stripe',
        status: 'Agreed',
        notes: 'Ex-colleague from UC Berkeley. Happy to submit internal referral.'
      }
    ],
    lastCrawledAt: '2026-08-25T14:30:00Z'
  },
  {
    id: 'comp_2',
    name: 'Vercel',
    domain: 'vercel.com',
    careersUrl: 'https://vercel.com/careers',
    status: 'approved',
    notes: 'Next.js & Frontend cloud platform. Ideal match for full-stack expertise.',
    referrals: [
      {
        id: 'ref_2',
        name: 'Elena Rostova',
        role: 'Engineering Manager, Edge Runtime',
        linkedInUrl: 'https://linkedin.com/in/erostova',
        companyName: 'Vercel',
        status: 'Contacted',
        notes: 'Connected via React Summit SF.'
      }
    ],
    lastCrawledAt: '2026-08-25T12:00:00Z'
  },
  {
    id: 'comp_3',
    name: 'Datadog',
    domain: 'datadoghq.com',
    careersUrl: 'https://careers.datadoghq.com',
    status: 'approved',
    notes: 'Observability and telemetry pipelines at scale.',
    referrals: [],
    lastCrawledAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'comp_4',
    name: 'Supabase',
    domain: 'supabase.com',
    careersUrl: 'https://supabase.com/careers',
    status: 'permanently_monitored',
    notes: 'Open source Firebase alternative, PostgreSQL heavy stack.',
    referrals: [
      {
        id: 'ref_3',
        name: 'Jordan Lee',
        role: 'Core Backend Architect',
        linkedInUrl: 'https://linkedin.com/in/jordanlee-dev',
        companyName: 'Supabase',
        status: 'Referred',
        notes: 'Submitted referral for Cloud Platform Engineer position.'
      }
    ],
    lastCrawledAt: '2026-08-25T09:15:00Z'
  },
  {
    id: 'comp_5',
    name: 'Legacy FinOps Inc',
    domain: 'legacyfinops.example',
    careersUrl: 'https://legacyfinops.example/jobs',
    status: 'blacklisted',
    notes: 'Outdated monolith stack with inflexible on-site mandate.',
    referrals: []
  }
];

export const INITIAL_MASTER_JOBS: MasterJob[] = [
  {
    id: 'job_101',
    title: 'Staff Full-Stack Engineer, Developer Experience & Cloud',
    company: 'Vercel',
    location: 'San Francisco, CA (or Remote US)',
    workplaceType: 'REMOTE',
    employmentType: 'FULL_TIME',
    salaryRange: '$210,000 – $260,000 + Equity',
    description: `We are looking for a Staff Full-Stack Engineer to architect next-generation edge deployment workflows and developer experience tooling. You will design high-throughput Node.js microservices, build sleek Next.js and React user interfaces, and optimize PostgreSQL and Redis caching layers.
Requirements:
- 7+ years of experience with TypeScript, Node.js, and modern React/Next.js frameworks.
- Deep understanding of distributed caching, event-driven queues (BullMQ/Kafka), and PostgreSQL performance tuning.
- Track record of leading technical initiatives and mentoring engineers.
- Strong grounding in AWS/GCP cloud platforms and containerization.`,
    requirements: [
      '7+ years software engineering experience with strong TypeScript mastery',
      'Expertise in React, Next.js, and server-side state architecture',
      'Experience with PostgreSQL, Redis, and high-concurrency event queues',
      'Track record designing developer-facing distributed systems'
    ],
    requiredSkills: ['TypeScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'AWS'],
    sources: [
      {
        provider: 'LinkedIn',
        sourceJobId: 'li_389201948',
        sourceUrl: 'https://linkedin.com/jobs/view/389201948',
        applicationUrl: 'https://vercel.com/careers/staff-fullstack-devx',
        retrievedTime: '2026-08-26T08:15:00Z',
        hasReliablePostingDate: true,
        postingDate: '2026-08-25T16:00:00Z',
        discoveryDate: '2026-08-26T08:15:00Z',
        rawPayloadSnippet: '{"provider": "linkedin_scraper", "title": "Staff Full-Stack Engineer", "company": "Vercel", "location": "Remote"}'
      },
      {
        provider: 'Company_ATS',
        sourceJobId: 'ats_vercel_8819',
        sourceUrl: 'https://boards.greenhouse.io/vercel/jobs/8819',
        applicationUrl: 'https://vercel.com/careers/staff-fullstack-devx',
        retrievedTime: '2026-08-26T09:00:00Z',
        hasReliablePostingDate: true,
        postingDate: '2026-08-25T15:30:00Z',
        discoveryDate: '2026-08-26T09:00:00Z',
        rawPayloadSnippet: '{"provider": "greenhouse_crawler", "id": "8819", "department": "Platform Eng"}'
      }
    ],
    isPreviousSearch: false,
    firstDiscoveredAt: '2026-08-26T08:15:00Z',
    lastDiscoveredAt: '2026-08-26T09:00:00Z',
    applicationUrl: 'https://vercel.com/careers/staff-fullstack-devx',
    status: 'Discovered',
    notes: 'Direct match for Alexander Vance core experience in Next.js + BullMQ.',
    companyStatus: 'approved',
    referralsCount: 1
  },
  {
    id: 'job_102',
    title: 'Senior Infrastructure & Backend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA / Seattle, WA',
    workplaceType: 'HYBRID',
    employmentType: 'FULL_TIME',
    salaryRange: '$225,000 – $280,000 + RSU',
    description: `Stripe builds economic infrastructure for the internet. As a Senior Backend Engineer on Payments Ingestion, you will design robust, fault-tolerant distributed systems handling billions of dollars in volume.
Key Responsibilities:
- Build low-latency financial transaction pipelines with Node.js/Go and PostgreSQL.
- Optimize distributed locking, idempotent message queues, and Redis cluster storage.
- Partner with security and compliance teams to enforce zero-trust authentication and RBAC.`,
    requirements: [
      '6+ years developing resilient distributed systems and API architectures',
      'Solid expertise in PostgreSQL schema design, indexing, and query optimization',
      'Experience with message queue architectures, idempotent consumers, and Redis',
      'Proven background in TypeScript, Node.js or Go'
    ],
    requiredSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Distributed Systems', 'OAuth2', 'AWS'],
    sources: [
      {
        provider: 'LinkedIn',
        sourceJobId: 'li_stripe_9921',
        sourceUrl: 'https://linkedin.com/jobs/view/9921448',
        applicationUrl: 'https://stripe.com/jobs/listing/senior-backend-payments',
        retrievedTime: '2026-08-25T11:20:00Z',
        hasReliablePostingDate: true,
        postingDate: '2026-08-24T18:00:00Z',
        discoveryDate: '2026-08-25T11:20:00Z',
        rawPayloadSnippet: '{"provider": "linkedin_scraper", "role": "Senior Infrastructure & Backend Engineer"}'
      }
    ],
    isPreviousSearch: true,
    firstDiscoveredAt: '2026-08-23T10:00:00Z',
    lastDiscoveredAt: '2026-08-25T11:20:00Z',
    applicationUrl: 'https://stripe.com/jobs/listing/senior-backend-payments',
    status: 'Saved',
    notes: 'Marcus Brody agreed to refer. Need tailored CV emphasizing high-throughput pipeline experience.',
    companyStatus: 'permanently_monitored',
    referralsCount: 1
  },
  {
    id: 'job_103',
    title: 'Lead Cloud & Database Platform Engineer',
    company: 'Supabase',
    location: 'Worldwide (Remote)',
    workplaceType: 'REMOTE',
    employmentType: 'FULL_TIME',
    salaryRange: '$195,000 – $240,000',
    description: `Supabase is scaling open source cloud database infrastructure. We are hiring a Lead Cloud Engineer to optimize our multi-tenant PostgreSQL control plane, queue dispatchers, and S3 backup systems.
What You Will Do:
- Architect orchestration microservices in TypeScript and Node.js.
- Ensure 99.99% uptime for PostgreSQL instances across AWS and GCP regions.
- Improve our automated backup, checksum validation, and instant recovery subsystems.`,
    requirements: [
      '8+ years in software engineering with deep PostgreSQL internal understanding',
      'Mastery of TypeScript, Node.js, and modern cloud primitives (AWS/GCP)',
      'Experience with S3 API integrations, signed URLs, and storage pipelines',
      'Strong open-source or developer community mindset'
    ],
    requiredSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'BullMQ'],
    sources: [
      {
        provider: 'Apify',
        sourceJobId: 'apify_sp_0019',
        sourceUrl: 'https://apify.com/actors/job-scraper/runs/sp_0019',
        applicationUrl: 'https://supabase.com/careers/lead-cloud-engineer',
        retrievedTime: '2026-08-26T07:30:00Z',
        hasReliablePostingDate: false,
        postingDate: '2026-08-26T07:30:00Z', // Discovery fallback
        discoveryDate: '2026-08-26T07:30:00Z',
        rawPayloadSnippet: '{"provider": "apify_crawler_v2", "actor": "crawler_ats_supabase"}'
      }
    ],
    isPreviousSearch: false,
    firstDiscoveredAt: '2026-08-26T07:30:00Z',
    lastDiscoveredAt: '2026-08-26T07:30:00Z',
    applicationUrl: 'https://supabase.com/careers/lead-cloud-engineer',
    status: 'Interviewing',
    notes: 'First round phone screen scheduled for Thursday. Jordan Lee referral on file.',
    companyStatus: 'permanently_monitored',
    referralsCount: 1
  },
  {
    id: 'job_104',
    title: 'Senior Frontend & Web Systems Engineer',
    company: 'Datadog',
    location: 'New York, NY (Hybrid)',
    workplaceType: 'HYBRID',
    employmentType: 'FULL_TIME',
    salaryRange: '$190,000 – $235,000',
    description: `Help engineers make sense of their complex cloud systems. Join Datadog to build responsive, data-dense real-time dashboards in React, TypeScript, and WebSockets.
Requirements:
- 5+ years of production experience in React, TypeScript, and state management.
- Experience with performance profiling, bundle splitting, and rendering optimization.
- Working knowledge of backend APIs and microservices.`,
    requirements: [
      '5+ years frontend & UI architecture experience with React & TypeScript',
      'Experience handling high frequency WebSocket streams and chart rendering',
      'Knowledge of testing frameworks (Jest, Cypress)'
    ],
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Jest', 'Cypress'],
    sources: [
      {
        provider: 'Indeed',
        sourceJobId: 'ind_dd_99182',
        sourceUrl: 'https://indeed.com/viewjob?jk=99182',
        applicationUrl: 'https://careers.datadoghq.com/detail/55129',
        retrievedTime: '2026-08-26T05:00:00Z',
        hasReliablePostingDate: true,
        postingDate: '2026-08-25T20:00:00Z',
        discoveryDate: '2026-08-26T05:00:00Z',
        rawPayloadSnippet: '{"provider": "indeed_publisher_feed", "id": "ind_dd_99182"}'
      }
    ],
    isPreviousSearch: true,
    firstDiscoveredAt: '2026-08-22T14:00:00Z',
    lastDiscoveredAt: '2026-08-26T05:00:00Z',
    applicationUrl: 'https://careers.datadoghq.com/detail/55129',
    status: 'Discovered',
    notes: 'Good match for React micro-frontend optimization history.',
    companyStatus: 'approved',
    referralsCount: 0
  },
  {
    id: 'job_105',
    title: 'Senior Rust & Systems Kernel Specialist',
    company: 'LowLevel Matrix Tech',
    location: 'Austin, TX (On-site)',
    workplaceType: 'ON_SITE',
    employmentType: 'FULL_TIME',
    salaryRange: '$170,000 – $210,000',
    description: `We are building bare-metal device drivers and embedded kernels in Rust and C++20. Requires 5+ years of deep Linux kernel development, memory registers, and custom hardware debugging.`,
    requirements: [
      '5+ years writing production C++ and Rust embedded systems',
      'Linux kernel module development and hardware driver experience',
      'On-site presence required daily at Austin laboratory'
    ],
    requiredSkills: ['Rust', 'C++', 'Linux Kernel', 'Embedded Systems', 'Assembly'],
    sources: [
      {
        provider: 'LinkedIn',
        sourceJobId: 'li_matrix_229',
        sourceUrl: 'https://linkedin.com/jobs/view/22901',
        applicationUrl: 'https://lowlevelmatrix.example/jobs/kernel-eng',
        retrievedTime: '2026-08-26T04:00:00Z',
        hasReliablePostingDate: true,
        postingDate: '2026-08-25T11:00:00Z',
        discoveryDate: '2026-08-26T04:00:00Z',
        rawPayloadSnippet: '{"provider": "linkedin_scraper", "skills": ["Rust", "Kernel"]}'
      }
    ],
    isPreviousSearch: false,
    firstDiscoveredAt: '2026-08-26T04:00:00Z',
    lastDiscoveredAt: '2026-08-26T04:00:00Z',
    applicationUrl: 'https://lowlevelmatrix.example/jobs/kernel-eng',
    status: 'Discovered',
    notes: 'Expected non-qualifying job (Score ~28) to test strict matching boundary and non-qualifying filters.',
    companyStatus: 'candidate',
    referralsCount: 0
  }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif_1',
    timestamp: '2026-08-26T08:16:00Z',
    title: '94% High Match Discovered at Vercel',
    message: 'Staff Full-Stack Engineer role matches your Next.js, TypeScript & BullMQ experience.',
    jobId: 'job_101',
    companyName: 'Vercel',
    matchScore: 94,
    type: 'HIGH_MATCH',
    isRead: false,
    isPriority: true
  },
  {
    id: 'notif_2',
    timestamp: '2026-08-26T07:35:00Z',
    title: 'Monitored Company Alert: Supabase',
    message: 'New posting for Lead Cloud & Database Platform Engineer found with 1 active referral.',
    jobId: 'job_103',
    companyName: 'Supabase',
    matchScore: 88,
    type: 'PRIORITY_COMPANY',
    isRead: false,
    isPriority: true
  },
  {
    id: 'notif_3',
    timestamp: '2026-08-25T11:25:00Z',
    title: 'Job Rediscovered (Previous Search)',
    message: 'Stripe Senior Infrastructure & Backend Engineer updated in search run.',
    jobId: 'job_102',
    companyName: 'Stripe',
    matchScore: 89,
    type: 'NEW_DISCOVERY',
    isRead: true,
    isPriority: false
  }
];
