const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://internshell.com',
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Increase payload size limit for resume data with images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
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

// Welcome route
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
      documentation: 'Coming soon...'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Handle 404 errors for API routes only
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

// Export app for testing
module.exports = app;

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 InternShell Backend Server                       ║
║                                                       ║
║   ✓ Server running on port ${PORT}                     ║
║   ✓ Environment: ${process.env.NODE_ENV}               ║
║   ✓ Database: MongoDB                                 ║
║                                                       ║
║   📡 API Endpoints:                                   ║
║   → http://localhost:${PORT}                           ║
║   → http://localhost:${PORT}/api/health                ║
║   → http://localhost:${PORT}/api/auth                  ║
║   → http://localhost:${PORT}/api/internship            ║
║   → http://localhost:${PORT}/api/applications          ║
║   → http://localhost:${PORT}/api/messages              ║
║   → http://localhost:${PORT}/api/profile               ║
║   → http://localhost:${PORT}/api/ats                   ║
║   → http://localhost:${PORT}/api/notifications         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
}