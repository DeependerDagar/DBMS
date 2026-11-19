const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./src/routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect Database from src/config/db
try {
  const connectDB = require('./src/config/db');
  connectDB();
} catch (err) {
  console.log('DB Connect Error/Warning:', err.message);
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Cineplex API Server is running' });
});

// Safe Route Loader Helper
const loadRoute = (path, routeFile) => {
  try {
    app.use(path, require(routeFile));
    console.log(`✓ Loaded: ${path}`);
  } catch (err) {
    console.warn(`✗ Skipped ${path}:`, err.message);
  }
};

// Mount Routes with ./src/routes/ prefix
loadRoute('/api/auth', './src/routes/authRoutes');
loadRoute('/api/movies', './src/routes/movieRoutes');
loadRoute('/api/showtimes', './src/routes/showtimeRoutes');
loadRoute('/api/bookings', './src/routes/bookingRoutes');
loadRoute('/api/admin', './src/routes/adminRoutes.js');

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Cineplex Server] Running on port ${PORT}`);
});