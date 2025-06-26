const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const individualRoutes = require('./routes/individualRoutes');
const organizationRoutes = require('./routes/organizationRoutes');

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://your-frontend-domain.vercel.app', // Replace with your actual frontend URL
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/party-management';
mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected to:', mongoUri.replace(/\/\/.*@/, '//***:***@')))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/tmf-api/party/v5/individual', individualRoutes);
app.use('/tmf-api/party/v5/organization', organizationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'POST /tmf-api/party/v5/individual',
      'GET /tmf-api/party/v5/individual',
      'GET /tmf-api/party/v5/individual/:id',
      'PATCH /tmf-api/party/v5/individual/:id',
      'DELETE /tmf-api/party/v5/individual/:id',
      'POST /tmf-api/party/v5/organization',
      'GET /tmf-api/party/v5/organization',
      'GET /tmf-api/party/v5/organization/:id',
      'PATCH /tmf-api/party/v5/organization/:id',
      'DELETE /tmf-api/party/v5/organization/:id'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;