'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Scan, 
  MapPin, 
  Sparkles, 
  PhoneCall, 
  Compass, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Camera, 
  AlertCircle,
  Layers,
  ExternalLink
} from 'lucide-react';
import { QR_HUBS } from '../lib/data';

// Mapping from physical QR Hub codeId to destination page
const HUB_DESTINATION_MAP = {
  'sita-gufa-hub': 'sita-gufa-and-panch-vruksha',
  'ramkund-ghat-hub': 'ramkund-and-panchavati-ghats',
  'kalaram-mandir-hub': 'shree-kalaram-mandir',
  'trimbakeshwar-arrival': 'trimbakeshwar-jyotirlinga-mandir',
  'panchavati-medical-point': 'sita-gufa-and-panch-vruksha',
  'cbs-bus-terminal': 'ramkund-and-panchavati-ghats',
  'tapovan-sadhugram-parking': 'tapovan-sadhugram-nashik',
};

export default function QRAssistance({ currentLang }) {
  const [selectedHub, setSelectedHub] = useState(QR_HUBS[0]);
  const [manualCode, setManualCode] = useState('');
  const [showSimulatedScan, setShowSimulatedScan] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('Ramkund Main Ghat Snan Hub');

  const steps = [
    { num: '01', title: 'Find Signage', desc: 'Locate physical Tourist Assist QR posters at Ramkund, Trimbakeshwar, Tapovan, and CBS.' },
    { num: '02', title: 'Instant Scan', desc: 'Scan directly with any standard smartphone camera. No app installation or download needed.' },
    { num: '03', title: 'Zone Assistance', desc: 'Instant access to nearest drinking water RO, Sulabh toilets, medical aid, and Aarti schedules.' },
    { num: '04', title: '1-Tap Emergency', desc: 'Direct dispatch to 108 Ambulance and police desks stationed within your physical sector.' },
  ];

  const handleManualLookup = (e) => {
    e.preventDefault();
    const found = QR_HUBS.find(h => h.codeId.toLowerCase().includes(manualCode.trim().toLowerCase()));
    if (found) {
      setSelectedHub(found);
      setShowSimulatedScan(true);
    } else {
      alert(`No QR Hub found matching "${manualCode}". Try "ramkund", "trimbakeshwar", or "cbs".`);
    }
  };

  return (
    <section id="qr" className="py-20 relative bg-surface-dark border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-semibold uppercase tracking-wider mb-3">
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital On-Ground Touchpoints</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            QR-Based Pilgrim Assistance
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Physical QR signs stationed across ghats, bus terminals, and parking grounds open location-specific emergency care and directions instantly on your phone.
          </p>
        </div>

        {/* 4 Steps Explainer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
              <span className="text-3xl font-extrabold font-heading text-cyan-electric/30 mb-2 block">{s.num}</span>
              <h3 className="text-base font-bold text-white mb-1.5">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive QR Simulation & Demonstration Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active QR Hub Selector */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-cyan-electric" /> Select a Verified Physical QR Hub:
            </h3>
            <p className="text-xs text-slate-400">
              Click any verified QR hub to preview the real mobile assistance landing interface that visitors see on ground.
            </p>

            <div className="space-y-2.5">
              {QR_HUBS.map((hub) => (
                <div
                  key={hub.codeId}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    selectedHub.codeId === hub.codeId
                      ? 'bg-slate-800/90 border-cyan-electric shadow-lg shadow-cyan-electric/15'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/25 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{hub.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-electric/10 text-cyan-electric border border-cyan-electric/30">
                      {hub.scans} Scans
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1 font-light">
                    <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0" /> {hub.location}
                  </p>
                </div>
              ))}
            </div>

            {/* Manual Code Finder */}
            <form onSubmit={handleManualLookup} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Enter Hub ID (e.g. ramkund-ghat-hub)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-electric"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-slate-800 border border-white/15 text-xs font-bold text-cyan-electric transition"
              >
                Lookup
              </button>
            </form>
          </div>

          {/* Right: Mobile Phone Frame Preview of QR Hub Landing View */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md rounded-[32px] border-4 border-slate-700 bg-slate-950 p-6 shadow-2xl shadow-cyan-electric/10 relative overflow-hidden">
              
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="w-3 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Header inside phone */}
              <div className="text-center mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-cyan-electric/20 border border-cyan-electric/40 text-cyan-electric inline-block mb-2">
                  LIVE QR ON-GROUND HUB
                </span>
                <h4 className="text-xl font-heading font-extrabold text-white leading-tight">
                  {selectedHub.title}
                </h4>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-cyan-electric" /> {selectedHub.location}
                </p>
              </div>

              {/* 1-Tap Emergency Calling Row inside phone */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <a
                  href="tel:108"
                  className="p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-center text-red-300 transition"
                >
                  <PhoneCall className="w-5 h-5 mx-auto mb-1 text-red-400" />
                  <span className="text-[11px] font-bold block">108 Ambulance</span>
                </a>
                <a
                  href="#facilities"
                  className="p-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-center text-teal-300 transition"
                >
                  <span className="text-lg block mb-0.5">🚰</span>
                  <span className="text-[11px] font-bold block">Chilled RO</span>
                </a>
                <a
                  href="#facilities"
                  className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-center text-purple-300 transition"
                >
                  <span className="text-lg block mb-0.5">🚻</span>
                  <span className="text-[11px] font-bold block">Sulabh Toilets</span>
                </a>
              </div>

              {/* Guidance Description */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 mb-5 text-xs text-slate-300 leading-relaxed font-light">
                {selectedHub.desc}
              </div>

              {/* Simulated QR Code SVG Graphic */}
              <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-slate-900 mb-4">
                <div className="w-36 h-36 relative flex items-center justify-center border-2 border-slate-900 p-2">
                  {/* Decorative Simulated QR Pattern */}
                  <div className="w-full h-full grid grid-cols-5 gap-1 p-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-xs ${
                          i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                            ? 'bg-slate-950' 
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold mt-2 text-slate-600 uppercase">
                  ID: {selectedHub.codeId}
                </span>
              </div>

              {/* Instant Destination Nearby Facilities Action */}
              <div className="mb-4">
                <Link
                  href={`/destination/${HUB_DESTINATION_MAP[selectedHub.codeId] || 'ramkund-and-panchavati-ghats'}`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-electric/25 hover:scale-[1.02] transition text-center"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open {selectedHub.title.split(' ')[0]} Nearby Facilities</span>
                </Link>
              </div>

              {/* Physical Poster Note */}
              <p className="text-[11px] text-slate-400 text-center">
                Physical weather-proof vinyl signs installed by Municipal Disaster Cell.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

