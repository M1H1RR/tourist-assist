'use client';

import React from 'react';
import { Target, Compass } from 'lucide-react';

export default function RadiusSelector({ selectedRadius, onRadiusChange }) {
  const options = [
    { value: 0.5, label: '500 Metres', short: '500m' },
    { value: 1.0, label: '1 Kilometre', short: '1 km', isDefault: true },
    { value: 2.0, label: '2 Kilometres', short: '2 km' },
    { value: 5.0, label: '5 Kilometres', short: '5 km' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-cyan-electric/15 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-bold text-white block">
            Search Coverage Radius
          </span>
          <span className="text-[11px] text-slate-400">
            Straight-line search boundary around destination
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
        {options.map((opt) => {
          const isActive = selectedRadius === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onRadiusChange(opt.value)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 shadow-md shadow-cyan-electric/30 scale-[1.02]'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>{opt.label}</span>
              {opt.isDefault && !isActive && (
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                  Default
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

