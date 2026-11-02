'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Info, 
  ChevronDown, 
  Bus, 
  Hotel, 
  AlertCircle 
} from 'lucide-react';
import { slideUp, staggerContainer } from '../lib/animations';

export default function KumbhSection({ currentLang }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'What is the significance of the Nashik Kumbh Mela?',
      a: 'The Nashik-Trimbakeshwar Simhastha Kumbh Mela is one of the four sacred Kumbh Melas of India, celebrated once every 12 years when Jupiter (Guru) enters Leo (Simha) constellation. Pilgrims take holy dips in River Godavari at Ramkund and Kushavarta Kund to attain spiritual purification.'
    },
    {
      q: 'Where will the main Shahi Snan (Royal Bathing) take place?',
      a: 'The primary royal dips take place at two sanctified water bodies: Ramkund in Panchavati (Nashik City) for the Vaishnava Akhadas, and Kushavarta Kund in Trimbakeshwar for the Shaiva Akhadas.'
    },
    {
      q: 'Where are private vehicles parked during festival days?',
      a: 'Private tourist buses, taxis, and cars are parked at designated perimeter mega-parking lots, predominantly in Tapovan Sadhugram (Aurangabad Road) and Nilgiri Baug, from where zero-emission municipal electric shuttle buses provide frequent transfers to the ghat promenades.'
    },
    {
      q: 'What pilgrim accommodations are available in Nashik?',
      a: 'Options include Devasthan Trust Dharamshalas (such as Trimbakeshwar Yatri Niwas and Panchavati Dharamshala), IRCTC Pod Dormitories at Nashik Road Railway Station, registered homestays under Local Connect, and temporary tent cities in Sadhugram.'
    },
    {
      q: 'How do the physical on-ground QR codes assist visitors?',
      a: 'Physical QR signage is installed across key ghat steps, parking lots, bus terminals, and medical posts. Scanning them with any smartphone immediately opens a dedicated location hub with 1-tap emergency calling, drinking water dispensers, nearest clean toilets, and navigation assistance.'
    }
  ];

  return (
    <section id="kumbh" className="py-20 relative bg-surface-dark/60 border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Spiritual Heritage &amp; Festival Guide</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Nashik Maha Kumbh Mela 2027
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Essential spiritual background, designated ghat sectors, official administrative advisories, and pilgrim guidelines for a safe pilgrimage.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          {/* Pillar 1: Spiritual Sanctity */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-amber-400/40 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Sacred Significance</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Revered as the Dakshin Ganga (Ganges of the South), River Godavari originates at Brahmagiri in Trimbakeshwar. Taking a holy dip during Simhastha snan is believed to bestow moksha and liberation from karmic cycles.
            </p>
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <span>Trimbakeshwar &amp; Ramkund Ground Zero</span>
            </div>
          </div>

          {/* Pillar 2: Transit & Mega Parking */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-electric/40 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric mb-5">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Transit &amp; Parking Grid</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Vehicles are regulated at outer satellite ring hubs to prevent pedestrian congestion on ancient ghat steps. Electric shuttle buses and battery e-rickshaws ferry pilgrims seamlessly between Tapovan parking and Ramkund.
            </p>
            <div className="text-xs text-cyan-electric font-medium flex items-center gap-1">
              <span>Tapovan Sadhugram Mega Hub</span>
            </div>
          </div>

          {/* Pillar 3: Pilgrim Etiquette & Safety */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-teal-400/40 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Safety &amp; River Care</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Pilgrims are requested to keep Godavari River clean by avoiding plastic, soap, or non-biodegradable pooja articles. ID wristbands are strongly advised for children and senior citizens at helpdesks.
            </p>
            <div className="text-xs text-teal-400 font-medium flex items-center gap-1">
              <span>Swachh Kumbh Clean River Protocol</span>
            </div>
          </div>

        </div>

        {/* Official Announcements Box (Strictly Labelled Placeholder as per Rules) */}
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 mb-14 bg-slate-900/80">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Official Administrative Advisory Desk (Demonstration Status)
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Official ceremonial dates, security alerts, and administrative traffic diversions for Nashik Kumbh Mela 2027 will be synced in real-time as published by the Nashik Municipal Corporation (NMC) and District Collectorate. Always refer to verified municipal boards stationed at Ramkund and Kushavarta Kund.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold font-heading text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="glass-panel rounded-xl overflow-hidden border border-white/10 transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between text-sm sm:text-base font-semibold text-slate-200 hover:text-cyan-electric transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-electric' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

