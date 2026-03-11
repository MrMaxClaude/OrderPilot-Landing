import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const TrustSecurity: React.FC = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section 
      ref={sectionRef as any}
      className="py-16 bg-card-white border-y border-gray-100 fade-in"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Enterprise-Grade <span className="font-serif italic text-rb2-orange">Security</span>
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Your data is encrypted at rest and in transit. We are ISO 27001 certified and GDPR compliant. We never use your data to train public AI models.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-warm-bg rounded-xl border border-gray-100 flex items-center gap-3">
                <Shield className="text-rb2-orange" size={20} />
                <span className="text-sm font-bold text-text-primary">ISO 27001</span>
              </div>
              <div className="p-4 bg-warm-bg rounded-xl border border-gray-100 flex items-center gap-3">
                <Lock className="text-rb2-orange" size={20} />
                <span className="text-sm font-bold text-text-primary">GDPR Ready</span>
              </div>
              <div className="p-4 bg-warm-bg rounded-xl border border-gray-100 flex items-center gap-3">
                <CheckCircle className="text-rb2-orange" size={20} />
                <span className="text-sm font-bold text-text-primary">SOC2 Type II</span>
              </div>
              <div className="p-4 bg-warm-bg rounded-xl border border-gray-100 flex items-center gap-3">
                <Shield className="text-rb2-orange" size={20} />
                <span className="text-sm font-bold text-text-primary">SLA 99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-text-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rb2-orange/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-xl font-serif italic mb-8">
                "Security was our #1 concern when moving to AI. OrderPilot's private cloud infrastructure and RB2's reputation made it an easy choice."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div>
                  <div className="font-bold">Mark van den Broek</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">CISO, Nedcargo Logistics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecurity;
