'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FacilityCard from './FacilityCard';
import EmptyState from './EmptyState';
import { FACILITY_CATEGORIES } from '../lib/facilitiesService';

export default function FacilityList({
  facilities,
  activeCategory,
  radiusKm,
  categoriesSummary,
  onExpandRadius,
  onFocusOnMap
}) {
  const currentCategoryInfo = FACILITY_CATEGORIES[activeCategory] || null;

  if (!facilities || facilities.length === 0) {
    const summary = currentCategoryInfo ? categoriesSummary[activeCategory] : null;
    return (
      <EmptyState
        categoryName={currentCategoryInfo ? currentCategoryInfo.name : 'Facility'}
        radiusKm={radiusKm}
        onExpandRadius={onExpandRadius}
        nearestFacilityName={summary?.nearestFacilityName}
        nearestDistanceText={summary?.nearestDistanceText}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onFocusOnMap={onFocusOnMap}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

