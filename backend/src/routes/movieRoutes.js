const express = require('express');
const router = express.Router();

// Correct relative path from 'src/routes' to 'src/controllers'
const movieController = require('../controllers/movieController');

// Controller functions mapping with safe fallbacks
const getAllMovies = movieController.getAllMovies || movieController.getMovies || ((req, res) => res.json({ success: true, data: [] }));
const getMovieById = movieController.getMovieById || ((req, res) => res.json({ success: true, data: null }));

// Optional helper routes if frontend calls them
const getGenres = movieController.getGenres || ((req, res) => res.json({ success: true, data: ['Action', 'Sci-Fi', 'Comedy', 'Drama', 'Horror', 'Thriller'] }));
const getTrending = movieController.getTrendingMovies || getAllMovies;
const getNowPlaying = movieController.getNowPlayingMovies || getAllMovies;

// Named routes first
router.get('/genres', getGenres);
router.get('/trending', getTrending);
router.get('/now-playing', getNowPlaying);
router.get('/', getAllMovies);

// Dynamic ID route
router.get('/:id', getMovieById);

module.exports = router;