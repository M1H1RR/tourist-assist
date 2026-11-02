'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  PlusCircle, 
  Shield, 
  Search, 
  Sparkles, 
  Droplets, 
  Car, 
  Bus, 
  Navigation, 
  Utensils, 
  Bed, 
  Info, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

const ICON_MAP = {
  HeartPulse,
  PlusCircle,
  Shield,
  Search,
  Sparkles,
  Droplets,
  Car,
  Bus,
  Navigation,
  Utensils,
  Bed,
  Info
};

export default function FacilityCategoryCard({ categorySummary, isActive, onSelect }) {
  const IconComponent = ICON_MAP[categorySummary.iconName] || Info;

  const getStatusBadge = () => {
    if (categorySummary.status === 'FOUND_NEARBY') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" />
          <span>Found Nearby</span>
        </span>
      );
    }
    if (categorySummary.status === 'NEEDS_VERIFICATION') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
          <Clock className="w-3 h-3" />
          <span>Pending Verification</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700/40 border border-white/10 text-slate-400 text-[10px] font-medium">
        <AlertCircle className="w-3 h-3 text-slate-500" />
        <span>No Records In Radius</span>
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(categorySummary.key)}
      className={`relative p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
        isActive
          ? 'bg-slate-800/90 border-cyan-electric shadow-lg shadow-cyan-electric/20'
          : 'bg-slate-900/70 border-white/10 hover:border-white/25 hover:bg-slate-800/50'
      }`}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ 
              backgroundColor: categorySummary.bgColor, 
              borderColor: categorySummary.borderColor,
              color: categorySummary.color 
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Category Name */}
        <h4 className="text-sm font-bold font-heading text-white mb-1 group-hover:text-cyan-electric transition-colors">
          {categorySummary.name}
        </h4>

        {/* Count and Subtext */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span 
            className="text-2xl font-extrabold font-heading"
            style={{ color: categorySummary.count > 0 ? categorySummary.color : '#94A3B8' }}
          >
            {categorySummary.count}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {categorySummary.count === 1 ? 'facility found' : 'facilities found'}
          </span>
        </div>

        {/* Nearest fallback notice if 0 in radius */}
        {categorySummary.count === 0 && categorySummary.nearestFacilityName && (
          <p className="text-[11px] text-slate-400 leading-tight mb-2">
            Nearest: <strong className="text-slate-200">{categorySummary.nearestFacilityName}</strong> ({categorySummary.nearestDistanceText})
          </p>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
        <span className={isActive ? 'text-cyan-electric font-bold' : 'text-slate-400 group-hover:text-white'}>
          {isActive ? 'Showing List Below' : 'View Facilities'}
        </span>
        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-cyan-electric translate-x-1' : 'text-slate-400'}`} />
      </div>
    </motion.div>
  );
}

