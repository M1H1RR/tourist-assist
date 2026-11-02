'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function VerificationBadge({ status, source, date }) {
  if (status === 'verified') {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold" title={`Source: ${source || 'Official Authority'} (Verified: ${date || 'Recent'})`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified Record</span>
      </div>
    );
  }

  if (status === 'pending_verification') {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold" title={`Under review. Source lead: ${source || 'Field Research'}`}>
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Verification Pending</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-white/10 text-slate-300 text-[11px] font-medium" title="Unverified community listing. Use with discretion.">
      <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
      <span>Needs Verification</span>
    </div>
  );
}

