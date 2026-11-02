'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, RotateCcw, Crosshair, Layers, Maximize2, Minimize2 } from 'lucide-react';
import { FACILITY_CATEGORIES } from '../lib/facilitiesService';

export default function NearbyFacilitiesMap({
  destination,
  facilities,
  radiusKm,
  selectedCategory,
  userLocation,
  focusedFacility
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState('standard');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [destination.lat, destination.lng],
        zoom: radiusKm <= 1 ? 15 : radiusKm <= 2 ? 14 : 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Standard OpenStreetMap tiles
      const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10,
        className: mapStyle === 'night' ? 'osm-tile-layer-night' : 'osm-tile-layer'
      });

      tileLayer.addTo(map);

      // LayerGroup for facilities
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      mapInstanceRef.current = map;

      // Render Destination & Radius & Facilities
      renderMapElements(L, map, markersGroup);

      // Invalidate size
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 300);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination]);

  // Update map when facilities, radius, or userLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      renderMapElements(L, mapInstanceRef.current, markersGroupRef.current);
    });
  }, [facilities, radiusKm, selectedCategory, userLocation]);

  // Focus on specific facility if triggered from list
  useEffect(() => {
    if (!focusedFacility || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [focusedFacility.latitude, focusedFacility.longitude],
      16,
      { duration: 1 }
    );
  }, [focusedFacility]);

  // Render Destination Pin, Radius Circle, User Pin, and Facility Pins/Clusters
  const renderMapElements = (L, map, markersGroup) => {
    markersGroup.clearLayers();

    // 1. Destination Marker (Gold/Saffron beacon)
    if (destinationMarkerRef.current) {
      map.removeLayer(destinationMarkerRef.current);
    }

    const destHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: #00F3FF; opacity: 0.35; animation: radar-pulse 2s infinite ease-out;"></div>
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0F172A;
          border: 3px solid #00F3FF;
          box-shadow: 0 0 20px #00F3FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #FFFFFF;
        ">
          ⭐
        </div>
      </div>
    `;

    const destIcon = L.divIcon({
      className: 'dest-beacon-marker',
      html: destHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
      .bindPopup(`
        <div style="padding: 4px; font-family: inherit;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #00F3FF; letter-spacing: 0.05em;">
            Selected Destination
          </span>
          <h4 style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin: 2px 0 4px 0;">
            ${destination.name}
          </h4>
          <p style="font-size: 11px; color: #CBD5E1; margin: 0;">
            ${destination.address}
          </p>
        </div>
      `)
      .addTo(map);

    destinationMarkerRef.current = destMarker;

    // 2. Visual Radius Circle
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
    }

    const radiusMeters = radiusKm * 1000;
    const radiusCircle = L.circle([destination.lat, destination.lng], {
      radius: radiusMeters,
      color: '#00F3FF',
      weight: 1.5,
      opacity: 0.6,
      fillColor: '#00F3FF',
      fillOpacity: 0.06,
      dashArray: '4, 6',
    }).addTo(map);

    radiusCircleRef.current = radiusCircle;

    // 3. User Location GPS Marker (if granted)
    if (userLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userHtml = `
        <div style="position: relative; width: 28px; height: 28px;">
          <div class="user-pulse-ring"></div>
          <div style="
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #FF0055;
            border: 3px solid #FFFFFF;
            box-shadow: 0 0 16px #FF0055;
            position: absolute;
            top: 5px;
            left: 5px;
          "></div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: userHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup('<strong style="color: #FF0055; font-size: 12px;">Your GPS Location</strong>')
        .addTo(map);

      userMarkerRef.current = userMarker;
    }

    // 4. Facility Markers with Clustering & Spiderfy
    if (!facilities || facilities.length === 0) return;

    const zoom = map.getZoom();

    if (zoom >= 16) {
      // Spiderfy on high zoom
      const spiderfied = spiderfyPoints(facilities);
      spiderfied.forEach(f => renderSingleFacility(L, markersGroup, f));
      return;
    }

    // Grid pixel clustering
    const clusterPixelRadius = 40;
    const clusters = [];
    const visited = new Set();

    facilities.forEach((f, i) => {
      if (visited.has(i)) return;
      visited.add(i);

      let p1;
      try {
        p1 = map.latLngToLayerPoint([f.latitude, f.longitude]);
      } catch (e) {
        return;
      }

      const members = [f];

      for (let j = i + 1; j < facilities.length; j++) {
        if (visited.has(j)) return;
        const other = facilities[j];
        let p2;
        try {
          p2 = map.latLngToLayerPoint([other.latitude, other.longitude]);
        } catch (e) {
          continue;
        }

        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < clusterPixelRadius) {
          visited.add(j);
          members.push(other);
        }
      }

      if (members.length === 1) {
        clusters.push({ isCluster: false, facility: members[0] });
      } else {
        const avgLat = members.reduce((sum, m) => sum + m.latitude, 0) / members.length;
        const avgLng = members.reduce((sum, m) => sum + m.longitude, 0) / members.length;
        clusters.push({
          isCluster: true,
          latitude: avgLat,
          longitude: avgLng,
          count: members.length,
          members: members,
        });
      }
    });

    clusters.forEach(item => {
      if (item.isCluster) {
        renderClusterBadge(L, map, markersGroup, item);
      } else {
        renderSingleFacility(L, markersGroup, item.facility);
      }
    });
  };

  const spiderfyPoints = (points) => {
    const threshold = 0.0003;
    const groups = [];
    const visited = new Set();

    points.forEach((p, i) => {
      if (visited.has(i)) return;
      visited.add(i);
      const group = [p];

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) return;
        const other = points[j];
        const dist = Math.hypot(p.latitude - other.latitude, p.longitude - other.longitude);
        if (dist < threshold) {
          visited.add(j);
          group.push(other);
        }
      }
      groups.push(group);
    });

    const result = [];
    groups.forEach(g => {
      if (g.length === 1) {
        result.push(g[0]);
      } else {
        const radius = 0.00025;
        g.forEach((pt, index) => {
          const angle = (2 * Math.PI * index) / g.length;
          result.push({
            ...pt,
            latitude: pt.latitude + radius * Math.sin(angle),
            longitude: pt.longitude + radius * Math.cos(angle),
          });
        });
      }
    });

    return result;
  };

  const renderSingleFacility = (L, layerGroup, facility) => {
    const cat = FACILITY_CATEGORIES[facility.category] || FACILITY_CATEGORIES.tourist_info;
    const color = cat.color || '#00F3FF';

    const iconHtml = `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.25; filter: blur(3px);"></div>
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #0F172A;
          border: 2px solid ${color};
          box-shadow: 0 4px 10px rgba(0,0,0,0.6), 0 0 8px ${color}40;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #FFFFFF;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
          ${cat.iconText || '📍'}
        </div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'custom-facility-pin',
      html: iconHtml,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    });

    const popupHtml = `
      <div style="font-family: inherit; min-width: 220px; max-width: 280px; padding: 2px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
            ${facility.categoryLabel || cat.name}
          </span>
          <span style="font-size: 11px; color: #94A3B8; font-weight: 700;">
            ${facility.distanceText}
          </span>
        </div>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px 0; line-height: 1.3;">
          ${facility.name}
        </h4>
        <div style="font-size: 11px; color: #CBD5E1; margin-bottom: 6px;">
          ${facility.address}
        </div>
        ${facility.contact_number ? `
          <div style="font-size: 11px; margin-bottom: 6px; color: #FF0055; font-weight: 600;">
            📞 <a href="tel:${facility.contact_number}" style="color: #FF0055; text-decoration: none;">${facility.contact_number}</a>
          </div>
        ` : ''}
        ${facility.opening_hours ? `
          <div style="font-size: 10px; color: #94A3B8; margin-bottom: 8px;">
            🕒 ${facility.opening_hours}
          </div>
        ` : ''}
        <div style="display: flex; gap: 6px; margin-top: 6px;">
          ${facility.mapsUrl ? `
            <a href="${facility.mapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; padding: 6px 10px; background: #00F3FF; color: #0F172A; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; text-align: center; display: block;">
              Directions ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;

    const marker = L.marker([facility.latitude, facility.longitude], { icon })
      .bindPopup(popupHtml);

    layerGroup.addLayer(marker);
  };

  const renderClusterBadge = (L, map, layerGroup, cluster) => {
    const size = cluster.count > 5 ? 40 : 36;
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.94);
        border: 2px solid #00F3FF;
        box-shadow: 0 0 14px rgba(0, 243, 255, 0.4);
        color: #00F3FF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: monospace;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        backdrop-filter: blur(8px);
      ">
        <span>${cluster.count}</span>
        <span style="font-size: 7px; text-transform: uppercase; color: #94A3B8; margin-top: -2px;">pts</span>
      </div>
    `;

    const icon = L.divIcon({
      className: 'cluster-icon',
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([cluster.latitude, cluster.longitude], { icon })
      .on('click', () => {
        const bounds = L.latLngBounds(cluster.members.map(m => [m.latitude, m.longitude]));
        map.flyToBounds(bounds.pad(0.35), { duration: 0.8 });
      });

    layerGroup.addLayer(marker);
  };

  // Reset to Destination Center
  const handleResetToDestination = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [destination.lat, destination.lng],
        radiusKm <= 1 ? 15 : radiusKm <= 2 ? 14 : 13,
        { duration: 0.8 }
      );
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 flex flex-col transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[500px] sm:h-[550px]'
    }`}>
      {/* Map Action Toolbar Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
        {/* Left Indicator */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-lg pointer-events-auto flex items-center gap-2 text-xs text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-electric animate-pulse shrink-0" />
          <span className="font-semibold truncate max-w-[150px] sm:max-w-none">
            {destination.name}
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            ({radiusKm >= 1 ? `${radiusKm} km radius` : `${radiusKm * 1000} m`})
          </span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Reset View */}
          <button
            onClick={handleResetToDestination}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-cyan-electric backdrop-blur-md shadow-lg transition"
            title="Reset view to destination center"
          >
            <RotateCcw className="w-4 h-4 text-cyan-electric" />
          </button>

          {/* Toggle Map Tone */}
          <button
            onClick={() => setMapStyle(prev => prev === 'standard' ? 'night' : 'standard')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-amber-400 text-xs backdrop-blur-md shadow-lg flex items-center gap-1.5 transition"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{mapStyle === 'night' ? 'Night Tone' : 'Standard'}</span>
          </button>

          {/* Expand Fullscreen */}
          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 200);
            }}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white backdrop-blur-md shadow-lg transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Map Legend Strip at Bottom */}
      <div className="bg-slate-900/95 border-t border-white/10 px-4 py-2.5 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-electric border-2 border-white"></span>
            <span className="font-semibold text-white">Destination Center</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-dashed border-cyan-electric bg-cyan-electric/20"></span>
            <span>Search Radius ({radiusKm >= 1 ? `${radiusKm} km` : `${radiusKm * 1000} m`})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Medical</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Police</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Toilets</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <span>Water</span>
          </span>
        </div>

        <div className="text-slate-400">
          Powered by OpenStreetMap Contributors
        </div>
      </div>
    </div>
  );
}

