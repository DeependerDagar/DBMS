import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Star, Clock, Calendar, ArrowLeft, Ticket } from 'lucide-react';

// Exact same 20 movies as Home.jsx (Title, Posters, IDs & Genres synchronized)
const MOVIES_SYNC_CATALOG = [
  {
    _id: 'm1',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the Manhattan Project.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    rating: 8.9,
    genre: ['Biography', 'Drama', 'Thriller'],
    duration: '180 min',
    language: 'English / Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi / Telugu'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'English / Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'English / Hindi'
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
    language: 'Hindi'
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
    language: 'Hindi'
  }
];

const DEFAULT_SHOWTIMES = [
  { _id: 's1', time: '10:30 AM', screen: 'Audi 1 (IMAX)', price: 350, format: 'IMAX 2D' },
  { _id: 's2', time: '01:45 PM', screen: 'Audi 2 (Dolby Atmos)', price: 350, format: '4K Dolby' },
  { _id: 's3', time: '05:15 PM', screen: 'Audi 1 (IMAX)', price: 350, format: 'IMAX 2D' },
  { _id: 's4', time: '08:45 PM', screen: 'Audi 3 (Gold Lounge)', price: 450, format: 'Recliner' },
  { _id: 's5', time: '11:15 PM', screen: 'Audi 2 (Dolby Atmos)', price: 350, format: 'Night Show' }
];

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Instant match from synchronized catalog (Zero possibility of "Movie not found")
  const localMatch = MOVIES_SYNC_CATALOG.find((m) => m._id === id) || MOVIES_SYNC_CATALOG[0];

  const [movie, setMovie] = useState(localMatch);
  const [showtimes, setShowtimes] = useState(DEFAULT_SHOWTIMES);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Dynamic 5-day calendar starting today
  const dateTabs = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      fullIso: d.toISOString()
    };
  });

  useEffect(() => {
    // If ID changes, update local matching movie immediately
    const found = MOVIES_SYNC_CATALOG.find((m) => m._id === id);
    if (found) {
      setMovie(found);
    }

    const fetchMovieAsync = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        if (res.data?.success && res.data.data) {
          setMovie(res.data.data);
          if (Array.isArray(res.data.data.showtimes) && res.data.data.showtimes.length > 0) {
            setShowtimes(res.data.data.showtimes);
          }
        }
      } catch (err) {
        // Fallback already active, UI remains responsive
      }
    };

    fetchMovieAsync();
  }, [id]);

  const handleSelectShowtime = (slot) => {
    const chosenDateIso = dateTabs[selectedDateIndex].fullIso;
    const query = new URLSearchParams({
      date: chosenDateIso,
      title: movie.title,
      time: slot.time,
      screen: slot.screen
    }).toString();

    navigate(`/book/${slot._id}?${query}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090E', color: '#F8FAFC', paddingBottom: '4rem' }}>
      {/* BACKDROP BANNER */}
      <div style={{
        position: 'relative',
        height: '420px',
        backgroundImage: `linear-gradient(to bottom, rgba(7,9,14,0.3), #07090E), url('${movie.backdropPath || movie.posterPath}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 3rem 2rem'
      }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: '1.5rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#F8FAFC', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> All Movies
        </button>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <img
            src={movie.posterPath}
            alt={movie.title}
            style={{ width: '180px', height: '260px', borderRadius: '12px', border: '2px solid #E5A93C', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
          />
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              {movie.genre?.map((g) => (
                <span key={g} style={{ backgroundColor: 'rgba(229,169,60,0.2)', border: '1px solid #E5A93C', color: '#E5A93C', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {g}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.6rem' }}>{movie.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#E5A93C', fontWeight: 800 }}>
                <Star size={16} fill="#E5A93C" /> {movie.rating} / 10
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={16} /> {movie.duration}
              </span>
              <span>{movie.language || 'Hindi / English'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWTIMES & SLOTS */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        <h3 style={{ color: '#E5A93C', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 800 }}>
          SELECT DATE & AUDITORIUM
        </h3>

        {/* 5 Days Selection Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {dateTabs.map((dt, idx) => {
            const isSelected = selectedDateIndex === idx;
            return (
              <button
                type="button"
                key={dt.fullIso}
                onClick={() => setSelectedDateIndex(idx)}
                style={{
                  minWidth: '90px',
                  padding: '0.8rem 0.5rem',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#E5A93C' : '#131A29',
                  color: isSelected ? '#07090E' : '#F8FAFC',
                  border: isSelected ? '1px solid #E5A93C' : '1px solid #334155',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 800,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6 }}>{dt.day}</div>
                <div style={{ fontSize: '1.4rem' }}>{dt.date}</div>
                <div style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6 }}>{dt.month}</div>
              </button>
            );
          })}
        </div>

        {/* Showtimes Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {showtimes.map((slot) => (
            <div
              key={slot._id}
              style={{
                backgroundColor: '#131A29',
                border: '1px solid rgba(229,169,60,0.25)',
                borderRadius: '12px',
                padding: '1.2rem 1.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.3rem' }}>
                  {slot.screen}
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  {slot.format} • Airia Mall Cineplex
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#E5A93C', fontSize: '1.3rem', fontWeight: 800 }}>{slot.time}</div>
                  <div style={{ color: '#22C55E', fontSize: '0.8rem', fontWeight: 700 }}>₹{slot.price} / ticket</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectShowtime(slot)}
                  style={{
                    backgroundColor: '#E5A93C',
                    color: '#07090E',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Ticket size={16} /> Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;