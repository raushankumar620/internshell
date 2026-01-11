const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Basic CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'InternShell API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
});

// Test database connection without actually connecting
app.get('/api/test-db', (req, res) => {
  res.json({
    success: true,
    message: 'Database test endpoint',
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;