import React from 'react';
import '../styles/LandingPage.css';
import { useLiveStats } from '../hooks/useLiveStats';

import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../sections/HeroSection';
import PainSection from '../sections/PainSection';
import IdentitySection from '../sections/IdentitySection';
import FeaturesSection from '../sections/FeaturesSection';
import WhySection from '../sections/WhySection';
import SubjectsSection from '../sections/SubjectsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CTASection from '../sections/CTASection';
import Footer from '../sections/Footer';

const LandingPage = () => {
  const stats = useLiveStats();

  return (
    <div className="landing-page md-landing">
      <LandingNavbar studentsOnline={stats.studentsOnline} />
      <main>
        <HeroSection totalStudents={stats.totalStudents} />
        <PainSection />
        <IdentitySection stats={stats} />
        <FeaturesSection />
        <WhySection />
        <SubjectsSection />
        <TestimonialsSection />
        <CTASection totalStudents={stats.totalStudents} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
