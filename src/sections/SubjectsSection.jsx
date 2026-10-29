import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Network, Cpu, Database, GitBranch, Binary, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const topics = [
  { name: 'Data Structures & Algorithms', short: 'DSA', Icon: GitBranch, color: 'green' },
  { name: 'Database Management', short: 'DBMS', Icon: Database, color: 'violet' },
  { name: 'Operating Systems', short: 'OS', Icon: Cpu, color: 'blue' },
  { name: 'Computer Networks', short: 'CN', Icon: Network, color: 'cyan' },
  { name: 'Digital Electronics', short: 'DE', Icon: Binary, color: 'amber' },
  { name: 'Discrete Mathematics', short: 'DM', Icon: Calculator, color: 'pink' },
  { name: 'Theory of Computation', short: 'TOC', Icon: BookOpen, color: 'green' },
];

const SubjectsSection = () => {
  const [activeTopic, setActiveTopic] = useState('DSA');
  const selected = topics.find(topic => topic.short === activeTopic) || topics[0];

  return (
    <section className="md-section md-subjects" id="subjects">
      <div className="md-section-shell md-subjects-layout">
        <div className="md-subjects-copy">
          <span className="md-kicker"><i /> BUILT AROUND YOUR SYLLABUS</span>
          <h2>Real subjects.<br /><span>Real semester problems.</span></h2>
          <p>Search with the words you already use in class, then follow the content that helps you move forward.</p>
          <div className="md-subject-tabs" role="tablist" aria-label="Engineering subject examples">
            {topics.map(topic => (
              <button
                type="button"
                key={topic.short}
                role="tab"
                aria-selected={activeTopic === topic.short}
                className={activeTopic === topic.short ? 'md-subject-tab md-subject-tab-active' : 'md-subject-tab'}
                onClick={() => setActiveTopic(topic.short)}
              >{topic.short}</button>
            ))}
          </div>
          <div className="md-selected-topic">
            <span className={'md-selected-topic-icon md-topic-' + selected.color}><selected.Icon size={19} /></span>
            <div><small>TRY A SEARCH FOR</small><strong>{selected.name}</strong></div>
            <Link to={'/search?q=' + encodeURIComponent(selected.name)} aria-label={'Search ' + selected.name}><ArrowUpRight size={18} /></Link>
          </div>
          <Link className="md-text-link" to="/rtu-exams">Explore RTU exam resources <ArrowUpRight size={16} /></Link>
        </div>

        <div className="md-subject-map">
          <div className="md-subject-map-head"><span>TOPIC MAP</span><span className="md-subject-map-status"><i /> SAMPLE PATH</span></div>
          <div className="md-topic-map-root"><span className="md-map-root-icon"><BookOpen size={17} /></span><span><b>{selected.name}</b><small>Start with the concept</small></span></div>
          <div className="md-topic-map-branches">
            <div><span className="md-map-branch-dot md-branch-green" /><span><b>Understand</b><small>Guides & videos</small></span></div>
            <div><span className="md-map-branch-dot md-branch-violet" /><span><b>Revise</b><small>Notes & diagrams</small></span></div>
            <div><span className="md-map-branch-dot md-branch-amber" /><span><b>Practise</b><small>Previous-year questions</small></span></div>
          </div>
          <div className="md-map-footer"><span>SEMESTER → SUBJECT → UNIT</span><span>Make the next step obvious <ArrowUpRight size={13} /></span></div>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
