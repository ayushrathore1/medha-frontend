import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const communityPillars = [
  {
    Icon: MessageCircle,
    number: '01',
    title: 'Ask without overthinking.',
    copy: 'Use Charcha for doubts, explanations and the small questions that block a whole study session.',
    tone: 'violet',
  },
  {
    Icon: Sparkles,
    number: '02',
    title: 'Share something useful.',
    copy: 'Upload the notes you made, help another student, and earn AURA when your work is downloaded.',
    tone: 'green',
  },
  {
    Icon: UsersRound,
    number: '03',
    title: 'Build knowledge together.',
    copy: 'Find resources from peers, discuss topics and make helpful material easier to discover.',
    tone: 'amber',
  },
];

const TestimonialsSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-community" id="community">
      <div className="md-section-shell">
        <div className="md-community-banner">
          <div className="md-community-banner-glow" aria-hidden="true" />
          <div className="md-community-banner-copy">
            <span className="md-kicker"><i /> BETTER TOGETHER</span>
            <h2>Knowledge gets better<br /><span>when it moves around.</span></h2>
            <p>MEDHA is not just somewhere to download a PDF. It is a loop: find material, learn the concept, share what worked, and help the next student.</p>
            <Link to="/register" className="md-button md-button-primary">Join the learning loop <ArrowUpRight size={16} /></Link>
          </div>
          <div className="md-community-visual" aria-label="Illustration of students sharing academic resources">
            <div className="md-community-node md-node-one"><span>🦊</span><b>Doubt solved</b></div>
            <div className="md-community-node md-node-two"><span>🐼</span><b>Notes shared</b></div>
            <div className="md-community-node md-node-three"><span>🦉</span><b>AURA earned</b></div>
            <div className="md-community-center"><UsersRound size={28} /><strong>CHARCHA</strong><small>Learn together</small></div>
            <span className="md-community-orbit md-community-orbit-one" />
            <span className="md-community-orbit md-community-orbit-two" />
          </div>
        </div>

        <div className="md-community-pillars">
          {communityPillars.map((pillar, index) => (
            <motion.article
              className={'md-community-pillar md-pillar-' + pillar.tone}
              key={pillar.number}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div><span>{pillar.number}</span><pillar.Icon size={18} /></div>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
