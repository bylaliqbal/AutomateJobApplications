export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY';
export type WorkplaceType = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type SeniorityLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'DIRECTOR' | 'EXECUTIVE';

export type JobStatus =
  | 'Discovered'
  | 'Saved'
  | 'Applied'
  | 'Submitted'
  | 'Interviewing'
  | 'Rejected'
  | 'Offer'
  | 'Closed'
  | 'Ignored';

export type CompanyStatus = 'candidate' | 'approved' | 'rejected' | 'blacklisted' | 'permanently_monitored';

export interface WeightedKeyword {
  id: string;
  name: string;
  weight: number; // 1 to 10
  source: 'CV' | 'LinkedIn' | 'Manual' | 'Combined';
  cvCount: number;
  linkedInCount: number;
  combinedCount: number;
  lastUpdated: string;
}

export interface ProfileFactExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string; // or 'Present'
  isCurrent: boolean;
  highlights: string[]; // verified bullet points
  skillsUsed: string[];
}

export interface ProfileFactEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  honors?: string;
}

export interface ProfileFactCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
}

export interface ProfileFacts {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  headline: string;
  professionalSummary: string;
  yearsOfExperience: number;
  experiences: ProfileFactExperience[];
  educations: ProfileFactEducation[];
  certifications: ProfileFactCertification[];
  skills: { name: string; category: string; proficiency: 'Novice' | 'Intermediate' | 'Expert'; weight: number }[];
  languages: string[];
  achievements?: string[];
  isLockedForEditing?: boolean;
}

export interface CoreCVFile {
  id: string;
  filename: string;
  fileSize: number;
  uploadedAt: string;
  version: number;
  rawText: string;
  formattedHtml?: string;
  isAuthoritative: boolean;
}

export interface SearchCriteria {
  id: string;
  name: string;
  targetTitles: string[];
  weightedSkills: { name: string; weight: number }[];
  industries: string[];
  seniorityLevels: SeniorityLevel[];
  employmentTypes: EmploymentType[];
  workplaceTypes: WorkplaceType[];
  countries: string[];
  cities: string[];
  isWorldwide: boolean;
  postingAgeHours: number; // e.g. 72 (3 days)
  matchThreshold: number; // default 50
  weights: {
    title: number;       // default 30
    skills: number;      // default 35
    experience: number;  // default 15
    industry: number;    // default 10
    location: number;    // default 5
    workplace: number;   // default 5
  };
  notificationRules: {
    notifyNewDiscovered: boolean;
    notifyHighMatch: boolean; // 80+
    notifyPriorityCompanies: boolean;
    channel: 'web' | 'mobile' | 'both';
  };
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  careersUrl: string;
  status: CompanyStatus;
  notes: string;
  referrals: Referral[];
  lastCrawledAt?: string;
}

export interface Referral {
  id: string;
  name: string;
  role: string;
  email?: string;
  linkedInUrl?: string;
  companyName: string;
  status: 'Identified' | 'Contacted' | 'Agreed' | 'Referred';
  notes: string;
}

export interface JobSourceRecord {
  provider: 'LinkedIn' | 'Indeed' | 'Company_ATS' | 'Apify';
  sourceJobId: string;
  sourceUrl: string;
  applicationUrl: string;
  retrievedTime: string;
  hasReliablePostingDate: boolean;
  postingDate: string; // ISO
  discoveryDate: string; // ISO
  rawPayloadSnippet: string;
}

export interface MasterJob {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  salaryRange?: string;
  sources: JobSourceRecord[];
  isPreviousSearch: boolean;
  firstDiscoveredAt: string;
  lastDiscoveredAt: string;
  applicationUrl: string;
  status: JobStatus;
  notes: string;
  companyStatus: CompanyStatus;
  referralsCount: number;
}

export interface MatchScoreComponent {
  name: string;
  weight: number;
  rawScore: number; // 0 - 100
  weightedScore: number;
  evidence: string;
}

export interface MatchScoreExplanation {
  jobId: string;
  totalScore: number; // 0 - 100
  threshold: number;
  isQualifying: boolean; // score >= threshold
  isHighMatch: boolean; // score >= 80
  scoreVersion: string;
  components: {
    title: MatchScoreComponent;
    skills: MatchScoreComponent;
    experience: MatchScoreComponent;
    industry: MatchScoreComponent;
    location: MatchScoreComponent;
    workplace: MatchScoreComponent;
  };
  matchedSkills: string[];
  missingSkills: string[];
  advisorySummary: string;
  calculatedAt: string;
}

export interface FactEvidenceItem {
  id: string;
  claim: string;
  section: 'Summary' | 'Experience' | 'Skill' | 'Certification';
  sourceCoreFactId: string;
  sourceTextSnippet: string;
  isTruthGrounded: boolean;
  status: 'Verified' | 'Modified_Rephrased' | 'Flagged';
  auditNote: string;
}

export interface TailoredDocument {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  generatedAt: string;
  version: number;
  cvFileName: string;
  coverLetterFileName: string;
  cvContent: {
    fullName: string;
    contactLine: string;
    tailoredHeadline: string;
    tailoredSummary: string;
    achievements?: string[];
    highlightedSkills: string[];
    experiences: {
      company: string;
      role: string;
      dates: string;
      location: string;
      rephrasedBullets: string[];
    }[];
    educations: {
      degree: string;
      institution: string;
      year: string;
    }[];
    certifications: string[];
  };
  coverLetterContent: {
    date: string;
    recipient: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
  };
  factEvidenceMap: FactEvidenceItem[];
  truthAuditPassed: boolean;
  modelMetadata: {
    model: string;
    tokenCount: number;
    promptVersion: string;
  };
}

export interface SearchRun {
  id: string;
  startedAt: string;
  completedAt: string;
  criteriaSnapshotName: string;
  providersQueried: string[];
  totalJobsFetched: number;
  newJobsCount: number;
  duplicatesConsolidated: number;
  qualifyingJobsCount: number;
  highMatchCount: number;
  status: 'Completed' | 'Running' | 'Failed';
}

export interface PlatformNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  jobId?: string;
  companyName?: string;
  matchScore?: number;
  type: 'NEW_DISCOVERY' | 'HIGH_MATCH' | 'PRIORITY_COMPANY' | 'SYSTEM';
  isRead: boolean;
  isPriority: boolean;
}
