const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('./auth');

// GET /api/services
// Supports filters: category, search, area, max_dist, verification_status, is_emergency
router.get('/', (req, res) => {
  try {
    const { category, search, area, max_dist, verification_status, emergency } = req.query;
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (area && area !== 'all') {
      query += ' AND area = ?';
      params.push(area);
    }

    if (verification_status && verification_status !== 'all') {
      query += ' AND verification_status = ?';
      params.push(verification_status);
    }

    if (emergency === '1' || emergency === 'true') {
      query += ' AND is_emergency = 1';
    }

    if (max_dist && !isNaN(parseFloat(max_dist))) {
      query += ' AND dist_from_ramkund <= ?';
      params.push(parseFloat(max_dist));
    }

    if (search && search.trim() !== '') {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)';
      params.push(s, s, s, s);
    }

    query += ' ORDER BY is_emergency DESC, dist_from_ramkund ASC, name ASC';

    const services = db.prepare(query).all(...params);

    // Parse JSON tags
    const formatted = services.map(s => {
      try {
        s.tags = JSON.parse(s.tags || '[]');
      } catch (e) {
        s.tags = [];
      }
      return s;
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service listing not found' });
    }
    try {
      service.tags = JSON.parse(service.tags || '[]');
    } catch (e) {
      service.tags = [];
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving service' });
  }
});

// POST /api/services (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name, category, sub_category, address, area, dist_from_ramkund,
      phone, hours, rate_type, rate_info, google_maps_url, latitude, longitude,
      description, source_reference, verification_status, reviewer_notes,
      is_emergency, tags
    } = req.body;

    if (!name || !category || !address || !area) {
      return res.status(400).json({ error: 'Name, category, address, and area are required.' });
    }

    const validCategories = ['medical', 'transport', 'sanitation', 'water', 'accommodation', 'helpdesk', 'food_shopping'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category specified.' });
    }

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (typeof tags === 'string' ? tags : '[]');
    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO services (
        name, category, sub_category, address, area, dist_from_ramkund,
        phone, hours, rate_type, rate_info, google_maps_url, latitude, longitude,
        description, source_reference, last_reviewed_date, verification_status,
        reviewer_notes, is_emergency, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(), category, sub_category || '', address.trim(), area.trim(),
      parseFloat(dist_from_ramkund) || 0.0, phone || '', hours || '24/7',
      rate_type || 'free', rate_info || '', google_maps_url || '',
      parseFloat(latitude) || null, parseFloat(longitude) || null,
      description || '', source_reference || '', today,
      verification_status || 'Reviewed by Project Team', reviewer_notes || '',
      is_emergency ? 1 : 0, tagsJson
    );

    const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    newService.tags = JSON.parse(newService.tags || '[]');

    res.status(201).json(newService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Failed to create service listing' });
  }
});

// PUT /api/services/:id (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Service listing not found' });
    }

    const {
      name, category, sub_category, address, area, dist_from_ramkund,
      phone, hours, rate_type, rate_info, google_maps_url, latitude, longitude,
      description, source_reference, verification_status, reviewer_notes,
      is_emergency, tags
    } = req.body;

    const tagsJson = tags !== undefined
      ? (Array.isArray(tags) ? JSON.stringify(tags) : String(tags))
      : existing.tags;
    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      UPDATE services SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        sub_category = COALESCE(?, sub_category),
        address = COALESCE(?, address),
        area = COALESCE(?, area),
        dist_from_ramkund = COALESCE(?, dist_from_ramkund),
        phone = COALESCE(?, phone),
        hours = COALESCE(?, hours),
        rate_type = COALESCE(?, rate_type),
        rate_info = COALESCE(?, rate_info),
        google_maps_url = COALESCE(?, google_maps_url),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        description = COALESCE(?, description),
        source_reference = COALESCE(?, source_reference),
        last_reviewed_date = ?,
        verification_status = COALESCE(?, verification_status),
        reviewer_notes = COALESCE(?, reviewer_notes),
        is_emergency = COALESCE(?, is_emergency),
        tags = COALESCE(?, tags),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name, category, sub_category, address, area,
      dist_from_ramkund !== undefined ? parseFloat(dist_from_ramkund) : null,
      phone, hours, rate_type, rate_info, google_maps_url,
      latitude !== undefined ? parseFloat(latitude) : null,
      longitude !== undefined ? parseFloat(longitude) : null,
      description, source_reference, today, verification_status,
      reviewer_notes, is_emergency !== undefined ? (is_emergency ? 1 : 0) : null,
      tagsJson, id
    );

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    try {
      updated.tags = JSON.parse(updated.tags || '[]');
    } catch (e) {
      updated.tags = [];
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /api/services/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Service listing not found' });
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.json({ message: 'Service removed successfully', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
