const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('./auth');

// POST /api/reports (Public: submit correction)
router.post('/', (req, res) => {
  try {
    const { entity_type, entity_id, entity_name, issue_type, description, reporter_name, reporter_contact } = req.body;

    if (!entity_name || !issue_type || !description) {
      return res.status(400).json({ error: 'Please provide the place name, issue type, and description of the correction.' });
    }

    const stmt = db.prepare(`
      INSERT INTO information_reports (
        entity_type, entity_id, entity_name, issue_type, description,
        reporter_name, reporter_contact, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    stmt.run(
      entity_type || 'general',
      entity_id ? parseInt(entity_id) : null,
      entity_name.trim(),
      issue_type,
      description.trim(),
      reporter_name ? reporter_name.trim() : 'Anonymous Pilgrim',
      reporter_contact ? reporter_contact.trim() : ''
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been forwarded to the Tourist Assist verification team for ground checking.'
    });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ error: 'Failed to record information report' });
  }
});

// GET /api/reports (Admin only: view reports)
router.get('/', requireAdmin, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM information_reports';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += " ORDER BY CASE WHEN status = 'pending' THEN 1 WHEN status = 'investigating' THEN 2 ELSE 3 END, created_at DESC";

    const reports = db.prepare(query).all(...params);
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

// PUT /api/reports/:id (Admin only: update resolution)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['pending', 'investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare(`
      UPDATE information_reports SET
        status = ?,
        admin_notes = COALESCE(?, admin_notes)
      WHERE id = ?
    `).run(status, admin_notes, id);

    const updated = db.prepare('SELECT * FROM information_reports WHERE id = ?').get(id);
    res.json({ message: 'Report status updated', report: updated });
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

module.exports = router;
