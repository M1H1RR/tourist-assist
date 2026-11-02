const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('./auth');

// GET /api/providers (Public: approved only)
router.get('/', (req, res) => {
  try {
    const { category, area, search } = req.query;
    let query = "SELECT id, name, business_name, category, description, area, phone, whatsapp, email, services_offered, pricing_notes, website_url, status, created_at FROM providers WHERE status = 'approved'";
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (area && area !== 'all') {
      query += ' AND area = ?';
      params.push(area);
    }

    if (search && search.trim() !== '') {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(business_name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(services_offered) LIKE ?)';
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const providers = db.prepare(query).all(...params);
    res.json(providers);
  } catch (err) {
    console.error('Error fetching approved providers:', err);
    res.status(500).json({ error: 'Failed to retrieve providers' });
  }
});

// POST /api/providers/register (Public registration -> enters pending state)
router.post('/register', (req, res) => {
  try {
    const {
      name, business_name, category, description, area,
      phone, whatsapp, email, services_offered, pricing_notes, website_url
    } = req.body;

    if (!name || !business_name || !category || !description || !area || !phone) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Your Name, Business Name, Category, Description, Area, and Contact Phone.'
      });
    }

    const validCategories = ['guide', 'transport', 'food', 'handicraft', 'accommodation'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid service category selected.' });
    }

    // Basic sanitization
    const cleanPhone = phone.replace(/[^0-9+\s-]/g, '').trim();
    if (cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    const stmt = db.prepare(`
      INSERT INTO providers (
        name, business_name, category, description, area, phone, whatsapp,
        email, services_offered, pricing_notes, website_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      name.trim(), business_name.trim(), category, description.trim(), area.trim(),
      cleanPhone, whatsapp ? whatsapp.trim() : '', email ? email.trim() : '',
      services_offered ? services_offered.trim() : '',
      pricing_notes ? pricing_notes.trim() : '',
      website_url ? website_url.trim() : ''
    );

    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Your registration has been submitted successfully! It is now in a "Pending Review" state. Our administrative team will review your credentials before making your listing public.',
      status: 'pending'
    });
  } catch (err) {
    console.error('Error registering provider:', err);
    res.status(500).json({ error: 'Registration failed due to server error. Please try again.' });
  }
});

// POST /api/providers/:id/enquire (Public visitor enquiry to approved provider)
router.post('/:id/enquire', (req, res) => {
  try {
    const { id } = req.params;
    const provider = db.prepare('SELECT id, name, business_name, status FROM providers WHERE id = ?').get(id);

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    if (provider.status !== 'approved') {
      return res.status(403).json({ error: 'Cannot send enquiries to unapproved provider listings.' });
    }

    const { visitor_name, visitor_phone, visitor_email, message, visit_date } = req.body;

    if (!visitor_name || !visitor_phone || !message) {
      return res.status(400).json({ error: 'Name, phone number, and enquiry message are required.' });
    }

    db.prepare(`
      INSERT INTO provider_enquiries (
        provider_id, visitor_name, visitor_phone, visitor_email, message, visit_date
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id, visitor_name.trim(), visitor_phone.trim(), visitor_email ? visitor_email.trim() : '',
      message.trim(), visit_date || null
    );

    res.status(201).json({
      success: true,
      message: `Your enquiry has been dispatched to ${provider.business_name}. The provider will review your request and get back to you directly.`
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ error: 'Failed to dispatch enquiry' });
  }
});

// GET /api/admin/providers (Admin only: view all pending, approved, rejected)
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM providers';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += " ORDER BY CASE WHEN status = 'pending' THEN 1 WHEN status = 'approved' THEN 2 ELSE 3 END, created_at DESC";

    const providers = db.prepare(query).all(...params);
    res.json(providers);
  } catch (err) {
    console.error('Error in admin provider list:', err);
    res.status(500).json({ error: 'Failed to retrieve provider records' });
  }
});

// PUT /api/admin/providers/:id/status (Admin only: approve or reject)
router.put('/admin/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, rejection_reason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved, rejected, or pending' });
    }

    const existing = db.prepare('SELECT * FROM providers WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    db.prepare(`
      UPDATE providers SET
        status = ?,
        admin_notes = COALESCE(?, admin_notes),
        rejection_reason = COALESCE(?, rejection_reason),
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, admin_notes, rejection_reason, id);

    const updated = db.prepare('SELECT * FROM providers WHERE id = ?').get(id);
    res.json({
      message: `Provider listing status updated to ${status}.`,
      provider: updated
    });
  } catch (err) {
    console.error('Error updating provider status:', err);
    res.status(500).json({ error: 'Failed to update provider status' });
  }
});

// DELETE /api/admin/providers/:id (Admin only)
router.delete('/admin/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM providers WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    db.prepare('DELETE FROM providers WHERE id = ?').run(id);
    res.json({ message: 'Provider removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

module.exports = router;
