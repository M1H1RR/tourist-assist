'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Navigation, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Compass,
  Tag,
  Layers
} from 'lucide-react';
import DestinationCard from './DestinationCard';
import { ATTRACTIONS } from '../lib/data';
import { staggerContainer, slideUp } from '../lib/animations';

export default function DestinationGrid({ currentLang }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const categories = ['All', 'Spiritual', 'Historical', 'Nature', 'Food', 'Handicrafts'];

  const filteredAttractions = activeCategory === 'All'
    ? ATTRACTIONS
    : ATTRACTIONS.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="explore" className="py-20 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Heritage &amp; Spiritual Corridor</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Explore Nashik &amp; Sacred Sights
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Ancient Jyotirlinga shrines, Ramayana cave sanctuaries, 2000-year-old rock-cut Buddhist chaityas, and scenic Sahyadri waterfall trails.
          </p>
        </div>

        {/* Category Pills Filter Scroll */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 shadow-lg shadow-cyan-electric/25'
                  : 'bg-surface-card hover:bg-slate-800 text-slate-300 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asymmetrical Destination Grid */}
        <motion.div 
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAttractions.map((attraction) => (
            <DestinationCard
              key={attraction.id}
              attraction={attraction}
              onSelect={setSelectedAttraction}
            />
          ))}
        </motion.div>

        {/* Destination Detail Modal */}
        <AnimatePresence>
          {selectedAttraction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-6 sm:p-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAttraction(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white border border-white/10 transition z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header Image */}
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 bg-slate-950">
                  <Image
                    src={selectedAttraction.image}
                    alt={selectedAttraction.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-cyan-electric/20 border border-cyan-electric/40 text-cyan-electric">
                      {selectedAttraction.category}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-white mt-2">
                      {selectedAttraction.name}
                    </h3>
                  </div>
                </div>

                {/* Modal Details Body */}
                <div className="space-y-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedAttraction.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-cyan-electric" /> Location &amp; Address
                      </div>
                      <div className="text-xs text-white font-semibold">{selectedAttraction.address}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Suggested Duration &amp; Timings
                      </div>
                      <div className="text-xs text-white font-semibold">{selectedAttraction.duration}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{selectedAttraction.bestTime}</div>
                    </div>
                  </div>

                  {/* Highlights / Tags */}
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-cyan-electric" /> Highlights &amp; Key Features
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAttraction.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-cyan-electric/10 border border-cyan-electric/25 text-cyan-electric font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/destination/${selectedAttraction.slug}`}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-electric/25 hover:scale-[1.01] transition"
                    >
                      <Layers className="w-4 h-4" /> Explore Nearby Facilities
                    </Link>
                    {selectedAttraction.googleMapsUrl && (
                      <a
                        href={selectedAttraction.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-2 border border-white/10"
                      >
                        <Navigation className="w-4 h-4 text-cyan-electric" /> Maps
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedAttraction(null)}
                      className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs sm:text-sm font-semibold border border-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

