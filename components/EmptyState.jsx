'use client';

import React from 'react';
import { AlertCircle, Target, RefreshCw, Compass } from 'lucide-react';

export default function EmptyState({ 
  categoryName, 
  radiusKm, 
  onExpandRadius, 
  nearestDistanceText, 
  nearestFacilityName 
}) {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 text-center max-w-xl mx-auto my-6 backdrop-blur-md">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-lg font-bold font-heading text-white mb-2">
        No Registered {categoryName || 'Facility'} Records Within {radiusKm >= 1 ? `${radiusKm} km` : `${radiusKm * 1000} m`}
      </h4>

      <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
        Our verified municipal database currently has no published records in this immediate radius.
        <strong className="text-amber-300 block mt-1">
          Important: This does not mean that the facility does not physically exist on ground.
        </strong>
      </p>

      {nearestFacilityName && nearestDistanceText && (
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 mb-5 text-left flex items-start gap-2.5">
          <Compass className="w-4 h-4 text-cyan-electric shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block">Nearest Registered Facility:</span>
            <span>{nearestFacilityName} ({nearestDistanceText} away)</span>
          </div>
        </div>
      )}

      {onExpandRadius && radiusKm < 5 && (
        <button
          onClick={onExpandRadius}
          className="px-4 py-2.5 rounded-xl bg-cyan-electric/15 hover:bg-cyan-electric/25 border border-cyan-electric/40 text-cyan-electric text-xs font-bold inline-flex items-center gap-2 transition"
        >
          <Target className="w-4 h-4" />
          <span>Expand Radius to {radiusKm < 1 ? '1.0 km' : radiusKm < 2 ? '2.0 km' : '5.0 km'}</span>
        </button>
      )}
    </div>
  );
}

