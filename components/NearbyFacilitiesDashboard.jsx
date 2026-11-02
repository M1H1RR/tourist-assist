'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, AlertCircle, Compass } from 'lucide-react';
import FacilityCategoryCard from './FacilityCategoryCard';

export default function NearbyFacilitiesDashboard({
  categoriesSummary,
  selectedCategory,
  onCategorySelect,
  radiusKm,
  totalFound
}) {
  const categoryKeys = Object.keys(categoriesSummary);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-electric" />
            <span>Essential Facilities Dashboard</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated radius scan within <strong>{radiusKm >= 1 ? `${radiusKm} km` : `${radiusKm * 1000} m`}</strong> straight-line boundary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onCategorySelect('all')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-electric border border-cyan-electric/30 transition"
            >
              Reset Category Filter
            </button>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-bold">
            {totalFound} Total Found in Radius
          </span>
        </div>
      </div>

      {/* 12 Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categoryKeys.map((key) => {
          const item = categoriesSummary[key];
          return (
            <FacilityCategoryCard
              key={key}
              categorySummary={item}
              isActive={selectedCategory === key}
              onSelect={onCategorySelect}
            />
          );
        })}
      </div>
    </div>
  );
}

