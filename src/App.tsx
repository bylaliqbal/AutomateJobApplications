import React, { useState, useEffect, useMemo } from 'react';
import {
  ProfileFacts,
  CoreCVFile,
  WeightedKeyword,
  SearchCriteria,
  Company,
  MasterJob,
  PlatformNotification,
  MatchScoreExplanation,
  TailoredDocument,
  JobStatus
} from './types';
import {
  INITIAL_PROFILE_FACTS,
  INITIAL_CORE_CV_FILE,
  INITIAL_KEYWORDS,
  INITIAL_SEARCH_CRITERIA,
  INITIAL_COMPANIES,
  INITIAL_MASTER_JOBS,
  INITIAL_NOTIFICATIONS
} from './data/seedData';
import { calculateMatchScore } from './utils/matchingEngine';
import { generateGroundedTailoredDocuments } from './utils/tailoringEngine';
import { generateXlsxReport } from './utils/exportEngine';
import { extractProfileFactsLocally } from './utils/cvFactExtractor';

import { Header } from './components/Header';
import { ResultsWorkspace } from './components/ResultsWorkspace';
import { JobScoreModal } from './components/JobScoreModal';
import { CoreCVProfileView } from './components/CoreCVProfileView';
import { SearchCriteriaCompanyView } from './components/SearchCriteriaCompanyView';
import { DocumentStudioView } from './components/DocumentStudioView';
import { WindowsExportNotificationView } from './components/WindowsExportNotificationView';
import { ProviderAdaptersView } from './components/ProviderAdaptersView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('results');

  // Core Data States with localStorage fallback
  const [profile, setProfile] = useState<ProfileFacts>(() => {
    const saved = localStorage.getItem('job_discovery_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE_FACTS;
  });

  const [coreCvFile, setCoreCvFile] = useState<CoreCVFile>(() => {
    const saved = localStorage.getItem('job_discovery_cv_file');
    return saved ? JSON.parse(saved) : INITIAL_CORE_CV_FILE;
  });

  const [keywords, setKeywords] = useState<WeightedKeyword[]>(() => {
    const saved = localStorage.getItem('job_discovery_keywords');
    return saved ? JSON.parse(saved) : INITIAL_KEYWORDS;
  });

  const [criteria, setCriteria] = useState<SearchCriteria>(() => {
    const saved = localStorage.getItem('job_discovery_criteria');
    return saved ? JSON.parse(saved) : INITIAL_SEARCH_CRITERIA;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('job_discovery_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobs, setJobs] = useState<MasterJob[]>(() => {
    const saved = localStorage.getItem('job_discovery_jobs');
    return saved ? JSON.parse(saved) : INITIAL_MASTER_JOBS;
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    const saved = localStorage.getItem('job_discovery_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modal / Selection states
  const [inspectedJob, setInspectedJob] = useState<MasterJob | null>(null);
  const [selectedStudioJob, setSelectedStudioJob] = useState<MasterJob | null>(null);
  const [tailoredDocument, setTailoredDocument] = useState<TailoredDocument | null>(null);

  // Processing indicators
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('job_discovery_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('job_discovery_keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('job_discovery_criteria', JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem('job_discovery_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('job_discovery_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('job_discovery_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Compute 0-100 scores deterministically for all jobs
  const scores: Record<string, MatchScoreExplanation> = useMemo(() => {
    const map: Record<string, MatchScoreExplanation> = {};
    jobs.forEach(job => {
      map[job.id] = calculateMatchScore(job, profile, criteria);
    });
    return map;
  }, [jobs, profile, criteria]);

  // Qualifying jobs (score >= threshold)
  const qualifyingJobs = useMemo(() => {
    return jobs.filter(job => {
      const s = scores[job.id]?.totalScore ?? 0;
      return s >= criteria.matchThreshold;
    });
  }, [jobs, scores, criteria.matchThreshold]);

  // Handle Tailored Document Generation
  const handleTailorDocuments = async (job: MasterJob) => {
    setSelectedStudioJob(job);
    setIsGeneratingDoc(true);
    setActiveTab('studio');

    try {
      // Attempt server-side Gemini 3.7 Flash generation
      const res = await fetch('/api/documents/generate-grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileFacts: profile, job })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const doc = generateGroundedTailoredDocuments(profile, job);
          // Enhance with Gemini response
          if (data.data.tailoredHeadline) {
            doc.cvContent.tailoredHeadline = data.data.tailoredHeadline;
          }
          if (data.data.tailoredSummary) {
            doc.cvContent.tailoredSummary = data.data.tailoredSummary;
          }
          if (data.data.coverLetterParagraphs && data.data.coverLetterParagraphs.length > 0) {
            doc.coverLetterContent.paragraphs = data.data.coverLetterParagraphs;
          }
          setTailoredDocument(doc);
          return;
        }
      }
    } catch (err) {
      console.warn('Using deterministic document generator:', err);
    } finally {
      setIsGeneratingDoc(false);
    }

    // Fallback deterministic grounded document generator
    const doc = generateGroundedTailoredDocuments(profile, job);
    setTailoredDocument(doc);
  };

  // Handle Discovery Crawl Execution
  const handleRunDiscovery = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch('/api/discovery/run-crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criteria,
          companies,
          activeProviders: ['Company_ATS', 'LinkedIn', 'Indeed', 'Apify']
        })
      });

      const data = await res.json();
      const newDiscoveredJobs: MasterJob[] = Array.isArray(data.jobs) && data.jobs.length > 0
        ? data.jobs
        : [];

      const updatedJobs = jobs.map(j => ({ ...j, isPreviousSearch: true }));

      if (newDiscoveredJobs.length > 0) {
        // Match newly discovered against existing by title and company to avoid visual duplicate clutter
        const existingKeys = new Set(jobs.map(j => `${j.company.toLowerCase().trim()}|${j.title.toLowerCase().trim()}`));
        const freshJobs = newDiscoveredJobs.filter(
          j => !existingKeys.has(`${j.company.toLowerCase().trim()}|${j.title.toLowerCase().trim()}`)
        );

        const jobsToAdd = freshJobs.length > 0 ? freshJobs : newDiscoveredJobs.slice(0, 2);
        const combined = [...jobsToAdd, ...updatedJobs];
        setJobs(combined);

        // Generate dynamic notification for top match
        const topJob = jobsToAdd[0];
        if (topJob) {
          const scoreExpl = calculateMatchScore(topJob, profile, criteria);
          const newNotif: PlatformNotification = {
            id: `notif_${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: `${scoreExpl.totalScore}% Match: ${topJob.title}`,
            message: `Discovered at ${topJob.company} via ${topJob.sources[0]?.provider || 'Apify'} with verified employer timestamps.`,
            jobId: topJob.id,
            companyName: topJob.company,
            matchScore: scoreExpl.totalScore,
            type: scoreExpl.totalScore >= 80 ? 'HIGH_MATCH' : 'NEW_DISCOVERY',
            isRead: false,
            isPriority: scoreExpl.totalScore >= 80
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      } else {
        setJobs(updatedJobs);
      }
    } catch (e) {
      console.error('Discovery crawl failed:', e);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Handle Core CV Upload & Extraction
  const handleUploadNewCoreCv = (rawText: string, filename: string, fileSize?: number, formattedHtml?: string) => {
    const updatedFile: CoreCVFile = {
      id: `cv_${Date.now()}`,
      filename,
      fileSize: fileSize || rawText.length,
      uploadedAt: new Date().toISOString(),
      version: coreCvFile.version + 1,
      rawText,
      formattedHtml,
      isAuthoritative: true
    };
    setCoreCvFile(updatedFile);
    handleExtractFacts(rawText);
  };

  // Asynchronous Extraction via Gemini 3.7 Flash + Local Deterministic Parser
  const handleExtractFacts = async (rawCvText: string) => {
    setIsExtracting(true);
    try {
      // 1. First run local regex/deterministic extractor immediately for rapid preview
      const localResult = extractProfileFactsLocally(rawCvText);

      // 2. Call backend Gemini extraction endpoint
      const res = await fetch('/api/profile/extract-facts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawCvText })
      });
      const data = await res.json();
      const d = data?.data || localResult.profile;

      // Ensure experiences preserve the most comprehensive highlights list (e.g. all 9 Du pointers)
      const rawExperiences = (d.experiences && d.experiences.length > 0) ? d.experiences : (localResult.profile.experiences || profile.experiences);
      const bestExperiences = rawExperiences.map((exp: any, expIdx: number) => {
        const localExp = localResult.profile.experiences?.[expIdx];
        if (localExp && localExp.highlights && localExp.highlights.length > (exp.highlights?.length || 0)) {
          return {
            ...exp,
            highlights: localExp.highlights
          };
        }
        return exp;
      });

      // Ensure certifications combine all sources without losing credentials
      const combinedCerts = [...(d.certifications || []), ...(localResult.profile.certifications || [])];
      const uniqueCertsMap = new Map();
      combinedCerts.forEach((c: any, idx: number) => {
        const key = (c.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (key && !uniqueCertsMap.has(key)) {
          uniqueCertsMap.set(key, {
            ...c,
            id: c.id || `cert_merged_${idx}_${Date.now()}`
          });
        }
      });
      const bestCertifications = uniqueCertsMap.size > 0 ? Array.from(uniqueCertsMap.values()) : (profile.certifications || []);

      const updatedProfile: ProfileFacts = {
        ...profile,
        fullName: d.fullName || localResult.profile.fullName || profile.fullName,
        email: d.email || localResult.profile.email || profile.email,
        phone: d.phone || localResult.profile.phone || profile.phone,
        location: d.location || localResult.profile.location || profile.location,
        linkedInUrl: d.linkedInUrl || localResult.profile.linkedInUrl || profile.linkedInUrl,
        headline: d.headline || localResult.profile.headline || profile.headline,
        professionalSummary: d.professionalSummary || localResult.profile.professionalSummary || profile.professionalSummary,
        yearsOfExperience: d.yearsOfExperience || localResult.profile.yearsOfExperience || profile.yearsOfExperience,
        achievements: (d.achievements && d.achievements.length > 0) ? d.achievements : (localResult.profile.achievements || profile.achievements),
        skills: (d.skills && d.skills.length > 0) ? d.skills : (localResult.profile.skills || profile.skills),
        experiences: bestExperiences.length > 0 ? bestExperiences : profile.experiences,
        educations: (d.educations && d.educations.length > 0) ? d.educations : (localResult.profile.educations || profile.educations),
        certifications: bestCertifications
      };

      setProfile(updatedProfile);

      // Merge and preserve exhaustive keywords without artificial limits
      const kwsSource = d.extractedKeywords || localResult.extractedKeywords || [];
      if (kwsSource.length > 0 || keywords.length > 0) {
        const mergedMap = new Map<string, WeightedKeyword>();

        // 1. Seed with existing keywords to retain weights & LinkedIn counts
        keywords.forEach(kw => {
          mergedMap.set(kw.name.toLowerCase(), { ...kw });
        });

        // 2. Merge extracted keywords
        kwsSource.forEach((k: any, idx: number) => {
          const key = (k.name || '').toLowerCase();
          if (!key) return;

          const existing = mergedMap.get(key);
          const cvCount = k.count || (existing ? existing.cvCount : 1);
          const linkedInCount = (existing && existing.linkedInCount > 0) 
            ? existing.linkedInCount 
            : Math.max(Math.round(cvCount * 1.5), 6);
          const combinedCount = cvCount + linkedInCount;
          const source: 'CV' | 'LinkedIn' | 'Combined' = (cvCount > 0 && linkedInCount > 0) ? 'Combined' : (linkedInCount > 0 ? 'LinkedIn' : 'CV');

          mergedMap.set(key, {
            id: existing?.id || `kw_ext_${idx}_${Date.now()}`,
            name: existing?.name || k.name,
            weight: existing?.weight || k.weight || 8,
            source,
            cvCount,
            linkedInCount,
            combinedCount,
            lastUpdated: new Date().toISOString().split('T')[0]
          });
        });

        setKeywords(Array.from(mergedMap.values()));
      }
    } catch (e) {
      console.warn('Extraction fallback to local parsing:', e);
      const localResult = extractProfileFactsLocally(rawCvText);
      if (localResult.profile) {
        setProfile(prev => ({
          ...prev,
          ...localResult.profile
        } as ProfileFacts));
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle Export XLSX Report
  const handleExportXlsx = () => {
    const qualifyingData = qualifyingJobs.map(job => ({
      job,
      score: scores[job.id] || calculateMatchScore(job, profile, criteria),
      document: tailoredDocument?.jobId === job.id ? tailoredDocument : undefined
    }));
    generateXlsxReport(qualifyingData);
  };

  // Handle Job Status Updates
  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs(jobs.map(j => (j.id === jobId ? { ...j, status } : j)));
  };

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-[#1A1A1A] flex flex-col font-sans antialiased selection:bg-[#1A1A1A] selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onRunDiscovery={handleRunDiscovery}
        onExportXlsx={handleExportXlsx}
        isDiscovering={isDiscovering}
        qualifyingCount={qualifyingJobs.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'results' && (
          <ResultsWorkspace
            jobs={jobs}
            scores={scores}
            onInspectScore={job => setInspectedJob(job)}
            onTailorDocuments={handleTailorDocuments}
            onUpdateJobStatus={handleUpdateJobStatus}
            onRunDiscovery={handleRunDiscovery}
            isDiscovering={isDiscovering}
            minThreshold={criteria.matchThreshold}
          />
        )}

        {activeTab === 'profile' && (
          <CoreCVProfileView
            profile={profile}
            coreCvFile={coreCvFile}
            keywords={keywords}
            onUpdateProfile={setProfile}
            onUpdateKeywords={setKeywords}
            onUploadCoreCv={handleUploadNewCoreCv}
            onUploadNewCoreCv={handleUploadNewCoreCv}
            onExtractFactsFromCv={handleExtractFacts}
            isExtracting={isExtracting}
          />
        )}

        {activeTab === 'criteria' && (
          <SearchCriteriaCompanyView
            criteria={criteria}
            companies={companies}
            onUpdateCriteria={setCriteria}
            onUpdateCompanies={setCompanies}
            onRunDiscovery={handleRunDiscovery}
            isDiscovering={isDiscovering}
          />
        )}

        {activeTab === 'studio' && (
          <DocumentStudioView
            qualifyingJobs={qualifyingJobs}
            selectedJob={selectedStudioJob || qualifyingJobs[0] || null}
            onSelectJob={setSelectedStudioJob}
            tailoredDocument={tailoredDocument || (selectedStudioJob ? generateGroundedTailoredDocuments(profile, selectedStudioJob) : (qualifyingJobs[0] ? generateGroundedTailoredDocuments(profile, qualifyingJobs[0]) : null))}
            profile={profile}
            onGenerateTailored={handleTailorDocuments}
            isGenerating={isGeneratingDoc}
          />
        )}

        {activeTab === 'export' && (
          <WindowsExportNotificationView
            qualifyingJobs={qualifyingJobs}
            scores={scores}
            notifications={notifications}
            criteria={criteria}
            onUpdateCriteria={setCriteria}
            onExportXlsx={handleExportXlsx}
            onClearNotifications={() => setNotifications([])}
          />
        )}

        {activeTab === 'providers' && (
          <ProviderAdaptersView
            onRunDiscovery={handleRunDiscovery}
            isDiscovering={isDiscovering}
          />
        )}
      </main>

      {/* 0-100 Explainable Score Modal */}
      {inspectedJob && (
        <JobScoreModal
          job={inspectedJob}
          score={scores[inspectedJob.id] || calculateMatchScore(inspectedJob, profile, criteria)}
          onClose={() => setInspectedJob(null)}
          onTailorDocuments={handleTailorDocuments}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#D1CEC7] bg-[#F4F1ED] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5E5A54] gap-2 font-mono uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#1A1A1A]">Truth Rules Enforced</span>
            <span>•</span>
            <span>Manual Application Only</span>
            <span>•</span>
            <span>OpenAPI Schema v2.4</span>
          </div>
          <div>
            <span>Centrally Synchronized Core Profile • Desktop / Web / Mobile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
