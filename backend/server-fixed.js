const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://internshell.com',
  'https://www.internshell.com',
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database on first request (serverless-friendly)
let dbConnected = false;

const ensureDbConnection = async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
  next();
};

// Apply database connection middleware to all API routes
app.use('/api', ensureDbConnection);

// Basic routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to InternShell API with AI-powered suggestions',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/internship',
      applications: '/api/applications',
      messages: '/api/messages',
      profile: '/api/profile',
      ats: '/api/ats',
      notifications: '/api/notifications',
      ai: '/api/ai',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'Connected' : 'Not connected'
  });
});

// API Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/internship', require('./routes/jobRoutes'));
  app.use('/api/applications', require('./routes/applicationRoutes'));
  app.use('/api/messages', require('./routes/messageRoutes'));
  app.use('/api/profile', require('./routes/profileRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
  app.use('/api/ats', require('./routes/atsRoutes'));
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  app.use('/api/ai', require('./routes/aiRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
} catch (error) {
  console.error('Error loading routes:', error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export app
module.exports = app;