const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    tmdbId: {
      type: Number,
      default: null,
      index: true
    },
    source: {
      type: String,
      enum: ['tmdb', 'admin'],
      default: 'admin'
    },
    overview: {
      type: String,
      default: 'No synopsis available.'
    },
    posterPath: {
      type: String,
      default: ''
    },
    backdropPath: {
      type: String,
      default: ''
    },
    genres: {
      type: [String],
      default: []
    },
    runtime: {
      type: Number, // Stored in minutes (e.g. 148)
      default: 120
    },
    rating: {
      type: Number, // Scaled from 0 to 10
      default: 7.5
    },
    language: {
      type: String,
      default: 'English'
    },
    releaseDate: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);