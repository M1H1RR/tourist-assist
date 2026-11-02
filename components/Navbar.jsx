'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  QrCode, 
  Users, 
  Building2, 
  Menu, 
  X, 
  Globe, 
  PhoneCall, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ currentLang, setLanguage, activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', labelHi: 'होम', labelMr: 'मुख्य', href: '#home', icon: Compass },
    { id: 'kumbh', label: 'Kumbh 2027', labelHi: 'कुंभ २०२७', labelMr: 'कुंभ २०२७', href: '#kumbh', icon: Sparkles },
    { id: 'explore', label: 'Explore Nashik', labelHi: 'नाशिक दर्शन', labelMr: 'नाशिक दर्शन', href: '#explore', icon: MapPin },
    { id: 'facilities', label: 'Facilities', labelHi: 'सुविधा केंद्र', labelMr: 'सुविधा केंद्र', href: '#facilities', icon: Building2 },
    { id: 'map', label: 'Live Map', labelHi: 'नकाशा', labelMr: 'नकाशा', href: '#map', icon: Compass },
    { id: 'qr', label: 'QR Assistance', labelHi: 'क्यूआर मदत', labelMr: 'क्यूआर मदत', href: '#qr', icon: QrCode },
    { id: 'emergency', label: 'Emergency', labelHi: 'आपत्कालीन', labelMr: 'तातडीची मदत', href: '#emergency', icon: ShieldAlert, highlight: true },
    { id: 'connect', label: 'Local Connect', labelHi: 'स्थानिक सेवा', labelMr: 'स्थानिक सेवा', href: '#connect', icon: Users },
  ];

  const getLabel = (item) => {
    if (currentLang === 'hi') return item.labelHi;
    if (currentLang === 'mr') return item.labelMr;
    return item.label;
  };

  return (
    <>
      {/* Top 24/7 Emergency Quick Bar */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white text-xs font-semibold py-1.5 px-4 border-b border-red-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-200">24/7 Maha Kumbh Helplines:</span>
            <span className="hidden sm:inline text-slate-300">Ambulance: <strong className="text-white">108</strong> | Police: <strong className="text-white">112</strong> | NMC Disaster: <strong className="text-white">1077</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:108" className="bg-red-600/80 hover:bg-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold transition flex items-center gap-1 shadow-sm">
              <PhoneCall className="w-3 h-3" /> Call 108
            </a>
            <a href="tel:112" className="bg-blue-600/80 hover:bg-blue-600 px-2 py-0.5 rounded-full text-[11px] font-bold transition hidden md:flex items-center gap-1 shadow-sm">
              <PhoneCall className="w-3 h-3" /> Call 112
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Sticky Header */}
      <header className={`sticky top-[31px] z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-cyan-electric/20 shadow-2xl py-3' 
          : 'bg-slate-900/70 backdrop-blur-md border-b border-white/10 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron to-amber-500 p-0.5 shadow-lg shadow-saffron/20 group-hover:shadow-cyan-electric/30 transition-all">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-saffron to-amber-300 bg-clip-text text-transparent group-hover:from-cyan-electric group-hover:to-teal-300 transition-all">
                  ॐ
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-electric transition-colors">
                  TOURIST <span className="text-saffron group-hover:text-amber-400">ASSIST</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Nashik Kumbh Mela 2027
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    item.highlight
                      ? 'text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30'
                      : isActive
                      ? 'text-cyan-electric bg-cyan-electric/10 border border-cyan-electric/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-red-400' : isActive ? 'text-cyan-electric' : 'text-slate-400'}`} />
                  {getLabel(item)}
                </a>
              );
            })}
          </nav>

          {/* Controls: Language Selector & CTA */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-card border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-electric/40 transition"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-electric" />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-white/15 shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                  >
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'hi', name: 'हिंदी (Hindi)' },
                      { code: 'mr', name: 'मराठी (Marathi)' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          currentLang === l.code
                            ? 'bg-cyan-electric/20 text-cyan-electric font-bold'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explore Now Button */}
            <a
              href="#explore"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-glow hover:shadow-cyan-electric/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4" /> Explore Now
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-surface-card border border-white/10 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-electric" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-2xl border-b border-cyan-electric/20 px-4 pt-3 pb-6"
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold border ${
                        item.highlight
                          ? 'border-red-500/30 bg-red-950/30 text-red-300'
                          : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-cyan-electric/30 hover:text-cyan-electric'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-cyan-electric" />
                      {getLabel(item)}
                    </a>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                <a
                  href="#emergency"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
                >
                  <ShieldAlert className="w-4 h-4" /> Emergency Helplines
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

