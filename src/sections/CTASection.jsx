import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = ({ totalStudents }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-final-cta" id="get-started">
      <div className="md-cta-shell">
        <div className="md-cta-orb md-cta-orb-one" aria-hidden="true" />
        <div className="md-cta-orb md-cta-orb-two" aria-hidden="true" />
        <div className="md-cta-grid" aria-hidden="true" />

        <motion.div
          className="md-cta-content"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="md-kicker"><i /> YOUR NEXT STUDY SESSION STARTS HERE</span>
          <h2>Your GPA is waiting.<br /><span>Let’s make the next hour count.</span></h2>
          <p>
            Start with the topic that’s been confusing you. Find a clearer path through notes,
            videos and exam resources, all in one place.
          </p>
          <div className="md-cta-actions">
            <Link to="/register" className="md-button md-button-primary md-button-large">
              Start your journey <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="md-button md-button-outline">I already have an account</Link>
          </div>
          <div className="md-cta-footnote">
            <Sparkles size={14} />
            <span>{typeof totalStudents === 'number' && totalStudents > 0
              ? 'Join ' + totalStudents.toLocaleString('en-IN') + '+ student accounts'
              : 'Free to get started'}</span>
            <i />
            <span>No credit card needed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
