'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-electric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-bold uppercase tracking-widest mb-6">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>Error 404 • Destination Not Found</span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-7xl font-extrabold font-heading text-white tracking-tight mb-4">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mb-3">
          Page or Destination Out of Reach
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed mb-8 font-light">
          The pilgrim assistance page or destination coordinate you were trying to reach does not exist or has been relocated on the digital map.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-electric/25 hover:scale-[1.02] transition"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/#explore"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-4 h-4 text-cyan-electric" /> Browse Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}

