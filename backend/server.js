const express = require('express');
const cors = require('cors');
require('dotenv').config();
// MongoDB disabled - using in-memory storage
// const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB disabled - using in-memory storage
// connectDB();

// Import routes
const donationsRouter = require('./routes/donations');
const volunteersRouter = require('./routes/volunteers');
const organizationsRouter = require('./routes/organizations');
const aiRouter = require('./routes/ai');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/donations', donationsRouter);
app.use('/api/volunteers', volunteersRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/ai', aiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Care Connect API',
    version: '1.0.0',
    endpoints: {
      donations: '/api/donations',
      volunteers: '/api/volunteers',
      organizations: '/api/organizations',
      ai: '/api/ai'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Care Connect API Server is running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(`   - Donations: http://localhost:${PORT}/api/donations`);
  console.log(`   - Volunteers: http://localhost:${PORT}/api/volunteers`);
  console.log(`   - Organizations: http://localhost:${PORT}/api/organizations`);
  console.log(`   - AI Assistant: http://localhost:${PORT}/api/ai`);
});
