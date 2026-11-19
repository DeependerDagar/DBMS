import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'mehul');
  // Logged-in user ki isolated storage key
  const userStorageKey = `my_cineplex_tickets_${user?.email || user?._id || 'guest'}`;

  useEffect(() => {
    const fetchOnlyMyBookings = async () => {
      try {
        setLoading(true);

        // 1. Sirf is active user ki local tickets lo
        const myLocalTickets = JSON.parse(localStorage.getItem(userStorageKey) || '[]');

        try {
          // 2. Server API call with strict user context query params
          const res = await API.get(
            `/bookings/my?userId=${user?._id || ''}&email=${encodeURIComponent(user?.email || '')}`
          );

          if (res.data?.success && Array.isArray(res.data.data)) {
            // Strict Client-Side Filter: Kisi aur ki ticket aane hi na paaye
            const strictlyMine = res.data.data.filter((b) => {
              const matchesUser = user?._id && b.user && String(b.user) === String(user._id);
              const matchesEmail = user?.email && b.customerEmail && b.customerEmail.toLowerCase() === user.email.toLowerCase();
              const matchesName = user?.name && b.customerName && b.customerName.toLowerCase() === user.name.toLowerCase();
              return matchesUser || matchesEmail || matchesName;
            });

            // Combine backend + local
            const combined = [...strictlyMine];
            myLocalTickets.forEach((lt) => {
              if (!combined.some((b) => b.pnr === lt.pnr || b._id === lt._id)) {
                combined.push(lt);
              }
            });

            setBookings(combined);
            return;
          }
        } catch (apiErr) {
          console.warn('Backend fetch failed, using local user storage:', apiErr);
        }

        setBookings(myLocalTickets);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlyMyBookings();
  }, [user]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem', color: '#F8FAFC' }}>
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Movies
      </button>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="cinematic-title" style={{ color: '#E5A93C', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          MY BOOKINGS
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Welcome, <span style={{ color: '#E5A93C', fontWeight: 700 }}>{profileName}</span> • Only your confirmed tickets are displayed
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#E5A93C' }}>Loading your tickets...</div>
      ) : bookings.length === 0 ? (
        <div style={{
          backgroundColor: '#131A29',
          border: '1px solid rgba(229, 169, 60, 0.2)',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Ticket size={48} color="#64748B" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No bookings found</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Aapne abhi tak apne account se koi ticket book nahi ki hai.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#E5A93C', color: '#07090E', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {bookings.map((b) => {
            const ticketCustomer = b.customerName || (b.user && b.user.name) || profileName;

            return (
              <div
                key={b._id || b.pnr}
                style={{
                  backgroundColor: '#131A29',
                  border: '1px solid rgba(229, 169, 60, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #22C55E' }}>
                      {b.bookingStatus?.toUpperCase() || 'CONFIRMED'}
                    </span>
                    <span style={{ color: '#E5A93C', fontWeight: 800, fontSize: '0.85rem' }}>
                      {b.pnr}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.6rem' }}>
                    {b.movieTitle || 'Movie Ticket'}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <MapPin size={15} color="#E5A93C" />
                    <span>{b.screen || 'Audi 1 (IMAX)'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <Calendar size={15} color="#E5A93C" />
                    <span>
                      {new Date(b.showDate || b.date || b.createdAt || Date.now()).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#07090E', padding: '0.9rem', borderRadius: '8px', border: '1px dashed #334155', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#64748B' }}>Booked For:</span>
                      <span style={{ color: '#E5A93C', fontWeight: 700 }}>
                        {ticketCustomer}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#64748B' }}>Seats:</span>
                      <span style={{ color: '#F8FAFC', fontWeight: 700 }}>
                        {Array.isArray(b.seats) ? b.seats.map(s => s.seatId || s).join(', ') : 'N/A'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748B' }}>Amount Paid:</span>
                      <span style={{ color: '#22C55E', fontWeight: 700 }}>₹{b.grandTotal || b.totalAmount || 350}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PNR:${b.pnr}`}
                    alt="Ticket QR"
                    style={{ width: '100px', height: '100px', borderRadius: '8px', margin: '0 auto', display: 'block', backgroundColor: '#fff', padding: '4px' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '0.4rem' }}>Scan at Theater Gate</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;