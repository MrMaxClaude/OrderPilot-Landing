import React, { useState, useEffect } from 'react';
import { X, Calculator, ArrowRight, CheckCircle } from 'lucide-react';

interface CostCalculatorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CostCalculatorPopup: React.FC<CostCalculatorPopupProps> = ({ isOpen, onClose }) => {
  const [ordersPerMonth, setOrdersPerMonth] = useState(500);
  const [minutesPerOrder, setMinutesPerOrder] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [savings, setSavings] = useState({ hours: 0, cost: 0 });

  useEffect(() => {
    const totalMinutes = ordersPerMonth * minutesPerOrder;
    const totalHours = totalMinutes / 60;
    const totalCost = totalHours * hourlyRate;
    
    // OrderPilot reduces time by 85%
    const savedHours = totalHours * 0.85;
    const savedCost = totalCost * 0.85;

    setSavings({
      hours: Math.round(savedHours),
      cost: Math.round(savedCost)
    });
  }, [ordersPerMonth, minutesPerOrder, hourlyRate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-card-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-tabFadeIn">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Inputs */}
          <div className="p-8 md:p-12 border-r border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rb2-orange/10 text-rb2-orange rounded-xl flex items-center justify-center">
                <Calculator size={20} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Savings Calculator</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-text-primary">Orders per month</label>
                  <span className="text-rb2-orange font-black">{ordersPerMonth}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100"
                  value={ordersPerMonth}
                  onChange={(e) => setOrdersPerMonth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rb2-orange"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-text-primary">Minutes per order (manual)</label>
                  <span className="text-rb2-orange font-black">{minutesPerOrder}m</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={minutesPerOrder}
                  onChange={(e) => setMinutesPerOrder(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rb2-orange"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-text-primary">Hourly rate (€)</label>
                  <span className="text-rb2-orange font-black">€{hourlyRate}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rb2-orange"
                />
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="p-8 md:p-12 bg-warm-bg flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-8">Your Potential Savings</h3>
              
              <div className="space-y-8 mb-12">
                <div>
                  <div className="text-4xl font-black text-text-primary mb-1">
                    €{savings.cost.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-text-muted uppercase tracking-wider">Annual Cost Savings</div>
                </div>

                <div>
                  <div className="text-4xl font-black text-rb2-orange mb-1">
                    {savings.hours.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-text-muted uppercase tracking-wider">Hours Saved Per Year</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-text-primary">
                  <CheckCircle size={16} className="text-green-accent" />
                  <span>85% reduction in manual labor</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-text-primary">
                  <CheckCircle size={16} className="text-green-accent" />
                  <span>100% data accuracy guarantee</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-12 w-full bg-text-primary text-white rounded-2xl font-bold py-4 hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              Get Detailed Report <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculatorPopup;
