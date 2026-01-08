require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Manyani Database Connected Successfully'))
.catch(err => {
  console.error('❌ Database Connection Error:', err);
  process.exit(1);
});

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('join-building', (buildingId) => {
    socket.join(`building-${buildingId}`);
    console.log(`👥 User joined building ${buildingId}`);
  });
  
  socket.on('send-message', (data) => {
    io.to(`building-${data.buildingId}`).emit('new-message', data);
  });
  
  socket.on('send-alert', (data) => {
    io.to(`building-${data.buildingId}`).emit('new-alert', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏠 Welcome to Manyani Rental Management System API',
    version: '1.0.0',
    description: 'Premium Rental Management Platform',
    colors: 'Theme: Brown, Green, White & Maroon',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      bookings: '/api/bookings',
      payments: '/api/payments',
      communications: '/api/communications',
      alerts: '/api/alerts'
    }
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const communicationRoutes = require('./routes/communications');
const alertRoutes = require('./routes/alerts');
const maintenanceRoutes = require('./routes/maintenance');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '🔍 Route not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n✨ ============================================== ✨`);
  console.log(`   🏠 MANYANI RENTAL MANAGEMENT SYSTEM`);
  console.log(`   ==============================================`);
  console.log(`   🔗 Server URL: http://localhost:${PORT}`);
  console.log(`   🌐 Frontend: http://localhost:3000`);
  console.log(`   🗄️  Database: ${process.env.MONGODB_URI}`);
  console.log(`   🎨 Theme: Brown, Green, White & Maroon`);
  console.log(`   ⚡ Real-time: Socket.IO enabled`);
  console.log(`   💰 Payments: M-Pesa integration ready`);
  console.log(`   🌍 Languages: EN/SW support`);
  console.log(`✨ ============================================== ✨\n`);
});

module.exports = { app, server, io };
