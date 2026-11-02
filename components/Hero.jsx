'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Compass, 
  Building2,
  QrCode,
  ChevronDown
} from 'lucide-react';
import { slideUp, staggerContainer } from '../lib/animations';

export default function Hero({ onSearchSubmit, currentLang }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
    const target = document.getElementById('explore');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24">
      {/* Full-Screen Cinematic Kumbh Mela Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Parallax & Gentle Breathing Animation on Authentic Kumbh Mela Photograph */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/assets/attractions/ramkund.jpg"
            alt="Nashik Kumbh Mela Sacred Godavari Ghats and Ramkund"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-105 contrast-[1.02]"
          />
        </motion.div>

        {/* Subtle Dark Gradient Overlay (Preserving photo vibrance while ensuring crisp text readability) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0.88) 100%)'
          }}
        />

        {/* Subtle Cyan and Saffron Ambient Lighting */}
        <div className="absolute top-1/4 -left-20 w-80 md:w-[480px] h-80 md:h-[480px] bg-cyan-electric/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-20 w-80 md:w-[480px] h-80 md:h-[480px] bg-saffron/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />

        {/* Subtle Floating Ambient Light Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '18%', left: '12%', size: 'w-2 h-2', bg: 'bg-cyan-electric', delay: 0 },
            { top: '60%', left: '8%', size: 'w-1.5 h-1.5', bg: 'bg-saffron', delay: 1.8 },
            { top: '24%', right: '14%', size: 'w-2.5 h-2.5', bg: 'bg-amber-300', delay: 0.9 },
            { top: '68%', right: '10%', size: 'w-2 h-2', bg: 'bg-cyan-electric', delay: 2.7 },
            { top: '42%', left: '88%', size: 'w-1.5 h-1.5', bg: 'bg-teal-300', delay: 1.4 },
            { top: '35%', left: '22%', size: 'w-1.5 h-1.5', bg: 'bg-amber-200', delay: 3.2 },
          ].map((p, idx) => (
            <motion.div
              key={idx}
              style={{ top: p.top, left: p.left, right: p.right }}
              className={`absolute ${p.size} ${p.bg} rounded-full blur-[1px] opacity-70`}
              animate={{
                y: [0, -22, 0],
                opacity: [0.25, 0.85, 0.25],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 4.5 + idx * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge Tag */}
          <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-electric/40 text-cyan-electric text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-lg shadow-cyan-electric/15">
            <Sparkles className="w-4 h-4 text-cyan-electric animate-pulse" />
            <span>Nashik Maha Kumbh Mela 2027 &amp; Smart Tourism Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={slideUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-white leading-[1.1] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
          >
            Your Complete Guide to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-electric via-amber-300 to-saffron bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_rgba(0,243,255,0.35)]">
              Nashik Kumbh Mela 2027
            </span> <br className="hidden sm:inline" />
            &amp; Beyond
          </motion.h1>

          {/* Supporting Subtitle */}
          <motion.p 
            variants={slideUp}
            className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            Discover sacred destinations, access essential facilities, explore Nashik, and get reliable tourist information through one simple platform.
          </motion.p>

          {/* Glassmorphic Search Bar */}
          <motion.div variants={slideUp} className="max-w-2xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl shadow-cyan-electric/20">
              <div className="absolute left-4 sm:left-5 pointer-events-none text-cyan-electric">
                <Search className="w-5 h-5 text-cyan-electric" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to next? Search temples, ghats, hospitals, tourist facilities..."
                className="w-full pl-12 sm:pl-14 pr-32 py-4 sm:py-4.5 rounded-2xl bg-slate-900/80 border border-white/25 text-white placeholder-slate-300 text-sm sm:text-base focus:outline-none focus:border-cyan-electric focus:ring-2 focus:ring-cyan-electric/40 backdrop-blur-xl transition duration-200 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs sm:text-sm hover:opacity-95 hover:shadow-glow-cyan transition duration-200 shadow-md"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div variants={slideUp} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            <a
              href="#explore"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-electric/25 hover:shadow-cyan-electric/40 hover:scale-[1.03] transition-all"
            >
              <Compass className="w-4 h-4" /> Explore Nashik
            </a>
            <a
              href="#facilities"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-md hover:border-cyan-electric/40 hover:scale-[1.02] transition-all"
            >
              <Building2 className="w-4 h-4 text-cyan-electric" /> Find Essential Facilities
            </a>
            <a
              href="#qr"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-[1.03] transition-all"
            >
              <QrCode className="w-4 h-4 text-slate-950" /> QR Assistance
            </a>
          </motion.div>

          {/* Platform Metric Badges Strip */}
          <motion.div 
            variants={slideUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-white/15"
          >
            <div className="p-4 rounded-2xl text-left bg-slate-900/75 border border-white/10 border-l-4 border-l-cyan-electric backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">16+</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Facilities</div>
            </div>
            <div className="p-4 rounded-2xl text-left bg-slate-900/75 border border-white/10 border-l-4 border-l-amber-400 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">11+</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Cultural Destinations</div>
            </div>
            <div className="p-4 rounded-2xl text-left bg-slate-900/75 border border-white/10 border-l-4 border-l-teal-400 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">5 Active</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Dynamic QR Hubs</div>
            </div>
            <div className="p-4 rounded-2xl text-left bg-slate-900/75 border border-white/10 border-l-4 border-l-coral-neon backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">24/7</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Emergency Helpline</div>
            </div>
          </motion.div>

          {/* Animated Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center justify-center mt-12 sm:mt-14"
          >
            <a
              href="#explore"
              aria-label="Scroll down to explore"
              className="inline-flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-electric transition-colors group cursor-pointer"
            >
              <span className="text-[11px] uppercase tracking-widest font-medium text-slate-400 group-hover:text-cyan-electric transition-colors">
                Scroll to explore
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-cyan-electric flex items-start justify-center p-1.5 transition-colors">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-electric shadow-glow-cyan"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-electric transition-colors -mt-0.5 animate-bounce" />
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
