import React, { useState } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  Bookmark,
  CheckCircle,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Award,
  Clock,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Download,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import { MasterJob, MatchScoreExplanation, JobStatus } from '../types';
import { TruthAuditBadge } from './TruthAuditBadge';

interface ResultsWorkspaceProps {
  jobs: MasterJob[];
  scores: Record<string, MatchScoreExplanation>;
  onInspectScore: (job: MasterJob) => void;
  onTailorDocuments: (job: MasterJob) => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
  onRunDiscovery: () => void;
  isDiscovering: boolean;
  minThreshold: number;
}

export const ResultsWorkspace: React.FC<ResultsWorkspaceProps> = ({
  jobs,
  scores,
  onInspectScore,
  onTailorDocuments,
  onUpdateJobStatus,
  onRunDiscovery,
  isDiscovering,
  minThreshold
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [qualifyingOnly, setQualifyingOnly] = useState<boolean>(false);
  const [companyTierFilter, setCompanyTierFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'DATE_DESC' | 'COMPANY'>('SCORE_DESC');

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const score = scores[job.id]?.totalScore || 0;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    const matchesQualifying = !qualifyingOnly || score >= minThreshold;
    const matchesCompany =
      companyTierFilter === 'ALL' ||
      (companyTierFilter === 'MONITORED' && (job.companyStatus === 'permanently_monitored' || job.companyStatus === 'approved'));

    return matchesSearch && matchesStatus && matchesQualifying && matchesCompany;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'SCORE_DESC') {
      const scoreA = scores[a.id]?.totalScore || 0;
      const scoreB = scores[b.id]?.totalScore || 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'DATE_DESC') {
      return new Date(b.lastDiscoveredAt).getTime() - new Date(a.lastDiscoveredAt).getTime();
    }
    if (sortBy === 'COMPANY') {
      return a.company.localeCompare(b.company);
    }
    return 0;
  });

  const statuses: JobStatus[] = [
    'Discovered',
    'Saved',
    'Applied',
    'Submitted',
    'Interviewing',
    'Rejected',
    'Offer',
    'Closed',
    'Ignored'
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Search and Filters Bar */}
      <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A847C]" />
            <input
              id="job-search-input"
              type="text"
              placeholder="Search by role title, company, skill, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F1ED] border border-[#D1CEC7] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:bg-white focus:outline-hidden focus:border-[#1A1A1A] transition-all font-sans"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status filter */}
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#F4F1ED] border border-[#D1CEC7] text-xs font-semibold text-[#1A1A1A] focus:outline-hidden cursor-pointer uppercase tracking-wider text-[11px]"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Company filter */}
            <select
              id="filter-company-tier"
              value={companyTierFilter}
              onChange={e => setCompanyTierFilter(e.target.value)}
              className="px-3 py-2 bg-[#F4F1ED] border border-[#D1CEC7] text-xs font-semibold text-[#1A1A1A] focus:outline-hidden cursor-pointer uppercase tracking-wider text-[11px]"
            >
              <option value="ALL">All Companies</option>
              <option value="MONITORED">Priority & Monitored Only</option>
            </select>

            {/* Sort by */}
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#F4F1ED] border border-[#D1CEC7] text-xs font-semibold text-[#1A1A1A] focus:outline-hidden cursor-pointer uppercase tracking-wider text-[11px]"
            >
              <option value="SCORE_DESC">Sort: Match Score (High to Low)</option>
              <option value="DATE_DESC">Sort: Latest Discovered</option>
              <option value="COMPANY">Sort: Company Name</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D1CEC7] text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#1A1A1A] font-semibold text-[11px] uppercase tracking-wider">
              <input
                type="checkbox"
                checked={qualifyingOnly}
                onChange={e => setQualifyingOnly(e.target.checked)}
                className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
              />
              <span>Qualifying Only ({`≥ ${minThreshold}%`})</span>
            </label>

            <span className="text-[#D1CEC7]">•</span>

            <span className="text-[#5E5A54] text-xs">
              Showing <strong className="text-[#1A1A1A]">{sortedJobs.length}</strong> of {jobs.length} canonical opportunities
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#1A1A1A] text-white">
              80+ Highlighted
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#EBE7E0] text-[#1A1A1A] border border-[#D1CEC7]">
              50–79 Qualifying
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div className="space-y-4">
        {sortedJobs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#D1CEC7] p-8 shadow-xs">
            <AlertCircle className="w-10 h-10 text-[#8A847C] mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">No matching opportunities found</h3>
            <p className="text-xs text-[#5E5A54] mt-1 max-w-md mx-auto leading-relaxed">
              Try adjusting your search criteria or trigger a live crawl across providers.
            </p>
            <button
              onClick={onRunDiscovery}
              disabled={isDiscovering}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] uppercase tracking-widest font-bold cursor-pointer"
            >
              Run Provider Discovery
            </button>
          </div>
        ) : (
          sortedJobs.map(job => {
            const score = scores[job.id];
            const totalScore = score?.totalScore ?? 50;
            const isHighMatch = totalScore >= 80;
            const isQualifying = totalScore >= minThreshold;

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className={`bg-white border transition-all duration-150 p-6 relative overflow-hidden shadow-xs ${
                  isHighMatch
                    ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]/10'
                    : 'border-[#D1CEC7] hover:border-[#8A847C]'
                }`}
              >
                {/* Monitored company banner if applicable */}
                {job.companyStatus === 'permanently_monitored' && (
                  <div className="absolute top-0 right-0 bg-[#1A1A1A] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                    Permanently Monitored
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Job Info */}
                  <div className="flex-1 space-y-3.5">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#1A1A1A] text-white">
                        {job.company}
                      </span>

                      {job.isPreviousSearch && (
                        <span
                          className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#EBE7E0] text-[#5E5A54] border border-[#D1CEC7]"
                          title="Discovered in an earlier search run"
                        >
                          Previous Search
                        </span>
                      )}

                      {job.referralsCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#F4F1ED] text-[#1A1A1A] border border-[#1A1A1A]">
                          <UserCheck className="w-3 h-3 text-[#1A1A1A]" />
                          {job.referralsCount} Referral Active
                        </span>
                      )}

                      <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-[#F4F1ED] text-[#5E5A54] border border-[#D1CEC7]">
                        {job.workplaceType}
                      </span>

                      {job.salaryRange && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#EBE7E0] text-[#1A1A1A]">
                          {job.salaryRange}
                        </span>
                      )}
                    </div>

                    {/* Job Title & Location */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] leading-tight">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E5A54] mt-1.5 font-sans">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8A847C]" />
                          {job.location}
                        </span>

                        {/* Date provenance label */}
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#8A847C]" />
                          {job.sources[0]?.hasReliablePostingDate ? (
                            <span className="text-[#1A1A1A]">
                              Posted: {new Date(job.sources[0].postingDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-[#8A847C] bg-[#F4F1ED] px-1.5 py-0.5">
                              Discovered: {new Date(job.sources[0]?.discoveryDate || job.firstDiscoveredAt).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Snippet / Description */}
                    <p className="text-xs text-[#5E5A54] line-clamp-2 leading-relaxed font-sans">
                      {job.description}
                    </p>

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.map(skill => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Source Links Provenance */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#5E5A54]">
                      <span className="font-bold text-[#1A1A1A] text-[10px] uppercase tracking-widest">Sources ({job.sources.length}):</span>
                      {job.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4F1ED] hover:bg-[#EBE7E0] border border-[#D1CEC7] text-[#1A1A1A] font-mono text-[10px] uppercase transition-colors"
                        >
                          <span>{src.provider}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#8A847C]" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Score & Action Area */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#D1CEC7]">
                    {/* Score Card Trigger - Editorial Black/Ink badge */}
                    <button
                      onClick={() => onInspectScore(job)}
                      className={`flex items-center gap-3 p-3.5 text-left transition-all hover:opacity-90 cursor-pointer border ${
                        isHighMatch
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : isQualifying
                          ? 'bg-white text-[#1A1A1A] border-[#1A1A1A]'
                          : 'bg-[#F4F1ED] text-[#5E5A54] border-[#D1CEC7]'
                      }`}
                      title="Click to view 0-100 explainable score breakdown & evidence"
                    >
                      <div className="text-center">
                        <span className="block text-3xl font-serif font-black leading-none">
                          {totalScore}%
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 block mt-0.5">
                          MATCH
                        </span>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider pl-2 border-l border-current/30">
                        <span className="font-bold block">
                          {isHighMatch ? 'High Match ★' : isQualifying ? 'Qualifying' : 'Below Target'}
                        </span>
                        <span className="underline opacity-75 text-[9px]">
                          Explain Score →
                        </span>
                      </div>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
                      {/* Manual External Apply */}
                      <a
                        id={`btn-apply-${job.id}`}
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest shadow-xs transition-colors cursor-pointer"
                        title="Manual Application: Opens official career portal in new tab"
                      >
                        <span>Apply on Portal</span>
                        <ExternalLink className="w-3 h-3 text-[#D1CEC7]" />
                      </a>

                      {/* Tailored CV Generator */}
                      <button
                        id={`btn-tailor-${job.id}`}
                        onClick={() => onTailorDocuments(job)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#EBE7E0] text-[#1A1A1A] border border-[#1A1A1A] text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        <span>Tailor CV & Letter</span>
                      </button>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#8A847C] font-semibold uppercase tracking-wider text-[10px]">Status:</span>
                      <select
                        id={`select-status-${job.id}`}
                        value={job.status}
                        onChange={e => onUpdateJobStatus(job.id, e.target.value as JobStatus)}
                        className="px-2.5 py-1 text-[11px] uppercase font-bold bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7] focus:outline-hidden cursor-pointer"
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
