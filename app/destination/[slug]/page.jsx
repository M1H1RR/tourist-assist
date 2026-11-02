'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Plus, 
  Layers, 
  Sparkles, 
  QrCode, 
  Share2, 
  Check 
} from 'lucide-react';
import { 
  DESTINATIONS, 
  getDestinationBySlug, 
  getDestinationFacilities 
} from '../../../lib/facilitiesService';
import DestinationHeader from '../../../components/DestinationHeader';
import NearbyFacilitiesDashboard from '../../../components/NearbyFacilitiesDashboard';
import RadiusSelector from '../../../components/RadiusSelector';
import FacilityFilters from '../../../components/FacilityFilters';
import FacilityList from '../../../components/FacilityList';
import AdminFacilityModal from '../../../components/AdminFacilityModal';

// Dynamically import Leaflet Map to prevent SSR hydration issues
const NearbyFacilitiesMap = dynamic(
  () => import('../../../components/NearbyFacilitiesMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-3xl bg-slate-900 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-cyan-electric border-t-transparent rounded-full animate-spin" />
          <span>Loading Geospatial Map &amp; Radius Boundary...</span>
        </div>
      </div>
    ),
  }
);

export default function DestinationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Extract destination from URL param slug or alias
  const slug = params?.slug || 'sita-gufa-and-panch-vruksha';
  const destination = useMemo(() => getDestinationBySlug(slug), [slug]);

  // State
  const [radiusKm, setRadiusKm] = useState(1.0); // Default 1.0 km as requested
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nearest');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Facilities data container
  const [facilitiesData, setFacilitiesData] = useState({
    facilities: [],
    categoriesSummary: {},
    totalInRadius: 0,
    allFacilitiesWithDistance: []
  });

  const [loading, setLoading] = useState(true);

  // Fetch facilities for this destination whenever destination, radius, category, search, or sort changes
  const loadFacilities = useCallback(async () => {
    setLoading(true);
    const result = await getDestinationFacilities(destination, {
      radiusKm,
      category: selectedCategory,
      sortBy,
      searchQuery,
      customUserCoords: userLocation
    });
    setFacilitiesData(result);
    setLoading(false);
  }, [destination, radiusKm, selectedCategory, sortBy, searchQuery, userLocation, dataVersion]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  // Handle destination switch
  const handleDestinationChange = (newDest) => {
    router.push(`/destination/${newDest.slug}`);
  };

  // Browser Geolocation Permission handler (optional "Use My Current Location")
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        setLocating(false);
        alert('Could not retrieve your location. Location permission was denied or timed out. Reverting to destination coordinates.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Share current destination link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primaryText selection:bg-cyan-electric selection:text-slate-950 font-sans pb-24">
      
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-electric" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2">
              <span className="text-sm font-extrabold font-heading tracking-wider text-white">
                TOURIST <span className="text-cyan-electric">ASSIST</span>
              </span>
            </Link>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy destination link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-electric" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setAdminModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-electric border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-electric" />
              <span className="hidden sm:inline">Admin / Manage</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* A. Destination Overview Header */}
        <DestinationHeader
          destination={destination}
          onDestinationChange={handleDestinationChange}
          userLocation={userLocation}
          onDetectLocation={handleDetectLocation}
          locating={locating}
          onClearUserLocation={() => setUserLocation(null)}
        />

        {/* Radius Selector Component */}
        <div className="mb-8">
          <RadiusSelector
            selectedRadius={radiusKm}
            onRadiusChange={(r) => setRadiusKm(r)}
          />
        </div>

        {/* B. Nearby Facilities Dashboard (12 Category Summary Cards) */}
        <section className="mb-10">
          <NearbyFacilitiesDashboard
            categoriesSummary={facilitiesData.categoriesSummary}
            selectedCategory={selectedCategory}
            onCategorySelect={(cat) => setSelectedCategory(cat)}
            radiusKm={radiusKm}
            totalFound={facilitiesData.totalInRadius}
          />
        </section>

        {/* Interactive Geospatial Leaflet Map */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-electric" />
                <span>Geospatial Proximity Map</span>
              </h3>
              <p className="text-xs text-slate-400">
                Centred on {destination.name} with circular {radiusKm >= 1 ? `${radiusKm} km` : `${radiusKm * 1000} m`} search boundary.
              </p>
            </div>
          </div>

          <NearbyFacilitiesMap
            destination={destination}
            facilities={facilitiesData.facilities}
            radiusKm={radiusKm}
            selectedCategory={selectedCategory}
            userLocation={userLocation}
            focusedFacility={focusedFacility}
          />
        </section>

        {/* Facility Search, Filter, & Sorting Toolbar */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold font-heading text-white">
              Nearby Verified Facilities ({facilitiesData.facilities.length})
            </h3>
            <span className="text-xs text-slate-400">
              Straight-line proximity from destination
            </span>
          </div>

          <FacilityFilters
            activeCategory={selectedCategory}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            sortBy={sortBy}
            onSortChange={(s) => setSortBy(s)}
            categoriesSummary={facilitiesData.categoriesSummary}
            totalCount={facilitiesData.totalInRadius}
          />
        </section>

        {/* Facility Cards Grid or Empty State */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl bg-slate-900 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <FacilityList
              facilities={facilitiesData.facilities}
              activeCategory={selectedCategory}
              radiusKm={radiusKm}
              categoriesSummary={facilitiesData.categoriesSummary}
              onExpandRadius={() => {
                const nextRadius = radiusKm < 1 ? 1.0 : radiusKm < 2 ? 2.0 : 5.0;
                setRadiusKm(nextRadius);
              }}
              onFocusOnMap={(facility) => {
                setFocusedFacility(facility);
                const mapEl = document.querySelector('#map') || document.querySelector('.leaflet-container');
                if (mapEl) {
                  mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            />
          )}
        </section>

      </main>

      {/* Admin Facility Management Modal */}
      <AdminFacilityModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        destination={destination}
        onFacilitySaved={() => setDataVersion(v => v + 1)}
      />

    </div>
  );
}

