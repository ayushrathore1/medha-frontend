import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const LandingNavbar = ({ studentsOnline }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Search', href: '#search-demo' },
    { label: 'Community', href: '#community' },
    { label: 'Exams', href: '#subjects' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={scrolled ? 'md-nav md-nav-scrolled' : 'md-nav'}>
      <nav className="md-nav-inner" aria-label="Main navigation">
        <Link className="md-brand" to="/" aria-label="MEDHA home" onClick={closeMenu}>
          <span className="md-brand-mark">m<span>.</span></span>
          <span className="md-brand-word">MEDHA</span>
        </Link>

        <div className="md-nav-links">
          {navLinks.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}
        </div>

        <div className="md-nav-actions">
          {typeof studentsOnline === 'number' && studentsOnline > 0 && (
            <span className="md-online"><i />{studentsOnline.toLocaleString('en-IN')} online</span>
          )}
          <Link className="md-nav-login" to="/login">Log in</Link>
          <Link className="md-nav-cta" to="/register">Start free <ArrowUpRight size={15} /></Link>
        </div>

        <button
          className="md-mobile-menu"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(value => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div className={menuOpen ? 'md-mobile-panel md-mobile-panel-open' : 'md-mobile-panel'} aria-hidden={!menuOpen}>
        {navLinks.map(link => (
          <a key={link.label} href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
        <Link to="/login" onClick={closeMenu}>Log in</Link>
        <Link className="md-mobile-cta" to="/register" onClick={closeMenu}>Start free <ArrowUpRight size={16} /></Link>
      </div>
    </header>
  );
};

export default LandingNavbar;
