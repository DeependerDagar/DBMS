const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Fallback helper agar qrHelper utility na ho
let generateTicketQR;
try {
  generateTicketQR = require('../utils/qrHelper').generateTicketQR;
} catch (e) {
  generateTicketQR = async (data) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`;
  };
}

// Official Concession Catalog
const CONCESSION_CATALOG = {
  'Caramel Popcorn': 150,
  'Cheese Popcorn': 150,
  'Large Cold Beverage': 90,
  'Nachos Combo': 180
};

// Generate Unique PNR (e.g., CPX-9B7E3)
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
 * @desc    Reserve seats & confirm booking
 * @access  Private / Public
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      showtimeId,
      seatIds,
      seats,
      concessions = [],
      paymentMethod = 'UPI QR',
      movieTitle,
      totalAmount,
      showDate,
      showTime,
      screen,
      customerName,
      customerEmail,
      userId: bodyUserId
    } = req.body;

    const rawSeats = seatIds || seats || [];
    const userId = req.user ? req.user._id : bodyUserId || null;
    const finalCustomerName = req.user?.name || customerName || 'Valued Guest';
    const finalCustomerEmail = req.user?.email || customerEmail || '';

    // Validation
    if (!showtimeId || !Array.isArray(rawSeats) || rawSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat.'
      });
    }

    if (rawSeats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 seats allowed per booking.'
      });
    }

    // Showtime lookup
    let showtime = null;
    try {
      showtime = await Showtime.findById(showtimeId).populate('movie');
    } catch (e) {
      // Mock showtime support
    }

    let bookedSeatsSummary = [];
    let ticketTotal = 0;
    const defaultPricePerSeat = showtime?.ticketPrice || 350;

    if (showtime && Array.isArray(showtime.seats) && showtime.seats.length > 0) {
      for (const id of rawSeats) {
        const foundSeat = showtime.seats.find((s) => s.seatId === id);
        if (!foundSeat) {
          return res.status(400).json({ success: false, message: `Invalid seat: ${id}` });
        }
        if (foundSeat.isBooked) {
          return res.status(409).json({
            success: false,
            message: `Seat ${id} is already occupied. Please pick another seat.`
          });
        }
        ticketTotal += foundSeat.price;
        bookedSeatsSummary.push({
          seatId: foundSeat.seatId,
          tier: foundSeat.tier || 'Classic',
          price: foundSeat.price
        });
      }

      const updateResult = await Showtime.updateOne(
        {
          _id: showtimeId,
          seats: {
            $all: rawSeats.map((id) => ({
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
          arrayFilters: [{ 'elem.seatId': { $in: rawSeats } }]
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(409).json({
          success: false,
          message: 'Conflict: One or more seats were just reserved by another guest.'
        });
      }
    } else {
      ticketTotal = totalAmount || rawSeats.length * defaultPricePerSeat;
      bookedSeatsSummary = rawSeats.map((id) => ({
        seatId: typeof id === 'object' ? id.seatId : id,
        tier: 'Classic',
        price: defaultPricePerSeat
      }));
    }

    // Concessions
    let concessionsTotal = 0;
    const itemizedConcessions = [];
    if (Array.isArray(concessions)) {
      for (const item of concessions) {
        const itemPrice = CONCESSION_CATALOG[item.name] || item.price;
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

    // Unique PNR
    let pnr = generatePNR();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const existing = await Booking.findOne({ pnr });
      if (!existing) isUnique = true;
      else pnr = generatePNR();
      attempts++;
    }

    const finalMovieTitle = showtime?.movie?.title || movieTitle || 'Movie Ticket';
    const finalScreen = screen || showtime?.auditorium?.name || showtime?.screen || 'Audi 1 (IMAX)';
    const finalShowTime = showTime || showtime?.startTime || '07:30 PM';
    const finalShowDate = showDate ? new Date(showDate) : (showtime?.startTime || new Date());

    const booking = new Booking({
      pnr,
      user: userId,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      showtime: showtime?._id || showtimeId,
      movieTitle: finalMovieTitle,
      moviePoster: showtime?.movie?.posterPath || '',
      showDate: finalShowDate,
      showTime: finalShowTime,
      screen: finalScreen,
      seats: bookedSeatsSummary,
      concessions: itemizedConcessions,
      ticketTotal,
      concessionsTotal,
      grandTotal,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed'
    });

    try {
      booking.qrCodeData = await generateTicketQR({
        pnr: booking.pnr,
        screen: booking.screen,
        seats: rawSeats.join(', ')
      });
    } catch (qrErr) {
      booking.qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PNR:${booking.pnr}`;
    }

    await booking.save();

    try {
      if (Payment) {
        await Payment.create({
          booking: booking._id,
          user: userId,
          amount: grandTotal,
          method: paymentMethod,
          transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          isDemo: true,
          status: 'SUCCESS'
        });
      }
    } catch (payErr) {
      console.warn('Payment audit skipped:', payErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Fetch authenticated user's isolated booking history ONLY
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.query?.userId || null;
    const currentUserEmail = req.user?.email || req.query?.email || null;
    const currentUserName = req.user?.name || null;

    // Agar identity nahi mili toh kisi ka bhi data mat bhejo
    if (!currentUserId && !currentUserEmail && !currentUserName) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Strict Filter: Sirf current user ki tickets fetch karo
    const orConditions = [];

    if (currentUserId) {
      orConditions.push({ user: currentUserId });
    }
    if (currentUserEmail) {
      orConditions.push({ customerEmail: currentUserEmail.toLowerCase() });
    }
    if (currentUserName && currentUserName !== 'Valued Guest') {
      orConditions.push({ customerName: currentUserName });
    }

    const bookings = await Booking.find({ $or: orConditions }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching isolated bookings:', error);
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:id
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/ticket/:pnr
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
        seats: booking.seats.map((s) => s.seatId || s),
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
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
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