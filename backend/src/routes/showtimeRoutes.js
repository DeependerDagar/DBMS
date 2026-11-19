const express = require('express');
const router = express.Router();
const { getShowtimesByMovie } = require('../controllers/showtimeController');

router.get('/movie/:movieId', getShowtimesByMovie);

module.exports = router;