const express = require('express');
const router = express.Router();
const { processDemoPayment } = require('../controllers/paymentController');

router.post('/demo', processDemoPayment);

module.exports = router;