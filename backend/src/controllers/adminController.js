const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');

let Showtime = null;
try {
  Showtime = require('../models/Showtime');
} catch (err) {
  Showtime = null;
}

/**
 * @desc    Add New Movie Permanently to MongoDB
 * @route   POST /api/admin/movies
 */
const addMovie = async (req, res) => {
  try {
    const {
      title,
      posterPath,
      backdropPath,
      overview,
      runtime,
      duration,
      genres,
      genre,
      rating,
      language,
      time,
      screen,
      price
    } = req.body;

    if (!title || !posterPath) {
      return res.status(400).json({
        success: false,
        message: 'Movie title and poster image URL are required.'
      });
    }

    let finalRuntime = 150;
    if (runtime) {
      finalRuntime = Number(runtime);
    } else if (duration) {
      const parsed = parseInt(duration, 10);
      if (!isNaN(parsed)) finalRuntime = parsed;
    }

    let finalGenres = ['Action', 'Thriller'];
    if (Array.isArray(genres) && genres.length > 0) {
      finalGenres = genres;
    } else if (typeof genre === 'string' && genre.trim()) {
      finalGenres = genre.split(',').map((g) => g.trim());
    }

    const movie = await Movie.create({
      title: title.trim(),
      posterPath: posterPath.trim(),
      backdropPath: backdropPath || posterPath.trim(),
      overview: overview || `${title.trim()} is now screening at Cineplex Airia Mall.`,
      runtime: finalRuntime,
      genres: finalGenres,
      rating: rating ? Number(rating) : 8.5,
      language: language || 'Hindi / English',
      source: 'admin',
      isActive: true
    });

    // Optional: Create default showtime entries if Showtime model exists
    if (Showtime) {
      try {
        await Showtime.create([
          {
            movie: movie._id,
            time: time || '08:00 PM',
            screen: screen || 'Audi 1 (IMAX)',
            price: price ? Number(price) : 350
          }
        ]);
      } catch (stErr) {
        // Fallback showtimes are generated automatically in movieController
      }
    }

    return res.status(201).json({
      success: true,
      message: `"${movie.title}" has been permanently stored in the database.`,
      data: movie
    });
  } catch (error) {
    console.error('Add Movie Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save the movie to the database.'
    });
  }
};

/**
 * @desc    Remove Movie Permanently from Database
 * @route   DELETE /api/admin/movies/:id
 */
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Default catalog movies cannot be deleted. Only custom database movies can be removed.'
      });
    }

    const removedMovie = await Movie.findByIdAndDelete(id);

    if (!removedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in the database.'
      });
    }

    if (Showtime) {
      await Showtime.deleteMany({ movie: id }).catch(() => null);
    }

    return res.status(200).json({
      success: true,
      message: `"${removedMovie.title}" has been permanently removed from the database.`
    });
  } catch (error) {
    console.error('Delete Movie Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete the movie from the database.'
    });
  }
};

/**
 * @desc    Get All Registered Users
 * @route   GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registered users.'
    });
  }
};

/**
 * @desc    Promote/Demote User Role
 * @route   POST /api/admin/users/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({
        success: false,
        message: 'User ID and target role are required.'
      });
    }

    if (!['user', 'admin'].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified.'
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    targetUser.role = newRole;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Role for ${targetUser.name} has been updated to ${newRole.toUpperCase()}.`,
      data: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role.'
    });
  }
};

module.exports = {
  addMovie,
  deleteMovie,
  getAllUsers,
  updateUserRole
};