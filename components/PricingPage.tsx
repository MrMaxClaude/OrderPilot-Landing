import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Zap, Shield, Users, Headphones, Star, Sparkles, ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';
import { usePostHogTracking } from '../src/hooks/usePostHogTracking';
import Logo from './Logo';

const PricingPage: React.FC = () => {
  const sectionRef = useScrollAnimation();
  const [isYearly, setIsYearly] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { track, trackPageView } = usePostHogTracking();

  useEffect(() => {
    trackPageView('pricing', {
      pricing_toggle: isYearly ? 'yearly' : 'monthly',
    });
  }, [trackPageView]);

  const handleTogglePricing = (yearly: boolean) => {
    setIsYearly(yearly);
    track('pricing_page_viewed', {
      pricing_toggle: yearly ? 'yearly' : 'monthly',
    });
  };

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 349,
      yearlyPrice: 279, // 20% discount
      orderLimit: '1,000 orders/month',
      icon: Users,
      features: [
        'AI-powered order processing',
        'Email support',
        'Basic ERP integrations',
        'Standard accuracy (99%+)',
        'Mobile dashboard access'
      ],
      cta: 'Talk to Expert',
      popular: false
    },
    {
      name: 'Growth',
      description: 'Most popular for scaling businesses',
      monthlyPrice: 899,
      yearlyPrice: 719, // 20% discount
      orderLimit: '5,000 orders/month',
      icon: Zap,
      features: [
        'Everything in Starter',
        'Priority email support',
        'Advanced workflow automation',
        'Premium accuracy (99.5%+)',
        'Custom approval rules',
        'Advanced analytics & reporting'
      ],
      cta: 'Talk to Expert',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthlyPrice: null,
      yearlyPrice: null,
      orderLimit: 'Unlimited orders',
      icon: Shield,
      features: [
        'Everything in Growth',
        'Dedicated customer success manager',
        'Custom integrations',
        'Enterprise accuracy (99.9%+)',
        'On-premise deployment option',
        '24/7 phone support'
      ],
      cta: 'Talk to Expert',
      popular: false
    }
  ];

  const formatPrice = (price: number | null) => {
    if (!price) return 'Custom';
    const currentPrice = isYearly ? price : price;
    return `€${currentPrice.toLocaleString()}`;
  };

  const getSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - (yearly * 12);
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-bg via-warm-bg-alt to-orange-50/30 pt-24">
      {/* Header */}
      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-orange-50 text-rb2-orange text-sm font-bold rounded-full border border-orange-200/50">
              <Sparkles size={16} className="mr-2" />
              Choose Your Growth Plan
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary mb-6">
            Simple, Powerful <span className="font-serif italic text-rb2-orange">Pricing</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12">
            Transform your order processing with AI-powered automation. No setup fees, no hidden costs—just transparent pricing that grows with your business.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-4">
            <span className={`text-lg font-bold transition-colors ${!isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`mx-4 relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-rb2-orange/20 ${
                isYearly ? 'bg-rb2-orange' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                  isYearly ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-bold transition-colors ${isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
              Yearly
            </span>
          </div>
          {isYearly && (
            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200/50 animate-fadeIn">
              <Star size={14} className="mr-1" />
              Save 20% with yearly billing
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        ref={sectionRef as any}
        className="px-6 mb-20 fade-in"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

              return (
                <div
                  key={index}
                  className={`relative rounded-[2.5rem] p-8 lg:p-10 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    plan.popular
                      ? 'border-rb2-orange bg-white shadow-xl scale-105 lg:scale-110 z-10'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-rb2-orange to-amber-accent px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                      plan.popular ? 'bg-orange-50' : 'bg-gray-50'
                    }`}>
                      <Icon
                        size={32}
                        className={plan.popular ? 'text-rb2-orange' : 'text-gray-600'}
                      />
                    </div>
                    <h3 className="text-2xl font-extrabold text-text-primary mb-3">{plan.name}</h3>
                    <p className="text-text-secondary leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-black text-text-primary">
                        {formatPrice(currentPrice)}
                      </span>
                      {currentPrice && (
                        <span className="text-lg text-text-muted font-bold ml-2">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isYearly && plan.monthlyPrice && plan.yearlyPrice && (
                      <div className="text-sm text-green-700 font-medium">
                        Save €{((plan.monthlyPrice * 12) - (plan.yearlyPrice * 12)).toLocaleString()} per year
                      </div>
                    )}
                    <div className="text-sm text-text-muted font-medium mt-2">
                      {plan.orderLimit}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-text-primary font-medium leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/#contact"
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      plan.popular
                        ? 'bg-rb2-orange text-white hover:bg-rb2-orange-hover shadow-lg hover:shadow-xl'
                        : 'bg-text-primary text-white hover:bg-black'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight size={20} />
                  </a>

                  <p className="text-xs text-text-muted text-center mt-4">
                    Free consultation • No pressure • Custom pricing available
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof & Guarantee */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-text-primary to-gray-800 rounded-[2.5rem] p-12 lg:p-16 text-white text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
                Trusted by <span className="font-serif italic text-rb2-orange">500+</span> Companies
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                From startups to enterprises, teams choose OrderPilot to eliminate manual order processing and reduce errors by 99.5%
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-rb2-orange mb-2">99.5%</div>
                  <div className="text-gray-300">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-rb2-orange mb-2">10x</div>
                  <div className="text-gray-300">Faster Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-rb2-orange mb-2">85%</div>
                  <div className="text-gray-300">Time Saved</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Shield size={24} />
                <span className="text-lg font-bold">30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
              Have <span className="font-serif italic text-rb2-orange">Questions?</span>
            </h2>
            <p className="text-xl text-text-secondary">Everything you need to know about getting started</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How quickly can I get started?",
                a: "Setup takes just 15 minutes. Connect your email, configure basic settings, and start processing orders immediately with our AI."
              },
              {
                q: "Do I need technical knowledge?",
                a: "No coding required. Our intuitive interface and DIY integration kit make setup simple for any team member."
              },
              {
                q: "What if I exceed my order limit?",
                a: "You'll get notifications at 80% usage. Overage is just €0.10 per order, and you can upgrade anytime."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, cancel anytime with no penalties. Your data remains accessible for 90 days after cancellation."
              },
              {
                q: "Which ERPs do you support?",
                a: "Business Central, Exact Online, Odoo, plus NetSuite, SAP, and 50+ others through our universal API connector."
              },
              {
                q: "How accurate is the AI processing?",
                a: "99.5% accuracy guaranteed. Our AI improves over time by learning from your specific order patterns and requirements."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 hover:border-rb2-orange/30 transition-all duration-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between focus:outline-none hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-text-primary text-lg pr-4">{faq.q}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-rb2-orange transition-transform duration-200 flex-shrink-0 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <p className="text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-secondary mb-4">Still have questions?</p>
            <a
              href="/#contact"
              className="px-8 py-3 bg-orange-50 text-rb2-orange font-bold rounded-2xl hover:bg-orange-100 transition-colors inline-block"
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-rb2-orange via-amber-accent to-rb2-orange-hover rounded-[2.5rem] p-12 lg:p-16 text-center text-white relative overflow-hidden">
            {/* Background Logo Icon Watermark */}
            <div className="absolute bottom-8 right-8 opacity-10">
              <img
                src="/logo.svg"
                alt="Orderpilot Icon"
                className="w-32 h-32"
              />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-full border border-white/30 mb-6">
                  <Zap size={16} className="mr-2" />
                  Limited Time: 50% Off First 3 Months
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
                  Stop Wrestling with <span className="font-serif italic">Order Processing</span>
                </h2>
                <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join 500+ companies who've eliminated manual data entry forever. Start your 14-day free trial and process your first order in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <a
                  href="/#contact"
                  className="px-10 py-5 bg-white text-rb2-orange rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span>Talk to Expert</span>
                  <ArrowRight size={20} className="ml-3" />
                </a>
                <a
                  href="/calculator"
                  className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-200 inline-block"
                >
                  Calculate ROI
                </a>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-white/80">
                <div className="flex items-center">
                  <Check size={16} className="mr-2" />
                  Free consultation
                </div>
                <div className="flex items-center">
                  <Check size={16} className="mr-2" />
                  Custom pricing
                </div>
                <div className="flex items-center">
                  <Check size={16} className="mr-2" />
                  No obligation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;