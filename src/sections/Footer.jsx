import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="md-footer">
      <div className="md-footer-shell">
        <div className="md-footer-main">
          <div className="md-footer-brand-block">
            <Link className="md-brand md-footer-brand" to="/" aria-label="MEDHA home">
              <span className="md-brand-mark">m<span>.</span></span>
              <span className="md-brand-word">MEDHA</span>
            </Link>
            <p>Made for the messy, late-night, figure-it-out phase of engineering.</p>
            <a className="md-footer-github" href="https://github.com/ayushrathore1/medha-frontend" target="_blank" rel="noreferrer">
              <BookOpen size={15} /> Explore the code <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="md-footer-column">
            <span>EXPLORE</span>
            <a href="#features">Features</a>
            <a href="#search-demo">Search demo</a>
            <a href="#subjects">Subjects</a>
            <a href="#community">Community</a>
          </div>

          <div className="md-footer-column">
            <span>YOUR MEDHA</span>
            <Link to="/search">Search topics</Link>
            <Link to="/rtu-exams">RTU exam resources</Link>
            <Link to="/register">Create account</Link>
            <Link to="/login">Log in</Link>
          </div>
        </div>

        <div className="md-footer-bottom">
          <span>© {new Date().getFullYear()} MEDHA. Crafted for students, by students.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
