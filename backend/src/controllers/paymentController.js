const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { generateTicketQR } = require('../utils/qrHelper');

// Official server-side price catalog for concessions
const CONCESSION_CATALOG = {
  'Caramel Popcorn': 150,
  'Cheese Popcorn': 150,
  'Large Cold Beverage': 90,
  'Nachos Combo': 180
};

// Generate an 8-character unique alphanumeric PNR (e.g. CPX-9B7E3)
const generatePNR = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CPX-${randomStr}`;
};

/**
 * @route   POST /api/bookings
 * @desc    Reserve seats and create a confirmed booking with simulated payment
 * @access  Private (Authenticated users)
 */
const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seatIds, concessions = [], paymentMethod = 'UPI' } = req.body;
    const userId = req.user._id;

    // 1. Validation: Seat selections
    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat.' });
    }

    if (seatIds.length > 6) {
      return res.status(400).json({ success: false, message: 'Maximum 6 seats allowed per booking transaction.' });
    }

    // 2. Fetch the target showtime
    const showtime = await Showtime.findById(showtimeId).populate('movie');
    if (!showtime || !showtime.isActive) {
      return res.status(404).json({ success: false, message: 'Selected showtime is unavailable.' });
    }

    // 3. Verify all selected seats exist in layout & check if any are already booked
    const selectedSeatObjects = [];
    for (const id of seatIds) {
      const seat = showtime.seats.find((s) => s.seatId === id);
      if (!seat) {
        return res.status(400).json({ success: false, message: `Invalid seat identifier: ${id}` });
      }
      if (seat.isBooked) {
        return res.status(409).json({
          success: false,
          message: `Seat ${id} is already occupied. Please refresh and select another seat.`
        });
      }
      selectedSeatObjects.push(seat);
    }

    // 4. Server-Side Price Calculation (Never trust frontend totals)
    let ticketTotal = 0;
    const bookedSeatsSummary = selectedSeatObjects.map((s) => {
      ticketTotal += s.price;
      return {
        seatId: s.seatId,
        tier: s.tier,
        price: s.price
      };
    });

    let concessionsTotal = 0;
    const itemizedConcessions = [];
    if (Array.isArray(concessions)) {
      for (const item of concessions) {
        const itemPrice = CONCESSION_CATALOG[item.name];
        if (itemPrice && item.quantity > 0) {
          const lineTotal = itemPrice * item.quantity;
          concessionsTotal += lineTotal;
          itemizedConcessions.push({
            name: item.name,
            quantity: item.quantity,
            price: itemPrice
          });
        }
      }
    }

    const grandTotal = ticketTotal + concessionsTotal;

    // 5. ATOMIC SEAT RESERVATION (Prevents Race Condition / Double Booking)
    // Update seats where isBooked is still false. If another user booked concurrently, matchedCount < seatIds.length
    const updateResult = await Showtime.updateOne(
      {
        _id: showtimeId,
        seats: {
          $all: seatIds.map((id) => ({
            $elemMatch: { seatId: id, isBooked: false }
          }))
        }
      },
      {
        $set: {
          'seats.$[elem].isBooked': true,
          'seats.$[elem].bookedBy': userId
        }
      },
      {
        arrayFilters: [{ 'elem.seatId': { $in: seatIds } }]
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: One or more selected seats were just reserved by another user. Please choose alternative seats.'
      });
    }

    // 6. Generate Unique PNR and Booking Record
    let pnr = generatePNR();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Booking.findOne({ pnr });
      if (!existing) isUnique = true;
      else pnr = generatePNR();
    }

    const booking = new Booking({
      pnr,
      user: userId,
      showtime: showtime._id,
      movieTitle: showtime.movie.title,
      moviePoster: showtime.movie.posterPath,
      showDate: showtime.date,
      showTime: showtime.time,
      screen: showtime.screen,
      seats: bookedSeatsSummary,
      concessions: itemizedConcessions,
      ticketTotal,
      concessionsTotal,
      grandTotal,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed'
    });

    // 7. Generate Ticket QR Code
    booking.qrCodeData = await generateTicketQR({
      pnr: booking.pnr,
      bookingId: booking._id,
      screen: booking.screen,
      showDate: booking.showDate,
      showTime: booking.showTime,
      seats: seatIds.join(', ')
    });

    await booking.save();

    // 8. Log the simulated payment record
    await Payment.create({
      booking: booking._id,
      user: userId,
      amount: grandTotal,
      method: paymentMethod,
      transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      isDemo: true,
      status: 'SUCCESS'
    });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! (Simulated Payment Confirmed)',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Fetch authenticated user's personal booking history
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking details by ID (Ownership verified)
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ownership check: Users can only see their own bookings; Admins can see all
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/ticket/:pnr
 * @desc    Public/Staff ticket verification by PNR
 * @access  Public
 */
const verifyTicketByPNR = async (req, res, next) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr: pnr.toUpperCase() });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invalid ticket PNR code' });
    }

    res.status(200).json({
      success: true,
      data: {
        pnr: booking.pnr,
        movieTitle: booking.movieTitle,
        showDate: booking.showDate,
        showTime: booking.showTime,
        screen: booking.screen,
        seats: booking.seats.map((s) => s.seatId),
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        venue: 'Cineplex, Airia Mall, Gurugram'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel booking and release seats back to available pool
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Release seats atomically in the showtime document
    const seatIds = booking.seats.map((s) => s.seatId);
    await Showtime.updateOne(
      { _id: booking.showtime },
      {
        $set: {
          'seats.$[elem].isBooked': false,
          'seats.$[elem].bookedBy': null
        }
      },
      {
        arrayFilters: [{ 'elem.seatId': { $in: seatIds } }]
      }
    );

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Mark corresponding simulated payment record
    await Payment.findOneAndUpdate(
      { booking: booking._id },
      { status: 'FAILED' }
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released. (Simulated refund initiated)',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  verifyTicketByPNR,
  cancelBooking
};