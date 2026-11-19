import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Film, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Direct API call to backend register endpoint
      const res = await API.post('/auth/register', formData);

      if (res.data?.success) {
        const token = res.data.token || res.data.data?.token;
        const apiUser = res.data.user || res.data.data?.user || res.data.data;

        const userData = {
          _id: apiUser?._id || 'user_' + Date.now(),
          name: formData.name || apiUser?.name || 'Customer',
          email: formData.email,
          role: apiUser?.role || 'customer'
        };

        // AuthContext ka login call karo
        if (login) {
          login(userData, token);
        }

        // Home page par bhej do
        navigate('/');
      } else {
        setError(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err.response || err);
      const msg = err.response?.data?.message || 'Registration fail ho gaya. Kripya details check karein.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3.5rem auto', padding: '2rem', backgroundColor: '#131A29', border: '1px solid rgba(229, 169, 60, 0.3)', borderRadius: '16px', color: '#F8FAFC' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Film size={36} color="#E5A93C" style={{ margin: '0 auto 0.5rem' }} />
        <h2 className="cinematic-title" style={{ fontSize: '1.9rem', color: '#E5A93C', marginBottom: '0.3rem' }}>
          CREATE ACCOUNT
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Book exclusive recliner seats at Airia Mall</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Mehul Sharma"
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 0.75rem 0.75rem 2.5rem', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 0.75rem 0.75rem 2.5rem', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#07090E', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 0.75rem 0.75rem 2.5rem', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', backgroundColor: '#E5A93C', color: '#07090E', padding: '0.85rem', borderRadius: '8px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
        >
          {loading ? 'Creating Account...' : <><span>Register</span> <ArrowRight size={18} /></>}
        </button>
      </form>

      <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#E5A93C', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
      </p>
    </div>
  );
};

export default Register;