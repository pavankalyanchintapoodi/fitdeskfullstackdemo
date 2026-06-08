import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { Server as SocketServer } from 'socket.io';
import db, { initializeDatabase } from './database.js';
import { startNotificationScheduler, checkExpiringSubscriptions } from './notificationScheduler.js';
import { authenticateToken } from './authMiddleware.js';
import authRouter from './routes/auth.js';
import clientsRouter from './routes/clients.js';
import statsRouter from './routes/stats.js';
import notificationsRouter from './routes/notifications.js';
import exportRouter from './routes/export.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🚀 Starting FitDesk Server...');

const app = express();
const httpServer = createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return false;
};
const io = new SocketServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
console.log('✅ Middleware configured');

// Initialize database
console.log('📦 Initializing database...');
await initializeDatabase().catch(err => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});

// Routes
console.log('🔗 Setting up routes...');
// Middleware to attach io to routes — MUST be registered before route handlers so they can access req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/export', exportRouter);
console.log('✅ All routes configured');

// Socket.IO connection
console.log('🔌 Configuring Socket.IO...');
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('check:notifications', () => {
    checkExpiringSubscriptions(io);
  });
});

// (req.io is attached above before route registration)

// Start notification scheduler
console.log('⏰ Starting notification scheduler (runs daily at 9 AM)');
startNotificationScheduler();
console.log('✅ Server ready to accept connections');

// The clients CRUD endpoints are implemented in `routes/clients.js` and emit socket events via req.io.
// Removed duplicate overrides here to avoid conflicting behavior.

// CRUD endpoints for clients are implemented in `routes/clients.js` which will emit socket events via `req.io`.

function calculateStatus(endDate) {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 1) return 'expiring';
  return 'active';
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Server initialization complete!`);
  console.log(`🏋️ FitDesk Server running on http://localhost:${PORT}`);
  console.log(`📱 Client should connect from http://localhost:5173`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try:`);
    console.error(`   lsof -i :${PORT}`);
    console.error(`   kill -9 <PID>`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
