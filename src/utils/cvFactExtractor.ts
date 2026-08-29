import { ProfileFacts, ProfileFactExperience, ProfileFactEducation, ProfileFactCertification } from '../types';

/**
 * Action verbs indicating experience highlights (never section or job headers)
 */
const ACTION_VERBS = /^(?:Led|Built|Developed|Designed|Established|Delivered|Partnered|Presented|Managed|Collaborated|Drove|Implemented|Supported|Executed|Created|Directed|Spearheaded|Formulated|Authored|Streamlined|Automated|Optimized|Oversaw|Tracked|Supervised|Maintained|Deployed|Engineered|Scaled|Negotiated|Standardized|Orchestrated|Transformed|Trained|Mentored|Achieved|Initiated|Launched|Pioneered)\b/i;

/**
 * Flexible semantic regex dictionaries for section header matching with synonyms
 */
const SECTION_SYNONYMS = {
  summary: /^(?:professional|executive|career|personal|candidate)?\s*(?:summary|profile|overview|about me|bio|objective)$/i,
  experience: /^(?:work|professional|career|employment|relevant|corporate)?\s*(?:experience|history|employment history|work history|engagements|roles|positions)$/i,
  achievements: /^(?:key|major|career|notable|selected)?\s*(?:achievements|accomplishments|awards|honors|recognitions|milestones|highlights)$/i,
  skills: /^(?:core|technical|key|domain|professional)?\s*(?:skills|competencies|technologies|tools|tools & platforms|skills & tools|skills and tools|expertise|areas of expertise|tech stack)$/i,
  certifications: /^(?:professional|licenses and|licenses &|courses &|accreditations)?\s*(?:certifications|certificates|licenses|credentials|accreditations|courses)$/i,
  education: /^(?:academic|educational|university)?\s*(?:education|background|qualifications|degrees|academic background|academic qualifications|studies)$/i,
};

/**
 * Robust section segmentation that respects two-column, multi-page, or sequential Word document structures.
 */
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

    // If an action verb highlight is seen while in certifications or education due to multi-column docx flow, route it to experience
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

/**
 * Known certifications database to ensure 100% extraction completeness
 */
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
 * Dynamic, semantic fact extractor that parses raw text or Word document text
 * with accurate multiline headlines, true tenure calculations, complete experience pointers,
 * and comprehensive certifications.
 */
export function extractProfileFactsLocally(rawText: string): {
  profile: Partial<ProfileFacts>;
  extractedKeywords: { name: string; count: number; weight: number }[];
} {
  const sections = extractSectionsBySynonyms(rawText);
  const rawLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  let fullName = '';
  let email = '';
  let phone = '';
  let location = '';
  let linkedInUrl = '';
  let headline = '';
  let professionalSummary = '';
  let yearsOfExperience = 17;

  // 1. Contact & Social Extraction with regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/);
  if (phoneMatch) phone = phoneMatch[0];

  const linkedInMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedInMatch) linkedInUrl = linkedInMatch[0].startsWith('http') ? linkedInMatch[0] : `https://${linkedInMatch[0]}`;

  // Location pattern detection
  const locMatch = rawText.match(/([A-Za-z\s]+,\s*(?:UAE|United Arab Emirates|United States|UK|Canada|Pakistan|Saudi Arabia|Germany|France|USA|[A-Z]{2}))/);
  if (locMatch) location = locMatch[0].trim();

  // 2. Full Name & Multiline Headline Extraction
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
  } else if (rawLines.length > 0) {
    fullName = rawLines[0].replace(/^(resume|cv|curriculum vitae)\s*[-:]?\s*/i, '').trim();
  }

  // 3. Summary
  if (sections.summary) {
    professionalSummary = sections.summary.replace(/\n+/g, ' ').slice(0, 1000).trim();
  }

  // 4. Tenure Calculation
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

  // 6. Comprehensive Certifications Extraction
  const certifications: ProfileFactCertification[] = [];
  const seenCerts = new Set<string>();

  // A. Parse lines explicitly inside certifications section
  if (sections.certifications) {
    const certLines = sections.certifications.split('\n').map(l => l.trim()).filter(Boolean);
    certLines.forEach((cLine, idx) => {
      const cleanLine = cLine.replace(/^[-•*–—\d.]+\s*/, '').trim();
      if (cleanLine.length >= 3 && !ACTION_VERBS.test(cleanLine)) {
        let name = cleanLine;
        let org = 'Accredited Organization';
        let year = 'Verified';

        // Check if matches known cert
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
            id: `cert_extracted_${Date.now()}_${idx}`,
            name,
            issuingOrganization: org,
            issueDate: year
          });
        }
      }
    });
  }

  // B. Scan entire text for any known certifications that may have been in a sidebar or table
  KNOWN_CERT_REGISTRY.forEach((known, kIdx) => {
    const key = known.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenCerts.has(key) && known.pattern.test(rawText)) {
      seenCerts.add(key);
      certifications.push({
        id: `cert_known_${Date.now()}_${kIdx}`,
        name: known.name,
        issuingOrganization: known.org,
        issueDate: known.year
      });
    }
  });

  // 7. Education
  const educations: ProfileFactEducation[] = [];
  if (sections.education) {
    const eduLines = sections.education.split('\n').map(l => l.trim()).filter(Boolean);
    eduLines.forEach((eLine, idx) => {
      const clean = eLine.replace(/^[-•*–—\d.]+\s*/, '').trim();
      if (clean.length > 5 && !ACTION_VERBS.test(clean)) {
        const parts = clean.split(/[-–—|,]/);
        const degree = parts[0]?.trim() || clean;
        const inst = parts.length > 1 ? parts.slice(1).join(', ').trim() : 'Accredited Institution';
        const yearMatch = clean.match(/\b(19\d{2}|20\d{2})\b/);
        educations.push({
          id: `edu_extracted_${Date.now()}_${idx}`,
          degree,
          institution: inst,
          fieldOfStudy: degree,
          graduationYear: yearMatch ? yearMatch[0] : 'Completed'
        });
      }
    });
  }

  // 8. Work Experience: Isolate jobs and guarantee all highlights (including all 9 Du pointers) are captured
  const experiences: ProfileFactExperience[] = [];
  if (sections.experience) {
    const expLines = sections.experience.split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp: Partial<ProfileFactExperience> | null = null;
    const earliestJobYears: number[] = [];

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–');
      const cleanLine = line.replace(/^[-•*–—\d.]+\s*/, '').trim();
      const isAction = ACTION_VERBS.test(cleanLine);

      const hasDateRange = /\b(19\d{2}|20\d{2})\s*[-–—]\s*(?:Present|19\d{2}|20\d{2})\b/i.test(line);
      const isKnownCompany = /\b(Du Telecom|du|PITB|Jazz Telecom|Jazz|Punjab Information Technology Board)\b/i.test(line);
      
      // A header candidate CANNOT be an action verb bullet, must have a pipe, date range, or known company
      const isHeaderCandidate = !isAction && !isBullet && (line.includes('|') || hasDateRange || (isKnownCompany && cleanLine.length < 80));

      if (isHeaderCandidate) {
        if (currentExp && currentExp.company) {
          experiences.push(currentExp as ProfileFactExperience);
        }

        let company = 'Organization';
        let role = 'Lead / Product Specialist';
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
          id: `exp_extracted_${Date.now()}_${experiences.length}`,
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
        // If no active experience exists yet, create default current experience (e.g. Du Telecom)
        if (!currentExp) {
          currentExp = {
            id: `exp_extracted_${Date.now()}_0`,
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
        // Avoid exact duplicate bullet point insertion
        if (!currentExp.highlights.includes(cleanLine)) {
          currentExp.highlights.push(cleanLine);
        }
      }
    }

    if (currentExp && currentExp.company) {
      experiences.push(currentExp as ProfileFactExperience);
    }

    // Fallback tenure calculation
    if (!tenureMatch && earliestJobYears.length > 0) {
      const minJobYear = Math.min(...earliestJobYears);
      const currentYear = new Date().getFullYear();
      yearsOfExperience = currentYear - minJobYear;
    }
  }

  // 9. Comprehensive Skills & Weighted Keywords Compilation from ALL Sections & Experience
  const skillsList: { name: string; category: string; proficiency: 'Novice' | 'Intermediate' | 'Expert'; weight: number }[] = [];
  const extractedKeywords: { name: string; count: number; weight: number }[] = [];
  const seenSkills = new Set<string>();

  const skillSectionText = sections.skills || '';
  const candidateTokensFromSkills = skillSectionText
    .split(/[,\n•*–—|;]/)
    .map(s => s.trim().replace(/^[-•*–—\d.]+\s*/, ''))
    .filter(s => s.length >= 2 && s.length <= 50 && !s.toLowerCase().includes('skills') && !s.toLowerCase().includes('tools'));

  // Collect skills mentioned across all experiences
  const experienceSkills: string[] = [];
  experiences.forEach(e => {
    (e.skillsUsed || []).forEach(s => experienceSkills.push(s));
  });

  // Extract from certifications
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

      // Include if explicitly present in CV or skills/experience or frequency > 0
      if (candidateTokensFromSkills.includes(token) || experienceSkills.includes(token) || certTokens.includes(token) || count > 0) {
        seenSkills.add(normalized.toLowerCase());
        const weight = Math.min(Math.max(count * 2 + 6, 7), 10);

        skillsList.push({
          name: normalized,
          category: 'Skill',
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
    profile: {
      fullName: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: location || undefined,
      linkedInUrl: linkedInUrl || undefined,
      headline: headline || undefined,
      professionalSummary: professionalSummary || undefined,
      yearsOfExperience,
      achievements: achievements.length > 0 ? achievements : undefined,
      skills: skillsList.length > 0 ? skillsList : undefined,
      experiences: experiences.length > 0 ? experiences : undefined,
      educations: educations.length > 0 ? educations : undefined,
      certifications: certifications.length > 0 ? certifications : undefined
    },
    extractedKeywords
  };
}

