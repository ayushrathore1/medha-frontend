import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, BadgeCheck, BookOpen, BrainCircuit, FileText,
  Flame, Search, Sparkles, Youtube
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    className: 'md-feature-search',
    label: '01 / FIND',
    Icon: Search,
    accent: 'green',
    title: 'Search by topic, not by folder.',
    copy: 'Look up “Normalization” and move straight into material organized for your semester and subject.',
    visual: 'search',
  },
  {
    className: 'md-feature-notes',
    label: '02 / STUDY',
    Icon: BookOpen,
    accent: 'violet',
    title: 'Notes that know where they belong.',
    copy: 'Handwritten notes, typed notes, PYQs and diagrams, grouped by subject, semester and unit.',
    visual: 'notes',
  },
  {
    className: 'md-feature-resources',
    label: '03 / UNDERSTAND',
    Icon: Youtube,
    accent: 'red',
    title: 'Good explanations, mapped to the topic.',
    copy: 'Find curated video lectures and GeeksforGeeks guides alongside the topic you searched for.',
    visual: 'resources',
  },
  {
    className: 'md-feature-aura',
    label: '04 / CONTRIBUTE',
    Icon: Sparkles,
    accent: 'amber',
    title: 'Share notes. Earn AURA.',
    copy: 'Help a classmate find what you found. Earn 3 AURA points when another student downloads your note.',
    visual: 'aura',
  },
  {
    className: 'md-feature-guard',
    label: '05 / KEEP IT USEFUL',
    Icon: BadgeCheck,
    accent: 'cyan',
    title: 'A quality check before notes go live.',
    copy: 'Uploaded material is checked for academic relevance before it is published, keeping the library focused on study resources.',
    visual: 'guard',
  },
  {
    className: 'md-feature-tutor',
    label: '06 / ASK',
    Icon: BrainCircuit,
    accent: 'blue',
    title: 'Stuck at 2 AM? Ask MEDHA.',
    copy: 'Get help unpacking a concept, build revision flashcards, or practise with question sets.',
    visual: 'tutor',
  },
  {
    className: 'md-feature-community',
    label: '07 / LEARN TOGETHER',
    Icon: Flame,
    accent: 'pink',
    title: 'Your campus has answers, too.',
    copy: 'Charcha gives students a place for doubts, useful resources, discussions and peer knowledge.',
    visual: 'community',
  },
];

const FeatureVisual = ({ type }) => {
  if (type === 'search') {
    return (
      <div className="md-feature-visual md-visual-search">
        <div className="md-visual-searchbar"><Search size={14} /><span>Normalization in DBMS</span><kbd>↵</kbd></div>
        <div className="md-visual-search-tabs"><b>All</b><span>Notes</span><span>Videos</span><span>PYQ</span></div>
        <div className="md-mini-result"><i className="md-mini-doc" /><span><b>Normalization</b><small>DBMS · Unit 3</small></span><ArrowUpRight size={13} /></div>
        <div className="md-mini-result"><i className="md-mini-play" /><span><b>1NF to BCNF</b><small>Concept lecture</small></span><ArrowUpRight size={13} /></div>
      </div>
    );
  }
  if (type === 'notes') {
    return (
      <div className="md-feature-visual md-visual-notes">
        <div className="md-note-sheet md-note-sheet-back"><span>UNIT 03</span><i /><i /><i /><i /></div>
        <div className="md-note-sheet md-note-sheet-front"><span><FileText size={12} /> STUDY NOTES</span><b>Database Normalization</b><i /><i /><i /><em>1NF → 2NF → 3NF</em><i /></div>
        <div className="md-note-chip">Semester mapped <BadgeCheck size={12} /></div>
      </div>
    );
  }
  if (type === 'resources') {
    return (
      <div className="md-feature-visual md-visual-resources">
        <div className="md-resource-row"><span className="md-resource-logo md-resource-gfg">G</span><span><b>GeeksforGeeks</b><small>Normalization in DBMS</small></span><ArrowUpRight size={14} /></div>
        <div className="md-resource-row"><span className="md-resource-logo md-resource-youtube"><Youtube size={16} /></span><span><b>Concept video</b><small>Functional dependencies</small></span><span className="md-match-score">MATCHED</span></div>
        <div className="md-resource-row"><span className="md-resource-logo md-resource-pyq"><BookOpen size={16} /></span><span><b>Previous year paper</b><small>Semester · Unit aligned</small></span><ArrowUpRight size={14} /></div>
      </div>
    );
  }
  if (type === 'aura') {
    return (
      <div className="md-feature-visual md-visual-aura">
        <span className="md-aura-orbit md-aura-orbit-one" /><span className="md-aura-orbit md-aura-orbit-two" />
        <div className="md-aura-core"><Sparkles size={23} /><strong>AURA</strong><small>POINTS</small></div>
        <div className="md-aura-gain">+3 <small>per download</small></div>
      </div>
    );
  }
  if (type === 'guard') {
    return (
      <div className="md-feature-visual md-visual-guard">
        <div className="md-guard-step"><span>01</span><FileText size={16} /><b>Upload note</b><small>PDF · Image · Document</small></div>
        <span className="md-guard-connector" />
        <div className="md-guard-step md-guard-scanning"><span>02</span><BrainCircuit size={17} /><b>AI relevance check</b><small>Academic material review</small></div>
        <span className="md-guard-connector" />
        <div className="md-guard-approved"><BadgeCheck size={17} /><b>Reviewed</b><small>Study library stays focused</small></div>
      </div>
    );
  }
  if (type === 'tutor') {
    return (
      <div className="md-feature-visual md-visual-tutor">
        <div className="md-chat-bubble md-chat-user">Explain TCP 3-way handshake in simple words.</div>
        <div className="md-chat-bubble md-chat-ai"><span><Sparkles size={13} /> MEDHA TUTOR</span><b>Think of it as a quick hello.</b><small>SYN → SYN-ACK → ACK</small><i /><i /></div>
        <div className="md-chat-input">Ask a follow-up <ArrowUpRight size={13} /></div>
      </div>
    );
  }
  return (
    <div className="md-feature-visual md-visual-community">
      <div className="md-community-post"><span className="md-community-avatar">🦊</span><span><b>Can someone explain K-Map grouping?</b><small>DSA? no, Digital Electronics · Doubts</small></span><span className="md-vote">↑ 18</span></div>
      <div className="md-community-post"><span className="md-community-avatar">🐼</span><span><b>Found a clean Unit 4 resource</b><small>Resources · 6 replies</small></span><span className="md-vote">↑ 12</span></div>
      <div className="md-community-rank"><span>YOUR RANK</span><b>Scholar</b><span className="md-rank-progress"><i /></span></div>
    </div>
  );
};

const FeaturesSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-features" id="features">
      <div className="md-section-shell">
        <div className="md-section-heading">
          <span className="md-kicker"><i /> THE TOOLKIT</span>
          <h2>Not another study app.<br /><span>Your entire study loop.</span></h2>
          <p>From finding one concept to sharing a complete set of notes, everything has a job.</p>
        </div>

        <div className="md-features-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.label}
              className={'md-feature-card ' + feature.className + ' md-accent-' + feature.accent}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="md-feature-card-top">
                <span className="md-feature-icon"><feature.Icon size={19} /></span>
                <span className="md-card-kicker">{feature.label}</span>
              </div>
              <div className="md-feature-copy"><h3>{feature.title}</h3><p>{feature.copy}</p></div>
              <FeatureVisual type={feature.visual} />
            </motion.article>
          ))}
        </div>

        <div className="md-features-bottom">
          <span>Start with a topic you already need to learn.</span>
          <Link to="/search" className="md-text-link">Try MEDHA search <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
