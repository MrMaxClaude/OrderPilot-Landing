import React from 'react';
import { Quote } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const SocialProof: React.FC = () => {
  const sectionRef = useScrollAnimation();

  const testimonials = [
    {
      quote: "OrderPilot has completely transformed our procurement workflow. We've reduced manual entry by 85% in just 3 months.",
      author: "Sarah Janssen",
      role: "Head of Procurement",
      company: "Breman Groep",
      metric: "85% Reduction",
      label: "in manual entry"
    },
    {
      quote: "The accuracy is what sets them apart. We tried other AI tools, but OrderPilot is the only one that actually delivers 100% correct data.",
      author: "Pieter de Vries",
      role: "Operations Director",
      company: "VDL Group",
      metric: "100% Accuracy",
      label: "guaranteed"
    }
  ];

  return (
    <section 
      id="results"
      ref={sectionRef as any}
      className="py-20 lg:py-32 fade-in border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ RESULTS</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-12">
            What procurement teams <span className="font-serif italic text-rb2-orange">see</span><br />
            after switching.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { val: '80%', label: 'less time on PO processing' },
              { val: '95%', label: 'fewer data entry errors' },
              { val: '6 weeks', label: 'to full ROI' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-5xl font-extrabold text-rb2-orange mb-2">{m.val}</div>
                <div className="text-sm text-text-muted font-bold uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              pill: "3 hrs → 15 min daily",
              quote: "We processed 450 POs a month with three people doing nothing but data entry. Now OrderPilot handles it and those three people do actual procurement work. The error rate went from 12% to basically zero.",
              author: "Procurement Director",
              company: "Manufacturing company"
            },
            {
              pill: "Handles any format",
              quote: "I tested it with our messiest suppliers first — the ones who send POs as plain text in an email body. No PDF, no structure. It nailed every single one. That's when I knew we could trust it.",
              author: "Operations Manager",
              company: "Distribution company"
            },
            {
              pill: "ROI in month 1",
              quote: "ROI was positive in the first month. Not the first quarter. The first month. Our CFO couldn't believe the cost-per-PO difference.",
              author: "Head of Procurement",
              company: "Wholesale company"
            }
          ].map((t, i) => (
            <div key={i} className="bg-card-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center bg-rb2-orange/10 text-rb2-orange text-[10px] font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                  {t.pill}
                </div>
                <p className="text-base font-serif italic text-text-primary mb-8 leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-bold text-text-primary text-sm">{t.author}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Bar — Wide Width */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-8">
          Trusted by procurement teams across manufacturing, distribution, and wholesale.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 font-black text-xl text-text-primary">
          <span>VDL GROUP</span>
          <span>NEDCARGO</span>
          <span>BREMAN</span>
          <span>GLOBALTRADE</span>
          <span>LOGISYS</span>
          <span>PROCURA</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
