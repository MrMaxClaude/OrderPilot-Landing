
import React from 'react';
import { Clock, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const BentoBenefits: React.FC = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section 
      id="benefits"
      ref={sectionRef as any}
      className="py-20 lg:py-32 fade-in border-t border-gray-100"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
          / The real cost
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[800] tracking-tight text-text-primary leading-[1.1] mt-4">
          Manual PO processing is{' '}
          <span className="font-serif italic text-rb2-orange">more expensive</span>{' '}
          than you think.
        </h2>
      </div>

      {/* The Real Cost Stack */}
      <div className="max-w-6xl mx-auto px-6 mb-24 space-y-6">
        
        {/* 1. Direct Labor Cost Block (100% Width) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
                Here's the math
              </p>
              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-600">Purchase orders per month</span>
                  <span className="text-xl font-bold text-text-primary">200</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-600">Minutes per PO (email → ERP entry)</span>
                  <span className="text-xl font-bold text-text-primary">× 15 min</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-600">Hours per year on manual processing</span>
                  <span className="text-xl font-bold text-rb2-orange">= 600 hours</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-600">Average procurement staff cost</span>
                  <span className="text-xl font-bold text-text-primary">× €42/hour</span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-lg font-bold text-text-primary">Direct labor cost alone</span>
                  <span className="text-3xl font-[800] text-text-primary">€25,200/year</span>
                </div>
              </div>
            </div>
            <div className="bg-warm-bg-alt rounded-2xl p-8 border border-gray-100">
              <p className="text-lg text-text-secondary leading-relaxed">
                That's just labor. Add error correction (<span className="font-bold text-text-primary">3-5% of POs need rework</span>), 
                lost early-payment discounts (<span className="font-bold text-text-primary">2% per delayed invoice</span>), 
                and manager escalation time — and the real number is 
                <span className="font-black text-text-primary text-xl ml-1 underline decoration-rb2-orange decoration-2 underline-offset-4">2-3× higher</span>.
              </p>
              <p className="text-xs text-text-muted mt-6">
                * Based on APQC procurement benchmarks and Ardent Partners research.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Comparison Cards (50% Width Each) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Column */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm">
            <p className="text-xs font-bold tracking-[0.2em] text-text-muted uppercase mb-8">
              What happens today
            </p>
            <div className="space-y-6">
              {[
                { metric: '15–30m', description: 'manually entering each purchase order' },
                { metric: '3–5%', description: 'error rate on manual data entry' },
                { metric: '1–5 days', description: 'delay between email and ERP entry' },
                { metric: '10%', description: 'of POs escalated to managers' },
                { metric: '0%', description: 'visibility into processing bottlenecks' }
              ].map(item => (
                <div key={item.description} className="flex items-baseline gap-4">
                  <span className="text-2xl font-[800] text-gray-400 w-24 flex-shrink-0 text-right whitespace-nowrap">{item.metric}</span>
                  <span className="text-sm text-text-secondary leading-tight">{item.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After Column */}
          <div className="bg-gray-900 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-xl">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rb2-orange/10 blur-[100px] -mr-32 -mt-32"></div>
            
            <p className="text-xs font-bold tracking-[0.2em] text-rb2-orange uppercase mb-8 relative z-10">
              With OrderPilot
            </p>
            <div className="space-y-6 relative z-10">
              {[
                { metric: '60 sec', description: 'from email to validated ERP entry' },
                { metric: '99.9%', description: 'extraction accuracy, every format' },
                { metric: 'Instant', description: 'processing — no backlog, no delays' },
                { metric: '5%', description: 'of POs need human review (the real exceptions)' },
                { metric: 'Full', description: 'dashboard with processing status and bottlenecks' }
              ].map(item => (
                <div key={item.description} className="flex items-baseline gap-4">
                  <span className="text-2xl font-[800] text-rb2-orange w-24 flex-shrink-0 text-right whitespace-nowrap">{item.metric}</span>
                  <span className="text-sm text-gray-400 leading-tight">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Calculator CTA (100% Width) */}
        <div className="bg-[#FFF9F5] rounded-3xl border border-rb2-orange/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-[800] text-text-primary tracking-tight mb-4">
              Want <span className="font-serif italic text-rb2-orange">your</span> actual number?
            </h3>
            <p className="text-lg text-text-secondary leading-relaxed">
              Most teams are surprised — it's usually higher than they expect. Our calculator uses your specific volume and labor rates to find the real cost of manual processing.
            </p>
          </div>
          <Link
            to="/calculator"
            className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 bg-rb2-orange text-white rounded-2xl font-bold text-lg hover:bg-rb2-orange-hover hover:shadow-2xl hover:shadow-orange-200/50 transition-all group-hover:-translate-y-1"
          >
            Calculate your costs
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gray-100 w-full mb-24"></div>
      </div>

      {/* Why OrderPilot Heading — Medium Width */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ WHY ORDERPILOT</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
          Built for procurement teams<br />
          that <span className="font-serif italic text-rb2-orange">can't afford</span> mistakes.
        </h2>
      </div>

      {/* Bento Grid — Standard Width */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Card 1: Accuracy */}
          <div className="md:col-span-3 bg-card-white rounded-2xl p-8 border border-gray-100 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <ShieldCheck className="text-rb2-orange mb-6" size={48} />
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4">99.9% Accuracy. Consistently.</h3>
              <p className="text-text-secondary mb-6">
                Every competitor claims 'high accuracy.' 95%. 98%. Sounds good until you realize that means 2-5 errors per 100 POs — every single month.
              </p>
              <p className="text-text-secondary mb-8">
                OrderPilot consistently delivers 99.9% accuracy across all document formats. The remaining edge cases? Flagged for your team to review. Not silently pushed through with bad data.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-rb2-orange/5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-rb2-orange">
              <span className="w-2 h-2 bg-rb2-orange rounded-full animate-pulse"></span>
              Proven Accuracy
            </div>
          </div>

          {/* Card 2: Speed - STANDOUT */}
          <div className="md:col-span-2 bg-rb2-orange text-white rounded-2xl p-8 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <Zap className="absolute -bottom-10 -right-10 text-white opacity-10" size={200} />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold mb-4">60-Second Processing</h3>
              <p className="text-white/80 mb-6">
                From the moment a PO email hits your inbox to validated data in your ERP: under 60 seconds. Your team used to spend 15-20 minutes per order. Now they spend zero.
              </p>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest">
                Fastest in Market
              </div>
            </div>
          </div>

          {/* Card 3: ERP Integration */}
          <div className="md:col-span-3 bg-card-white rounded-2xl p-8 border border-gray-100 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
            <Layers className="text-rb2-orange mb-6" size={48} />
            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Works With Your ERP</h3>
            <p className="text-text-secondary mb-8">
              Native connectors for SAP, AFAS, Exact, Microsoft Dynamics, and NetSuite. No middleware. No custom development. Plug in and go.
            </p>
            <div className="flex flex-wrap gap-3">
              {['SAP', 'AFAS', 'Exact', 'Dynamics', 'NetSuite'].map((erp) => (
                <span key={erp} className="bg-warm-bg-alt rounded-lg px-3 py-1 text-sm font-medium text-text-secondary">
                  {erp}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Exceptions */}
          <div className="md:col-span-2 bg-card-white rounded-2xl p-8 border border-gray-100 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 flex flex-col justify-center group">
            <h3 className="text-xl font-bold text-text-primary mb-2">Handles the Exceptions</h3>
            <p className="text-text-secondary text-sm">
              Unclear line items. Missing vendor codes. Weird formatting. OrderPilot flags what needs human attention and processes everything else. Your team handles the 5% that actually requires judgment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoBenefits;
