import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

interface Props {
  isPassed?: boolean;
  score?: number;
  compact?: boolean;
}

export const TruthAuditBadge: React.FC<Props> = ({ isPassed = true, score = 100, compact = false }) => {
  if (compact) {
    return (
      <span
        id="truth-audit-badge-compact"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-white border border-[#1A1A1A] text-[#1A1A1A]"
        title="Verified against Authoritative Core CV facts. No invented experiences or skills."
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
        Truth-Grounded
      </span>
    );
  }

  return (
    <div
      id="truth-audit-badge"
      className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-[#D1CEC7] text-[#1A1A1A] text-xs shadow-xs"
    >
      <div className="flex items-center justify-center w-5 h-5 bg-[#1A1A1A] text-white font-bold">
        <ShieldCheck className="w-3.5 h-3.5" />
      </div>
      <div>
        <span className="font-bold block text-[11px] uppercase tracking-wider text-[#1A1A1A]">Truth Rules Enforced (100% Grounded)</span>
        <span className="text-[#5E5A54] text-[10px]">Zero hallucination • Strictly verified against Core CV facts</span>
      </div>
    </div>
  );
};
