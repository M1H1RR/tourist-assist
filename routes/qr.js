const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require('../db/database');
const { requireAdmin } = require('./auth');

// GET /api/qr (Admin only: list all QR codes)
router.get('/', requireAdmin, (req, res) => {
  try {
    const qrs = db.prepare('SELECT * FROM qr_codes ORDER BY created_at DESC').all();
    res.json(qrs);
  } catch (err) {
    console.error('Error fetching QR codes:', err);
    res.status(500).json({ error: 'Failed to retrieve QR records' });
  }
});

// POST /api/qr (Admin only: create dynamic QR code)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { title, description, target_type, target_id, custom_target_url, location_label } = req.body;

    if (!title || !location_label) {
      return res.status(400).json({ error: 'Title and location label are required.' });
    }

    const code_id = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    let target_url = custom_target_url || `/qr/${code_id}`;

    // If linked to attraction or service, format internal target
    if (target_type === 'attraction' && target_id) {
      target_url = `/explore?id=${target_id}`;
    } else if (target_type === 'service' && target_id) {
      target_url = `/services?id=${target_id}`;
    }

    const stmt = db.prepare(`
      INSERT INTO qr_codes (
        code_id, title, description, target_type, target_id, target_url, location_label, scans_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const result = stmt.run(
      code_id, title.trim(), description || '', target_type || 'area_hub',
      target_id ? parseInt(target_id) : null, target_url, location_label.trim()
    );

    const created = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating QR record:', err);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
});

// PUT /api/qr/:id (Admin only: dynamically update destination without reprinting QR code)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'QR record not found' });
    }

    const { title, description, target_type, target_id, target_url, location_label } = req.body;

    db.prepare(`
      UPDATE qr_codes SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        target_type = COALESCE(?, target_type),
        target_id = COALESCE(?, target_id),
        target_url = COALESCE(?, target_url),
        location_label = COALESCE(?, location_label),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, description, target_type,
      target_id !== undefined ? (target_id ? parseInt(target_id) : null) : undefined,
      target_url, location_label, id
    );

    const updated = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating QR record:', err);
    res.status(500).json({ error: 'Failed to update QR code' });
  }
});

// DELETE /api/qr/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'QR record not found' });
    }

    db.prepare('DELETE FROM qr_codes WHERE id = ?').run(id);
    res.json({ message: 'QR record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete QR record' });
  }
});

// GET /api/qr/:codeId/download?format=png|svg&size=500
router.get('/:codeId/download', async (req, res) => {
  try {
    const { codeId } = req.params;
    const { format = 'png', size = 400 } = req.query;

    const qrRecord = db.prepare('SELECT * FROM qr_codes WHERE code_id = ?').get(codeId);
    if (!qrRecord) {
      return res.status(404).json({ error: 'QR Code not found' });
    }

    // Dynamic destination permalink (accessible in browser)
    const protocol = req.protocol;
    const host = req.get('host');
    const fullScanUrl = `${protocol}://${host}/qr/view/${codeId}`;

    if (format === 'svg') {
      const svgString = await QRCode.toString(fullScanUrl, {
        type: 'svg',
        width: parseInt(size) || 400,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="tourist-assist-qr-${codeId}.svg"`);
      return res.send(svgString);
    } else {
      const pngBuffer = await QRCode.toBuffer(fullScanUrl, {
        width: parseInt(size) || 400,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      });
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="tourist-assist-qr-${codeId}.png"`);
      return res.send(pngBuffer);
    }
  } catch (err) {
    console.error('Error generating QR download:', err);
    res.status(500).json({ error: 'Failed to generate QR image' });
  }
});

// GET /api/qr/view/:codeId (Public: resolves dynamic QR and increments scan count)
router.get('/view/:codeId', async (req, res) => {
  try {
    const { codeId } = req.params;
    const qrRecord = db.prepare('SELECT * FROM qr_codes WHERE code_id = ?').get(codeId);

    if (!qrRecord) {
      return res.status(404).json({ error: 'Invalid or expired QR code' });
    }

    // Increment scan count
    db.prepare('UPDATE qr_codes SET scans_count = scans_count + 1 WHERE id = ?').run(qrRecord.id);

    // Fetch relevant contextual entities for the scanned area
    let linkedAttraction = null;
    let linkedService = null;

    if (qrRecord.target_type === 'attraction' && qrRecord.target_id) {
      linkedAttraction = db.prepare('SELECT * FROM attractions WHERE id = ?').get(qrRecord.target_id);
    } else if (qrRecord.target_type === 'service' && qrRecord.target_id) {
      linkedService = db.prepare('SELECT * FROM services WHERE id = ?').get(qrRecord.target_id);
    }

    // Fetch immediate nearby emergency amenities based on location
    const emergencyNearby = db.prepare(`
      SELECT * FROM services 
      WHERE (category = 'medical' OR is_emergency = 1 OR category = 'sanitation' OR category = 'water')
      ORDER BY dist_from_ramkund ASC
      LIMIT 6
    `).all().map(s => {
      try { s.tags = JSON.parse(s.tags || '[]'); } catch (e) { s.tags = []; }
      return s;
    });

    res.json({
      qrRecord,
      linkedAttraction,
      linkedService,
      emergencyNearby,
      groundZero: {
        name: 'Ramkund / Tapovan Central Corridor, Panchavati',
        helplineNumbers: [
          { label: 'Medical Ambulance', phone: '108' },
          { label: 'Police Assistance', phone: '112' },
          { label: 'Disaster Management Helpline', phone: '1077' },
          { label: 'Kumbh Control Room', phone: '1800-233-0011' }
        ]
      }
    });
  } catch (err) {
    console.error('Error resolving QR view:', err);
    res.status(500).json({ error: 'Failed to process QR destination' });
  }
});

module.exports = router;
