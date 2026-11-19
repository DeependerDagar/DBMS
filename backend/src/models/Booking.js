const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    default: 'Valued Guest'
  },
  customerEmail: {
    type: String
  },
  movieTitle: {
    type: String,
    default: 'Interstellar'
  },
  moviePoster: {
    type: String,
    default: ''
  },
  showtime: {
    type: String,
    required: true
  },
  showDate: {
    type: Date,
    default: Date.now
  },
  showTime: {
    type: String,
    default: ''
  },
  screen: {
    type: String,
    default: 'Audi 1 (IMAX)'
  },
  seats: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  concessions: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  ticketTotal: {
    type: Number,
    required: true
  },
  concessionsTotal: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  qrCodeData: {
    type: String,
    default: ''
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['completed', 'pending', 'refunded'],
    default: 'completed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);