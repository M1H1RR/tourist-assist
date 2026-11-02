'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, Eye, Compass, Sparkles, Navigation, Layers } from 'lucide-react';

export default function DestinationCard({ attraction, onSelect }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-electric/40 hover:shadow-2xl hover:shadow-cyan-electric/15 flex flex-col h-full bg-surface-card"
    >
      {/* Destination Image Banner */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
        <Image
          src={attraction.image}
          alt={attraction.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md border border-white/20 text-cyan-electric">
            {attraction.category}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md border border-white/10 text-amber-300 flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-400" />
            {attraction.distFromRamkund === 0 ? 'Ground Zero' : `${attraction.distFromRamkund} km`}
          </span>
        </div>

        {/* Name and Area overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold font-heading text-white group-hover:text-cyan-electric transition-colors line-clamp-1">
            {attraction.name}
          </h3>
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
            <span>{attraction.area}</span>
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4 font-light">
            {attraction.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {attraction.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Duration & Best Time */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-electric" />
              {attraction.duration}
            </span>
            <span className="truncate max-w-[150px] text-right">
              {attraction.bestTime.split('/')[0]}
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            href={`/destination/${attraction.slug}`}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-electric/20 hover:scale-[1.02] transition"
          >
            <Layers className="w-3.5 h-3.5" /> Nearby Facilities
          </Link>
          <button
            onClick={() => onSelect(attraction)}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          {attraction.googleMapsUrl && (
            <a
              href={attraction.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition"
              title="Open in Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

