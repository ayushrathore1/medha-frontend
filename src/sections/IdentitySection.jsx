import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BookOpen, FileText, Search, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const IdentitySection = ({ stats }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-identity" id="identity">
      <div className="md-identity-glow" aria-hidden="true" />
      <div className="md-section-shell md-identity-layout">
        <motion.div
          className="md-identity-copy"
          initial={reduceMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65 }}
        >
          <span className="md-kicker"><i /> MEET YOUR STUDY SYSTEM</span>
          <h2>Enter MEDHA.<br /><span>Leave the chaos behind.</span></h2>
          <p className="md-body-lg">One topic becomes a clear path through your syllabus, with useful study material grouped together instead of scattered across ten apps.</p>

          <div className="md-identity-points">
            <div><span className="md-check">✓</span><span><strong>Topic first</strong><small>Start with what you need to understand.</small></span></div>
            <div><span className="md-check">✓</span><span><strong>Syllabus aware</strong><small>Find content by semester, subject and unit.</small></span></div>
            <div><span className="md-check">✓</span><span><strong>Built to share</strong><small>Learn from peers and contribute your own notes.</small></span></div>
          </div>

          {typeof stats.totalStudents === 'number' && stats.totalStudents > 0 && (
            <div className="md-live-stat">
              <span className="md-live-stat-number">{stats.totalStudents.toLocaleString('en-IN')}+</span>
              <span><strong>student accounts</strong><small>reported by MEDHA</small></span>
            </div>
          )}

          <Link to="/search" className="md-text-link">Explore the search experience <ArrowUpRight size={16} /></Link>
        </motion.div>

        <motion.div
          className="md-product-window"
          initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="md-window-chrome">
            <span className="md-window-dots"><i /><i /><i /></span>
            <span className="md-window-url">medha.study / search</span>
            <span className="md-window-key">⌘ K</span>
          </div>
          <div className="md-window-app">
            <aside className="md-window-sidebar">
              <div className="md-window-logo">m<span>.</span></div>
              <span className="md-sidebar-active"><Search size={15} /></span>
              <span><BookOpen size={15} /></span>
              <span><FileText size={15} /></span>
            </aside>
            <div className="md-window-content">
              <div className="md-window-heading"><span>DISCOVER</span><span className="md-window-online"><i /> All resources</span></div>
              <h3>What are we learning today?</h3>
              <div className="md-window-search"><Search size={15} /><span>Binary Search Tree</span><kbd>↵</kbd></div>
              <div className="md-window-filters"><b>All</b><span>Notes</span><span>Videos</span><span>Subjects</span><span>PYQs</span></div>
              <div className="md-window-result">
                <span className="md-result-icon md-result-green"><FileText size={16} /></span>
                <span><strong>Binary Search Tree</strong><small>Data Structures · Unit 4</small><em>Topic notes</em></span>
                <ArrowUpRight size={15} />
              </div>
              <div className="md-window-result">
                <span className="md-result-icon md-result-red"><Youtube size={16} /></span>
                <span><strong>BST explained visually</strong><small>Recommended lecture</small><em>Video resource</em></span>
                <ArrowUpRight size={15} />
              </div>
              <div className="md-window-result">
                <span className="md-result-icon md-result-violet"><BookOpen size={16} /></span>
                <span><strong>Tree traversal questions</strong><small>Previous year paper</small><em>PYQ resource</em></span>
                <ArrowUpRight size={15} />
              </div>
              <div className="md-window-bottom"><span><i /> Organized by your syllabus</span><span>MEDHA Search</span></div>
            </div>
          </div>
          <div className="md-window-caption"><span>01</span> ONE SEARCH. A MORE USEFUL STUDY SESSION.</div>
        </motion.div>
      </div>
    </section>
  );
};

export default IdentitySection;
