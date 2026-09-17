const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/server/config/db');

const authRoutes = require('./src/server/routes/authRoutes');
const accountRoutes = require('./src/server/routes/accountRoutes');
const transactionRoutes = require('./src/server/routes/transactionRoutes');
const loanRoutes = require('./src/server/routes/loanRoutes');
const fdRoutes = require('./src/server/routes/fdRoutes');
const virtualCardRoutes = require('./src/server/routes/virtualCardRoutes');
const dashboardRoutes = require('./src/server/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection (MongoDB / MongoMemoryServer fallback)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static frontend dist if available
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/fd', fdRoutes);
app.use('/api/virtual-card', virtualCardRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root API route
app.get('/api', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: 'Nova Crest Bank Unified MERN API is running',
    version: '2.0.0',
  });
});

// Fallback for SPA routing in production
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.json({ status: 'ONLINE', message: 'Nova Crest Bank MERN API is running' });
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nova Crest Bank MERN Backend running on port ${PORT}`);
  console.log(`====================================================`);
});
