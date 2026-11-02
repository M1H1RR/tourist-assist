'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Crosshair, 
  X,
  AlertCircle,
  RotateCcw,
  Layers,
  Sparkles,
  Info,
  Car,
  Droplets,
  HeartPulse,
  Shield,
  Bus,
  Landmark,
  ExternalLink
} from 'lucide-react';
import { ATTRACTIONS, FACILITIES } from '../lib/data';

// Category color and visual config
const CATEGORY_CONFIG = {
  attraction: {
    label: 'Temples & Sights',
    color: '#F59E0B', // Amber Gold
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    icon: '🏛️',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  medical: {
    label: 'Hospitals & ER',
    color: '#EF4444', // Emergency Red
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.4)',
    icon: '🏥',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
  },
  police: {
    label: 'Police & Safety',
    color: '#3B82F6', // Blue
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    icon: '👮',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  },
  water: {
    label: 'RO Drinking Water',
    color: '#06B6D4', // Cyan
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
    icon: '🚰',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
  },
  toilets: {
    label: 'Public Sanitation',
    color: '#8B5CF6', // Purple
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.4)',
    icon: '🚻',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  parking: {
    label: 'Parking Areas',
    color: '#6366F1', // Indigo
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.4)',
    icon: '🅿️',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>'
  },
  transport: {
    label: 'Transit & Shuttles',
    color: '#F97316', // Orange
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    icon: '🚌',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>'
  },
  tourist_info: {
    label: 'Tourist Helpdesks',
    color: '#10B981', // Emerald
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    icon: 'ℹ️',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  },
  accommodation: {
    label: 'Pilgrim Dormitory',
    color: '#EC4899', // Pink
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)',
    icon: '🛏️',
    svgIcon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>'
  }
};

const DEFAULT_CENTER = [20.0053, 73.7925]; // Ramkund, Panchavati, Nashik
const DEFAULT_ZOOM = 13;

export default function InteractiveMap({ currentLang }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('standard'); // 'standard' | 'night'
  const [locating, setLocating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Merge attractions and facilities with consistent schema
  const allPoints = useMemo(() => {
    const attractionPoints = ATTRACTIONS.map(a => {
      const cfg = CATEGORY_CONFIG.attraction;
      return {
        id: `attr-${a.id}`,
        name: a.name,
        category: 'attraction',
        categoryLabel: a.category || cfg.label,
        lat: a.lat,
        lng: a.lng,
        address: a.address,
        area: a.area,
        dist: a.distFromRamkund,
        description: a.description,
        phone: null,
        hours: a.bestTime,
        rate: null,
        mapsUrl: a.googleMapsUrl,
        verified: 'Official Source',
        tags: a.tags || [],
        color: cfg.color,
        icon: cfg.icon,
        svgIcon: cfg.svgIcon,
      };
    });

    const facilityPoints = FACILITIES.map(f => {
      const catKey = CATEGORY_CONFIG[f.category] ? f.category : 'tourist_info';
      const cfg = CATEGORY_CONFIG[catKey];
      return {
        id: `fac-${f.id}`,
        name: f.name,
        category: catKey,
        categoryLabel: f.categoryLabel || cfg.label,
        lat: f.lat,
        lng: f.lng,
        address: f.address,
        area: f.area,
        dist: f.dist,
        description: f.categoryLabel,
        phone: f.phone,
        hours: f.hours,
        rate: f.rate,
        mapsUrl: f.mapsUrl,
        verified: f.verified || 'Official Source',
        tags: f.tags || [],
        color: cfg.color,
        icon: cfg.icon,
        svgIcon: cfg.svgIcon,
      };
    });

    return [...attractionPoints, ...facilityPoints];
  }, []);

  // Expose location selector globally so Leaflet popup HTML buttons can trigger side panel
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__selectMapLocation = (id) => {
        const found = allPoints.find(p => p.id === id);
        if (found) {
          setSelectedLocation(found);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([found.lat, found.lng], { animate: true });
          }
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__selectMapLocation;
      }
    };
  }, [allPoints]);

  // Filter points based on category and search query
  const filteredPoints = useMemo(() => {
    return allPoints.filter(p => {
      const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [allPoints, activeFilter, searchQuery]);

  // Calculate category counts for UI badges
  const categoryCounts = useMemo(() => {
    const counts = { all: allPoints.length };
    allPoints.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allPoints]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Map with Nashik Ramkund Center
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: false,
      });

      // Add Zoom Controls to bottom-right so they don't overlap filters/search
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Standard Tiles (Clean, reliable, no API keys, zero CARTO watermark)
      const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10,
        className: mapStyle === 'night' ? 'osm-tile-layer-night' : 'osm-tile-layer',
      });

      tileLayer.on('tileerror', (error) => {
        console.warn('OpenStreetMap tile loading notification:', error);
      });

      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Create a LayerGroup for markers
      const markersLayerGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayerGroup;

      mapInstanceRef.current = map;

      // Initial marker render
      updateMapMarkers(L, map, markersLayerGroup, filteredPoints);

      // Re-cluster on zoom or move
      map.on('zoomend', () => {
        updateMapMarkers(L, map, markersLayerGroup, filteredPoints);
      });

      // Invalidate size to ensure crisp rendering
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Handle map style (Standard vs Night Contrast)
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const container = tileLayerRef.current.getContainer();
    if (container) {
      if (mapStyle === 'night') {
        container.classList.add('osm-tile-layer-night');
      } else {
        container.classList.remove('osm-tile-layer-night');
      }
    }
  }, [mapStyle]);

  // Invalidate map size when container or side panel changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedLocation]);

  // Update markers when filters or search change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    import('leaflet').then(LModule => {
      const L = LModule.default;
      updateMapMarkers(L, mapInstanceRef.current, markersLayerGroupRef.current, filteredPoints);
    });
  }, [filteredPoints]);

  // Core Marker & Clustering Engine
  const updateMapMarkers = useCallback((L, map, layerGroup, points) => {
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (!points || points.length === 0) return;

    const zoom = map.getZoom();

    // High zoom: spiderfy overlapping coordinates
    if (zoom >= 16) {
      const offsetPoints = spiderfyNearbyPoints(points);
      offsetPoints.forEach(p => {
        renderIndividualMarker(L, map, layerGroup, p);
      });
      return;
    }

    // Grid/pixel distance clustering for smooth exploration
    const clusterPixelRadius = 45;
    const clusters = [];
    const visited = new Set();

    points.forEach((point, i) => {
      if (visited.has(i)) return;
      visited.add(i);

      let p1;
      try {
        p1 = map.latLngToLayerPoint([point.lat, point.lng]);
      } catch (e) {
        return;
      }

      const clusterMembers = [point];

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) return;
        const other = points[j];
        let p2;
        try {
          p2 = map.latLngToLayerPoint([other.lat, other.lng]);
        } catch (e) {
          continue;
        }

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < clusterPixelRadius) {
          visited.add(j);
          clusterMembers.push(other);
        }
      }

      if (clusterMembers.length === 1) {
        clusters.push({ isCluster: false, point: clusterMembers[0] });
      } else {
        const avgLat = clusterMembers.reduce((acc, m) => acc + m.lat, 0) / clusterMembers.length;
        const avgLng = clusterMembers.reduce((acc, m) => acc + m.lng, 0) / clusterMembers.length;
        clusters.push({
          isCluster: true,
          lat: avgLat,
          lng: avgLng,
          count: clusterMembers.length,
          members: clusterMembers,
        });
      }
    });

    // Render resulting clusters & individual markers
    clusters.forEach(item => {
      if (item.isCluster) {
        renderClusterMarker(L, map, layerGroup, item);
      } else {
        renderIndividualMarker(L, map, layerGroup, item.point);
      }
    });
  }, []);

  // Spiderfy points with nearly identical coordinates at high zoom
  const spiderfyNearbyPoints = (points) => {
    const threshold = 0.0003; // ~30 meters
    const groups = [];
    const visited = new Set();

    points.forEach((p, i) => {
      if (visited.has(i)) return;
      visited.add(i);
      const group = [p];

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) return;
        const other = points[j];
        const dist = Math.hypot(p.lat - other.lat, p.lng - other.lng);
        if (dist < threshold) {
          visited.add(j);
          group.push(other);
        }
      }
      groups.push(group);
    });

    const result = [];
    groups.forEach(group => {
      if (group.length === 1) {
        result.push(group[0]);
      } else {
        const radius = 0.00025; // ~25 meters offset
        group.forEach((pt, index) => {
          const angle = (2 * Math.PI * index) / group.length;
          result.push({
            ...pt,
            lat: pt.lat + radius * Math.sin(angle),
            lng: pt.lng + radius * Math.cos(angle),
          });
        });
      }
    });

    return result;
  };

  // Render Individual Category Marker
  const renderIndividualMarker = (L, map, layerGroup, point) => {
    const iconHtml = `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${point.color};
          opacity: 0.25;
          filter: blur(4px);
        "></div>
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0F172A;
          border: 2px solid ${point.color};
          box-shadow: 0 4px 14px rgba(0,0,0,0.6), 0 0 10px ${point.color}50;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${point.color};
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.18)'" onmouseout="this.style.transform='scale(1)'">
          ${point.svgIcon}
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: iconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    const popupHtml = `
      <div style="font-family: inherit; min-width: 220px; max-width: 280px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 2px 7px;
            border-radius: 4px;
            background: ${point.color}20;
            color: ${point.color};
            border: 1px solid ${point.color}50;
          ">
            ${point.categoryLabel}
          </span>
          <span style="font-size: 11px; color: #94A3B8; font-weight: 500;">
            ${point.dist === 0 ? 'Ground Zero' : `${point.dist} km`}
          </span>
        </div>
        <h4 style="
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          line-height: 1.3;
        ">
          ${point.name}
        </h4>
        <div style="font-size: 11px; color: #CBD5E1; margin-bottom: 8px; line-height: 1.4;">
          ${point.address || point.area}
        </div>
        ${point.phone ? `
          <div style="font-size: 11px; margin-bottom: 8px; color: #FF0055; font-weight: 600;">
            📞 <a href="tel:${point.phone}" style="color: #FF0055; text-decoration: none;">${point.phone}</a>
          </div>
        ` : ''}
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button 
            onclick="window.__selectMapLocation('${point.id}')"
            style="
              flex: 1;
              padding: 6px 10px;
              background: #00F3FF;
              color: #0F172A;
              border: none;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              transition: opacity 0.2s;
            "
            onmouseover="this.style.opacity='0.9'"
            onmouseout="this.style.opacity='1'"
          >
            View Details
          </button>
          ${point.mapsUrl ? `
            <a 
              href="${point.mapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                padding: 6px 10px;
                background: #1E293B;
                color: #00F3FF;
                border: 1px solid rgba(0, 243, 255, 0.4);
                border-radius: 6px;
                font-size: 11px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              Directions ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;

    const marker = L.marker([point.lat, point.lng], { icon: customIcon })
      .bindPopup(popupHtml, { maxWidth: 300 })
      .on('click', () => {
        setSelectedLocation(point);
      });

    layerGroup.addLayer(marker);
  };

  // Render Cluster Marker
  const renderClusterMarker = (L, map, layerGroup, cluster) => {
    const size = cluster.count > 10 ? 46 : cluster.count > 5 ? 42 : 38;
    const clusterHtml = `
      <div class="map-cluster-marker" style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.92);
        border: 2px solid #00F3FF;
        box-shadow: 0 0 16px rgba(0, 243, 255, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.2);
        color: #FFFFFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(8px);
      ">
        <span style="font-size: 13px; font-weight: 800; font-family: monospace; color: #00F3FF; line-height: 1;">
          ${cluster.count}
        </span>
        <span style="font-size: 8px; font-weight: 600; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.05em; margin-top: 1px;">
          spots
        </span>
      </div>
    `;

    const clusterIcon = L.divIcon({
      className: 'custom-cluster-icon',
      html: clusterHtml,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon })
      .on('click', () => {
        const bounds = L.latLngBounds(cluster.members.map(m => [m.lat, m.lng]));
        if (map.getZoom() < 16) {
          map.flyToBounds(bounds.pad(0.35), { duration: 0.8 });
        } else {
          // If already at high zoom, open the first location or center
          setSelectedLocation(cluster.members[0]);
          map.panTo([cluster.lat, cluster.lng], { animate: true });
        }
      });

    layerGroup.addLayer(marker);
  };

  // Reset Map View to default center
  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
      setSelectedLocation(null);
    }
  };

  // Current Location Geolocation Control
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;

        if (mapInstanceRef.current) {
          const L = (await import('leaflet')).default;
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.2 });

          if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
          }

          const userHtml = `
            <div style="position: relative; width: 24px; height: 24px;">
              <div class="user-pulse-ring"></div>
              <div style="
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #00F3FF;
                border: 3px solid #FFFFFF;
                box-shadow: 0 0 16px #00F3FF;
                position: absolute;
                top: 3px;
                left: 3px;
              "></div>
            </div>
          `;

          const userIcon = L.divIcon({
            className: 'user-radar-marker',
            html: userHtml,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="text-align: center; padding: 4px;">
                <strong style="color: #00F3FF; font-size: 13px;">Your Current Location</strong>
                <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px;">GPS Detection Active</div>
              </div>
            `)
            .openPopup();

          userMarkerRef.current = marker;
        }
      },
      (err) => {
        setLocating(false);
        alert('Could not retrieve your location. Please ensure location permissions are enabled.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <section id="map" className="py-20 relative bg-surface-dark border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-electric/15 border border-cyan-electric/30 text-cyan-electric text-xs font-semibold uppercase tracking-wider mb-3 shadow-glow-cyan/15">
            <Compass className="w-3.5 h-3.5" />
            <span>Official Geospatial Guide</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
            Interactive Nashik City &amp; Ghats Map
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Verified, real-time spatial navigation for sacred river ghats, ancient temples, emergency hospitals, police assistance posts, drinking water stations, and transit parking.
          </p>
        </div>

        {/* Map Control Toolbar */}
        <div className="mb-6 bg-slate-900/90 p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          
          {/* Top Row: Search Box + Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-cyan-electric pointer-events-none" />
              <input
                type="text"
                placeholder="Search temples, ghats, hospitals, RO water, parking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-electric focus:ring-1 focus:ring-cyan-electric/40 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Actions (Reset, Locate Me, Map Style Toggle) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              {/* Reset Map View */}
              <button
                onClick={handleResetMap}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition"
                title="Reset map to Ramkund center"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-electric" />
                <span>Reset View</span>
              </button>

              {/* Locate Me */}
              <button
                onClick={handleLocateMe}
                disabled={locating}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-medium text-slate-200 hover:text-cyan-electric flex items-center gap-1.5 transition"
                title="Detect GPS location"
              >
                <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin text-cyan-electric' : 'text-cyan-electric'}`} />
                <span>{locating ? 'Locating...' : 'Locate Me'}</span>
              </button>

              {/* Map Layer / Style Toggle */}
              <button
                onClick={() => setMapStyle(prev => prev === 'standard' ? 'night' : 'standard')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-medium text-slate-200 hover:text-amber-400 flex items-center gap-1.5 transition"
                title="Toggle between Standard and Night Tone OSM view"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{mapStyle === 'night' ? 'Night Tone' : 'Standard Map'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold shadow-md shadow-cyan-electric/25'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>All Locations</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'all' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                {categoryCounts.all || 0}
              </span>
            </button>

            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
              const count = categoryCounts[key] || 0;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
                  }`}
                  style={isActive ? { backgroundColor: cfg.color, boxShadow: `0 0 14px ${cfg.color}50` } : {}}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950/25 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Map Canvas and Interactive Details Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 flex flex-col md:flex-row h-[580px]">
          
          {/* Leaflet Map Canvas */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full z-0 flex-1 relative" 
            style={{ minHeight: '440px' }}
          />

          {/* Interactive Location Details Side Panel */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute md:relative right-0 bottom-0 top-0 w-full md:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-white/15 p-6 z-20 overflow-y-auto flex flex-col justify-between shadow-2xl"
              >
                <div>
                  {/* Top Bar with Category Badge and Close Button */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5"
                      style={{ 
                        color: selectedLocation.color, 
                        borderColor: `${selectedLocation.color}50`,
                        backgroundColor: `${selectedLocation.color}15`
                      }}
                    >
                      <span>{selectedLocation.icon}</span>
                      <span>{selectedLocation.categoryLabel}</span>
                    </span>

                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                      aria-label="Close details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-heading text-white mb-2 leading-snug">
                    {selectedLocation.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {selectedLocation.description}
                  </p>

                  {/* Metadata Specs */}
                  <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-electric shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">{selectedLocation.area}</div>
                        <div className="text-slate-400 text-[11px] leading-relaxed">{selectedLocation.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-300">
                        Distance: <strong className="text-white">{selectedLocation.dist === 0 ? 'Ground Zero (Ramkund)' : `${selectedLocation.dist} km from Ramkund`}</strong>
                      </span>
                    </div>

                    {selectedLocation.hours && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="text-slate-300">{selectedLocation.hours}</span>
                      </div>
                    )}

                    {selectedLocation.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-red-400 shrink-0" />
                        <a 
                          href={`tel:${selectedLocation.phone}`} 
                          className="text-red-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>{selectedLocation.phone}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-red-500/20 text-red-300">Call</span>
                        </a>
                      </div>
                    )}

                    {selectedLocation.rate && (
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                        <strong className="text-cyan-electric">Tariff / Fee:</strong> {selectedLocation.rate}
                      </div>
                    )}

                    {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedLocation.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Data Provenance: <strong className="text-emerald-400 font-medium">{selectedLocation.verified}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Button */}
                <div className="pt-6">
                  {selectedLocation.mapsUrl && (
                    <a
                      href={selectedLocation.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-electric/25 hover:shadow-cyan-electric/40 hover:scale-[1.01] transition"
                    >
                      <Navigation className="w-4 h-4" /> Start Turn-by-Turn Navigation
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Legend & Transparency Disclaimer Notice */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Map tiles powered by OpenStreetMap contributors. Geospatial markers reflect verified municipal data points for Nashik &amp; Trimbakeshwar.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-electric"></span>
              <span>Ground Zero: Ramkund</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Verified Source</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
