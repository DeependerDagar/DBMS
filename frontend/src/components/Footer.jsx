import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#07090E',
      borderTop: '1px solid rgba(229, 169, 60, 0.1)',
      padding: '2.5rem 2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <h3 className="cinematic-title" style={{ color: '#E5A93C', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
        CINEPLEX AIRIA MALL
      </h3>
      <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Sector 68, Sohna Road, Gurugram, Haryana • Premium 4K Laser Projection & Dolby Atmos
      </p>
      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>
        © 2026 Cineplex Cinema Systems. Capstone Project Architecture.
      </div>
    </footer>
  );
};

export default Footer;