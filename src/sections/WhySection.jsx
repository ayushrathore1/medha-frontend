import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Search, Layers3, Upload } from 'lucide-react';

const steps = [
  {
    number: '01',
    Icon: Search,
    title: 'Search the topic.',
    copy: 'Type what you are learning now: Binary Search Tree, K-Map, Normalization or TCP handshake.',
    tag: 'START WITH A QUESTION',
  },
  {
    number: '02',
    Icon: Layers3,
    title: 'Follow the study trail.',
    copy: 'Explore notes, syllabus context, curated explanations and previous-year material together.',
    tag: 'LESS TAB-HOPPING',
  },
  {
    number: '03',
    Icon: Upload,
    title: 'Share what helped.',
    copy: 'Contribute your notes, earn AURA when classmates download them, and make the next study session easier for someone else.',
    tag: 'LEARN. SHARE. REPEAT.',
  },
];

const WhySection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-how" id="how-it-works">
      <div className="md-section-shell">
        <div className="md-section-heading md-centered">
          <span className="md-kicker"><i /> THREE STEPS. LESS CHAOS.</span>
          <h2>From “what is this?”<br /><span>to “okay, I get it.”</span></h2>
          <p>Keep the workflow simple. You bring the topic; MEDHA helps line up the material.</p>
        </div>
        <div className="md-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <motion.article
                className="md-step-card"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.58, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="md-step-top"><span>{step.number}</span><step.Icon size={18} /></div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <span className="md-step-tag">{step.tag}</span>
                {index === 0 && <div className="md-step-example"><Search size={13} /><span>Binary Search Tree</span><ArrowRight size={13} /></div>}
                {index === 1 && <div className="md-step-example"><Layers3 size={13} /><span>Notes · Videos · PYQs</span><ArrowRight size={13} /></div>}
                {index === 2 && <div className="md-step-example"><span className="md-step-aura">✦ +3 AURA</span><span>Note shared</span><ArrowRight size={13} /></div>}
              </motion.article>
              {index < steps.length - 1 && <div className="md-step-connector" aria-hidden="true"><ArrowDownRight size={18} /></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
