import React from 'react';
import { ArrowRight, Clock, TrendingUp, Users, CheckCircle, Quote } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const CaseStudy: React.FC = () => {
  const sectionRef = useScrollAnimation();

  const metrics = [
    {
      value: '2,400',
      unit: 'hours/year',
      label: 'Time Saved',
      description: 'Previously spent on manual PO processing',
      icon: Clock
    },
    {
      value: '95%',
      unit: 'reduction',
      label: 'Processing Time',
      description: 'From 30 minutes to under 2 minutes per order',
      icon: TrendingUp
    },
    {
      value: '99.8%',
      unit: 'accuracy',
      label: 'Data Quality',
      description: 'Elimination of manual entry errors',
      icon: CheckCircle
    },
    {
      value: '3',
      unit: 'FTE',
      label: 'Resources Freed',
      description: 'Team members redirected to strategic work',
      icon: Users
    }
  ];

  return (
    <section
      ref={sectionRef as any}
      className="py-24 lg:py-32 bg-warm-bg-alt fade-in"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">
            / CUSTOMER SUCCESS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary mb-6">
            How IPN Saves <span className="font-serif italic text-rb2-orange">2,400 Hours</span> Per Year
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Leading animal feed manufacturer transforms procurement operations with AI-powered automation
          </p>
        </div>

        {/* Company Logo & Info */}
        <div className="bg-white rounded-[2.5rem] p-12 mb-16 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                {/* IPN Logo - Grayscale version */}
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-200">
                  <img
                    src="/ipn-nutrition-logo-1563350225.jpg"
                    alt="IPN Logo"
                    className="w-full h-full object-contain grayscale opacity-70"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">IPN Pet Food</h3>
                  <p className="text-text-muted font-medium">Premium Animal Feed Manufacturer</p>
                </div>
              </div>
              <div className="space-y-4 text-text-secondary">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-rb2-orange rounded-full mt-2"></div>
                  <p><strong>Industry:</strong> Animal Feed & Pet Food Manufacturing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-rb2-orange rounded-full mt-2"></div>
                  <p><strong>Location:</strong> Netherlands</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-rb2-orange rounded-full mt-2"></div>
                  <p><strong>Volume:</strong> 1,200+ purchase orders monthly</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-rb2-orange/10 to-amber-accent/10 rounded-3xl p-8 border border-rb2-orange/20">
                <Quote className="text-rb2-orange mb-4" size={32} />
                <blockquote className="text-lg font-medium text-text-primary leading-relaxed mb-4 italic">
                  "OrderPilot has transformed how we handle procurement. What used to take our team 30 minutes per order now happens automatically in under 2 minutes. It's given us our time back to focus on what really matters."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-bold text-text-primary">Procurement Director</p>
                    <p className="text-sm text-text-muted">IPN Pet Food</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Challenge */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="sticky top-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4 block">
                THE CHALLENGE
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Manual Processing <span className="font-serif italic text-rb2-orange">Bottleneck</span>
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                With over 1,200 purchase orders flowing through email monthly, IPN's procurement team was drowning in manual data entry. Each order required 20-30 minutes of careful transcription from supplier emails into their ERP system.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full relative">
                    <div className="absolute top-0.5 left-1/2 w-0.5 h-2 bg-gray-400 transform -translate-x-1/2"></div>
                    <div className="absolute top-1.5 left-1/2 w-1.5 h-0.5 bg-gray-400 transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">Time-Intensive Process</h4>
                  <p className="text-text-secondary">30+ minutes per order for manual data entry and validation</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">Resource Drain</h4>
                  <p className="text-text-secondary">3 full-time staff members dedicated solely to PO processing</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <div className="flex flex-col space-y-0.5 w-5 h-5">
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-1 bg-gray-400"></div>
                      <div className="w-1.5 h-1 bg-gray-400"></div>
                      <div className="w-1 h-1 bg-gray-400"></div>
                    </div>
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-1 bg-gray-400"></div>
                      <div className="w-2 h-1 bg-gray-400"></div>
                      <div className="w-1.5 h-1 bg-gray-400"></div>
                    </div>
                    <div className="flex space-x-0.5">
                      <div className="w-1.5 h-1 bg-gray-400"></div>
                      <div className="w-1 h-1 bg-gray-400"></div>
                      <div className="w-1.5 h-1 bg-gray-400"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">Scaling Challenges</h4>
                  <p className="text-text-secondary">Growing order volume making manual process unsustainable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Metrics */}
        <div className="bg-gradient-to-br from-text-primary to-gray-800 rounded-[2.5rem] p-12 lg:p-16 mb-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute bottom-8 right-8 opacity-10">
            <img
              src="/logo.svg"
              alt="OrderPilot Icon"
              className="w-32 h-32"
            />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rb2-orange mb-4 block">
                MEASURABLE IMPACT
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Transformation by the <span className="font-serif italic text-rb2-orange">Numbers</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                      <Icon className="text-rb2-orange mx-auto mb-4" size={32} />
                      <div className="text-4xl font-black text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-rb2-orange font-bold text-sm mb-3 uppercase tracking-wider">
                        {metric.unit}
                      </div>
                      <div className="text-lg font-bold text-white mb-2">
                        {metric.label}
                      </div>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {metric.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Implementation Journey */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <span className="font-bold text-xl">1</span>
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-4">Setup & Integration</h4>
            <p className="text-text-secondary leading-relaxed">
              Connected OrderPilot to IPN's email system and Business Central ERP in under 48 hours with zero downtime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <span className="font-bold text-xl">2</span>
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-4">AI Training & Testing</h4>
            <p className="text-text-secondary leading-relaxed">
              Trained the AI on IPN's specific supplier formats and product codes, achieving 99.8% accuracy within the first week.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-rb2-orange/10 rounded-xl flex items-center justify-center text-rb2-orange mb-6">
              <span className="font-bold text-xl">3</span>
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-4">Full Deployment</h4>
            <p className="text-text-secondary leading-relaxed">
              Rolled out across all procurement workflows, with staff retrained to focus on exception handling and strategic tasks.
            </p>
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-green-50 rounded-[2.5rem] p-12 border border-green-200/50">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-4 block">
                RETURN ON INVESTMENT
              </span>
              <h3 className="text-3xl font-bold text-text-primary mb-6">
                Payback in <span className="font-serif italic font-bold text-rb2-orange">3.2 Months</span>
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                With 2,400 hours saved annually at an average cost of €45/hour, IPN achieved an ROI of 380% in the first year alone.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Annual labor cost saved:</span>
                  <span className="font-bold text-text-primary">€108,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">OrderPilot annual cost:</span>
                  <span className="font-bold text-text-primary">€28,500</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-text-primary">Net savings:</span>
                  <span className="font-bold text-green-600">€79,500/year</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="text-5xl font-black text-green-600 mb-2">380%</div>
                  <div className="text-lg font-bold text-text-primary mb-4">First Year ROI</div>
                  <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
            Ready to Transform Your <span className="font-serif italic text-rb2-orange">Procurement?</span>
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            See how OrderPilot can deliver similar results for your business. Talk to our experts about your specific needs.
          </p>
          <button className="inline-flex items-center px-10 py-5 bg-rb2-orange text-white rounded-2xl font-bold text-lg hover:bg-rb2-orange-hover hover:shadow-2xl hover:shadow-orange-200/50 transition-all hover:-translate-y-1">
            Get Your Custom ROI Analysis
            <ArrowRight size={20} className="ml-3" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;