import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  MapPin,
  Building2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { MasterJob, MatchScoreExplanation, MatchScoreComponent } from '../types';

interface JobScoreModalProps {
  job: MasterJob | null;
  score: MatchScoreExplanation | null;
  onClose: () => void;
  onTailorDocuments: (job: MasterJob) => void;
}

export const JobScoreModal: React.FC<JobScoreModalProps> = ({
  job,
  score,
  onClose,
  onTailorDocuments
}) => {
  if (!job || !score) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="match-score-modal"
        className="bg-[#F4F1ED] border border-[#1A1A1A] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#1A1A1A]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#D1CEC7] flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C]">
                0–100 Explainable Match Score
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-[#F4F1ED] border border-[#D1CEC7] text-[#1A1A1A] font-mono font-medium uppercase">
                {score.scoreVersion}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">{job.title}</h2>
            <p className="text-xs text-[#5E5A54] font-medium">{job.company} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A847C] hover:text-[#1A1A1A] hover:bg-[#F4F1ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-[#D1CEC7] gap-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-[#1A1A1A] text-white flex flex-col items-center justify-center border border-[#1A1A1A] shadow-xs">
                <span className="text-3xl font-serif font-bold leading-none">{score.totalScore}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-1 opacity-80">MATCH</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-serif font-bold text-[#1A1A1A]">
                    {score.isHighMatch
                      ? 'High Match (80+ Highlighted)'
                      : score.isQualifying
                      ? 'Qualifying Match'
                      : 'Below Threshold'}
                  </span>
                  {score.isQualifying ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#8A847C]" />
                  )}
                </div>
                <p className="text-xs text-[#5E5A54] mt-1">
                  Threshold: <span className="font-mono font-bold text-[#1A1A1A]">{score.threshold}%</span> •
                  Status: <span className="font-bold text-[#1A1A1A]">{score.isQualifying ? 'Qualifies for Tailoring' : 'Excluded by default'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onTailorDocuments(job);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tailor Documents
            </button>
          </div>

          {/* Advisory summary */}
          <div className="p-4 bg-white border-l-2 border-[#1A1A1A] border-y border-r border-[#D1CEC7] text-xs text-[#1A1A1A] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-[#8A847C] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
              Advisory Explanation & Grounding Analysis:
            </div>
            <p className="font-serif italic text-sm">{score.advisorySummary}</p>
          </div>

          {/* Component Score Breakdown */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C] mb-3">
              Deterministic Component Breakdown
            </h3>
            <div className="space-y-3">
              {(Object.entries(score.components) as [string, MatchScoreComponent][]).map(([key, comp]) => (
                <div key={key} className="p-4 border border-[#D1CEC7] bg-white space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                    <span className="flex items-center gap-2">
                      <span className="font-serif text-sm">{comp.name}</span>
                      <span className="text-[9px] font-mono text-[#5E5A54] bg-[#F4F1ED] px-1.5 py-0.5 border border-[#D1CEC7]">
                        Weight: {comp.weight}%
                      </span>
                    </span>
                    <span className="font-mono text-[#1A1A1A] font-bold">
                      {comp.rawScore}/100 <span className="text-[#8A847C] text-[10px]">({comp.weightedScore} pts)</span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#EBE7E0] overflow-hidden">
                    <div
                      className="h-full bg-[#1A1A1A]"
                      style={{ width: `${comp.rawScore}%` }}
                    />
                  </div>

                  {/* Evidence text */}
                  <p className="text-[11px] text-[#5E5A54] leading-relaxed">
                    <strong className="text-[#1A1A1A] uppercase text-[9px] tracking-wider">Evidence:</strong> {comp.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matched vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#D1CEC7]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Matched Verified Skills ({score.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {score.matchedSkills.length > 0 ? (
                  score.matchedSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#8A847C] italic">No direct keyword overlap found</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#D1CEC7]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A847C] flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#8A847C]" />
                Unmatched / Missing ({score.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {score.missingSkills.length > 0 ? (
                  score.missingSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] uppercase font-medium bg-[#EBE7E0] text-[#5E5A54]">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#1A1A1A] font-bold uppercase tracking-wider">All required skills matched!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#D1CEC7] flex items-center justify-between text-xs text-[#5E5A54]">
          <span className="text-[10px] uppercase tracking-wider font-mono">Truth Rules Active • Zero Hallucination</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F4F1ED] hover:bg-[#EBE7E0] text-[#1A1A1A] border border-[#D1CEC7] text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
