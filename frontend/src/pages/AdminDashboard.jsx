import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Trash2, PlusCircle, Users, Shield, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [newMovie, setNewMovie] = useState({
    title: '',
    posterPath: '',
    time: '08:00 PM',
    duration: '150 min',
    screen: 'Audi 1 (IMAX)',
    price: 350,
    genre: 'Action, Thriller'
  });

  const fetchData = async () => {
    try {
      const [moviesRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/movies').then((r) => r.json()),
        fetch('http://localhost:5000/api/admin/users').then((r) => r.json()).catch(() => ({ data: [] }))
      ]);

      if (moviesRes?.data) setMovies(moviesRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.title.trim() || !newMovie.posterPath.trim()) {
      setStatusMsg({ type: 'error', text: 'Movie title and poster image URL are required.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMsg({
          type: 'success',
          text: data.message || `Movie "${newMovie.title}" is successfully added to the database!`
        });
        setNewMovie({
          title: '',
          posterPath: '',
          time: '08:00 PM',
          duration: '150 min',
          screen: 'Audi 1 (IMAX)',
          price: 350,
          genre: 'Action, Thriller'
        });
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to add movie.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server connection error while adding movie.' });
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from the database and frontend?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/movies/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMsg({
          type: 'success',
          text: data.message || `Movie "${title}" has been permanently deleted from database and frontend!`
        });
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Unable to delete this movie.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server error while deleting movie.' });
    }
  };

  const handleRoleToggle = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const response = await fetch('http://localhost:5000/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUser._id,
          newRole: nextRole
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        fetchData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to update user role.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server error while updating user role.' });
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '2.5rem 1.5rem', color: '#F8FAFC' }}>
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Movies
      </button>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#E5A93C', fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            ADMIN CONTROL PANEL
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Active Profile: <span style={{ color: '#E5A93C', fontWeight: 700 }}>{user?.name || 'Administrator'}</span> ({user?.role?.toUpperCase() || 'ADMIN'})
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('movies')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'movies' ? '#E5A93C' : '#131A29',
              color: activeTab === 'movies' ? '#07090E' : '#94A3B8',
              border: '1px solid #334155',
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Film size={18} /> Add & Manage Movies
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'users' ? '#E5A93C' : '#131A29',
              color: activeTab === 'users' ? '#07090E' : '#94A3B8',
              border: '1px solid #334155',
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Users size={18} /> Manage Users & Admins
          </button>
        </div>
      </div>

      {/* STATUS MESSAGE BANNER */}
      {statusMsg.text && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: statusMsg.type === 'success' ? '1px solid #22C55E' : '1px solid #EF4444',
          color: statusMsg.type === 'success' ? '#22C55E' : '#FCA5A5',
          padding: '0.85rem 1.2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontWeight: 600
        }}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* --- TAB 1: ADD & REMOVE MOVIES --- */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ backgroundColor: '#131A29', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(229, 169, 60, 0.3)', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#E5A93C', fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <PlusCircle size={20} /> Add New Movie (Stores Permanently in Database)
            </h3>

            <form onSubmit={handleAddMovie} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Movie Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pushpa 2: The Rule"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Poster Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newMovie.posterPath}
                  onChange={(e) => setNewMovie({ ...newMovie, posterPath: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Show Time</label>
                <input
                  type="text"
                  placeholder="e.g. 08:30 PM"
                  value={newMovie.time}
                  onChange={(e) => setNewMovie({ ...newMovie, time: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem' }}>Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 150 min"
                  value={newMovie.duration}
                  onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{ backgroundColor: '#E5A93C', color: '#07090E', padding: '0.8rem 2.2rem', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Save Movie to Database
                </button>
              </div>
            </form>
          </div>

          <h3 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '1.2rem', fontWeight: 800 }}>
            Live Movies on Platform ({movies.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
            {movies.map((m) => {
              const idStr = String(m._id || '');
              const isDatabaseMovie = m.isCustomDb || idStr.length === 24;

              return (
                <div
                  key={idStr}
                  style={{
                    backgroundColor: '#131A29',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    overflow: 'hidden',
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.9rem',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={m.posterPath}
                    alt={m.title}
                    style={{ width: '65px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.6rem' }}>
                      {m.duration} • {Array.isArray(m.genre) ? m.genre[0] : 'Feature'}
                    </div>

                    {isDatabaseMovie ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteMovie(idStr, m.title)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid #EF4444', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Trash2 size={13} /> Delete Movie
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#64748B', backgroundColor: '#07090E', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        Default Catalog
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: USER & ADMIN ROLE CONTROL --- */}
      {activeTab === 'users' && (
        <div style={{ backgroundColor: '#131A29', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#E5A93C', fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <Shield size={20} /> Multi-User Profile & Role Management
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            View all registered accounts and promote any user to <strong>Admin</strong> or revert them back to standard <strong>User</strong> privileges.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#64748B' }}>
                  <th style={{ padding: '0.8rem' }}>NAME</th>
                  <th style={{ padding: '0.8rem' }}>EMAIL</th>
                  <th style={{ padding: '0.8rem' }}>CURRENT ROLE</th>
                  <th style={{ padding: '0.8rem', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                      No registered users found in the database.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '0.8rem', color: '#94A3B8' }}>{u.email}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: u.role === 'admin' ? 'rgba(229, 169, 60, 0.2)' : '#07090E',
                          color: u.role === 'admin' ? '#E5A93C' : '#94A3B8',
                          border: u.role === 'admin' ? '1px solid #E5A93C' : '1px solid #334155'
                        }}>
                          {u.role?.toUpperCase() || 'USER'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                        {u.role === 'admin' ? (
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u)}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid #EF4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Demote to User
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u)}
                            style={{ backgroundColor: '#E5A93C', color: '#07090E', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;