
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';
import HeroAnimation from './HeroAnimation';

const Hero: React.FC = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section 
      ref={sectionRef as any}
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 fade-in"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center bg-rb2-orange/10 text-rb2-orange text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          NOW IN PUBLIC BETA
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[800] tracking-tight text-text-primary mb-8 leading-[1.1]">
          Stop Manually Entering Purchase Orders.<br />
          Start Getting Them <span className="font-serif italic text-rb2-orange">Right.</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          OrderPilot turns purchase order emails into validated, ERP-ready data in under 60 seconds. 
          Your team spends 15 hours a week on data entry. It should be zero.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a 
            href="#demo"
            className="w-full sm:w-auto bg-rb2-orange text-white rounded-2xl font-semibold px-8 py-4 hover:bg-rb2-orange-hover hover:shadow-lg transition-all duration-200"
          >
            Book a Demo
          </a>
          <Link 
            to="/calculator"
            className="w-full sm:w-auto bg-white text-text-primary border border-gray-200 rounded-2xl font-semibold px-8 py-4 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            Calculate your costs <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust Strip */}
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-6">
            Works with: SAP · AFAS · Exact · Microsoft Dynamics · NetSuite
          </p>
        </div>
      </div>

      {/* New Processing Animation — Wider than text */}
      <div className="max-w-[1200px] mx-auto mt-8">
        <HeroAnimation />
      </div>
    </section>
  );
};

export default Hero;
