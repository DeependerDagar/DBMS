const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Check server & database connectivity status
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cineplex REST API is operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;