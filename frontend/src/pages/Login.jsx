import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    const endpoint = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus({
          type: 'error',
          message: data.message || 'Authentication failed. Please check your credentials.'
        });
        setLoading(false);
        return;
      }

      // Save user and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (login) login(data.user, data.token);

      setStatus({
        type: 'success',
        message: data.message || (isRegister ? 'Account created successfully!' : 'You have logged in successfully!')
      });

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1200);
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Cannot connect to server. Please ensure the backend is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#07090E' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#131A29', padding: '2.2rem', borderRadius: '14px', border: '1px solid rgba(229, 169, 60, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#E5A93C', color: '#07090E', padding: '0.6rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
            <Film size={28} />
          </div>
          <h2 style={{ color: '#F8FAFC', fontSize: '1.6rem', fontWeight: 800 }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            {isRegister ? 'Sign up to book tickets at Cineplex Airia Mall' : 'Sign in to access your bookings and profile'}
          </p>
        </div>

        {/* Status Message Display */}
        {status.message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem',
            borderRadius: '8px',
            marginBottom: '1.3rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: status.type === 'success' ? '1px solid #22C55E' : '1px solid #EF4444',
            color: status.type === 'success' ? '#22C55E' : '#FCA5A5'
          }}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.8rem 0.7rem 2.4rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.8rem 0.7rem 2.4rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.8rem 0.7rem 2.4rem', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#E5A93C', color: '#07090E', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setStatus({ type: '', message: '' });
            }}
            style={{ background: 'none', border: 'none', color: '#E5A93C', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;