import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingNavbar = ({ studentsOnline }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Visualizations', to: '/visualizations' },
    { label: 'Notes', to: '/notes' },
    { label: 'RTU PYQ Analysis', to: '/rtu-exams' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(242,237,228,0.9)' : '#F2EDE4',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #E8E4DC' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 0 rgba(232,228,220,0.8), 0 4px 20px rgba(242,237,228,0.6)' : 'none',
      transition: 'all 300ms ease',
      padding: '0 32px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: '#1A1A2E' }}>
            MEDHA
          </span>
          <span className="logo-dot" style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: '#F59E0B', marginBottom: 2, marginLeft: 2, verticalAlign: 'middle'
          }} />
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} style={{
              fontSize: 15, fontWeight: 400, color: '#1A1A2E',
              textDecoration: 'none', transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#7DC67A'}
            onMouseLeave={e => e.currentTarget.style.color = '#1A1A2E'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Live Pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'white', border: '1px solid #E8E4DC',
            borderRadius: 999, padding: '6px 12px',
          }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A2E' }}>
              <span style={{ fontWeight: 700 }}>{studentsOnline}</span> studying right now
            </span>
          </div>

          {/* Login */}
          <Link to="/login" style={{
            fontSize: 15, fontWeight: 400, color: '#1A1A2E',
            textDecoration: 'none', transition: 'color 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#7DC67A'}
          onMouseLeave={e => e.currentTarget.style.color = '#1A1A2E'}
          >
            Login
          </Link>

          {/* Join Premium */}
          <Link to="/register" className="btn-shine" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#1A1A2E', color: 'white',
            borderRadius: 999, padding: '10px 20px',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: 'transform 150ms',
          }}>
            <span>👑</span> Join Premium
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
