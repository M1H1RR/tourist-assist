const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/stats
router.get('/', (req, res) => {
  try {
    const totalServices = db.prepare("SELECT COUNT(*) as count FROM services").get().count;
    const emergencyServices = db.prepare("SELECT COUNT(*) as count FROM services WHERE is_emergency = 1").get().count;
    const totalAttractions = db.prepare("SELECT COUNT(*) as count FROM attractions").get().count;
    const approvedProviders = db.prepare("SELECT COUNT(*) as count FROM providers WHERE status = 'approved'").get().count;
    const pendingProviders = db.prepare("SELECT COUNT(*) as count FROM providers WHERE status = 'pending'").get().count;
    const totalQRs = db.prepare("SELECT COUNT(*) as count FROM qr_codes").get().count;
    const totalScans = db.prepare("SELECT COALESCE(SUM(scans_count), 0) as total FROM qr_codes").get().total;
    const pendingReports = db.prepare("SELECT COUNT(*) as count FROM information_reports WHERE status = 'pending'").get().count;

    res.json({
      totalServices,
      emergencyServices,
      totalAttractions,
      approvedProviders,
      pendingProviders,
      totalQRs,
      totalScans,
      pendingReports,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error calculating platform statistics:', err);
    res.status(500).json({ error: 'Failed to compute statistics' });
  }
});

module.exports = router;
