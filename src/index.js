const express = require('express');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api', auth, deviceRoutes);

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
