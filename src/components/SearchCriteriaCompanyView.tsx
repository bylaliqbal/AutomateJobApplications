import React, { useState } from 'react';
import {
  Sliders,
  Building2,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Calendar,
  Globe,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { SearchCriteria, Company, Referral, CompanyStatus, SeniorityLevel, WorkplaceType, EmploymentType } from '../types';

interface SearchCriteriaCompanyViewProps {
  criteria: SearchCriteria;
  companies: Company[];
  onUpdateCriteria: (updated: SearchCriteria) => void;
  onUpdateCompanies: (updated: Company[]) => void;
  onRunDiscovery: () => void;
  isDiscovering: boolean;
}

export const SearchCriteriaCompanyView: React.FC<SearchCriteriaCompanyViewProps> = ({
  criteria,
  companies,
  onUpdateCriteria,
  onUpdateCompanies,
  onRunDiscovery,
  isDiscovering
}) => {
  const [activeTab, setActiveTab] = useState<'CRITERIA' | 'COMPANIES' | 'REFERRALS'>('CRITERIA');
  const [newTitle, setNewTitle] = useState('');
  const [newCompanyModal, setNewCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    domain: '',
    careersUrl: '',
    status: 'approved',
    notes: '',
    referrals: []
  });

  const [newReferralModal, setNewReferralModal] = useState(false);
  const [selectedCompanyForReferral, setSelectedCompanyForReferral] = useState<string>('');
  const [newReferral, setNewReferral] = useState<Partial<Referral>>({
    name: '',
    role: '',
    email: '',
    linkedInUrl: '',
    status: 'Identified',
    notes: ''
  });

  // Handle adding target title
  const handleAddTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || criteria.targetTitles.includes(newTitle.trim())) return;
    onUpdateCriteria({
      ...criteria,
      targetTitles: [...criteria.targetTitles, newTitle.trim()]
    });
    setNewTitle('');
  };

  const handleRemoveTitle = (title: string) => {
    onUpdateCriteria({
      ...criteria,
      targetTitles: criteria.targetTitles.filter(t => t !== title)
    });
  };

  // Handle company updates
  const handleUpdateCompanyStatus = (companyId: string, status: CompanyStatus) => {
    onUpdateCompanies(
      companies.map(c => (c.id === companyId ? { ...c, status } : c))
    );
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name?.trim()) return;

    const company: Company = {
      id: `comp_${Date.now()}`,
      name: newCompany.name.trim(),
      domain: newCompany.domain?.trim() || `${newCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
      careersUrl: newCompany.careersUrl?.trim() || `https://${newCompany.name.toLowerCase().replace(/\s+/g, '')}.com/careers`,
      status: (newCompany.status as CompanyStatus) || 'approved',
      notes: newCompany.notes || '',
      referrals: []
    };

    onUpdateCompanies([...companies, company]);
    setNewCompany({ name: '', domain: '', careersUrl: '', status: 'approved', notes: '' });
    setNewCompanyModal(false);
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReferral.name?.trim() || !selectedCompanyForReferral) return;

    const referral: Referral = {
      id: `ref_${Date.now()}`,
      name: newReferral.name.trim(),
      role: newReferral.role?.trim() || 'Software Engineer',
      email: newReferral.email?.trim(),
      linkedInUrl: newReferral.linkedInUrl?.trim(),
      companyName: selectedCompanyForReferral,
      status: newReferral.status as any || 'Identified',
      notes: newReferral.notes || ''
    };

    onUpdateCompanies(
      companies.map(c => {
        if (c.name.toLowerCase() === selectedCompanyForReferral.toLowerCase()) {
          return { ...c, referrals: [...c.referrals, referral] };
        }
        return c;
      })
    );

    setNewReferral({ name: '', role: '', email: '', linkedInUrl: '', status: 'Identified', notes: '' });
    setNewReferralModal(false);
  };

  const companyStatuses: { value: CompanyStatus; label: string }[] = [
    { value: 'permanently_monitored', label: 'Permanently Monitored' },
    { value: 'approved', label: 'Approved Target' },
    { value: 'candidate', label: 'Candidate' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'blacklisted', label: 'Blacklisted' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">Search Configuration & Monitored Entities</h2>
          <p className="text-xs text-[#5E5A54] mt-1 leading-relaxed max-w-2xl">
            Configure matching weights, target roles, age thresholds, and company priority lists.
          </p>
        </div>

        <button
          onClick={onRunDiscovery}
          disabled={isDiscovering}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isDiscovering ? 'Executing Discovery...' : 'Execute Crawl with Criteria'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#D1CEC7]">
        {[
          { id: 'CRITERIA', label: 'Matching Weights & Role Criteria' },
          { id: 'COMPANIES', label: `Company Registry (${companies.length})` },
          { id: 'REFERRALS', label: `Active Referrals (${companies.reduce((acc, c) => acc + c.referrals.length, 0)})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#8A847C] hover:text-[#1A1A1A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: MATCHING WEIGHTS & CRITERIA */}
      {activeTab === 'CRITERIA' && (
        <div className="space-y-6">
          {/* Threshold and Component Weights */}
          <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D1CEC7]">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A847C]">
                  Qualifying Match Threshold (Default 50, 80+ Highlighted)
                </h3>
                <p className="text-xs text-[#5E5A54] mt-1">
                  Jobs with score &ge; {criteria.matchThreshold}% automatically qualify for grounded CV and cover-letter generation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={30}
                  max={90}
                  value={criteria.matchThreshold}
                  onChange={e => onUpdateCriteria({ ...criteria, matchThreshold: Number(e.target.value) })}
                  className="w-32 accent-[#1A1A1A] cursor-pointer"
                />
                <span className="font-mono text-lg font-black text-[#1A1A1A] w-12 text-right">
                  {criteria.matchThreshold}%
                </span>
              </div>
            </div>

            {/* Weights Sliders */}
            <div>
              <h4 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3">
                Component Weights Distribution
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(criteria.weights).map(([key, weight]) => (
                  <div key={key} className="p-4 bg-[#F9F9F7] border border-[#D1CEC7] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                      <span className="capitalize font-serif text-sm">{key} Component</span>
                      <span className="font-mono text-[#1A1A1A]">{weight}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={weight}
                      onChange={e => {
                        onUpdateCriteria({
                          ...criteria,
                          weights: { ...criteria.weights, [key]: Number(e.target.value) }
                        });
                      }}
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Titles Card */}
          <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A847C] border-b border-[#D1CEC7] pb-2">
              Target Role Titles ({criteria.targetTitles.length})
            </h3>

            <form onSubmit={handleAddTitle} className="flex gap-2">
              <input
                type="text"
                placeholder="Add target title (e.g. Staff Full-Stack Engineer, Lead Cloud Architect)..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8A847C] focus:outline-hidden focus:border-[#1A1A1A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer whitespace-nowrap"
              >
                Add Title
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {criteria.targetTitles.map(title => (
                <span
                  key={title}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]"
                >
                  <span>{title}</span>
                  <button
                    onClick={() => handleRemoveTitle(title)}
                    className="p-0.5 text-[#8A847C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Posting Age & Workplace Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A847C] flex items-center gap-2 border-b border-[#D1CEC7] pb-2">
                <Clock className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Posting Age Window
              </h3>
              <p className="text-xs text-[#5E5A54]">
                Filter results by reliable posting date or discovery date:
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={criteria.postingAgeHours}
                  onChange={e => onUpdateCriteria({ ...criteria, postingAgeHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-bold text-[#1A1A1A] uppercase tracking-wider"
                >
                  <option value={24}>Past 24 Hours (1 day)</option>
                  <option value={72}>Past 72 Hours (3 days - Default)</option>
                  <option value={168}>Past 7 Days (1 week)</option>
                  <option value={336}>Past 14 Days (2 weeks)</option>
                  <option value={720}>Past 30 Days (1 month)</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A847C] flex items-center gap-2 border-b border-[#D1CEC7] pb-2">
                <Globe className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Workplace Mode & Geographic Scope
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['REMOTE', 'HYBRID', 'ON_SITE'] as WorkplaceType[]).map(wp => {
                  const isSelected = criteria.workplaceTypes.includes(wp);
                  return (
                    <button
                      key={wp}
                      onClick={() => {
                        const next = isSelected
                          ? criteria.workplaceTypes.filter(w => w !== wp)
                          : [...criteria.workplaceTypes, wp];
                        if (next.length > 0) {
                          onUpdateCriteria({ ...criteria, workplaceTypes: next });
                        }
                      }}
                      className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#F4F1ED] text-[#5E5A54] border-[#D1CEC7] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {wp}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COMPANY REGISTRY */}
      {activeTab === 'COMPANIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C]">
              Monitored Employers & Priority Lists
            </span>
            <button
              onClick={() => setNewCompanyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Target Company
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map(comp => (
              <div
                key={comp.id}
                className="p-5 bg-white border border-[#D1CEC7] shadow-xs space-y-3 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#1A1A1A]">{comp.name}</h4>
                      <a
                        href={comp.careersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5E5A54] hover:text-[#1A1A1A] underline mt-0.5"
                      >
                        <span>{comp.domain}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-[#5E5A54] mt-2 line-clamp-2 leading-relaxed">
                    {comp.notes || 'No custom notes provided.'}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#D1CEC7]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A847C] font-bold uppercase text-[9px] tracking-wider">Status:</span>
                    <select
                      value={comp.status}
                      onChange={e => handleUpdateCompanyStatus(comp.id, e.target.value as CompanyStatus)}
                      className="px-2 py-1 bg-[#F9F9F7] border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]"
                    >
                      {companyStatuses.map(st => (
                        <option key={st.value} value={st.value}>{st.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5E5A54]">
                    <span>Referrals: <strong className="text-[#1A1A1A] font-mono">{comp.referrals.length}</strong></span>
                    {comp.lastCrawledAt && (
                      <span className="font-mono text-[10px]">Crawled: {new Date(comp.lastCrawledAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: REFERRALS */}
      {activeTab === 'REFERRALS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C]">
              Active Referrals Network
            </span>
            <button
              onClick={() => {
                setSelectedCompanyForReferral(companies[0]?.name || '');
                setNewReferralModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Referral Contact
            </button>
          </div>

          <div className="bg-white border border-[#D1CEC7] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F1ED] border-b border-[#D1CEC7] text-[#5E5A54] uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Contact Name</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Referral Status</th>
                    <th className="px-4 py-3">Notes & Next Steps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1CEC7] font-medium">
                  {companies.flatMap(c => c.referrals).map(ref => (
                    <tr key={ref.id} className="hover:bg-[#F9F9F7]">
                      <td className="px-4 py-3 font-bold text-[#1A1A1A] font-serif text-sm">{ref.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]">
                          {ref.companyName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#5E5A54]">{ref.role}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#1A1A1A] text-white">
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#5E5A54] text-[11px] font-sans">{ref.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {newCompanyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCompany} className="bg-white border border-[#1A1A1A] shadow-2xl max-w-md w-full p-6 space-y-4 text-[#1A1A1A]">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Add Target Company</h3>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. OpenAI, Anthropic, Netflix"
                value={newCompany.name}
                onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Careers / ATS URL</label>
              <input
                type="url"
                placeholder="https://company.com/careers"
                value={newCompany.careersUrl}
                onChange={e => setNewCompany({ ...newCompany, careersUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Status Tier</label>
              <select
                value={newCompany.status}
                onChange={e => setNewCompany({ ...newCompany, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-bold uppercase text-[#1A1A1A]"
              >
                {companyStatuses.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Notes</label>
              <textarea
                rows={2}
                placeholder="Key tech stack, interview stages, or referral context..."
                value={newCompany.notes}
                onChange={e => setNewCompany({ ...newCompany, notes: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewCompanyModal(false)}
                className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#5E5A54] hover:text-[#1A1A1A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase font-bold tracking-widest cursor-pointer shadow-xs"
              >
                Save Company
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Referral Modal */}
      {newReferralModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateReferral} className="bg-white border border-[#1A1A1A] shadow-2xl max-w-md w-full p-6 space-y-4 text-[#1A1A1A]">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Add Referral Contact</h3>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Target Company</label>
              <select
                value={selectedCompanyForReferral}
                onChange={e => setSelectedCompanyForReferral(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-bold uppercase text-[#1A1A1A]"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Contact Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={newReferral.name}
                onChange={e => setNewReferral({ ...newReferral, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Contact Role</label>
              <input
                type="text"
                placeholder="e.g. Engineering Manager"
                value={newReferral.role}
                onChange={e => setNewReferral({ ...newReferral, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#5E5A54] block mb-1">Status</label>
              <select
                value={newReferral.status}
                onChange={e => setNewReferral({ ...newReferral, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-bold uppercase text-[#1A1A1A]"
              >
                <option value="Identified">Identified</option>
                <option value="Contacted">Contacted</option>
                <option value="Agreed">Agreed</option>
                <option value="Referred">Referred</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewReferralModal(false)}
                className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#5E5A54] hover:text-[#1A1A1A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase font-bold tracking-widest cursor-pointer shadow-xs"
              >
                Add Referral
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
