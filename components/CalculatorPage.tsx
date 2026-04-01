
import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Users,
  AlertTriangle,
  Clock,
  RefreshCw,
  Lightbulb,
  Database,
  Building2,
  Mail,
  CheckCircle,
  Check,
  Search,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePostHogTracking } from '../src/hooks/usePostHogTracking';
import Logo from './Logo';

// --- CONSTANTS & LOGIC ---

const HOURLY_STAFF_COST = 42;
const MANAGER_HOURLY_COST = 62;
const ERROR_RESOLUTION_TIME = 0.33;
const AVG_INVOICE_VALUE = 2500;
const EARLY_PAYMENT_DISCOUNT = 0.02;
const REWORK_RATE = 0.25;
const ESCALATION_RATE = 0.10;

interface QuestionOption {
  label: string;
  value: any;
}

interface Question {
  key: string;
  icon: any;
  question: string;
  options: QuestionOption[];
  feedback: (val: any, answers: any) => string;
}

const questions: Question[] = [
  {
    key: 'volume',
    icon: Mail,
    question: 'How many purchase orders does your team process per month?',
    options: [
      { label: 'Under 50', value: 25 },
      { label: '50–150', value: 100 },
      { label: '150–300', value: 225 },
      { label: '300+', value: 400 }
    ],
    feedback: (val: number) => {
      const yearly = val * 12;
      return `That's roughly ${yearly.toLocaleString()} orders per year.${val >= 100 ? ' Every minute per order adds up fast.' : ''}`;
    }
  },
  {
    key: 'time',
    icon: Clock,
    question: 'How long does it take to process one PO — from email to ERP entry?',
    options: [
      { label: 'Under 10 minutes', value: 0.125 },
      { label: '10–20 minutes', value: 0.25 },
      { label: '20–30 minutes', value: 0.42 },
      { label: '30+ minutes', value: 0.58 }
    ],
    feedback: (val: number, answers: any) => {
      const weeklyHours = ((answers.volume || 100) * val * 12 / 52).toFixed(1);
      if (val <= 0.125) return `That's about ${weeklyHours} hours per week on data entry.`;
      if (val <= 0.25) return `That's ${weeklyHours} hours per week. Almost a full workday, every week, just on PO entry.`;
      if (val <= 0.42) return `That's ${weeklyHours} hours per week. That's a part-time employee doing nothing but copy-pasting.`;
      return `That's ${weeklyHours} hours per week — more than a full workday, every single week.`;
    }
  },
  {
    key: 'team',
    icon: Users,
    question: 'How many people spend time processing POs?',
    options: [
      { label: '1 person', value: 1 },
      { label: '2–3 people', value: 2.5 },
      { label: '4–5 people', value: 4.5 },
      { label: '6+ people', value: 7 }
    ],
    feedback: (val: number) => {
      if (val === 1) return 'One person handling all PO processing. That\'s a single point of failure.';
      if (val <= 2.5) return 'Multiple people spending their day on manual data entry instead of procurement work.';
      if (val <= 4.5) return 'That\'s significant headcount dedicated to a process that should be automated.';
      return 'Six or more people. The coordination overhead alone costs thousands per year.';
    }
  },
  {
    key: 'errors',
    icon: AlertTriangle,
    question: 'How often do PO processing errors occur — wrong quantities, incorrect prices, mismatched vendor codes?',
    options: [
      { label: 'Rarely (under 5%)', value: 0.03 },
      { label: 'Sometimes (5–10%)', value: 0.075 },
      { label: 'Often (10–20%)', value: 0.15 },
      { label: 'Very often (20%+)', value: 0.25 }
    ],
    feedback: (val: number, answers: any) => {
      const monthlyErrors = Math.round((answers.volume || 100) * val);
      if (val <= 0.03) return `Even at 3%, that's ${monthlyErrors} errors per month that each cost €35–€120 to fix.`;
      if (val <= 0.075) return `At your volume, that's roughly ${monthlyErrors} errors per month. Each one takes 15–30 minutes to find and fix.`;
      if (val <= 0.15) return `That's ${monthlyErrors} errors per month. At €75 average cost per error, the math isn't pretty.`;
      return `${monthlyErrors} errors per month. This is likely causing supplier relationship damage on top of direct costs.`;
    }
  },
  {
    key: 'delay',
    icon: Clock,
    question: 'What\'s the typical delay between receiving a PO email and entering it into your ERP?',
    options: [
      { label: 'Same day', value: 0 },
      { label: '1–2 days', value: 1.5 },
      { label: '3–5 days', value: 4 },
      { label: 'More than 5 days', value: 7 }
    ],
    feedback: (val: number, answers: any) => {
      if (val === 0) return 'Good. Same-day processing minimizes lost discounts and keeps suppliers happy.';
      if (val <= 1.5) return 'A 1-2 day delay means you\'re likely missing early payment discounts on some orders.';
      const volume = answers.volume || 100;
      if (val <= 4) return `At 3-5 days, you're almost certainly losing 2% early payment discounts. On ${volume} POs/month at €2,500 average, that's serious money.`;
      return 'Over 5 days. That\'s lost discounts, delayed deliveries, and suppliers who stop prioritizing your orders.';
    }
  },
  {
    key: 'erp',
    icon: Database,
    question: 'Which ERP system does your team use?',
    options: [
      { label: 'Business Central', value: 'business-central' },
      { label: 'Exact Online', value: 'exact' },
      { label: 'Odoo', value: 'odoo' },
      { label: 'NetSuite', value: 'netsuite' },
      { label: 'SAP', value: 'sap' },
      { label: 'Other', value: 'other' }
    ],
    feedback: (val: string) => {
      if (val === 'other') return 'We may be able to connect to your system via API. We\'ll include details in your report.';
      const names: any = { 'business-central': 'Business Central', exact: 'Exact Online', odoo: 'Odoo', netsuite: 'NetSuite', sap: 'SAP' };
      return `OrderPilot has a native ${names[val]} connector. Direct integration, no middleware.`;
    }
  },
  {
    key: 'size',
    icon: Building2,
    question: 'How many employees does your company have?',
    options: [
      { label: 'Under 50', value: 25 },
      { label: '50–150', value: 100 },
      { label: '150–300', value: 225 },
      { label: '300–500', value: 400 },
      { label: '500+', value: 600 }
    ],
    feedback: (val: number) => {
      if (val === 25) return 'Got it. We\'ll benchmark you against similar-sized companies.';
      if (val <= 400) return 'Mid-market companies your size typically spend €40,000–€90,000 annually on PO processing. Let\'s see your exact number.';
      return 'At your scale, processing costs compound fast. Let\'s calculate the real number.';
    }
  }
];

function calculateCosts(answers: any) {
  const volume = answers.volume || 100;
  const time = answers.time || 0.25;
  const errors = answers.errors || 0.075;
  const delay = answers.delay || 0;

  // 1. Direct Labor
  const laborCost = volume * time * HOURLY_STAFF_COST * 12;

  // 2. Error Correction
  const monthlyErrors = volume * errors;
  const errorCost = monthlyErrors * ERROR_RESOLUTION_TIME * HOURLY_STAFF_COST * 12;

  // 3. Processing Delays (lost discounts)
  let delayCost = 0;
  if (delay > 0) {
    let delayFactor = 0;
    if (delay <= 1.5) delayFactor = 0.30;
    else if (delay <= 4) delayFactor = 0.60;
    else delayFactor = 0.85;

    const delayedPOs = volume * delayFactor;
    delayCost = delayedPOs * AVG_INVOICE_VALUE * EARLY_PAYMENT_DISCOUNT * 12;
  }

  // 4. Rework & Escalation
  const monthlyRework = monthlyErrors * REWORK_RATE;
  const reworkCost = monthlyRework * ERROR_RESOLUTION_TIME * HOURLY_STAFF_COST * 12;
  const monthlyEscalations = volume * ESCALATION_RATE;
  const escalationCost = monthlyEscalations * 0.5 * MANAGER_HOURLY_COST * 12;
  const reworkEscalationCost = reworkCost + escalationCost;

  const totalCost = laborCost + errorCost + delayCost + reworkEscalationCost;
  const costPerPO = totalCost / (volume * 12);
  const weeklyHours = (volume * time * 12 / 52);
  const annualHours = weeklyHours * 52;
  const potentialSavings = totalCost - 6000;

  return {
    laborCost: Math.round(laborCost),
    errorCost: Math.round(errorCost),
    delayCost: Math.round(delayCost),
    reworkEscalationCost: Math.round(reworkEscalationCost),
    totalCost: Math.round(totalCost),
    costPerPO: Math.round(costPerPO),
    weeklyHours: weeklyHours.toFixed(1),
    annualHours: Math.round(annualHours),
    potentialSavings: Math.round(potentialSavings),
    roi: (totalCost / 6000).toFixed(1),
    largestCategory: getLargestCategory({ laborCost, errorCost, delayCost, reworkEscalationCost })
  };
}

function getLargestCategory(costs: any) {
  const categories = [
    { name: 'Processing delays', value: costs.delayCost },
    { name: 'Direct labor', value: costs.laborCost },
    { name: 'Rework & escalation', value: costs.reworkEscalationCost },
    { name: 'Error correction', value: costs.errorCost }
  ];
  return categories.sort((a, b) => b.value - a.value)[0].name;
}

// --- HOOKS ---

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

// --- COMPONENT ---

const categories = [
  { label: 'LABOR', questions: [0, 1, 2] },
  { label: 'ERRORS', questions: [3] },
  { label: 'DELAYS', questions: [4] },
  { label: 'CONTEXT', questions: [5, 6] }
];

const CalculatorPage: React.FC = () => {
  const [phase, setPhase] = useState<'intro' | 'questions' | 'results' | 'thankyou'>('intro');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { track, trackPageView, identifyUser } = usePostHogTracking();

  // Track calculator started
  useEffect(() => {
    if (phase === 'questions' && currentStep === 0) {
      track('calculator_started', {
        entry_point: document.referrer.includes('orderpi') ? 'internal' : 'external',
      });
    }
  }, [phase, currentStep, track]);

  // Track page view
  useEffect(() => {
    trackPageView('calculator', {
      phase: phase,
      step: currentStep,
    });
  }, [trackPageView, phase, currentStep]);

  const results = useMemo(() => {
    if (Object.keys(answers).length < 7) return null;
    return calculateCosts(answers);
  }, [answers]);

  const animatedTotal = useCountUp(results?.totalCost || 0);

  const handleSelect = (key: string, value: any) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentStep < 6) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPhase('results');
        // Track calculator completion
        const finalResults = calculateCosts(newAnswers);
        if (finalResults) {
          track('calculator_completed', {
            cost_savings: finalResults.potentialSavings || 0,
            po_volume: newAnswers.volume || 0,
            processing_time: newAnswers.time || 0,
            team_size: newAnswers.team || 0,
          });
        }
      }
    }, 600);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else setPhase('intro');
  };

  const goNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
    else setPhase('results');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for PDF generation
      const reportData = {
        email,
        firstName,
        companyName: answers.company || '',
        monthlyVolume: answers.volume || 225,
        timePerPO: answers.time ? Math.round(answers.time * 60) : 18, // Convert hours to minutes
        errorRate: answers.errors || 12,
        erpSystem: erpName
      };

      // Call our PDF generation API
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Track successful completion
      track('calculator_completed', {
        cost_savings: parseFloat(result.data?.annualSavings?.replace(/[^0-9.-]+/g, '') || '0'),
        po_volume: reportData.monthlyVolume * 12,
        processing_time: reportData.timePerPO,
        team_size: answers.team || 1,
      });

      // Track PDF report generation and delivery
      track('pdf_report_generated', {
        email: email,
        company_name: reportData.companyName,
        annual_savings: parseFloat(result.data?.annualSavings?.replace(/[^0-9.-]+/g, '') || '0'),
        monthly_po_volume: reportData.monthlyVolume,
        erp_system: erpName,
        lead_score: reportData.monthlyVolume * (reportData.timePerPO / 60) * 42 * 12, // Rough lead score based on cost
      });

      // Identify user in PostHog
      identifyUser(email, {
        first_name: firstName,
        email: email,
        company_name: reportData.companyName,
        monthly_po_volume: reportData.monthlyVolume,
      });

      setIsSubmitting(false);
      setShowEmailModal(false);
      setPhase('thankyou');

    } catch (error) {
      console.error('Error generating PDF report:', error);
      setIsSubmitting(false);

      // Still show success to user but track the error
      track('calculator_error', {
        error_type: 'pdf_generation_failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      // Show success anyway - better UX
      setShowEmailModal(false);
      setPhase('thankyou');
    }
  };

  const erpName = useMemo(() => {
    const val = answers.erp;
    const names: any = { 'business-central': 'Business Central', exact: 'Exact Online', odoo: 'Odoo', netsuite: 'NetSuite', sap: 'SAP', other: 'ERP' };
    return names[val] || 'ERP';
  }, [answers.erp]);

  const sortedCategories = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Processing delays', value: results.delayCost },
      { name: 'Direct labor', value: results.laborCost },
      { name: 'Rework & escalation', value: results.reworkEscalationCost },
      { name: 'Error correction', value: results.errorCost }
    ].sort((a, b) => b.value - a.value);
  }, [results]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.questions.includes(currentStep))?.label || 'CONTEXT';
  }, [currentStep]);

  // --- RENDER HELPERS ---

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Top bar — on warm background */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size={40} />
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Back to homepage
        </Link>
      </div>

      {/* Dark card container — Centered */}
      <div className="flex items-center justify-center px-6 pb-12 pt-4">
        <div className="w-full max-w-4xl bg-gray-900 rounded-[2.5rem] p-8 md:p-14 lg:p-16 relative overflow-hidden shadow-2xl min-h-[650px] flex flex-col">
          {/* Dot grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {phase === 'intro' && (
            <div className="relative z-10 animate-fadeIn">
              {/* Right side decorative element — abstract bar chart shape */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.06] pointer-events-none">
                <div className="flex items-end gap-3 h-64">
                  <div className="w-12 bg-white rounded-t-lg" style={{ height: '40%' }} />
                  <div className="w-12 bg-white rounded-t-lg" style={{ height: '70%' }} />
                  <div className="w-12 bg-white rounded-t-lg" style={{ height: '55%' }} />
                  <div className="w-12 bg-rb2-orange rounded-t-lg" style={{ height: '100%' }} />
                </div>
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-rb2-orange" />
                <span className="text-xs font-bold tracking-[0.2em] text-rb2-orange uppercase">
                  Free Assessment
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-[800] text-white tracking-tight leading-[1.1] max-w-xl">
                What does manual PO processing{' '}
                <span className="font-serif italic text-rb2-orange">actually cost you?</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-400 mt-6 max-w-lg leading-relaxed">
                7 questions. 2 minutes. Find out exactly where your procurement budget leaks — and how much.
              </p>

              {/* Substantial category pills */}
              <div className="flex flex-wrap gap-3 mt-12">
                {[
                  { icon: Users, label: 'LABOR' },
                  { icon: AlertTriangle, label: 'ERRORS' },
                  { icon: Clock, label: 'DELAYS' },
                  { icon: RefreshCw, label: 'REWORK' }
                ].map(cat => (
                  <div
                    key={cat.label}
                    className="flex flex-col items-center gap-2.5 bg-gray-800/80 border border-gray-700/50 rounded-2xl px-7 py-5 min-w-[100px]"
                  >
                    <cat.icon size={22} className="text-rb2-orange" />
                    <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-6 mt-12">
                {['7 questions', '2 minutes', 'Instant results'].map(text => (
                  <div key={text} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rb2-orange" />
                    <span className="text-sm text-gray-400 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button
                onClick={() => setPhase('questions')}
                className="mt-10 inline-flex items-center px-8 py-4 bg-rb2-orange text-white rounded-2xl font-bold text-lg hover:bg-rb2-orange-hover hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5"
              >
                Start the calculator
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          )}

          {phase === 'questions' && (
            <div className="relative z-10 flex flex-col h-full animate-fadeIn">
              {/* Category Navigation */}
              <div className="flex items-center gap-2 mb-6">
                {categories.map(cat => {
                  const isActive = cat.questions.includes(currentStep);
                  const isComplete = cat.questions.every(q => q < currentStep);
                  return (
                    <div
                      key={cat.label}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all ${
                        isActive
                          ? 'bg-rb2-orange text-white'
                          : isComplete
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-transparent border border-gray-700 text-gray-500'
                      }`}
                    >
                      {cat.label}
                    </div>
                  );
                })}

                {/* Question counter on the right */}
                <div className="ml-auto text-sm text-gray-500 font-mono">
                  <span className="text-white font-bold">{String(currentStep + 1).padStart(2, '0')}</span>
                  <span className="text-gray-600">/07</span>
                </div>
              </div>

              {/* Thin progress line */}
              <div className="w-full h-0.5 bg-gray-800 rounded-full mb-10">
                <div
                  className="h-full bg-rb2-orange rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
                />
              </div>

              <div key={currentStep} className="animate-slideInRight">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest font-bold">
                  {currentCategory} — Question {currentStep + 1} of 7
                </p>
                <h2 className="text-2xl md:text-3xl font-[800] text-white tracking-tight leading-snug max-w-xl">
                  {questions[currentStep].question}
                </h2>

                {/* Vertical stack options */}
                <div className="mt-10 space-y-3 max-w-2xl">
                  {questions[currentStep].options.map((option, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isSelected = answers[questions[currentStep].key] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(questions[currentStep].key, option.value)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 relative overflow-hidden ${
                          isSelected
                            ? 'bg-rb2-orange/10 border border-rb2-orange/40 shadow-[0_0_20px_rgba(255,69,0,0.1)]'
                            : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        {/* Letter label */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-rb2-orange text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {letter}
                        </div>

                        {/* Option text */}
                        <span className={`text-sm font-medium transition-all ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {option.label}
                        </span>

                        {/* Selected glow effect */}
                        {isSelected && (
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rb2-orange/50 to-transparent" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Micro-feedback */}
                {answers[questions[currentStep].key] !== undefined && (
                  <div className="mt-6 bg-gray-800/80 rounded-xl p-4 border border-gray-700/30 animate-fadeIn max-w-2xl">
                    <div className="flex gap-3">
                      <Lightbulb size={16} className="text-rb2-orange flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {questions[currentStep].feedback(answers[questions[currentStep].key], answers)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-auto pt-10">
                <button onClick={goBack} className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>

                <button
                  onClick={goNext}
                  disabled={answers[questions[currentStep].key] === undefined}
                  className="inline-flex items-center px-8 py-4 bg-rb2-orange text-white rounded-2xl font-bold text-sm disabled:opacity-20 disabled:cursor-not-allowed hover:bg-rb2-orange-hover hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Continue <ArrowRight className="ml-1" size={16} />
                </button>
              </div>
            </div>
          )}

          {phase === 'results' && results && (
            <div className="relative z-10 animate-fadeIn flex flex-col h-full">
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-6">
                  Your hidden PO processing costs
                </p>
                <p className="text-7xl md:text-8xl font-[800] text-white tracking-tight">
                  €{animatedTotal.toLocaleString()}
                </p>
                <p className="text-xl text-gray-400 mt-3 font-serif italic">per year</p>
                <p className="text-sm text-gray-500 mt-2">
                  That's €{results.costPerPO} for every purchase order your team processes manually.
                </p>
              </div>

              <div className="max-w-xl mx-auto w-full bg-gray-800/40 rounded-3xl p-8 border border-gray-700/30">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-8">
                  Where the money goes
                </p>
                <div className="space-y-6">
                  {sortedCategories.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-gray-400 w-24 sm:w-32 text-right flex-shrink-0 uppercase tracking-tighter">{cat.name}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-rb2-orange rounded-full"
                          style={{
                            width: `${(cat.value / results.totalCost * 100)}%`,
                            opacity: 0.4 + (cat.value / results.totalCost * 0.6),
                            animation: `barGrow 1s ease-out ${i * 0.2}s forwards`,
                            transform: 'scaleX(0)',
                            transformOrigin: 'left'
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-20 flex-shrink-0">€{cat.value.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 w-10 flex-shrink-0">{Math.round(cat.value / results.totalCost * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-gray-500 mt-8 px-6">
                Your team spends <span className="font-bold text-white">{results.weeklyHours} hours per week</span> on manual PO processing.
              </p>

              <div className="mt-10 bg-gray-800/60 border border-gray-700/30 rounded-2xl p-8 text-center max-w-2xl mx-auto w-full">
                <p className="text-sm text-gray-400 mb-3">Based on companies your size</p>
                <p className="text-3xl md:text-4xl font-[800] text-white tracking-tight">
                  70–85%
                  <span className="text-lg font-normal text-gray-400 ml-2">cost reduction possible</span>
                </p>
                <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto leading-relaxed">
                  That's up to <span className="text-rb2-orange font-bold">€{Math.round(results.totalCost * 0.85).toLocaleString()}</span> back 
                  in your budget — and <span className="text-rb2-orange font-bold">{Math.round(results.weeklyHours * 0.85)} hours per week</span> back 
                  for your team.
                </p>
              </div>

              <div className="max-w-md mx-auto w-full mt-12 text-center">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full py-5 bg-rb2-orange text-white rounded-2xl font-bold text-lg hover:bg-rb2-orange-hover hover:shadow-2xl hover:shadow-orange-500/20 transition-all"
                >
                  Get Your Full Report
                  <ArrowRight className="inline ml-2" size={20} />
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Includes: industry benchmarks · ROI model · 90-day action plan
                </p>
              </div>

              <div className="text-center mt-8 pt-8 border-t border-gray-700/30 max-w-xl mx-auto w-full">
                <a href="/#demo" className="text-sm font-bold text-rb2-orange hover:underline">
                  Skip the report — book a demo instead →
                </a>
              </div>

              {/* Email Modal Overlay */}
              {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                  {/* Backdrop — results visible but dimmed */}
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowEmailModal(false)}
                  />

                  {/* Modal */}
                  <div className="relative bg-gray-900 rounded-3xl p-10 md:p-12 max-w-md w-full border border-gray-700/50 shadow-2xl animate-slideUp">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <X size={18} />
                    </button>

                    {/* Heading with Playfair accent */}
                    <h3 className="text-2xl md:text-3xl font-[800] text-white tracking-tight leading-snug">
                      Get your{' '}
                      <span className="font-serif italic text-rb2-orange">full report</span>
                    </h3>

                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                      Your hidden costs:{' '}
                      <span className="text-white font-bold">
                        €{results.totalCost.toLocaleString()}/year
                      </span>
                      . The report shows you exactly where — and how to fix it.
                    </p>

                    {/* Checklist — ORANGE checkmarks, not green */}
                    <div className="mt-6 space-y-2.5">
                      {[
                        'Detailed breakdown with methodology',
                        'Industry benchmarks for your company size',
                        'ROI model with exact savings projection',
                        '90-day action plan',
                        `${erpName}-specific integration guide`
                      ].map(item => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle size={15} className="text-rb2-orange flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Form inputs */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                      <input
                        type="text"
                        placeholder="First name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-800 rounded-xl border border-gray-700 focus:border-rb2-orange focus:outline-none focus:ring-2 focus:ring-rb2-orange/20 text-white placeholder-gray-500"
                      />
                      <input
                        type="email"
                        placeholder="Work email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-800 rounded-xl border border-gray-700 focus:border-rb2-orange focus:outline-none focus:ring-2 focus:ring-rb2-orange/20 text-white placeholder-gray-500"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !firstName || !email || !email.includes('@')}
                        className="w-full py-4 bg-rb2-orange text-white rounded-xl font-bold text-base disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 hover:shadow-xl hover:shadow-orange-500/20 transition-all mt-1"
                      >
                        {isSubmitting ? 'Sending...' : 'Send me the report'}
                        {!isSubmitting && <ArrowRight className="inline ml-2" size={18} />}
                      </button>
                    </form>

                    <p className="text-xs text-gray-600 mt-4 text-center">
                      Your data stays private. No spam. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'thankyou' && results && (
            <div className="relative z-10 animate-fadeIn flex flex-col h-full max-w-md mx-auto w-full text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto animate-scaleIn">
                <CheckCircle size={40} className="text-green-500" />
              </div>

              <h2 className="text-3xl font-[900] text-white mt-8">Check your inbox</h2>
              <p className="text-gray-400 mt-3 leading-relaxed">
                Your cost report is on its way to<br />
                <span className="font-bold text-white">{email}</span>
              </p>

              <div className="mt-12 bg-gray-800/40 border border-gray-700/30 rounded-3xl p-8 text-left shadow-2xl">
                <h3 className="text-xl font-[900] text-white leading-tight">
                  Talk to a procurement automation expert
                </h3>
                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                  Get in touch with our team to discuss your PO processing challenges
                  and see if OrderPilot is the right solution for your {erpName} setup.
                </p>
                <div className="flex items-center gap-3 mt-6 text-sm">
                  <span className="text-gray-500">Your cost: <span className="font-bold text-white">€{results.totalCost.toLocaleString()}</span></span>
                  <ArrowRight size={14} className="text-gray-600" />
                  <span className="text-rb2-orange font-bold">€6,000/yr</span>
                </div>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-rb2-orange text-white rounded-2xl font-bold text-lg mt-8 hover:bg-rb2-orange-hover hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Get in Touch
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-8">
                No commitment. No pressure. Just a conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
