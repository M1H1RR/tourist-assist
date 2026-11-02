'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import KumbhSection from '../components/KumbhSection';
import DestinationGrid from '../components/DestinationGrid';
import FacilitySection from '../components/FacilitySection';
import QRAssistance from '../components/QRAssistance';
import EmergencySection from '../components/EmergencySection';
import LocalConnect from '../components/LocalConnect';
import Footer from '../components/Footer';
import AIAssistant from '../components/AIAssistant';

// Dynamic import for Leaflet map to guarantee zero SSR hydration issues
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-3xl bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-cyan-electric border-t-transparent rounded-full animate-spin" />
        <span>Loading Interactive Geospatial Map...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeSection, setActiveSection] = useState('home');

  const handleGlobalSearch = (query) => {
    // Scrolls to explore section and focuses query
    const target = document.getElementById('explore');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background text-primaryText selection:bg-cyan-electric selection:text-slate-950 font-sans">
      
      {/* Sticky Glassmorphic Navbar */}
      <Navbar 
        currentLang={currentLang} 
        setLanguage={setCurrentLang}
        activeSection={activeSection}
      />

      {/* Cinematic Hero Section */}
      <Hero 
        onSearchSubmit={handleGlobalSearch}
        currentLang={currentLang}
      />

      {/* Kumbh Mela 2027 Information Section */}
      <KumbhSection 
        currentLang={currentLang}
      />

      {/* Explore Nashik Tourism & Asymmetrical Destination Grid */}
      <DestinationGrid 
        currentLang={currentLang}
      />

      {/* Interactive Dark Leaflet Map */}
      <InteractiveMap 
        currentLang={currentLang}
      />

      {/* Essential Tourist Facilities Directory */}
      <FacilitySection 
        currentLang={currentLang}
      />

      {/* Dedicated QR Assistance Hub */}
      <QRAssistance 
        currentLang={currentLang}
      />

      {/* Emergency Assistance Section */}
      <EmergencySection 
        currentLang={currentLang}
      />

      {/* Local Connect & Community Opportunities */}
      <LocalConnect 
        currentLang={currentLang}
      />

      {/* Footer */}
      <Footer 
        currentLang={currentLang}
        setLanguage={setCurrentLang}
      />

      {/* Interactive Multilingual AI Tourist Assistant */}
      <AIAssistant 
        currentLang={currentLang}
      />

    </main>
  );
}

