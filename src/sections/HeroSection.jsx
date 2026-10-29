import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, BookOpen, Check, Command, FileText, Play, Search, Sparkles, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const examples = ['Binary Search Tree', 'Normalization', 'K-Map', 'Turing Machine'];

const HeroSection = ({ totalStudents }) => {
  const [query, setQuery] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [demoVisible, setDemoVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setExampleIndex(index => (index + 1) % examples.length);
      setDemoVisible(false);
      window.setTimeout(() => setDemoVisible(true), 180);
    }, 3600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const activeQuery = query.trim() || examples[exampleIndex];
  const search = event => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(activeQuery)}`);
  };

  return (
    <section className="md-hero" id="top" aria-labelledby="md-hero-title">
      <div className="md-hero-grid" aria-hidden="true" />
      <div className="md-hero-aurora md-aurora-one" aria-hidden="true" />
      <div className="md-hero-aurora md-aurora-two" aria-hidden="true" />
      <div className="md-hero-noise" aria-hidden="true" />
      <div className="md-hero-shell">
        <div className="md-hero-copy">
          <motion.div
            className="md-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="md-status-dot" />
            BUILT FOR ENGINEERING STUDENTS
            <span className="md-eyebrow-divider" />
            RTU · CSE · AIDS
          </motion.div>

          <motion.h1
            id="md-hero-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Stop hunting for notes.
            <span className="md-gradient-word">Start understanding.</span>
          </motion.h1>

          <motion.p
            className="md-hero-description"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            Search one topic. Find syllabus-mapped notes, curated videos, GFG guides
            and previous-year questions, together in one place.
          </motion.p>

          <motion.div
            className="md-hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <Link className="md-button md-button-primary" to="/register">
              Start learning free <ArrowRight size={17} />
            </Link>
            <a className="md-button md-button-quiet" href="#how-it-works">
              <Play size={15} fill="currentColor" /> See how it works
            </a>
          </motion.div>

          <motion.div
            className="md-hero-proof"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.65 }}
          >
            <div className="md-proof-avatars" aria-hidden="true">
              <span>DS</span><span>AK</span><span>RM</span><span>+</span>
            </div>
            <div>
              <div className="md-proof-line">
                {totalStudents ? <strong>{totalStudents.toLocaleString('en-IN')}+ students</strong> : <strong>Made for your syllabus</strong>}
                <span>·</span> Free to get started
              </div>
              <div className="md-proof-caption">Less tab-hopping. More actual learning.</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="md-hero-visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="md-orbit md-orbit-outer" aria-hidden="true" />
          <div className="md-orbit md-orbit-inner" aria-hidden="true" />
          <div className="md-prism-stage" aria-label="Abstract illustration of scattered topics becoming structured knowledge">
            <div className="md-prism-glow" aria-hidden="true" />
            <div className="md-prism">
              <div className="md-prism-face md-prism-face-front"><span>∑</span></div>
              <div className="md-prism-face md-prism-face-back"><span>λ</span></div>
              <div className="md-prism-face md-prism-face-left"><span>{'{ }'}</span></div>
              <div className="md-prism-face md-prism-face-right"><span>∴</span></div>
              <div className="md-prism-face md-prism-face-top"><span>π</span></div>
              <div className="md-prism-face md-prism-face-bottom"><span>∂</span></div>
            </div>
            <span className="md-floating-token md-token-dsa">DSA <i /></span>
            <span className="md-floating-token md-token-dbms">DBMS <i /></span>
            <span className="md-floating-token md-token-os">OS <i /></span>
            <span className="md-floating-token md-token-cn">TCP/IP <i /></span>
            <span className="md-floating-token md-token-math">K-MAP <i /></span>
            <span className="md-orbit-label md-label-chaos">SCATTERED TABS</span>
            <span className="md-orbit-label md-label-clarity">ONE CLEAR PATH</span>
          </div>
          <div className="md-hero-float-card md-float-card-top">
            <span className="md-float-icon md-green"><Check size={14} /></span>
            <span><strong>Mapped to your syllabus</strong><small>Semester · Subject · Unit</small></span>
          </div>
          <div className="md-hero-float-card md-float-card-bottom">
            <span className="md-float-icon md-violet"><Sparkles size={15} /></span>
            <span><strong>One topic. A full study path.</strong><small>Notes + videos + PYQs</small></span>
          </div>
          <div className="md-visual-caption"><span className="md-status-dot" /> FROM CHAOS TO CLARITY</div>
        </motion.div>
      </div>

      <motion.div
        className="md-search-demo-wrap"
        id="search-demo"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.42 }}
      >
        <div className="md-search-demo-head">
          <div>
            <span className="md-section-kicker">THE MEDHA SEARCH</span>
            <p>Try a real engineering topic.</p>
          </div>
          <span className="md-command-hint"><Command size={13} /> Topic → resources</span>
        </div>
        <form className="md-search-demo-form" onSubmit={search}>
          <Search size={19} aria-hidden="true" />
          <input
            aria-label="Search an engineering topic"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={examples[exampleIndex]}
          />
          <kbd>↵</kbd>
          <button className="md-search-submit" type="submit">Explore <ArrowRight size={15} /></button>
        </form>
        <div className="md-query-chips" aria-label="Example topics">
          <span>Try</span>
          {examples.map(example => (
            <button type="button" key={example} onClick={() => { setQuery(example); navigate(`/search?q=${encodeURIComponent(example)}`); }}>
              {example}
            </button>
          ))}
        </div>
        <div className="md-search-preview" aria-live="polite">
          <AnimatePresence mode="wait">
            {demoVisible && (
              <motion.div
                key={examples[exampleIndex]}
                className="md-preview-content"
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
              >
                <div className="md-preview-topic">
                  <span className="md-preview-topic-icon"><BookOpen size={16} /></span>
                  <span><strong>{examples[exampleIndex]}</strong><small>Suggested search · Engineering</small></span>
                </div>
                <div className="md-preview-counts">
                  <span><FileText size={15} /><b>Notes</b><small>structured</small></span>
                  <span><Youtube size={15} /><b>Videos</b><small>curated</small></span>
                  <span><BookOpen size={15} /><b>PYQs</b><small>past papers</small></span>
                </div>
                <Link to={`/search?q=${encodeURIComponent(examples[exampleIndex])}`} className="md-preview-open">Open search <ArrowRight size={14} /></Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <a href="#md-problem" className="md-scroll-cue" aria-label="Scroll to explore MEDHA">
        <span>KEEP SCROLLING</span><ArrowDown size={14} />
      </a>
    </section>
  );
};

export default HeroSection;
