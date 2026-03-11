import React from 'react';
import { Check } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const Pricing: React.FC = () => {
  const sectionRef = useScrollAnimation();

  const plans = [
    {
      name: 'Starter',
      price: '€499',
      description: 'Perfect for small teams processing up to 500 orders monthly.',
      features: ['Up to 500 POs / month', 'Standard ERP Connectors', 'Email Support', '99.9% Accuracy Guarantee'],
      cta: 'Start for Free',
      featured: false
    },
    {
      name: 'Professional',
      price: '€1,299',
      description: 'For growing teams processing up to 2,500 orders monthly.',
      features: ['Up to 2,500 POs / month', 'Advanced ERP Mapping', 'Priority Support', '100% Accuracy Guarantee', 'Custom Workflows'],
      cta: 'Get Started',
      featured: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex procurement needs.',
      features: ['Unlimited POs', 'Dedicated Integration Engineer', '24/7 Phone Support', 'On-premise Deployment', 'Custom SLAs'],
      cta: 'Contact Sales',
      featured: false
    }
  ];

  return (
    <section 
      id="pricing"
      ref={sectionRef as any}
      className="py-20 lg:py-24 px-6 bg-warm-bg-alt border-y border-gray-100 fade-in"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ PRICING</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            Simple, <span className="font-serif italic text-rb2-orange">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your procurement volume. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`rounded-[2.5rem] p-8 md:p-12 border transition-all duration-300 ${
                plan.featured 
                  ? 'bg-card-white border-rb2-orange shadow-2xl scale-105 z-10' 
                  : 'bg-transparent border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-text-primary">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-text-muted font-bold">/mo</span>}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-medium text-text-primary">
                    <Check size={16} className="text-rb2-orange" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-200 ${
                plan.featured 
                  ? 'bg-rb2-orange text-white hover:bg-rb2-orange-hover shadow-lg' 
                  : 'bg-text-primary text-white hover:bg-black'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
