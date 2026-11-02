'use client';

import React from 'react';
import { Search, ArrowUpDown, X, Filter } from 'lucide-react';
import { FACILITY_CATEGORIES } from '../lib/facilitiesService';

export default function FacilityFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoriesSummary,
  totalCount
}) {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
      {/* Top Row: Search Input + Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyan-electric pointer-events-none" />
          <input
            type="text"
            placeholder="Search within nearby facilities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-electric transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Count */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Sort by:
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric appearance-none cursor-pointer"
            >
              <option value="nearest">Distance: Nearest First</option>
              <option value="farthest">Distance: Farthest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1 text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 shadow-md shadow-cyan-electric/25'
              : 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <span>All Categories</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
            {totalCount}
          </span>
        </button>

        {Object.entries(FACILITY_CATEGORIES).map(([key, cfg]) => {
          const count = categoriesSummary[key]?.count || 0;
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
              }`}
              style={isActive ? { backgroundColor: cfg.color, boxShadow: `0 0 12px ${cfg.color}50` } : {}}
            >
              <span>{cfg.iconText}</span>
              <span>{cfg.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950/25 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

