
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Calculator } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CalculatorCTA: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show on calculator page
    if (location.pathname === '/calculator') {
      setVisible(false);
      return;
    }

    // Show after 5s OR 40% scroll — whichever comes first
    const timer = setTimeout(() => setVisible(true), 5000);

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4) setVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const minimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMinimized(true);
  };

  if (!visible || location.pathname === '/calculator') return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 cta-enter">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 bg-white hover:bg-[#FFF9F5] rounded-full shadow-xl border border-gray-100 p-3 px-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group border-l-4 border-l-rb2-orange"
        >
          <div className="w-8 h-8 rounded-full bg-rb2-orange/10 flex items-center justify-center text-rb2-orange group-hover:bg-rb2-orange group-hover:text-white transition-all duration-300">
            <Calculator size={18} />
          </div>
          <span className="text-sm font-bold text-gray-900 pr-1">Calculate your costs</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-8 sm:right-8 sm:left-auto z-50 max-w-full sm:max-w-md cta-enter">
      <Link 
        to="/calculator"
        className="block bg-gradient-to-br from-white to-[#FFF9F5] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-100/80 border-l-4 border-l-rb2-orange p-6 sm:p-9 relative hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden backdrop-blur-sm sm:backdrop-blur-none bg-white/95 sm:bg-transparent"
      >
        {/* Decorative element - subtle icon mark */}
        <div className="absolute -top-6 -right-6 rotate-12 group-hover:rotate-0 transition-transform duration-700 opacity-[0.08]">
          <img 
            src="/logo.svg" 
            alt="" 
            className="w-48 h-48 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Minimize button */}
        <button
          onClick={minimize}
          className="absolute top-4 right-4 text-gray-200 hover:text-gray-400 transition-colors z-20"
        >
          <X size={16} />
        </button>

        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-4 sm:gap-0">
          <div className="flex-1">
            {/* Eyebrow - Desktop only */}
            <p className="hidden sm:block text-[10px] font-bold tracking-[0.2em] text-rb2-orange/70 uppercase mb-4">
              / Free calculator
            </p>
            
            <h3 className="text-lg sm:text-2xl font-[800] text-gray-900 leading-[1.3] mb-1 sm:mb-3">
              What's <span className="font-serif italic text-rb2-orange">the real cost</span> of processing POs by hand?
            </h3>
            
            {/* Subtext - Desktop only */}
            <p className="hidden sm:block text-sm text-gray-400 mb-5">
              7 questions. 2 minutes. Find your number.
            </p>
          </div>

          <div
            className="flex-shrink-0 sm:flex-shrink sm:inline-flex items-center px-4 py-2 bg-rb2-orange/10 text-rb2-orange rounded-full font-bold text-sm hover:bg-rb2-orange hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-orange-200/50"
          >
            Calculate now
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
          </div>
        </div>
        
        {/* Mobile safe area padding */}
        <div className="sm:hidden pb-safe" />
      </Link>
    </div>
  );
};

export default CalculatorCTA;
