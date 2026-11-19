const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  verifyTicketByPNR,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Safe/Flexible Auth Helper: Token mile toh user attach karega, na mile toh request block nahi karega
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// 1. Create Booking (Guests aur Logged-in dono allow honge)
router.post('/', optionalProtect, createBooking);

// 2. Logged-in User ki Personal Bookings
router.get('/my', protect, getMyBookings);

// 3. Public Ticket Verification (Scanner / Staff verification by PNR)
router.get('/ticket/:pnr', verifyTicketByPNR);

// 4. Single Booking Details
router.get('/:id', optionalProtect, getBookingById);

// 5. Booking Cancellation
router.post('/:id/cancel', protect, cancelBooking);

module.exports = router;