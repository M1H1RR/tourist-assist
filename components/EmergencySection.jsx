'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  HeartHandshake, 
  AlertTriangle, 
  HelpCircle, 
  MapPin, 
  ExternalLink,
  Flame,
  LifeBuoy
} from 'lucide-react';
import { EMERGENCY_CONTACTS, FACILITIES } from '../lib/data';
import { slideUp, staggerContainer } from '../lib/animations';

export default function EmergencySection({ currentLang }) {
  const hospitals = FACILITIES.filter(f => f.category === 'medical');

  const safetyGuidelines = [
    {
      title: 'Crowd Discipline & Flow Lanes',
      desc: 'Follow the designated one-way barricaded entry and exit pathways at Ramkund and Kushavarta Kund. Never attempt to push against pedestrian flow.'
    },
    {
      title: 'Lost Persons & Identification Bands',
      desc: 'Collect free identification wristbands for children and senior citizens from any Police Helpdesk. Pre-agree on an outer meeting landmark.'
    },
    {
      title: 'Heatstroke & Dehydration Care',
      desc: 'Drink water regularly from the free RO stations along the ghats. Free ORS pouches and first-aid treatment are available at Ramkund First-Aid Post.'
    },
    {
      title: 'River Current Caution',
      desc: 'Bathe only within designated safety chains and under lifeguard supervision. Do not swim beyond protective net barriers in the Godavari river.'
    }
  ];

  return (
    <section id="emergency" className="py-20 relative bg-slate-950 border-t border-b border-red-500/20">
      
      {/* Background Emergency Ambient Red Tint */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-lg shadow-red-600/20">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>24/7 Verified Emergency Helplines</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Emergency Care &amp; Public Safety Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Official emergency hotlines, dedicated trauma centers, and lost &amp; found safety protocols. All numbers verified by district authorities.
          </p>
        </div>

        {/* Big Emergency Helpline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {EMERGENCY_CONTACTS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20 relative overflow-hidden flex flex-col justify-between hover:border-red-400 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-red-400 tracking-wider">
                    {item.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">{item.desc}</p>
              </div>

              <a
                href={item.callUrl}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call {item.number}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Nearby Verified Hospitals Grid */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-2">
            <Hospital className="w-5 h-5 text-red-400" /> Designated Hospitals &amp; First Aid Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hospitals.map((h) => (
              <div key={h.id} className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-red-500/30 transition">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 inline-block mb-2">
                  {h.categoryLabel}
                </span>
                <h4 className="text-base font-bold text-white mb-1.5">{h.name}</h4>
                <p className="text-xs text-slate-300 flex items-start gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                  <span>{h.address}</span>
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                  <span>Distance: <strong>{h.dist} km</strong></span>
                  <a href={`tel:${h.phone}`} className="text-red-400 font-bold hover:underline">
                    {h.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Instructions & Guidelines Accordion / Grid */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-slate-900/80">
          <h3 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Crucial Pilgrim Safety Instructions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safetyGuidelines.map((g, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-white/5">
                <h4 className="text-sm font-bold text-amber-300 mb-1.5">{g.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

