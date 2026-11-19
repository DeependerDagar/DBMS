const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  auditorium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auditorium'
  },
  startTime: {
    type: Date,
    required: true
  },
  ticketPrice: {
    type: Number,
    default: 350
  },
  bookedSeats: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);