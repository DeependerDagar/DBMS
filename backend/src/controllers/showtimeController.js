const Showtime = require('../models/Showtime');

// @route   GET /api/showtimes/movie/:movieId
// @desc    Get all showtimes for a specific movie
// @access  Public
const getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    let showtimes = [];

    // 1. Try finding in MongoDB
    try {
      showtimes = await Showtime.find({ movie: movieId })
        .populate('movie', 'title posterPath runtime')
        .populate('auditorium', 'name soundSystem totalSeats')
        .sort({ startTime: 1 });
    } catch (dbErr) {
      console.warn('MongoDB showtime search warning:', dbErr.message);
    }

    // 2. Agar DB mein shows nahi mile, toh default slots generate karo
    if (!showtimes || showtimes.length === 0) {
      const today = new Date();
      const createTime = (hours, minutes) => {
        const d = new Date(today);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      showtimes = [
        {
          _id: `${movieId}_show_1`,
          startTime: createTime(12, 30),
          ticketPrice: 350,
          auditorium: { name: 'Audi 1 (IMAX)', soundSystem: 'Dolby Atmos 7.1' }
        },
        {
          _id: `${movieId}_show_2`,
          startTime: createTime(16, 15),
          ticketPrice: 400,
          auditorium: { name: 'Audi 2 (VIP Recliner)', soundSystem: 'Dolby Atmos' }
        },
        {
          _id: `${movieId}_show_3`,
          startTime: createTime(19, 45),
          ticketPrice: 450,
          auditorium: { name: 'Audi 1 (IMAX)', soundSystem: 'Dolby Atmos 7.1' }
        },
        {
          _id: `${movieId}_show_4`,
          startTime: createTime(22, 30),
          ticketPrice: 350,
          auditorium: { name: 'Audi 3 (Gold Class)', soundSystem: 'Dolby 5.1' }
        }
      ];
    }

    return res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    console.error('Showtime Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to load showtimes'
    });
  }
};

module.exports = {
  getShowtimesByMovie
};