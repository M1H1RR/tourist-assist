require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable aggressive browser caching for HTML and Service Worker to guarantee instant live branding updates
app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html') || req.path === '/sw.js') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const { router: authRouter } = require('./routes/auth');
const servicesRouter = require('./routes/services');
const attractionsRouter = require('./routes/attractions');
const providersRouter = require('./routes/providers');
const qrRouter = require('./routes/qr');
const reportsRouter = require('./routes/reports');
const statsRouter = require('./routes/stats');

app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/attractions', attractionsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/qr', qrRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/stats', statsRouter);

// Fallback to index.html for client-side routing (Single Page Architecture)
app.use((req, res, next) => {
  // If it's an API request that didn't match, return 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  // If it's a GET request for a web page route, serve index.html
  if (req.method === 'GET') {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  TOURIST ASSIST: Nashik and Kumbh is LIVE!`);
  console.log(`  Tagline:    Explore. Discover. Stay Safe.`);
  console.log(`  Access URL: http://localhost:${PORT}`);
  console.log(`  API Base:   http://localhost:${PORT}/api`);
  console.log(`  Admin User: admin / admin123`);
  console.log(`=================================================`);
});

module.exports = { app, server };
