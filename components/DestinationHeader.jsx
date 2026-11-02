'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Navigation, 
  Crosshair, 
  Compass, 
  Sparkles,
  ChevronDown,
  Check,
  ShieldCheck
} from 'lucide-react';
import { DESTINATIONS } from '../lib/facilitiesService';

export default function DestinationHeader({
  destination,
  onDestinationChange,
  userLocation,
  onDetectLocation,
  locating,
  onClearUserLocation
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl mb-8">
      {/* Background Banner with Gradient */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden sm:block" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
          {/* Destination Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/20 backdrop-blur-md shadow-xl transition"
            >
              <Compass className="w-4 h-4 text-cyan-electric" />
              <span className="truncate max-w-[140px] sm:max-w-none">
                Switch Destination ({DESTINATIONS.indexOf(destination) + 1}/10)
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1.5 block">
                  Select Tourist Destination:
                </span>
                {DESTINATIONS.map((d) => {
                  const isCurrent = d.id === destination.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        onDestinationChange(d);
                        setDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-electric/20 text-cyan-electric font-bold border border-cyan-electric/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-[10px] text-slate-400">{d.area}</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-cyan-electric" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Location Permission / GPS Button */}
          <div>
            {!userLocation ? (
              <button
                onClick={onDetectLocation}
                disabled={locating}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-cyan-electric text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/20 backdrop-blur-md shadow-xl transition"
                title="Detect GPS coordinates to compare distances from your current location"
              >
                <Crosshair className={`w-4 h-4 text-cyan-electric ${locating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {locating ? 'Detecting GPS...' : 'Use My Current Location'}
                </span>
                <span className="sm:hidden">GPS</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GPS Active</span>
                </span>
                <button
                  onClick={onClearUserLocation}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-white/10"
                  title="Reset distance reference back to destination"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Destination Title & Identity Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-electric text-slate-950 shadow-md">
              {destination.category}
            </span>
            {destination.nameLocal && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/20 text-slate-300 backdrop-blur-md font-devanagari">
                {destination.nameLocal}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Coordinates
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {destination.name}
          </h1>
        </div>
      </div>

      {/* Details Row under Banner */}
      <div className="p-4 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {destination.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
              <span>{destination.address}</span>
            </span>
            {destination.bestTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{destination.bestTime}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions Button */}
        <div className="flex items-center gap-3 shrink-0">
          {destination.googleMapsUrl && (
            <a
              href={destination.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-electric/25 hover:scale-[1.02] transition"
            >
              <Navigation className="w-4 h-4" /> Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

