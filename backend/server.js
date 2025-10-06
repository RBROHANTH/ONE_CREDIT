const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');

// Import routes
const studentAuthRoutes = require('./routes/studentAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const courseRoutes = require('./routes/courses');
const testRoutes = require('./routes/test');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Support base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EduLearn Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth/student', studentAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/test', testRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to EduLearn Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      studentAuth: '/api/auth/student',
      adminAuth: '/api/auth/admin',
      courses: '/api/courses',
      test: '/api/test'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 EduLearn Backend Server Running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
📡 API Base URL: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/api/health
📚 Documentation: http://localhost:${PORT}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

module.exports = app;