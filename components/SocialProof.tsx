import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const SocialProof: React.FC = () => {
  const sectionRef = useScrollAnimation();
  const [currentStartIndex, setCurrentStartIndex] = useState(0);

  const testimonials = [
    {
      pill: "WhatsApp to ERP",
      quote: "We get orders via WhatsApp, fax and email, all processed manually. Orderpilot finally turns that chaos into one automated flow. From napkin to order, literally.",
      author: "Operations Manager",
      company: "B2B Technical Wholesaler, The Netherlands",
      featured: true
    },
    {
      pill: "Four systems unified",
      quote: "Our quote-to-order process ran across four different systems. Errors and delays always came from transferring data between them. That problem is now solved.",
      author: "Sales Manager",
      company: "Industrial Food Manufacturer (5,000+ employees), USA"
    },
    {
      pill: "30 min to 3 min",
      quote: "What used to take 30 minutes of manual entry per order now takes under 3. We finally spend our time on customers instead of copying data between screens.",
      author: "Customer Service Lead",
      company: "Building Materials Distributor, Germany"
    },
    {
      pill: "Future-proof value",
      quote: "What Orderpilot built works. It's measurable, future-proof, and designed to add real business value from day one.",
      author: "Sander van Duijn, Digital Transformation Expert",
      company: "INSPIRED Pet Nutrition"
    }
  ];

  // Get the 3 testimonials to show (no auto-rotation)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentStartIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], isCenter: i === 1 });
    }
    return visible;
  };

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

        {/* Testimonials Static Display */}
        <div className="relative mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((t, i) => (
              <div
                key={`${currentStartIndex}-${i}`}
                className={`rounded-3xl p-8 border flex flex-col justify-between relative overflow-hidden transition-all duration-500 ease-in-out ${
                  t.isCenter
                    ? 'bg-gradient-to-br from-rb2-orange to-amber-accent text-white border-rb2-orange shadow-xl scale-105 z-10'
                    : 'bg-card-white border-gray-100 shadow-sm scale-95 opacity-75'
                }`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex items-center text-[10px] font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider ${
                    t.isCenter
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-rb2-orange/10 text-rb2-orange'
                  }`}>
                    {t.pill}
                  </div>
                  <p className={`text-base font-serif italic mb-8 leading-relaxed ${
                    t.isCenter ? 'text-white' : 'text-text-primary'
                  }`}>
                    "{t.quote}"
                  </p>
                  <div>
                    <div className={`font-bold text-sm ${
                      t.isCenter ? 'text-white' : 'text-text-primary'
                    }`}>{t.author}</div>
                    <div className={`text-[10px] uppercase tracking-widest ${
                      t.isCenter ? 'text-white/80' : 'text-text-muted'
                    }`}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center mt-8 space-x-6">
            <button
              onClick={() => setCurrentStartIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-rb2-orange hover:text-white transition-all duration-300 flex items-center justify-center text-gray-600 hover:scale-110"
              aria-label="Previous testimonials"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: testimonials.length }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStartIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStartIndex
                      ? 'bg-rb2-orange scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Show testimonials starting from ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStartIndex((prev) => (prev + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-rb2-orange hover:text-white transition-all duration-300 flex items-center justify-center text-gray-600 hover:scale-110"
              aria-label="Next testimonials"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Logo Bar — Wide Width */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-8">
          Trusted by procurement teams across manufacturing, distribution, and wholesale.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 font-black text-xl text-text-primary">
          <span className="text-rb2-orange opacity-100">IPN PET FOOD</span>
          <span>VDL GROUP</span>
          <span>NEDCARGO</span>
          <span>BREMAN</span>
          <span>GLOBALTRADE</span>
          <span>LOGISYS</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;