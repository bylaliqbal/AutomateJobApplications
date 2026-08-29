import {
  ProfileFacts,
  SearchCriteria,
  MasterJob,
  MatchScoreExplanation,
  MatchScoreComponent
} from '../types';

export function calculateMatchScore(
  job: MasterJob,
  profile: ProfileFacts,
  criteria: SearchCriteria
): MatchScoreExplanation {
  const weights = criteria.weights;
  const totalWeightSum =
    weights.title +
    weights.skills +
    weights.experience +
    weights.industry +
    weights.location +
    weights.workplace;

  const normalizedWeights = {
    title: (weights.title / totalWeightSum) * 100,
    skills: (weights.skills / totalWeightSum) * 100,
    experience: (weights.experience / totalWeightSum) * 100,
    industry: (weights.industry / totalWeightSum) * 100,
    location: (weights.location / totalWeightSum) * 100,
    workplace: (weights.workplace / totalWeightSum) * 100,
  };

  // 1. Title matching
  const jobTitleLower = job.title.toLowerCase();
  let titleScore = 20; // baseline
  let titleEvidence = 'Partial match with standard engineering hierarchy.';

  const isExactTitle = criteria.targetTitles.some(
    t => jobTitleLower.includes(t.toLowerCase()) || t.toLowerCase().includes(jobTitleLower)
  );

  if (isExactTitle) {
    titleScore = 100;
    titleEvidence = `Direct match with target title criteria (${criteria.targetTitles.find(t => jobTitleLower.includes(t.toLowerCase())) || job.title}).`;
  } else if (
    jobTitleLower.includes('software') ||
    jobTitleLower.includes('engineer') ||
    jobTitleLower.includes('full-stack') ||
    jobTitleLower.includes('backend') ||
    jobTitleLower.includes('staff') ||
    jobTitleLower.includes('lead')
  ) {
    titleScore = 75;
    titleEvidence = 'Strong alignment with software engineering and architecture seniority.';
  } else if (jobTitleLower.includes('developer') || jobTitleLower.includes('tech')) {
    titleScore = 55;
    titleEvidence = 'Moderate alignment with technology and developer role profiles.';
  } else {
    titleScore = 15;
    titleEvidence = 'Low alignment with target engineering leadership titles.';
  }

  // 2. Skills matching
  const candidateSkills = profile.skills.map(s => (typeof s === 'string' ? s : (s as any).name).toLowerCase());
  const jobSkills = job.requiredSkills.map(s => (typeof s === 'string' ? s : (s as any).name).toLowerCase());
  const jobText = (job.description + ' ' + job.requirements.join(' ')).toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach(reqSkill => {
    const sLower = reqSkill.toLowerCase();
    const hasSkill = candidateSkills.some(cs => cs === sLower || cs.includes(sLower) || sLower.includes(cs));
    if (hasSkill) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  let skillsScore = 0;
  if (job.requiredSkills.length > 0) {
    skillsScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
  } else {
    skillsScore = 70;
  }

  const skillsEvidence = `Matched ${matchedSkills.length} of ${job.requiredSkills.length} required skills (${matchedSkills.slice(0, 4).join(', ')}${matchedSkills.length > 4 ? '...' : ''}).`;

  // 3. Experience matching
  let experienceScore = 50;
  let experienceEvidence = '';
  const years = profile.yearsOfExperience;

  if (jobTitleLower.includes('staff') || jobTitleLower.includes('principal') || jobTitleLower.includes('lead')) {
    if (years >= 7) {
      experienceScore = 98;
      experienceEvidence = `${years} years of verified experience exceeds the 7+ year threshold for Staff/Lead.`;
    } else {
      experienceScore = 65;
      experienceEvidence = `${years} years of experience is near the standard threshold for Senior/Staff.`;
    }
  } else if (jobTitleLower.includes('senior')) {
    if (years >= 5) {
      experienceScore = 100;
      experienceEvidence = `${years} years of experience fully qualifies for Senior-level scope.`;
    } else {
      experienceScore = 70;
      experienceEvidence = `${years} years of experience partially meets senior scope.`;
    }
  } else {
    experienceScore = 90;
    experienceEvidence = `${years} years of proven full-stack and systems experience.`;
  }

  // 4. Industry matching
  let industryScore = 40;
  let industryEvidence = 'General technology and enterprise software domain.';

  const isMonitoredCompany = job.companyStatus === 'permanently_monitored' || job.companyStatus === 'approved';
  const industryKeywords = criteria.industries.map(i => i.toLowerCase());
  const hasIndustryMatch = industryKeywords.some(ind => jobText.includes(ind) || job.company.toLowerCase().includes(ind));

  if (isMonitoredCompany && hasIndustryMatch) {
    industryScore = 100;
    industryEvidence = `Approved priority company (${job.company}) in targeted domain (${criteria.industries[0]}).`;
  } else if (isMonitoredCompany) {
    industryScore = 90;
    industryEvidence = `Pre-approved target company list member (${job.company}).`;
  } else if (hasIndustryMatch) {
    industryScore = 85;
    industryEvidence = 'Domain matches configured search industries.';
  } else {
    industryScore = 50;
    industryEvidence = 'Standard software and internet technology industry.';
  }

  // 5. Location matching
  let locationScore = 50;
  let locationEvidence = '';

  const jobLocLower = job.location.toLowerCase();
  const profileLocLower = profile.location.toLowerCase();

  if (jobLocLower.includes('remote') || criteria.isWorldwide) {
    locationScore = 100;
    locationEvidence = 'Remote / Worldwide eligible location.';
  } else if (
    jobLocLower.includes('san francisco') ||
    jobLocLower.includes('ca') ||
    jobLocLower.includes(profileLocLower)
  ) {
    locationScore = 95;
    locationEvidence = `Matches candidate home base (${profile.location}).`;
  } else if (criteria.cities.some(c => jobLocLower.includes(c.split(',')[0].toLowerCase()))) {
    locationScore = 80;
    locationEvidence = `Matches configured target metro area (${job.location}).`;
  } else {
    locationScore = 40;
    locationEvidence = `Outside primary target cities (${job.location}), but may offer relocation or flexible options.`;
  }

  // 6. Workplace arrangement matching
  let workplaceScore = 60;
  let workplaceEvidence = '';

  if (criteria.workplaceTypes.includes(job.workplaceType)) {
    workplaceScore = 100;
    workplaceEvidence = `Direct match with desired workplace mode (${job.workplaceType}).`;
  } else if (job.workplaceType === 'HYBRID' && criteria.workplaceTypes.includes('ON_SITE')) {
    workplaceScore = 80;
    workplaceEvidence = 'Hybrid arrangement is acceptable within commute radius.';
  } else {
    workplaceScore = 25;
    workplaceEvidence = `Configured for ${criteria.workplaceTypes.join('/')}, but job is ${job.workplaceType}.`;
  }

  // Calculate weighted total
  const weightedTitle = (titleScore * normalizedWeights.title) / 100;
  const weightedSkills = (skillsScore * normalizedWeights.skills) / 100;
  const weightedExp = (experienceScore * normalizedWeights.experience) / 100;
  const weightedIndustry = (industryScore * normalizedWeights.industry) / 100;
  const weightedLocation = (locationScore * normalizedWeights.location) / 100;
  const weightedWorkplace = (workplaceScore * normalizedWeights.workplace) / 100;

  const rawTotal = Math.round(
    weightedTitle +
    weightedSkills +
    weightedExp +
    weightedIndustry +
    weightedLocation +
    weightedWorkplace
  );

  const totalScore = Math.min(100, Math.max(0, rawTotal));
  const isQualifying = totalScore >= criteria.matchThreshold;
  const isHighMatch = totalScore >= 80;

  const components: { [key: string]: MatchScoreComponent } = {
    title: {
      name: 'Job Title & Seniority',
      weight: Math.round(normalizedWeights.title),
      rawScore: titleScore,
      weightedScore: Math.round(weightedTitle),
      evidence: titleEvidence
    },
    skills: {
      name: 'Skills & Keywords',
      weight: Math.round(normalizedWeights.skills),
      rawScore: skillsScore,
      weightedScore: Math.round(weightedSkills),
      evidence: skillsEvidence
    },
    experience: {
      name: 'Experience Depth',
      weight: Math.round(normalizedWeights.experience),
      rawScore: experienceScore,
      weightedScore: Math.round(weightedExp),
      evidence: experienceEvidence
    },
    industry: {
      name: 'Industry & Company',
      weight: Math.round(normalizedWeights.industry),
      rawScore: industryScore,
      weightedScore: Math.round(weightedIndustry),
      evidence: industryEvidence
    },
    location: {
      name: 'Location Match',
      weight: Math.round(normalizedWeights.location),
      rawScore: locationScore,
      weightedScore: Math.round(weightedLocation),
      evidence: locationEvidence
    },
    workplace: {
      name: 'Workplace Policy',
      weight: Math.round(normalizedWeights.workplace),
      rawScore: workplaceScore,
      weightedScore: Math.round(weightedWorkplace),
      evidence: workplaceEvidence
    }
  };

  let advisorySummary = '';
  if (isHighMatch) {
    advisorySummary = `Strong qualifying match (${totalScore}/100). High alignment on core stack (${matchedSkills.slice(0, 3).join(', ')}) and leadership experience at ${job.company}.`;
  } else if (isQualifying) {
    advisorySummary = `Solid qualifying match (${totalScore}/100). Meets minimum qualification threshold (${criteria.matchThreshold}). Key skills align with target scope.`;
  } else {
    advisorySummary = `Non-qualifying match (${totalScore}/100). Falls below configured threshold of ${criteria.matchThreshold}. Missing critical competencies: ${missingSkills.slice(0, 3).join(', ') || 'Domain divergence'}.`;
  }

  return {
    jobId: job.id,
    totalScore,
    threshold: criteria.matchThreshold,
    isQualifying,
    isHighMatch,
    scoreVersion: 'v2.1-deterministic',
    components: components as any,
    matchedSkills,
    missingSkills,
    advisorySummary,
    calculatedAt: new Date().toISOString()
  };
}
