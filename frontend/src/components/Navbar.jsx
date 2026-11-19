import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Ticket, ChevronDown, LogOut, LogIn, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = user?.name || user?.fullName || user?.username || (user?.email ? user.email.split('@')[0] : 'jeetu Dagar');

  const handleLogout = () => {
    if (logout) logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#0D121F',
      borderBottom: '1px solid rgba(229, 169, 60, 0.25)',
      padding: '0.9rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: '#E5A93C',
            color: '#07090E',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Film size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '1px' }}>
              CINE<span style={{ color: '#E5A93C' }}>PLEX</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block', marginTop: '-3px', letterSpacing: '1.5px' }}>
              AIRIA MALL
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* PERMANENT ADMIN PANEL BUTTON (No Hiding Condition) */}
          <Link
            to="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#E5A93C',
              color: '#07090E',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(229, 169, 60, 0.3)'
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin Panel</span>
          </Link>

          {/* My Bookings Link */}
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#CBD5E1',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#131A29'
            }}
          >
            <Ticket size={16} color="#E5A93C" />
            <span>My Bookings</span>
          </Link>

          {/* User Profile Pill & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(229, 169, 60, 0.12)',
                border: '1px solid #E5A93C',
                padding: '0.45rem 0.9rem',
                borderRadius: '24px',
                color: '#F8FAFC',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#E5A93C',
                color: '#07090E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span>{displayName}</span>
              <ChevronDown size={14} color="#E5A93C" />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                backgroundColor: '#131A29',
                border: '1px solid rgba(229, 169, 60, 0.3)',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                width: '180px',
                padding: '0.5rem 0',
                zIndex: 2000
              }}>
                <Link
                  to="/admin"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.7rem 1.2rem',
                    color: '#E5A93C',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>Admin Panel</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.7rem 1.2rem',
                    color: '#F8FAFC',
                    textDecoration: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <Ticket size={15} color="#E5A93C" />
                  <span>View Tickets</span>
                </Link>

                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0.3rem 0' }} />

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    padding: '0.7rem 1.2rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;