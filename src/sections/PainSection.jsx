import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock3, Files, SearchX } from 'lucide-react';

const problems = [
  {
    number: '01',
    Icon: Files,
    label: 'THE PDF GRAVEYARD',
    title: 'Your notes are everywhere.',
    copy: 'A file in WhatsApp. A drive link from a senior. A blurry photo from last year. None of it sorted by your unit.',
    tone: 'amber',
  },
  {
    number: '02',
    Icon: Clock3,
    label: 'THE 2 AM REALITY',
    title: 'The exam is in a few hours.',
    copy: 'Six units, zero plan, and no clue where to start. Reading everything is not the same as learning what matters.',
    tone: 'violet',
  },
  {
    number: '03',
    Icon: SearchX,
    label: 'THE SEARCH SPIRAL',
    title: 'Ten tabs. Still no answer.',
    copy: 'You search a topic and find random videos, unrelated notes, and examples outside your university syllabus.',
    tone: 'green',
  },
];

const PainSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="md-section md-problem" id="md-problem">
      <div className="md-section-shell">
        <div className="md-section-heading md-centered">
          <span className="md-kicker"><i /> THE ENGINEERING STUDENT LOOP</span>
          <h2>Studying is hard enough.<br /><span>Finding what to study shouldn’t be.</span></h2>
          <p>MEDHA was built for the actual college routine, not an imaginary 9-to-5 study schedule.</p>
        </div>

        <div className="md-problem-grid">
          {problems.map((problem, index) => (
            <motion.article
              className={'md-problem-card md-tone-' + problem.tone}
              key={problem.number}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="md-problem-card-top">
                <span className="md-problem-number">{problem.number}</span>
                <span className="md-problem-icon"><problem.Icon size={19} /></span>
              </div>
              <span className="md-card-kicker">{problem.label}</span>
              <h3>{problem.title}</h3>
              <p>{problem.copy}</p>
              <div className="md-problem-line" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSection;
