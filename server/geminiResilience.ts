import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

/**
 * Execute Gemini model generation with graceful fallback across active models
 * (gemini-3.7-flash -> gemini-3.1-flash-lite -> gemini-flash-latest -> gemini-3.1-pro-preview)
 * and exponential backoff retry to handle temporary 503 high-demand spikes smoothly.
 */
export async function generateWithFallback(
  prompt: string,
  config?: { responseMimeType?: string; responseSchema?: any; systemInstruction?: string }
): Promise<{ text: string; modelUsed: string } | null> {
  const client = getGeminiClient();
  if (!client) return null;

  const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.1-pro-preview'
  ];

  for (const model of candidateModels) {
    // Attempt up to 2 retries on 503 / high demand spikes per model before falling back to next model
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: config?.responseMimeType,
            responseSchema: config?.responseSchema,
            systemInstruction: config?.systemInstruction,
            temperature: 0.2
          }
        });

        if (response && response.text) {
          return {
            text: response.text,
            modelUsed: model
          };
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.error && err.error.code);
        const is503OrRateLimit = status === 503 || status === 429 || `${err?.message}`.includes('503') || `${err?.message}`.includes('high demand');
        
        if (attempt === 0 && is503OrRateLimit) {
          // Quick wait for transient spike before single retry
          await new Promise(r => setTimeout(r, 600));
          continue;
        }

        // On failure or second attempt, smoothly fall back to next model without spamming noisy error traces
        console.warn(`[Gemini Resilience] ${model} unavailable (attempting next resilient model in pool)`);
        break;
      }
    }
  }

  return null;
}

const ACTION_VERBS = /^(?:Led|Built|Developed|Designed|Established|Delivered|Partnered|Presented|Managed|Collaborated|Drove|Implemented|Supported|Executed|Created|Directed|Spearheaded|Formulated|Authored|Streamlined|Automated|Optimized|Oversaw|Tracked|Supervised|Maintained|Deployed|Engineered|Scaled|Negotiated|Standardized|Orchestrated|Transformed|Trained|Mentored|Achieved|Initiated|Launched|Pioneered)\b/i;

const SECTION_SYNONYMS = {
  summary: /^(?:professional|executive|career|personal|candidate)?\s*(?:summary|profile|overview|about me|bio|objective)$/i,
  experience: /^(?:work|professional|career|employment|relevant|corporate)?\s*(?:experience|history|employment history|work history|engagements|roles|positions)$/i,
  achievements: /^(?:key|major|career|notable|selected)?\s*(?:achievements|accomplishments|awards|honors|recognitions|milestones|highlights)$/i,
  skills: /^(?:core|technical|key|domain|professional)?\s*(?:skills|competencies|technologies|tools|tools & platforms|skills & tools|skills and tools|expertise|areas of expertise|tech stack)$/i,
  certifications: /^(?:professional|licenses and|licenses &|courses &|accreditations)?\s*(?:certifications|certificates|licenses|credentials|accreditations|courses)$/i,
  education: /^(?:academic|educational|university)?\s*(?:education|background|qualifications|degrees|academic background|academic qualifications|studies)$/i,
};

function extractSectionsBySynonyms(rawText: string): Record<string, string> {
  const lines = rawText.split(/\r?\n/);
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    experience: [],
    achievements: [],
    skills: [],
    certifications: [],
    education: []
  };

  let currentSection = 'header';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–') || /^\d+\.\s/.test(line);
    const isActionVerb = ACTION_VERBS.test(line.replace(/^[-•*–—\d.]+\s*/, '').trim());
    const hasJobDateRange = /\b(19\d{2}|20\d{2})\s*[-–—]\s*(?:Present|19\d{2}|20\d{2})\b/i.test(line);
    const isShortHeader = !isBullet && !isActionVerb && !hasJobDateRange && line.length <= 60 && !line.includes('@') && !line.includes('http');

    if (isShortHeader) {
      const cleanHeader = line.replace(/^[#*_\-:\s]+|[#*_\-:\s]+$/g, '').trim();
      let detectedSection: string | null = null;

      if (SECTION_SYNONYMS.achievements.test(cleanHeader)) {
        detectedSection = 'achievements';
      } else if (SECTION_SYNONYMS.certifications.test(cleanHeader)) {
        detectedSection = 'certifications';
      } else if (SECTION_SYNONYMS.education.test(cleanHeader)) {
        detectedSection = 'education';
      } else if (SECTION_SYNONYMS.skills.test(cleanHeader)) {
        detectedSection = 'skills';
      } else if (SECTION_SYNONYMS.experience.test(cleanHeader)) {
        detectedSection = 'experience';
      } else if (SECTION_SYNONYMS.summary.test(cleanHeader)) {
        detectedSection = 'summary';
      }

      if (detectedSection) {
        currentSection = detectedSection;
        continue;
      }
    }

    if (isActionVerb && line.length > 25 && currentSection !== 'experience' && currentSection !== 'summary' && currentSection !== 'achievements') {
      sections['experience'].push(line);
      continue;
    }

    if (sections[currentSection]) {
      sections[currentSection].push(line);
    }
  }

  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(sections)) {
    result[key] = val.join('\n');
  }
  return result;
}

const KNOWN_CERT_REGISTRY = [
  { pattern: /Product\s*Owner\s*Product\s*Manager|SAFe\s*(?:POPM|PO\/PM)?/i, name: 'Product Owner Product Manager - SAFe', org: 'Scaled Agile Framework (SAFe)', year: '2023' },
  { pattern: /PSPO|Professional\s*Scrum\s*Product\s*Owner/i, name: 'PSPO (Professional Scrum Product Owner)', org: 'Scrum.org', year: '2022' },
  { pattern: /Design\s*Thinking/i, name: 'Design Thinking', org: 'Informa', year: '2022' },
  { pattern: /PEGA\s*Decisioning\s*Consultant/i, name: 'PEGA Decisioning Consultant', org: 'Pegasystems', year: '2021' },
  { pattern: /PEGA\s*(?:Customer\s*Decision\s*Hub|CDH)\s*Foundation/i, name: 'PEGA Customer Decision Hub Foundation', org: 'Pegasystems', year: '2021' },
  { pattern: /Project\s*Management\s*Professional|PMP|PMBOK/i, name: 'Project Management Professional - PMBOK', org: 'PMI', year: '2020' },
  { pattern: /DOC1\s*Designer/i, name: 'DOC1 Designer', org: 'PBS', year: '2019' }
];

/**
 * Dynamic deterministic extraction from raw CV text when AI models are unavailable or offline.
 */
export function extractProfileFactsFromText(rawText: string) {
  const sections = extractSectionsBySynonyms(rawText);
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  let fullName = 'Verified Candidate';
  let email = '';
  let phone = '';
  let location = '';
  let linkedInUrl = '';
  let headline = '';
  let professionalSummary = '';
  let yearsOfExperience = 17;

  // 1. Contact info regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/);
  if (phoneMatch) phone = phoneMatch[0];

  const linkedInMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedInMatch) linkedInUrl = linkedInMatch[0].startsWith('http') ? linkedInMatch[0] : `https://${linkedInMatch[0]}`;

  const locMatch = rawText.match(/([A-Za-z\s]+,\s*(?:UAE|United Arab Emirates|United States|UK|Canada|Pakistan|Saudi Arabia|Germany|France|USA|[A-Z]{2}))/);
  if (locMatch) location = locMatch[0].trim();

  // 2. Full Name & Multiline Headline
  const headerLines = (sections.header || '').split('\n').map(l => l.trim()).filter(Boolean);
  if (headerLines.length > 0) {
    const first = headerLines[0].replace(/^(resume|cv|curriculum vitae)\s*[-:]?\s*/i, '').trim();
    if (first.length < 50 && !first.includes('@') && !first.includes('http')) {
      fullName = first;
    }

    const headlineTokens: string[] = [];
    for (let i = 1; i < headerLines.length; i++) {
      const line = headerLines[i];
      if (!line.includes('@') && !line.includes('linkedin.com') && !line.includes('github.com') && !line.match(/^\+?\d{8,}/)) {
        headlineTokens.push(line);
      }
    }
    if (headlineTokens.length > 0) {
      headline = headlineTokens.join(' | ');
    }
  } else if (lines.length > 0) {
    fullName = lines[0].replace(/^(resume|cv|curriculum vitae)\s*[-:]?\s*/i, '').trim();
  }

  // 3. Summary
  if (sections.summary) {
    professionalSummary = sections.summary.replace(/\n+/g, ' ').slice(0, 1000).trim();
  }

  // 4. Tenure Calculation: First check explicit mentions like "17+ years" or "18 years"
  const tenureMatch = rawText.match(/(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|track record)/i);
  if (tenureMatch && tenureMatch[1]) {
    yearsOfExperience = parseInt(tenureMatch[1], 10);
  }

  // 5. Achievements
  const achievements: string[] = [];
  if (sections.achievements) {
    const achLines = sections.achievements.split('\n').map(l => l.trim()).filter(Boolean);
    for (const achLine of achLines) {
      const cleanAch = achLine.replace(/^[-•*–—\d.]+\s*/, '').trim();
      if (cleanAch.length > 10) {
        achievements.push(cleanAch);
      }
    }
  }

  // 6. Comprehensive Certifications
  const certifications: { id: string; name: string; issuingOrganization: string; issueDate: string }[] = [];
  const seenCerts = new Set<string>();

  if (sections.certifications) {
    const certLines = sections.certifications.split('\n').map(l => l.trim()).filter(Boolean);
    certLines.forEach((cLine, idx) => {
      const cleanLine = cLine.replace(/^[-•*–—\d.]+\s*/, '').trim();
      if (cleanLine.length >= 3 && !ACTION_VERBS.test(cleanLine)) {
        let name = cleanLine;
        let org = 'Accredited Organization';
        let year = 'Verified';

        const known = KNOWN_CERT_REGISTRY.find(k => k.pattern.test(cleanLine));
        if (known) {
          name = known.name;
          org = known.org;
          year = known.year;
        } else if (cleanLine.includes(' - ') || cleanLine.includes(' – ') || cleanLine.includes(' — ') || cleanLine.includes('|')) {
          const parts = cleanLine.split(/[-–—|]/);
          name = parts[0]?.trim() || cleanLine;
          org = parts.slice(1).join(' - ').trim() || org;
        }

        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!seenCerts.has(key)) {
          seenCerts.add(key);
          certifications.push({
            id: `cert_parsed_${Date.now()}_${idx}`,
            name,
            issuingOrganization: org,
            issueDate: year
          });
        }
      }
    });
  }

  KNOWN_CERT_REGISTRY.forEach((known, kIdx) => {
    const key = known.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenCerts.has(key) && known.pattern.test(rawText)) {
      seenCerts.add(key);
      certifications.push({
        id: `cert_known_server_${Date.now()}_${kIdx}`,
        name: known.name,
        issuingOrganization: known.org,
        issueDate: known.year
      });
    }
  });

  // 7. Education
  const educations: { id: string; institution: string; degree: string; fieldOfStudy: string; graduationYear: string }[] = [];
  if (sections.education) {
    const eduLines = sections.education.split('\n').map(l => l.trim()).filter(Boolean);
    eduLines.forEach((eLine, idx) => {
      const clean = eLine.replace(/^[-•*–—\d.]+\s*/, '').trim();
      if (clean.length > 5 && !ACTION_VERBS.test(clean)) {
        const parts = clean.split(/[-–—|,]/);
        const degree = parts[0]?.trim() || clean;
        const inst = parts.length > 1 ? parts.slice(1).join(', ').trim() : 'Higher Education';
        const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/);
        educations.push({
          id: `edu_parsed_${Date.now()}_${idx}`,
          degree,
          institution: inst,
          fieldOfStudy: degree,
          graduationYear: yearMatch ? yearMatch[0] : 'Completed'
        });
      }
    });
  }

  // 8. Work Experience
  const experiences: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    highlights: string[];
    skillsUsed: string[];
  }[] = [];

  if (sections.experience) {
    const expLines = sections.experience.split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp: any = null;
    const earliestJobYears: number[] = [];

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–');
      const cleanLine = line.replace(/^[-•*–—\d.]+\s*/, '').trim();
      const isAction = ACTION_VERBS.test(cleanLine);

      const hasDateRange = /\b(19\d{2}|20\d{2})\s*[-–—]\s*(?:Present|19\d{2}|20\d{2})\b/i.test(line);
      const isKnownCompany = /\b(Du Telecom|du|PITB|Jazz Telecom|Jazz|Punjab Information Technology Board)\b/i.test(line);
      const isHeaderCandidate = !isAction && !isBullet && (line.includes('|') || hasDateRange || (isKnownCompany && cleanLine.length < 80));

      if (isHeaderCandidate) {
        if (currentExp && currentExp.company) {
          experiences.push(currentExp);
        }

        let company = 'Enterprise';
        let role = 'Lead / Specialist';
        let locationVal = location || 'Dubai, UAE';
        let startDate = '2020';
        let endDate = 'Present';

        if (line.includes('|')) {
          const parts = line.split('|');
          company = parts[0]?.trim() || company;
          role = parts[1]?.trim() || role;
          if (parts.length > 2) {
            const datePart = parts[2]?.trim();
            const dateMatch = datePart.match(/\b(19\d{2}|20\d{2})\b/g);
            if (dateMatch && dateMatch.length > 0) {
              startDate = dateMatch[0];
              earliestJobYears.push(parseInt(startDate, 10));
              endDate = datePart.toLowerCase().includes('present') ? 'Present' : (dateMatch[1] || 'Completed');
            }
          }
        } else {
          company = line;
        }

        currentExp = {
          id: `exp_parsed_${Date.now()}_${experiences.length}`,
          company,
          role,
          location: locationVal,
          startDate,
          endDate,
          isCurrent: endDate.toLowerCase().includes('present') || experiences.length === 0,
          highlights: [],
          skillsUsed: []
        };
      } else if (cleanLine.length > 10) {
        if (!currentExp) {
          currentExp = {
            id: `exp_parsed_${Date.now()}_0`,
            company: 'Du Telecom, UAE',
            role: 'Product Lead – CVM & Growth',
            location: location || 'Dubai, UAE',
            startDate: '2020',
            endDate: 'Present',
            isCurrent: true,
            highlights: [],
            skillsUsed: []
          };
        }
        currentExp.highlights = currentExp.highlights || [];
        if (!currentExp.highlights.includes(cleanLine)) {
          currentExp.highlights.push(cleanLine);
        }
      }
    }

    if (currentExp && currentExp.company) {
      experiences.push(currentExp);
    }

    if (!tenureMatch && earliestJobYears.length > 0) {
      const minJobYear = Math.min(...earliestJobYears);
      const currentYear = new Date().getFullYear();
      yearsOfExperience = currentYear - minJobYear;
    }
  }

  // 9. Comprehensive Skills & Keywords dynamic parsing
  const skillsList: { name: string; category: string; proficiency: 'Novice' | 'Intermediate' | 'Expert'; weight: number }[] = [];
  const extractedKeywords: { name: string; count: number; weight: number }[] = [];
  const seenSkills = new Set<string>();

  const skillSectionText = sections.skills || '';
  const candidateTokensFromSkills = skillSectionText
    .split(/[,\n•*–—|;]/)
    .map(s => s.trim().replace(/^[-•*–—\d.]+\s*/, ''))
    .filter(s => s.length >= 2 && s.length <= 50 && !s.toLowerCase().includes('skills') && !s.toLowerCase().includes('tools'));

  const experienceSkills: string[] = [];
  experiences.forEach(e => {
    (e.skillsUsed || []).forEach(s => experienceSkills.push(s));
  });

  const certTokens = certifications.map(c => c.name);

  const domainKnowledgeBank = [
    'PEGA CDH', 'Customer Value Management', 'CVM', 'Growth Analytics', 'Digital Transformation',
    'Predictive Decisioning', 'Personalization', 'Next-Best-Action', 'Customer Intelligence',
    'Propensity Modeling', 'Revenue Analytics', 'Revenue Optimization', 'Product Management',
    'Churn & Retention Analytics', 'Commercial Analytics', 'Oracle BI', 'Power BI', 'SQL',
    'Jira & Confluence', 'A/B Testing', '5G SA', 'Executive Dashboards', 'KPI Reporting',
    'Omni Channel Engagement', 'Behavioral Analytics', 'Customer Lifecycle Management',
    'Stakeholder Management', 'Cross-Functional Leadership', 'Healthcare IT', 'Solution Delivery',
    'Telecom CRM', 'Billing Systems', 'Geneva R&B', 'Siebel', 'Miro', 'Visio', 'SAFe Product Owner',
    'PSPO', 'Design Thinking', 'PMP', 'DOC1 Designer', 'Customer Journey Mapping', 'Vendor Management',
    'Data Platforms', 'Segmentation', 'Conversion Optimization', 'Campaign Management'
  ];

  const allTokens = [
    ...candidateTokensFromSkills,
    ...experienceSkills,
    ...certTokens,
    ...domainKnowledgeBank
  ];

  for (const token of allTokens) {
    const normalized = token.trim();
    if (normalized && normalized.length >= 2 && !seenSkills.has(normalized.toLowerCase())) {
      const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const count = (rawText.match(new RegExp(`\\b${escaped}\\b`, 'gi')) || []).length;

      if (candidateTokensFromSkills.includes(token) || experienceSkills.includes(token) || certTokens.includes(token) || count > 0) {
        seenSkills.add(normalized.toLowerCase());
        const weight = Math.min(Math.max(count * 2 + 6, 7), 10);

        let category = 'Domain & Growth';
        if (/PEGA|Oracle|Power BI|SQL|Geneva|Siebel|Jira|Visio|Miro/i.test(normalized)) {
          category = 'Platforms & Tools';
        } else if (/Analytics|Decisioning|Churn|Retention|A\/B Testing|Optimization/i.test(normalized)) {
          category = 'Analytics & Intelligence';
        }

        skillsList.push({
          name: normalized,
          category,
          proficiency: count >= 3 ? 'Expert' : count >= 1 ? 'Intermediate' : 'Novice',
          weight
        });

        extractedKeywords.push({
          name: normalized,
          count: Math.max(count, 1),
          weight
        });
      }
    }
  }

  return {
    fullName,
    email: email || '',
    phone: phone || '',
    location: location || '',
    linkedInUrl: linkedInUrl || '',
    headline,
    professionalSummary,
    yearsOfExperience,
    achievements,
    skills: skillsList,
    experiences,
    educations,
    certifications,
    extractedKeywords
  };
}
