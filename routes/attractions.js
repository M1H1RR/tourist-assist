const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('./auth');

// GET /api/attractions
router.get('/', (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = 'SELECT * FROM attractions WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === '1' || featured === 'true') {
      query += ' AND is_featured = 1';
    }

    if (search && search.trim() !== '') {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(address) LIKE ? OR LOWER(tags) LIKE ?)';
      params.push(s, s, s, s);
    }

    query += ' ORDER BY is_featured DESC, dist_from_ramkund ASC, name ASC';

    const attractions = db.prepare(query).all(...params);

    const formatted = attractions.map(a => {
      try {
        a.highlights = JSON.parse(a.highlights || '[]');
      } catch (e) {
        a.highlights = [];
      }
      try {
        a.tags = JSON.parse(a.tags || '[]');
      } catch (e) {
        a.tags = [];
      }
      return a;
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching attractions:', err);
    res.status(500).json({ error: 'Failed to retrieve attractions' });
  }
});

// GET /api/attractions/:id_or_slug
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    let attraction;
    if (!isNaN(parseInt(identifier))) {
      attraction = db.prepare('SELECT * FROM attractions WHERE id = ?').get(identifier);
    }
    if (!attraction) {
      attraction = db.prepare('SELECT * FROM attractions WHERE slug = ?').get(identifier);
    }

    if (!attraction) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    try {
      attraction.highlights = JSON.parse(attraction.highlights || '[]');
      attraction.tags = JSON.parse(attraction.tags || '[]');
    } catch (e) {
      attraction.highlights = [];
      attraction.tags = [];
    }

    res.json(attraction);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving attraction' });
  }
});

// POST /api/attractions/itinerary
// Generates a customized suggested itinerary based on duration and interests
router.post('/itinerary', (req, res) => {
  try {
    const { duration = 'half_day', interests = [] } = req.body;
    // duration can be: '2_3_hours', 'half_day', 'full_day'
    // interests can be array of: 'spiritual', 'historical', 'nature', 'food_shopping'

    const allAttractions = db.prepare('SELECT * FROM attractions').all().map(a => {
      try {
        a.highlights = JSON.parse(a.highlights || '[]');
        a.tags = JSON.parse(a.tags || '[]');
      } catch (e) {
        a.highlights = [];
        a.tags = [];
      }
      return a;
    });

    // Score attractions based on selected interests
    const normalizedInterests = Array.isArray(interests) && interests.length > 0
      ? interests
      : ['spiritual', 'historical', 'nature', 'food_shopping'];

    // Determine max stops based on duration
    let maxStops = 3;
    let durationLabel = 'Half Day (approx 4–5 hours)';
    let timeBudgetMinutes = 300;

    if (duration === '2_3_hours') {
      maxStops = 2;
      durationLabel = 'Express Tour (2–3 hours)';
      timeBudgetMinutes = 180;
    } else if (duration === 'full_day') {
      maxStops = 5;
      durationLabel = 'Comprehensive Day Tour (7–8 hours)';
      timeBudgetMinutes = 480;
    }

    // Filter & sort matching attractions
    const scored = allAttractions.map(a => {
      let score = 0;
      if (normalizedInterests.includes(a.category)) {
        score += 10;
      }
      if (a.is_featured) {
        score += 3;
      }
      // Prefer clustered places close to Panchavati for short tours
      if (duration === '2_3_hours' && a.dist_from_ramkund <= 2.0) {
        score += 8;
      }
      return { ...a, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore || a.dist_from_ramkund - b.dist_from_ramkund);

    // Pick top unique stops
    const chosenStops = scored.slice(0, maxStops);

    // Sort stops logically by distance or logical progression
    chosenStops.sort((a, b) => a.dist_from_ramkund - b.dist_from_ramkund);

    // Build timeline
    let currentHour = 8; // Starting at 8:00 AM
    let currentMin = 30;

    const timeline = chosenStops.map((stop, index) => {
      const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')} AM`;
      // Duration in minutes
      let stopDurationMin = 45;
      if (stop.category === 'nature' || stop.dist_from_ramkund > 15) stopDurationMin = 90;
      else if (stop.category === 'spiritual' && stop.dist_from_ramkund > 20) stopDurationMin = 90;
      else if (stop.category === 'historical') stopDurationMin = 60;

      currentMin += stopDurationMin;
      while (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }
      const endHourDisplay = currentHour > 12 ? currentHour - 12 : currentHour;
      const endPeriod = currentHour >= 12 ? 'PM' : 'AM';
      const endStr = `${String(endHourDisplay).padStart(2, '0')}:${String(currentMin).padStart(2, '0')} ${endPeriod}`;

      // Add transit buffer to next stop
      currentMin += 25;
      while (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }

      return {
        step: index + 1,
        timeSlot: `${startStr} – ${endStr}`,
        attraction: stop,
        allocatedDuration: `${stopDurationMin} mins`,
        recommendedActivity: stop.highlights[0] || 'Explore the heritage and architecture',
        distanceFromCenter: `${stop.dist_from_ramkund} km from Ramkund`
      };
    });

    res.json({
      title: `Suggested ${durationLabel}`,
      durationOption: duration,
      selectedInterests: normalizedInterests,
      totalStops: chosenStops.length,
      estimatedTotalHours: (timeBudgetMinutes / 60).toFixed(1) + ' hrs',
      advisoryNote: 'This itinerary is generated from verified historical and cultural attraction records. Travel times are based on typical road transit and do not account for dynamic festival crowd regulations or road blockages. Please check on-ground police notices.',
      timeline
    });
  } catch (err) {
    console.error('Error generating itinerary:', err);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// POST /api/attractions (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name, category, description, address, area, dist_from_ramkund,
      google_maps_url, latitude, longitude, suggested_duration, best_time_to_visit,
      source_reference, verification_status, image_url, highlights, tags, is_featured
    } = req.body;

    if (!name || !category || !description || !address) {
      return res.status(400).json({ error: 'Name, category, description, and address are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO attractions (
        slug, name, category, description, address, area, dist_from_ramkund,
        google_maps_url, latitude, longitude, suggested_duration, best_time_to_visit,
        source_reference, last_reviewed_date, verification_status, image_url,
        highlights, tags, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      slug, name.trim(), category, description.trim(), address.trim(), area || 'Nashik',
      parseFloat(dist_from_ramkund) || 0.0, google_maps_url || '',
      parseFloat(latitude) || null, parseFloat(longitude) || null,
      suggested_duration || '1 hour', best_time_to_visit || 'Morning / Evening',
      source_reference || '', today, verification_status || 'Reviewed by Project Team',
      image_url || '/assets/attractions/default.jpg',
      Array.isArray(highlights) ? JSON.stringify(highlights) : String(highlights || '[]'),
      Array.isArray(tags) ? JSON.stringify(tags) : String(tags || '[]'),
      is_featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM attractions WHERE id = ?').get(result.lastInsertRowid);
    created.highlights = JSON.parse(created.highlights || '[]');
    created.tags = JSON.parse(created.tags || '[]');

    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating attraction:', err);
    res.status(500).json({ error: 'Failed to create attraction' });
  }
});

// PUT /api/attractions/:id (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM attractions WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    const {
      name, category, description, address, area, dist_from_ramkund,
      google_maps_url, latitude, longitude, suggested_duration, best_time_to_visit,
      source_reference, verification_status, image_url, highlights, tags, is_featured
    } = req.body;

    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      UPDATE attractions SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        address = COALESCE(?, address),
        area = COALESCE(?, area),
        dist_from_ramkund = COALESCE(?, dist_from_ramkund),
        google_maps_url = COALESCE(?, google_maps_url),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        suggested_duration = COALESCE(?, suggested_duration),
        best_time_to_visit = COALESCE(?, best_time_to_visit),
        source_reference = COALESCE(?, source_reference),
        last_reviewed_date = ?,
        verification_status = COALESCE(?, verification_status),
        image_url = COALESCE(?, image_url),
        highlights = COALESCE(?, highlights),
        tags = COALESCE(?, tags),
        is_featured = COALESCE(?, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name, category, description, address, area,
      dist_from_ramkund !== undefined ? parseFloat(dist_from_ramkund) : null,
      google_maps_url,
      latitude !== undefined ? parseFloat(latitude) : null,
      longitude !== undefined ? parseFloat(longitude) : null,
      suggested_duration, best_time_to_visit, source_reference, today,
      verification_status, image_url,
      highlights !== undefined ? (Array.isArray(highlights) ? JSON.stringify(highlights) : String(highlights)) : null,
      tags !== undefined ? (Array.isArray(tags) ? JSON.stringify(tags) : String(tags)) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM attractions WHERE id = ?').get(id);
    updated.highlights = JSON.parse(updated.highlights || '[]');
    updated.tags = JSON.parse(updated.tags || '[]');

    res.json(updated);
  } catch (err) {
    console.error('Error updating attraction:', err);
    res.status(500).json({ error: 'Failed to update attraction' });
  }
});

// DELETE /api/attractions/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM attractions WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    db.prepare('DELETE FROM attractions WHERE id = ?').run(id);
    res.json({ message: 'Attraction removed successfully', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete attraction' });
  }
});

module.exports = router;
