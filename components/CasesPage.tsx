import React from 'react';
import CaseStudy from './CaseStudy';
import { ArrowRight } from 'lucide-react';

const CasesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-bg pt-24">
      {/* Page Header */}
      <section className="px-6 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ CUSTOMER SUCCESS STORIES</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary mb-6">
            Real Results from <span className="font-serif italic text-rb2-orange">Real Companies</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            See how leading companies are transforming their procurement operations with OrderPilot's AI-powered automation.
          </p>
        </div>
      </section>

      {/* IPN Case Study */}
      <CaseStudy />

    </div>
  );
};

export default CasesPage;