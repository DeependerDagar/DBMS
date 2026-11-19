const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Exact 20 Movies catalog matching frontend Home.jsx
const MOVIES_20_CATALOG = [
  {
    _id: 'm1',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the Manhattan Project.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    rating: 8.9,
    genre: ['Biography', 'Drama', 'Thriller'],
    duration: '180 min',
    language: 'English / Hindi',
    releaseDate: '2023-07-21'
  },
  {
    _id: 'm2',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history.',
    posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.7,
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '169 min',
    language: 'English / Hindi',
    releaseDate: '2014-11-07'
  },
  {
    _id: 'm3',
    title: 'Kalki 2898 AD',
    description: 'A modern avatar of Vishnu descends to Earth to protect the world in a dystopian future.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFT6oZ95TQv1rJjd3RcqiN11wERSmvRbT75u-ZFmmsDw&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/69sm3H0zQpXl7v6P9rD4VbVp5QY.jpg',
    rating: 8.1,
    genre: ['Action', 'Sci-Fi', 'Mythology'],
    duration: '181 min',
    language: 'Hindi / Telugu',
    releaseDate: '2024-06-27'
  },
  {
    _id: 'm4',
    title: 'Stree 2',
    description: 'After the events of Stree, the town of Chanderi faces the terror of headless Sarkata.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlavx0KTwQHV-E8AFPD5A8f14AOVevVowkNY-3I05Q7Q&s',
    backdropPath: 'https://image.tmdb.org/t/p/original/9B7D1E8Y2A3mX5rYtB3vXm2m7o4.jpg',
    rating: 7.9,
    genre: ['Comedy', 'Horror'],
    duration: '147 min',
    language: 'Hindi',
    releaseDate: '2024-08-15'
  },
  {
    _id: 'm5',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against conspirators.',
    posterPath: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
    rating: 8.5,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '166 min',
    language: 'English / Hindi',
    releaseDate: '2024-03-01'
  },
  {
    _id: 'm6',
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson teams up with Wolverine to protect their timeline.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/yDHYTjA3R0jFYba16jBB12mvgId.jpg',
    rating: 8.0,
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: '128 min',
    language: 'English / Hindi',
    releaseDate: '2024-07-26'
  },
  {
    _id: 'm7',
    title: 'The Dark Knight',
    description: 'Batman faces off against his ultimate psychological nemesis, the Joker.',
    posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    rating: 9.0,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    duration: '152 min',
    language: 'English / Hindi',
    releaseDate: '2008-07-18'
  },
  {
    _id: 'm8',
    title: 'Jawan',
    description: 'A man driven by a personal vendetta sets out to right the wrongs in society.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwVY_8ccJBZZ7fmKyfLCuCYTdJiZwKCcjwDj7vH77fpA&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/35X8G2gVfF5z6sX9R8qK7L2M4nL.jpg',
    rating: 7.8,
    genre: ['Action', 'Thriller'],
    duration: '169 min',
    language: 'Hindi',
    releaseDate: '2023-09-07'
  },
  {
    _id: 'm9',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully and Neytiri fight to protect their family against returning human threats.',
    posterPath: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZIMQvRjr22q.jpg',
    rating: 7.6,
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    duration: '192 min',
    language: 'English / Hindi',
    releaseDate: '2022-12-16'
  },
  {
    _id: 'm10',
    title: 'Animal',
    description: 'A fierce underworld drama depicting the toxic and obsessive relationship between a son and father.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS82lQF9lHnTFqfmjWWsPA_rIV54gn1cT5a1iT1wDwAvQ&s',
    backdropPath: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    rating: 7.2,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    duration: '201 min',
    language: 'Hindi',
    releaseDate: '2023-12-01'
  },
  {
    _id: 'm11',
    title: 'Inception',
    description: 'A thief enters dreams to steal secrets and is hired to plant an idea into a mind.',
    posterPath: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    rating: 8.8,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: '148 min',
    language: 'English / Hindi',
    releaseDate: '2010-07-16'
  },
  {
    _id: 'm12',
    title: 'Hanuman Ansh',
    description: 'An ancient spiritual awakening unleashes divine protection against emerging dark forces.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMBB7tvdT2-FgK-c9IPwW6BiVyhjJyK01oAXkzWTH1Jw&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    rating: 7.5,
    genre: ['Religious', 'Thriller', 'Exciting'],
    duration: '166 min',
    language: 'Hindi',
    releaseDate: '2024-01-12'
  },
  {
    _id: 'm13',
    title: 'Gladiator II',
    description: 'Years after Maximus, Lucius enters the Colosseum fighting for the honor of Rome.',
    posterPath: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/euYIWhG2n9hgM8sn0qaUrnEZ7nN.jpg',
    rating: 7.9,
    genre: ['Action', 'Adventure', 'Drama'],
    duration: '148 min',
    language: 'English / Hindi',
    releaseDate: '2024-11-22'
  },
  {
    _id: 'm14',
    title: 'Avengers: DoomsDay',
    description: 'Earth mightiest heroes face an unprecedented cosmic collapse masterminded by Doctor Doom.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYaT6IHyHfx89hyFLymUyZRrgbvUOur2LlhsPLN7IxjA&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 8.6,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '140 min',
    language: 'English / Hindi',
    releaseDate: '2026-05-01'
  },
  {
    _id: 'm15',
    title: 'Bhool Bhulaiyaa 3',
    description: 'Rooh Baba returns to venture into a haunted estate in West Bengal to face vengeful spirits.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1SLsQFbhO1cTX_Taczxzuv8lmpUUzGOlI1PRPyt8AmQ&s',
    backdropPath: 'https://image.tmdb.org/t/p/original/9B7D1E8Y2A3mX5rYtB3vXm2m7o4.jpg',
    rating: 7.3,
    genre: ['Comedy', 'Horror'],
    duration: '158 min',
    language: 'Hindi',
    releaseDate: '2024-11-01'
  },
  {
    _id: 'm16',
    title: 'Avengers: Endgame',
    description: 'The Avengers assemble once more to reverse the catastrophic devastation caused by Thanos.',
    posterPath: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zJW8QxW5ZgV2n.jpg',
    rating: 8.4,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '181 min',
    language: 'English / Hindi',
    releaseDate: '2019-04-26'
  },
  {
    _id: 'm17',
    title: 'Singham Again',
    description: 'Bajirao Singham joins forces with his squad of brave officers for a perilous rescue mission.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe5lDzPt67FHHSgHb05AovQa50TcuPbg4FgoH_htJURw&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 7.1,
    genre: ['Action', 'Drama', 'Thriller'],
    duration: '144 min',
    language: 'Hindi',
    releaseDate: '2024-11-01'
  },
  {
    _id: 'm18',
    title: 'The Batman',
    description: 'Batman ventures into Gotham underworld when a killer targets the city elite.',
    posterPath: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    rating: 7.8,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    duration: '176 min',
    language: 'English / Hindi',
    releaseDate: '2022-03-04'
  },
  {
    _id: 'm19',
    title: 'Drishyam : The Conclusion',
    description: 'The final showdown of intellect and survival as Vijay Salgaonkar shields his family one last time.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4bIrAbs-gY6aco_k3MptkkbFOh3t7fcBbIa_6jeHL-A&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/euYIWhG2n9hgM8sn0qaUrnEZ7nN.jpg',
    rating: 8.2,
    genre: ['Crime', 'Drama', 'Thriller'],
    duration: '142 min',
    language: 'Hindi',
    releaseDate: '2022-11-18'
  },
  {
    _id: 'm20',
    title: 'Shaitaan',
    description: 'A family weekend getaway turns into a nightmare when they let a mysterious stranger into their home.',
    posterPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSf1K_7UUojbAx2cja5YSye2dIhCFPxqQjM2KjvqV0sA&s=10',
    backdropPath: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    rating: 7.4,
    genre: ['Horror', 'Thriller'],
    duration: '132 min',
    language: 'Hindi',
    releaseDate: '2024-03-08'
  }
];

// Helper: Showtimes generator for every movie
const buildMovieShowtimes = (movieId) => {
  return [
    { _id: `${movieId}_s1`, time: '10:30 AM', screen: 'Audi 1 (IMAX)', price: 350, format: 'IMAX 2D' },
    { _id: `${movieId}_s2`, time: '01:45 PM', screen: 'Audi 2 (Dolby Atmos)', price: 350, format: '4K Dolby' },
    { _id: `${movieId}_s3`, time: '05:15 PM', screen: 'Audi 1 (IMAX)', price: 350, format: 'IMAX 2D' },
    { _id: `${movieId}_s4`, time: '08:45 PM', screen: 'Audi 3 (Gold Lounge)', price: 450, format: 'Recliner' },
    { _id: `${movieId}_s5`, time: '11:15 PM', screen: 'Audi 2 (Dolby Atmos)', price: 350, format: 'Night Show' }
  ];
};

/**
 * @desc    Get all movies: MongoDB Added Movies (at the top) + Static Blockbusters
 * @route   GET /api/movies
 */
const getAllMovies = async (req, res) => {
  try {
    let dbMovies = [];
    try {
      dbMovies = await Movie.find({}).sort({ createdAt: -1 });
    } catch (dbErr) {
      dbMovies = [];
    }

    // Normalize MongoDB fields to match frontend Home.jsx structure
    const formattedDbMovies = dbMovies.map((doc) => {
      const m = doc.toObject ? doc.toObject() : doc;
      return {
        ...m,
        _id: m._id.toString(),
        isCustomDb: true,
        description: m.overview || m.description || 'Now screening at Cineplex Airia Mall.',
        genre: Array.isArray(m.genres) && m.genres.length > 0 ? m.genres : (m.genre || ['Action', 'Thriller']),
        duration: m.runtime ? `${m.runtime} min` : (m.duration || '150 min')
      };
    });

    const combinedMovies = [...formattedDbMovies, ...MOVIES_20_CATALOG];

    return res.status(200).json({
      success: true,
      count: combinedMovies.length,
      data: combinedMovies
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: MOVIES_20_CATALOG.length,
      data: MOVIES_20_CATALOG
    });
  }
};

/**
 * @route   GET /api/movies/:id
 * @desc    Fetch Movie Details with Showtimes by ID (Supports MongoDB ObjectId & static m1-m20)
 */
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    let movie = null;

    // 1. Check MongoDB first if id is a valid 24-character ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const dbDoc = await Movie.findById(id).catch(() => null);
      if (dbDoc) {
        const m = dbDoc.toObject();
        movie = {
          ...m,
          _id: m._id.toString(),
          isCustomDb: true,
          description: m.overview || 'Now screening at Cineplex Airia Mall.',
          genre: Array.isArray(m.genres) && m.genres.length > 0 ? m.genres : ['Action', 'Thriller'],
          duration: m.runtime ? `${m.runtime} min` : '150 min'
        };
      }
    }

    // 2. Fallback to static catalog
    if (!movie) {
      movie = MOVIES_20_CATALOG.find((m) => m._id === id) || MOVIES_20_CATALOG[0];
    }

    const showtimes = movie.showtimes && movie.showtimes.length > 0
      ? movie.showtimes
      : buildMovieShowtimes(movie._id);

    return res.status(200).json({
      success: true,
      data: {
        ...movie,
        showtimes
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById
};