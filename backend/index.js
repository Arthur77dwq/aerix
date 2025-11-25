/**
 * MAIN SERVER ENTRY POINT
 *
 * This is where your Express application starts. It:
 * - Loads environment variables
 * - Sets up middleware (CORS, JSON parsing)
 * - Mounts all route handlers
 * - Starts the server listening on a port
 */

// Load environment variables from .env file FIRST (before other imports)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');

// Create Express application
const app = express();

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Enable CORS - allows your frontend (different origin) to call this API
// TODO: In production, replace '*' with your actual frontend URL for security
app.use(cors({
  origin: '*', // Change to 'https://aerix.app' in production
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies - allows you to access req.body
app.use(express.json());

// =============================================================================
// ROUTES
// =============================================================================

// Health check endpoint - use this to verify server is running
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Aerix API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount route handlers
app.use('/api/auth', authRoutes);   // /api/auth/signup, /api/auth/login
app.use('/api/user', userRoutes);   // /api/user/profile, etc.

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler - catches requests to undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - catches errors thrown in route handlers
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// =============================================================================
// START SERVER
// =============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/status`);
});
