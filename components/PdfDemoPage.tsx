import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Star, Clock, Shield, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePostHogTracking } from '../src/hooks/usePostHogTracking';
import Logo from './Logo';

const PdfDemoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { track, identifyUser } = usePostHogTracking();

  // Extract parameters from URL
  const savings = searchParams.get('savings') || '';
  const company = searchParams.get('company') || 'Your Company';
  const erp = searchParams.get('erp') || 'your ERP';

  // Track page view
  useEffect(() => {
    track('pdf_demo_page_viewed', {
      savings: savings,
      company: company,
      erp: erp,
      source: 'pdf_report'
    });
  }, [track, savings, company, erp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const urgency = formData.get('urgency') as string;

    // Identify user with PDF context
    identifyUser(email, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      company_name: company,
      estimated_savings: savings,
      erp_system: erp,
      lead_source: 'pdf_report',
      urgency_level: urgency
    });

    // Track form completion
    track('pdf_demo_form_completed', {
      email: email,
      company: company,
      estimated_savings: savings,
      erp_system: erp,
      urgency_level: urgency,
      source: 'pdf_report'
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center px-6">
        <div className="max-w-lg mx-auto text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Demo Booked Successfully!</h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Our OrderPilot expert will call you within the next 2 hours to schedule your personalized demo.
          </p>
          <div className="bg-rb2-orange/10 border border-rb2-orange/30 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-700">
              <strong>Next steps:</strong> We'll show you exactly how OrderPilot processes POs in your {erp} format
              and demonstrate the {savings} annual savings you calculated.
            </p>
          </div>
          <Link to="/" className="text-rb2-orange font-bold hover:underline">
            ← Back to OrderPilot homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={32} />
            <span className="ml-3 text-xl font-bold text-gray-900">OrderPilot</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">From your PDF report</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Value Prop */}
          <div>
            <div className="mb-6">
              <span className="inline-block bg-rb2-orange/10 text-rb2-orange px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Hot Lead Priority
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Ready to save {savings ? (
                <span className="text-rb2-orange">{savings}/year?</span>
              ) : (
                <span className="text-rb2-orange">thousands per year?</span>
              )}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              You've seen the numbers from your cost analysis. Now see exactly how OrderPilot
              eliminates 90% of your manual PO processing work.
            </p>

            {/* Social Proof */}
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <span className="text-sm font-semibold text-gray-600">4.9/5 from 200+ implementations</span>
              </div>

              <blockquote className="text-gray-700 mb-4">
                "OrderPilot saved us €47,000 in the first year. Our team went from spending 15 hours/week
                on PO processing to just 2 hours reviewing exceptions."
              </blockquote>
              <cite className="text-sm text-gray-500">
                — Sarah Chen, Operations Director at MidCorp Manufacturing (320 employees)
              </cite>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Clock, label: 'Fast Setup', desc: 'Live in 14 days' },
                { icon: Shield, label: 'Risk-Free', desc: '30-day money-back guarantee' },
                { icon: Users, label: 'Expert Support', desc: 'Dedicated success manager' },
                { icon: CheckCircle, label: '99.9% Accuracy', desc: 'Proven across 500K+ POs' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 bg-rb2-orange/10 text-rb2-orange rounded-lg">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Urgency */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">Limited Time: Q1 Implementation Bonus</h4>
                  <p className="text-sm text-yellow-700">
                    Start before March 31st and get 3 months free implementation support
                    (€4,500 value). Only 12 spots remaining.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Demo Form */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Book Your <span className="text-rb2-orange">Personalized Demo</span>
              </h2>
              <p className="text-gray-400">
                See OrderPilot process your actual PO formats in your {erp} system.
                20-minute call, no commitment required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@company.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+31 6 1234 5678"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Implementation Timeline
                </label>
                <select
                  name="urgency"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all appearance-none"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP (within 30 days)</option>
                  <option value="q1">This quarter (within 90 days)</option>
                  <option value="h1">This half-year (within 6 months)</option>
                  <option value="evaluating">Just evaluating options</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-rb2-orange text-white rounded-2xl font-bold py-4 hover:bg-rb2-orange-hover hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book My Demo Now <ArrowRight size={18} />
              </button>

              <p className="text-xs text-center text-gray-500">
                Free consultation • No pressure • We'll call you within 2 hours
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>🔒 Your data is secure</span>
                <span>•</span>
                <span>📞 Expert will call you</span>
                <span>•</span>
                <span>⚡ 20-min demo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-4">
            Not ready for a demo yet?{' '}
            <Link to="/#contact" className="text-rb2-orange font-bold hover:underline">
              Just get in touch →
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            Based on your PDF analysis: {company} • {erp} • {savings ? `Potential savings: ${savings}` : 'Custom analysis completed'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfDemoPage;