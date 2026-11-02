'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Compass,
  Building,
  ExternalLink
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function FacilityCard({ facility, onFocusOnMap }) {
  const categoryInfo = facility.categoryInfo || {};
  const hasPhone = facility.contact_number && facility.contact_number.trim() !== '';

  return (
    <motion.div
      layout
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-2xl bg-surface-card/90 border border-white/10 hover:border-cyan-electric/40 backdrop-blur-md flex flex-col justify-between shadow-lg shadow-black/20 group"
    >
      <div>
        {/* Top Header: Category Tag & Distance */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span 
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5"
            style={{ 
              color: categoryInfo.color || '#00F3FF', 
              borderColor: categoryInfo.borderColor || 'rgba(0, 243, 255, 0.4)',
              backgroundColor: categoryInfo.bgColor || 'rgba(0, 243, 255, 0.12)'
            }}
          >
            <span>{categoryInfo.iconText || '📍'}</span>
            <span>{facility.categoryLabel || categoryInfo.name}</span>
          </span>

          {/* Dynamic Straight-line Distance */}
          <div className="text-right shrink-0">
            <span className="text-sm font-extrabold font-heading text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 inline-flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-electric" />
              <span>{facility.distanceText}</span>
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              approx. straight-line
            </span>
          </div>
        </div>

        {/* Facility Name */}
        <h4 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-cyan-electric transition-colors leading-snug mb-2">
          {facility.name}
        </h4>

        {/* Description */}
        {facility.description && (
          <p className="text-xs text-slate-300 leading-relaxed mb-3.5 font-light">
            {facility.description}
          </p>
        )}

        {/* Details & Specs Block */}
        <div className="space-y-2 text-xs pt-2 border-t border-white/10 text-slate-300">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold text-white">{facility.area}</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">{facility.address}</span>
            </div>
          </div>

          {/* Operating Hours */}
          {facility.opening_hours && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="text-slate-300">
                Hours: <strong className="text-white">{facility.opening_hours}</strong>
              </span>
            </div>
          )}

          {/* Contact Number (if verified) */}
          {hasPhone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-slate-300">
                Tel: <strong className="text-red-300">{facility.contact_number}</strong>
              </span>
            </div>
          )}

          {/* Data Provenance & Verification Badge */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-white/5">
            <VerificationBadge 
              status={facility.verification_status} 
              source={facility.source} 
              date={facility.last_verified_at} 
            />

            <span className="text-slate-400 text-[10px]">
              Source: <span className="text-slate-300">{facility.source}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-4 mt-3 border-t border-white/10 flex items-center gap-2">
        {/* Call button only if valid public telephone exists */}
        {hasPhone && (
          <a
            href={`tel:${facility.contact_number}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5" /> Call Now
          </a>
        )}

        {/* Turn-by-Turn Directions */}
        {facility.mapsUrl && (
          <a
            href={facility.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-electric/20 hover:scale-[1.01] transition"
          >
            <Navigation className="w-3.5 h-3.5" /> Get Directions
          </a>
        )}

        {/* Focus on map trigger */}
        {onFocusOnMap && (
          <button
            onClick={() => onFocusOnMap(facility)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-electric border border-white/10 transition"
            title="Locate on Interactive Map"
          >
            <Compass className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

