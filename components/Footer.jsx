'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, PhoneCall, ShieldAlert, Heart, Globe, ExternalLink } from 'lucide-react';

export default function Footer({ currentLang, setLanguage }) {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-saffron to-amber-500 p-0.5 shadow-md shadow-saffron/20 flex items-center justify-center text-white font-bold text-base">
                ॐ
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                TOURIST <span className="text-saffron">ASSIST</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
              QR-Based Tourist Information and Essential Facility System for Nashik Kumbh Mela 2027 and citywide sustainable tourism.
            </p>
            <div className="text-[11px] text-cyan-electric font-semibold flex items-center gap-1">
              <span>Explore. Discover. Stay Safe.</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-cyan-electric transition">Home Overview</a></li>
              <li><a href="#kumbh" className="hover:text-cyan-electric transition">Kumbh Mela 2027</a></li>
              <li><a href="#explore" className="hover:text-cyan-electric transition">Explore Nashik Attractions</a></li>
              <li><a href="#facilities" className="hover:text-cyan-electric transition">Essential Facilities Directory</a></li>
              <li><a href="#map" className="hover:text-cyan-electric transition">Interactive Geospatial Map</a></li>
              <li><a href="#qr" className="hover:text-cyan-electric transition">QR Assistance Hub</a></li>
              <li><a href="#connect" className="hover:text-cyan-electric transition">Local Community Connect</a></li>
            </ul>
          </div>

          {/* Emergency Helpline Contacts */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3 flex items-center gap-1.5 text-red-400">
              <ShieldAlert className="w-4 h-4" /> 24/7 Helplines
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="tel:108" className="hover:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                  <span>Ambulance &amp; Medical: <strong className="text-white">108</strong></span>
                </a>
              </li>
              <li>
                <a href="tel:112" className="hover:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>National Police: <strong className="text-white">112</strong></span>
                </a>
              </li>
              <li>
                <a href="tel:1077" className="hover:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>NMC Disaster Control: <strong className="text-white">1077</strong></span>
                </a>
              </li>
              <li>
                <a href="tel:1091" className="hover:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                  <span>Women Safety: <strong className="text-white">1091</strong></span>
                </a>
              </li>
              <li>
                <a href="tel:18002330011" className="hover:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                  <span>NMC Toll-Free: <strong>1800-233-0011</strong></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Language & Transparency */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-electric" /> Language
            </h4>
            <div className="flex gap-2 mb-4">
              {['en', 'hi', 'mr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold border transition ${
                    currentLang === lang
                      ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric'
                      : 'border-white/10 hover:border-white/30 text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Information aggregated from official municipal directories and verified community records. Not an official municipal portal.
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026–2027 <strong>TOURIST ASSIST</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#kumbh" className="hover:text-slate-300">Visitor Advisory</a>
            <a href="#emergency" className="hover:text-slate-300">Safety Notice</a>
            <a href="#facilities" className="hover:text-slate-300">Verified Amenities</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

