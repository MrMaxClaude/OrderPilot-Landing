
import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, ArrowRight, Database, Server, Check } from 'lucide-react';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';

const HowItWorks: React.FC = () => {
  const sectionRef = useScrollAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      title: 'Connect',
      icon: Mail,
      description: "Hook up your email inbox and ERP system. OrderPilot has native connectors for Business Central, Exact Online, Odoo, plus NetSuite and SAP. Setup takes hours, not weeks.",
      illustration: (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-tabFadeIn">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-md relative">
            {/* Left Card: Inbox */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">/ EMAIL INBOX</span>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-48 relative overflow-hidden animate-connectPop1">
                {/* Large Checkmark Overlay */}
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 opacity-0 animate-connectCheckLarge1">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <Check size={28} strokeWidth={3} />
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 bg-rb2-orange rounded-full animate-ping"></div>
                </div>
                <div className="w-8 h-8 bg-rb2-orange/10 rounded-lg flex items-center justify-center text-rb2-orange mb-4">
                  <Mail size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-text-primary truncate">orders@company.com</div>
                  <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                    <div className="h-full bg-rb2-orange/30 w-full animate-pulse"></div>
                  </div>
                  <div className="h-1.5 w-3/4 bg-gray-100 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1/2 bg-gray-100 rounded"></div>
                    <Check size={10} className="text-green-500 animate-connectCheck1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Line - Sequenced Filling */}
            <div className="relative flex-1 h-1.5 w-24 md:w-auto bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-rb2-orange w-0 animate-connectLine"></div>
            </div>

            {/* Right Card: ERP */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">/ YOUR ERP</span>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-48 relative overflow-hidden animate-connectPop2">
                {/* Large Checkmark Overlay */}
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 opacity-0 animate-connectCheckLarge2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <Check size={28} strokeWidth={3} />
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 mb-4">
                  <Server size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-text-primary">SAP S/4HANA</div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-4 bg-gray-100 rounded"></div>
                    <div className="h-1.5 w-8 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                    <div className="h-full bg-blue-500/20 w-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1/3 bg-gray-100 rounded"></div>
                    <Check size={10} className="text-green-500 animate-connectCheck2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badges - Sequenced */}
          <div className="mt-12 relative h-8 w-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-100 text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full flex items-center justify-center gap-2 animate-connectStatus1">
              <Search size={12} className="animate-spin" />
              CONNECTING...
            </div>
            <div className="absolute inset-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full flex items-center justify-center gap-2 opacity-0 animate-connectStatus2">
              <CheckCircle size={14} />
              SYSTEMS SYNCED
            </div>
          </div>

          {/* ERP Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['Business Central', 'Exact Online', 'Odoo', 'NetSuite', 'SAP'].map((erp, i) => (
              <span
                key={erp}
                className="text-[10px] font-bold text-text-muted uppercase tracking-wider animate-tabFadeIn"
                style={{ animationDelay: `${3.5 + i * 0.1}s` }}
              >
                {erp}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Process',
      icon: Search,
      description: (
        <>
          <p className="mb-4">Purchase orders arrive by email. OrderPilot reads the document — whatever the format — and extracts every field: vendor, PO number, line items, quantities, prices, delivery dates.</p>
          <p>No templates to configure. No rules to maintain. It reads the document the way your best team member would. Faster.</p>
        </>
      ),
      illustration: (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-tabFadeIn">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-2xl">
            {/* Left: Raw Document */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">/ RAW DOCUMENT</span>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 w-56 h-72 relative overflow-hidden -rotate-1">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-rb2-orange/40 animate-scan z-10"></div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-rb2-orange/20 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                    <div className="h-2 w-4/6 bg-gray-100 rounded"></div>
                  </div>
                  <div className="pt-4 space-y-3">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex gap-2">
                        <div className="h-2 w-2 bg-gray-200 rounded"></div>
                        <div className="h-2 flex-1 bg-gray-100 rounded"></div>
                        <div className="h-2 w-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-rb2-orange text-white text-[10px] font-bold px-3 py-1 rounded-full">
                PROCESSING
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block">
              <ArrowRight className="text-rb2-orange/40" size={32} />
            </div>

            {/* Right: Extracted Data */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">/ EXTRACTED DATA</span>
              <div className="space-y-2 w-64">
                {[
                  { label: 'Customer', value: 'Breman Groep' },
                  { label: 'PO #', value: 'PO-2024-0847' },
                  { label: 'Items', value: '3' },
                  { label: 'Total', value: '€12,450.00' }
                ].map((field, i) => (
                  <div 
                    key={i} 
                    className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-center justify-between animate-staggerIn"
                    style={{ animationDelay: `${i * 0.15 + 0.5}s` }}
                  >
                    <div>
                      <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{field.label}</div>
                      <div className="text-xs font-bold text-text-primary">{field.value}</div>
                    </div>
                    <Check className="text-green-500" size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Validate & Deliver',
      icon: CheckCircle,
      description: (
        <>
          <p className="mb-4">Every extracted data point gets checked against your ERP master data. Vendor names matched. Product codes verified. Prices validated.</p>
          <p>Clean, validated data lands in your ERP automatically. Your team reviews exceptions only. The routine work is done.</p>
        </>
      ),
      illustration: (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-tabFadeIn">
          <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mb-8">
            <div className="flex items-center justify-between w-full gap-4">
              {/* Left: OrderPilot */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">ORDERPILOT</span>
                <div className="bg-white rounded-2xl shadow-sm border border-rb2-orange/30 p-4 w-36">
                  <div className="text-[10px] font-bold text-text-primary">Extracted PO</div>
                  <div className="h-1.5 w-full bg-rb2-orange/10 rounded mt-2 overflow-hidden">
                    <div className="h-full bg-rb2-orange w-0 animate-loopStep1"></div>
                  </div>
                </div>
              </div>

              {/* Flow 1 */}
              <div className="flex-1 h-1 bg-gray-100 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-rb2-orange w-0 animate-loopStep2"></div>
              </div>

              {/* Center: Master Data Catalog */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">VALIDATION</span>
                <div className="bg-white rounded-2xl shadow-md border-2 border-green-500/30 p-4 w-40 relative overflow-hidden animate-loopStep3">
                  <div className="absolute inset-0 bg-green-500/5"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <Database size={20} className="text-green-600 mb-2" />
                    <div className="text-[10px] font-bold text-green-700">MASTER DATA</div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow 2 */}
              <div className="flex-1 h-1 bg-gray-100 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-green-500 w-0 animate-loopStep4"></div>
              </div>

              {/* Right: ERP */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">ERP SYSTEM</span>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-36">
                  <div className="text-[10px] font-bold text-text-primary">SAP S/4HANA</div>
                  <div className="h-1.5 w-full bg-blue-100 rounded mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 w-0 animate-loopStep5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl border-l-4 border-green-500 p-6 shadow-lg shadow-green-100/50 max-w-sm w-full animate-tabFadeIn" style={{ animationDelay: '2.5s' }}>
            <div className="flex items-center gap-3 text-green-600 font-bold mb-2">
              <CheckCircle size={20} />
              Validated & Synced
            </div>
            <div className="text-xs text-text-muted font-medium">
              PO-2024-0847 — All lines matched
            </div>
          </div>

          {/* Validation Badges */}
          <div className="mt-8 flex gap-3">
            {['Vendor Match ✓', 'Price Check ✓', 'SKU Verified ✓'].map((badge, i) => (
              <span 
                key={i} 
                className="text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-100 animate-tabFadeIn"
                style={{ animationDelay: `${2.8 + i * 0.1}s` }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000); // 8 seconds per step, allowing the 7.5s animations to complete

    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="how-it-works" className="py-32 lg:py-40 bg-[#F5F3EF] fade-in" ref={sectionRef as any}>
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          95% { top: 85%; opacity: 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes loopStep1 {
          0%, 5% { width: 0%; }
          15%, 100% { width: 100%; }
        }
        @keyframes loopStep2 {
          0%, 15% { width: 0%; }
          30%, 100% { width: 100%; }
        }
        @keyframes loopStep3 {
          0%, 30% { opacity: 1; transform: scale(1); }
          40%, 55% { opacity: 0.7; transform: scale(1.05); }
          65%, 100% { opacity: 1; transform: scale(1); }
        }
        @keyframes loopStep4 {
          0%, 55% { width: 0%; }
          65%, 100% { width: 100%; }
        }
        @keyframes loopStep5 {
          0%, 65% { width: 0%; }
          80%, 100% { width: 100%; }
        }
        @keyframes connectPop1 {
          0%, 5% { transform: scale(0.9); opacity: 0.5; }
          15%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes connectPop2 {
          0%, 45% { transform: scale(0.9); opacity: 0.5; }
          55%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes connectCheck1 {
          0%, 20% { opacity: 0; transform: scale(0); }
          25%, 100% { opacity: 1; transform: scale(1); }
        }
        @keyframes connectCheck2 {
          0%, 60% { opacity: 0; transform: scale(0); }
          65%, 100% { opacity: 1; transform: scale(1); }
        }
        @keyframes connectLine {
          0%, 25% { width: 0%; }
          50%, 100% { width: 100%; }
        }
        @keyframes connectStatus1 {
          0%, 75% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }
        @keyframes connectStatus2 {
          0%, 75% { opacity: 0; transform: translateY(5px); }
          80%, 95% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(5px); }
        }
        @keyframes connectCheckLarge1 {
          0%, 15% { opacity: 0; transform: scale(0.8); }
          20%, 95% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes connectCheckLarge2 {
          0%, 75% { opacity: 0; transform: scale(0.8); }
          80%, 95% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes staggerIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-progressFill { animation: progressFill 1.5s ease-out forwards; }
        .animate-staggerIn { animation: staggerIn 0.5s ease-out forwards; opacity: 0; }
        .animate-loopStep1 { animation: loopStep1 7.5s ease-in-out infinite; }
        .animate-loopStep2 { animation: loopStep2 7.5s ease-in-out infinite; }
        .animate-loopStep3 { animation: loopStep3 7.5s ease-in-out infinite; }
        .animate-loopStep4 { animation: loopStep4 7.5s ease-in-out infinite; }
        .animate-loopStep5 { animation: loopStep5 7.5s ease-in-out infinite; }
        .animate-connectPop1 { animation: connectPop1 7.5s ease-in-out infinite; }
        .animate-connectPop2 { animation: connectPop2 7.5s ease-in-out infinite; }
        .animate-connectCheck1 { animation: connectCheck1 7.5s ease-in-out infinite; }
        .animate-connectCheck2 { animation: connectCheck2 7.5s ease-in-out infinite; }
        .animate-connectLine { animation: connectLine 7.5s ease-in-out infinite; }
        .animate-connectStatus1 { animation: connectStatus1 7.5s ease-in-out infinite; }
        .animate-connectStatus2 { animation: connectStatus2 7.5s ease-in-out infinite; }
        .animate-connectCheckLarge1 { animation: connectCheckLarge1 7.5s ease-in-out infinite; }
        .animate-connectCheckLarge2 { animation: connectCheckLarge2 7.5s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 mb-16">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ HOW IT WORKS</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[800] tracking-tight text-text-primary mb-6">
          Three steps. Zero <span className="font-serif italic text-rb2-orange">manual entry.</span>
        </h2>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed">
          AI handles the processing. Your team handles the exceptions.
        </p>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Steps */}
          <div className="relative space-y-4">
            {/* Vertical connector line */}
            <div className="absolute left-12 top-12 bottom-12 w-px bg-gray-200 -z-10"></div>
            
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => handleStepClick(i)}
                className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeStep === i 
                    ? 'bg-white border-rb2-orange/20 shadow-xl' 
                    : 'bg-transparent border-transparent hover:bg-white/40'
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeStep === i 
                      ? 'bg-rb2-orange text-white' 
                      : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    <step.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold transition-colors duration-500 ${
                      activeStep === i ? 'text-text-primary' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 ${
                      activeStep === i ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="text-sm text-text-secondary leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Illustration Viewport */}
          <div className="lg:sticky lg:top-32 bg-[#EDEBE8] rounded-[2rem] overflow-hidden relative min-h-[500px] flex items-center justify-center shadow-inner">
            {/* Subtle dot grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div key={activeStep} className="w-full h-full">
              {steps[activeStep].illustration}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <a 
            href="#contact" 
            className="inline-flex items-center px-10 py-5 bg-rb2-orange text-white rounded-2xl font-bold text-lg hover:bg-rb2-orange-hover hover:shadow-2xl hover:shadow-orange-200 transition-all hover:-translate-y-1"
          >
            See It Work With Your POs
            <ArrowRight className="ml-2" size={20} />
          </a>
          <p className="text-sm text-text-muted mt-6 font-medium">
            Talk to our team about your PO processing challenges and explore if OrderPilot fits.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
