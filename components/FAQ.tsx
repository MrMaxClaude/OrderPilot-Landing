import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const FAQ: React.FC = () => {
  const sectionRef = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How accurate is the AI extraction?",
      a: "Our AI extraction is 99.9% accurate out of the box. However, we combine this with human-in-the-loop validation to guarantee 100% accuracy for every order that enters your ERP."
    },
    {
      q: "Which ERP systems do you support?",
      a: "We have pre-built connectors for SAP (S/4HANA & ECC), MS Dynamics 365, Oracle Netsuite, AFAS, and Exact. We also offer a flexible API for custom integrations."
    },
    {
      q: "How long does implementation take?",
      a: "A standard implementation takes less than 48 hours. Our integration engineers handle the mapping to your ERP, so your IT team doesn't have to."
    },
    {
      q: "Is my data secure?",
      a: "Yes. OrderPilot is ISO 27001 certified and GDPR compliant. All data is encrypted, and we offer private cloud deployments for enterprise customers."
    },
    {
      q: "What happens if the AI makes a mistake?",
      a: "Our system flags any low-confidence extractions for human review. If an error does reach your ERP, our 100% accuracy guarantee means you don't pay for that month's service."
    }
  ];

  return (
    <section 
      id="faq"
      ref={sectionRef as any}
      className="py-20 lg:py-24 px-6 fade-in border-t border-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            Frequently Asked <span className="font-serif italic text-rb2-orange">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i ? 'bg-card-white border-rb2-orange shadow-lg' : 'bg-transparent border-gray-100'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-6 flex items-center justify-between"
              >
                <span className="text-lg font-bold text-text-primary">{faq.q}</span>
                {openIndex === i ? <Minus className="text-rb2-orange" /> : <Plus className="text-text-muted" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 animate-tabFadeIn">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
