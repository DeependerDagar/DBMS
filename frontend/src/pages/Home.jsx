import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Search } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchLiveMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://cineplex-backend-ohfi.onrender.com/api'}/movies`);
        const result = await response.json();
        const fetchedList = result?.data || [];

        if (Array.isArray(fetchedList)) {
          const normalized = fetchedList.map((m) => ({
            ...m,
            genre: Array.isArray(m.genre)
              ? m.genre
              : Array.isArray(m.genres) && m.genres.length > 0
              ? m.genres
              : ['Action'],
            duration: m.duration || (m.runtime ? `${m.runtime} min` : '150 min'),
            posterPath: m.posterPath || 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
          }));
          setMovies(normalized);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Comedy', 'Drama', 'Horror', 'Thriller'];

  const filteredMovies = movies.filter((movie) => {
    const title = movie.title || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const movieGenres = Array.isArray(movie.genre) ? movie.genre : ['Feature'];
    const matchesGenre =
      selectedGenre === 'All' ||
      movieGenres.some((g) => g && g.toLowerCase() === selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <div style={{ backgroundColor: '#07090E', minHeight: '100vh', color: '#F8FAFC', paddingBottom: '4rem' }}>
      {/* HERO SECTION */}
      <div style={{
        position: 'relative',
        height: '380px',
        backgroundImage: `linear-gradient(to bottom, rgba(7, 9, 14, 0.4), #07090E), url('https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2.5rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <span style={{ backgroundColor: '#E5A93C', color: '#07090E', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Featured Cinema
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0.8rem 0' }}>
            EXPERIENCE CINEMA IN 4K
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
            Book premium recliners, Dolby Atmos 7.1 sound, and laser projection at Airia Mall Cineplex.
          </p>
        </div>
      </div>

      {/* FILTER & MOVIES CONTAINER */}
      <div style={{ maxWidth: '1240px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E5A93C' }}>
              NOW SHOWING ({filteredMovies.length} MOVIES)
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Select your movie to reserve seats</p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search movie title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#131A29',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Genre Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {genres.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setSelectedGenre(g)}
              style={{
                backgroundColor: selectedGenre === g ? '#E5A93C' : '#131A29',
                color: selectedGenre === g ? '#07090E' : '#94A3B8',
                border: selectedGenre === g ? '1px solid #E5A93C' : '1px solid #334155',
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* MOVIES GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#E5A93C', fontWeight: 700 }}>
            Loading movies from database...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No movies found matching your filter.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredMovies.map((m) => {
              const displayGenre = Array.isArray(m.genre) && m.genre.length > 0 ? m.genre[0] : 'Feature';

              return (
                <div
                  key={m._id}
                  style={{
                    backgroundColor: '#131A29',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(229, 169, 60, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/movie/${m._id}`)}
                >
                  <div style={{ position: 'relative', width: '100%', height: '310px', backgroundColor: '#0A0F1D' }}>
                    <img
                      src={m.posterPath}
                      alt={m.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(7, 9, 14, 0.85)',
                      border: '1px solid #E5A93C',
                      color: '#E5A93C',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Star size={13} fill="#E5A93C" />
                      <span>{m.rating || 8.0}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={12} /> {m.duration}
                        </span>
                        <span>•</span>
                        <span>{displayGenre}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${m._id}`);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: '#E5A93C',
                        color: '#07090E',
                        border: 'none',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Ticket size={15} /> Book Tickets
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;