import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, X } from 'lucide-react';

const BookTicket = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Dynamic Movie Information from URL query params
  const searchParams = new URLSearchParams(location.search);
  const selectedShowDate = searchParams.get('date') || new Date().toISOString();
  const movieTitle = searchParams.get('title') || 'Oppenheimer';
  const showTime = searchParams.get('time') || '07:30 PM';
  const screenName = searchParams.get('screen') || 'Audi 1 (IMAX)';

  // Logged-in profile name
  const customerName = user?.name || user?.fullName || user?.username || (user?.email ? user.email.split('@')[0] : 'mehul');

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const seatPrice = 350;

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Kripya kam se kam ek seat select karein.');
      return;
    }
    setError('');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    setPaymentProcessing(true);
    setError('');

    const randomPnr = 'CPX-' + Math.floor(10000 + Math.random() * 90000);
    const total = selectedSeats.length * seatPrice;

    const ticketPayload = {
      _id: 'CPX-' + Date.now(),
      pnr: randomPnr,
      customerName: customerName,
      customerEmail: user?.email || '',
      userId: user?._id || null,
      showtimeId: showtimeId || 'slot_1',
      movieTitle: movieTitle,
      showDate: selectedShowDate,
      showTime: showTime,
      screen: screenName,
      seatIds: selectedSeats,
      seats: selectedSeats,
      totalAmount: total,
      grandTotal: total,
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Strict User-Specific Storage Key
    const userStorageKey = `my_cineplex_tickets_${user?.email || user?._id || 'guest'}`;

    try {
      const res = await API.post('/bookings', ticketPayload);
      const finalData = res.data?.data || ticketPayload;
      setConfirmedBooking(finalData);

      // Save sirf is specific user ki local key mein
      const stored = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      localStorage.setItem(userStorageKey, JSON.stringify([finalData, ...stored]));

      setShowPaymentModal(false);
    } catch (err) {
      // Fallback
      setConfirmedBooking(ticketPayload);
      const stored = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      localStorage.setItem(userStorageKey, JSON.stringify([ticketPayload, ...stored]));
      setShowPaymentModal(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2.5rem 1.5rem', color: '#F8FAFC' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Movie
      </button>

      {/* CONFIRMED TICKET RECEIPT */}
      {confirmedBooking ? (
        <div style={{
          backgroundColor: '#131A29',
          border: '1px solid #E5A93C',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '520px',
          margin: '2rem auto',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <CheckCircle2 size={56} color="#22C55E" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#E5A93C', fontSize: '1.8rem', marginBottom: '0.4rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Airia Mall Cineplex • {screenName}</p>

          <div style={{ backgroundColor: '#07090E', padding: '1.2rem', borderRadius: '10px', textAlign: 'left', marginBottom: '1.5rem', border: '1px dashed #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>Movie:</span>
              <span style={{ fontWeight: 800, color: '#F8FAFC' }}>{confirmedBooking.movieTitle || movieTitle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>Booked For:</span>
              <span style={{ fontWeight: 700, color: '#E5A93C' }}>{confirmedBooking.customerName || customerName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>Show Date:</span>
              <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                {new Date(confirmedBooking.showDate || selectedShowDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>Show Time:</span>
              <span style={{ fontWeight: 700, color: '#E5A93C' }}>{showTime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>PNR / ID:</span>
              <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{confirmedBooking.pnr || confirmedBooking._id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#64748B' }}>Seats:</span>
              <span style={{ fontWeight: 700, color: '#E5A93C' }}>{selectedSeats.join(', ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Total Paid:</span>
              <span style={{ fontWeight: 700, color: '#22C55E' }}>₹{selectedSeats.length * seatPrice}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ backgroundColor: '#E5A93C', color: '#07090E', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              View in Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ backgroundColor: 'transparent', color: '#94A3B8', border: '1px solid #334155', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 className="cinematic-title" style={{ color: '#E5A93C', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              SELECT YOUR SEATS
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              {movieTitle} • {screenName} ({showTime})
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', justifyContent: 'center' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Screen Curve */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              width: '70%',
              height: '6px',
              backgroundColor: '#E5A93C',
              borderRadius: '50%',
              boxShadow: '0 4px 20px rgba(229, 169, 60, 0.8)',
              marginBottom: '0.8rem'
            }} />
            <span style={{ color: '#64748B', fontSize: '0.75rem', letterSpacing: '4px' }}>SCREEN THIS WAY</span>
          </div>

          {/* Seats Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'center', marginBottom: '3rem' }}>
            {rows.map((row) => (
              <div key={row} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <span style={{ color: '#64748B', width: '22px', fontWeight: 700, fontSize: '0.9rem' }}>{row}</span>
                {cols.map((col) => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      type="button"
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      style={{
                        width: '38px',
                        height: '38px',
                        backgroundColor: isSelected ? '#E5A93C' : '#131A29',
                        color: isSelected ? '#07090E' : '#94A3B8',
                        border: isSelected ? '1px solid #E5A93C' : '1px solid #334155',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Checkout Bar */}
          <div style={{
            backgroundColor: '#131A29',
            border: '1px solid rgba(229, 169, 60, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.2rem'
          }}>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Selected Seats</div>
              <div style={{ color: '#F8FAFC', fontSize: '1.2rem', fontWeight: 700 }}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Koi seat select nahi ki'}
              </div>
            </div>

            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Total Amount</div>
              <div style={{ color: '#E5A93C', fontSize: '1.5rem', fontWeight: 800 }}>
                ₹{selectedSeats.length * seatPrice}
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              style={{
                backgroundColor: '#E5A93C',
                color: '#07090E',
                padding: '0.85rem 2.2rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                opacity: selectedSeats.length === 0 ? 0.5 : 1,
                cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Proceed to Pay & Scan QR
            </button>
          </div>
        </>
      )}

      {/* QR MODAL */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#131A29',
            border: '1px solid #E5A93C',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <h3 style={{ color: '#F8FAFC', fontSize: '1.4rem', marginBottom: '0.3rem' }}>Scan to Pay with UPI</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.2rem' }}>Airia Mall Cineplex Counter</p>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '1rem',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=cineplexairia@upi&pn=CineplexCinemas&am=${selectedSeats.length * seatPrice}&cu=INR`}
                alt="UPI Scanner"
                style={{ width: '180px', height: '180px', display: 'block' }}
              />
            </div>

            <div style={{ color: '#E5A93C', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              ₹{selectedSeats.length * seatPrice}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#22C55E', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              <ShieldCheck size={16} /> 256-Bit Encrypted Secure Demo Gateway
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={paymentProcessing}
              style={{
                width: '100%',
                backgroundColor: '#E5A93C',
                color: '#07090E',
                padding: '0.85rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                cursor: paymentProcessing ? 'not-allowed' : 'pointer'
              }}
            >
              {paymentProcessing ? 'Verifying Transaction...' : 'I Have Paid (Confirm Ticket)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTicket;