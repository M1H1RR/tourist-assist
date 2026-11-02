'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
  Compass
} from 'lucide-react';
import { FACILITIES } from '../lib/data';
import { staggerContainer, slideUp } from '../lib/animations';

export default function FacilitySection({ currentLang }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxRadius, setMaxRadius] = useState(30);
  const [areaFilter, setAreaFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'medical', label: '🏥 Medical & ER' },
    { id: 'police', label: '👮 Police Safety' },
    { id: 'toilets', label: '🚻 Sulabh Toilets' },
    { id: 'water', label: '🚰 Chilled RO Water' },
    { id: 'transport', label: '🚌 Shuttles & Transit' },
    { id: 'accommodation', label: '🏨 Yatri Niwas' },
    { id: 'parking', label: '🅿️ Mega Parking' },
    { id: 'tourist_info', label: 'ℹ️ Tourist Desks' },
  ];

  const filteredFacilities = FACILITIES.filter(f => {
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter;
    const matchSearch = !searchTerm || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRadius = f.dist <= maxRadius;
    const matchArea = areaFilter === 'all' || f.area === areaFilter;
    return matchCat && matchSearch && matchRadius && matchArea;
  });

  return (
    <section id="facilities" className="py-20 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Civic Amenities &amp; Medical Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Essential Tourist &amp; Pilgrim Facilities
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Verified municipal hospitals, Sulabh modern toilet complexes, free RO drinking water dispensers, and electric shuttle corridors.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-5 rounded-2xl mb-8 space-y-4">
          
          {/* Search + Area Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by facility name, service, or keyword (e.g. 'Civil Hospital', 'RO water', 'Sulabh')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-electric"
              />
            </div>

            <div>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-electric"
              >
                <option value="all">All Areas in Nashik</option>
                <option value="Panchavati">Panchavati &amp; Ramkund</option>
                <option value="Tapovan">Tapovan Sadhugram</option>
                <option value="Old CBS">Old CBS Bus Stand</option>
                <option value="Nashik Road">Nashik Road Railway</option>
                <option value="Trimbakeshwar">Trimbakeshwar</option>
                <option value="Trambakeshwar Road">Trambakeshwar Road</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 shadow-md shadow-cyan-electric/25'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Radius Slider Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Compass className="w-3.5 h-3.5 text-cyan-electric" /> Radius from Ramkund:
              </span>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={maxRadius}
                onChange={(e) => setMaxRadius(parseFloat(e.target.value))}
                className="w-32 accent-cyan-electric cursor-pointer"
              />
              <span className="font-bold text-cyan-electric">{maxRadius} km</span>
            </div>

            <span className="text-slate-400 font-medium">
              Showing <strong>{filteredFacilities.length}</strong> verified amenities
            </span>
          </div>

        </div>

        {/* Facility Cards Grid */}
        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFacilities.map((facility) => (
            <motion.div
              layout
              key={facility.id}
              variants={slideUp}
              whileHover={{ y: -4 }}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                facility.emergency
                  ? 'border-red-500/30 hover:border-red-500/60 bg-red-950/10'
                  : 'border-white/10 hover:border-cyan-electric/40'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    facility.emergency
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/30'
                  }`}>
                    {facility.categoryLabel}
                  </span>
                  
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" />
                    {facility.dist === 0 ? 'Ground Zero' : `${facility.dist} km`}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white mb-2 leading-snug">
                  {facility.name}
                </h3>

                <p className="text-xs text-slate-300 mb-4 flex items-start gap-1.5 font-light">
                  <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                  <span>{facility.address}</span>
                </p>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-300 mb-4 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Hours:
                    </span>
                    <span className="font-medium text-white">{facility.hours}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tariff / Fee:</span>
                    <span className="font-medium text-teal-300 truncate max-w-[180px]">{facility.rate}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Provenance:
                    </span>
                    <span className="text-emerald-300 font-semibold text-[11px]">{facility.verified}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {facility.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Button */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                {facility.phone && (
                  <a
                    href={`tel:${facility.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-electric" /> {facility.phone}
                  </a>
                )}
                {facility.mapsUrl && (
                  <a
                    href={facility.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-cyan-electric/20 hover:bg-cyan-electric/30 text-cyan-electric font-semibold text-xs flex items-center justify-center gap-1 border border-cyan-electric/40 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-white">No facilities found matching your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try expanding the radius slider or resetting category filters.</p>
          </div>
        )}

      </div>
    </section>
  );
}

