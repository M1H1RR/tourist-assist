'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Phone, 
  MapPin, 
  PlusCircle, 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  Send
} from 'lucide-react';
import { LOCAL_PROVIDERS } from '../lib/data';

export default function LocalConnect({ currentLang }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    category: 'Guide',
    area: '',
    phone: '',
    services: '',
    pricing: '',
  });

  const categories = ['All', 'Guide', 'Transport', 'Food', 'Handicraft', 'Accommodation'];

  const filteredProviders = activeCategory === 'All'
    ? LOCAL_PROVIDERS
    : LOCAL_PROVIDERS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setRegistrationOpen(false);
      setFormData({
        name: '',
        businessName: '',
        category: 'Guide',
        area: '',
        phone: '',
        services: '',
        pricing: '',
      });
      alert('Thank you! Your registration has entered the pending moderation queue.');
    }, 1500);
  };

  return (
    <section id="connect" className="py-20 relative bg-surface-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Community Livelihoods &amp; Fair Tourism</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Local Connect — Nashik Community Directory
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Connect directly with verified local spiritual guides, zero-emission e-rickshaw drivers, traditional copper artisans, and satvik family homestays without middleman commissions.
          </p>
        </div>

        {/* Filter & Register Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === c
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setRegistrationOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" /> Register as Local Provider
          </button>
        </div>

        {/* Providers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {provider.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {provider.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white mb-1">
                  {provider.businessName}
                </h3>
                <p className="text-xs text-slate-400 mb-3 font-medium">
                  Proprietor: {provider.name}
                </p>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed font-light">
                  {provider.desc}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
                    <span>Area: <strong>{provider.area}</strong></span>
                  </div>
                  <div>
                    <span className="text-slate-400">Offerings: </span>
                    <span>{provider.services}</span>
                  </div>
                  <div className="text-amber-300 font-medium">
                    Tariff: {provider.pricing}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${provider.phone}`}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Call {provider.phone}
              </a>
            </div>
          ))}
        </div>

        {/* Local Provider Registration Modal */}
        <AnimatePresence>
          {registrationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/20 shadow-2xl p-6 sm:p-8"
              >
                <button
                  onClick={() => setRegistrationOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold font-heading text-white mb-1 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" /> Register as a Local Provider
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Join the verified community platform. All entries enter a pending queue audited by the Tourist Assist team.
                </p>

                {formSubmitted ? (
                  <div className="py-8 text-center text-emerald-400 space-y-2">
                    <CheckCircle className="w-12 h-12 mx-auto animate-bounce" />
                    <p className="font-bold text-white text-base">Application Submitted!</p>
                    <p className="text-xs text-slate-400">Our ground team will verify your credentials shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Deshmukh"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Business / Service Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Godavari Heritage Pilgrim Tours"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="Guide">Local Guide</option>
                          <option value="Transport">E-Rickshaw / Auto</option>
                          <option value="Food">Satvik Bhojanalay</option>
                          <option value="Handicraft">Copper &amp; Brass Crafts</option>
                          <option value="Accommodation">Homestay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98220 00000"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Operating Area *</label>
                      <input
                        type="text"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. Panchavati / Ramkund / Trimbakeshwar"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Services Offered *</label>
                      <input
                        type="text"
                        required
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        placeholder="e.g. Guided 2-hour walking tours in Hindi and Marathi"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit for Approval
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

