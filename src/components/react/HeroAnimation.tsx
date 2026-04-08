import React, { useState, useEffect, useRef } from 'react';
import { Mail, FileText, Table } from 'lucide-react';

const purchaseOrders = [
  {
    type: 'email',
    vendor: "Breman Installatiegroep",
    poNumber: "PO-2024-0847",
    total: "€12,450.00",
    items: "3 items",
    header: "INCOMING EMAIL",
    color: "#FF4500",
    icon: <Mail className="w-3 h-3 text-[#FF4500]" />
  },
  {
    type: 'pdf',
    vendor: "Nedcargo Logistics",
    poNumber: "PO-2024-1203",
    total: "€8,920.00",
    items: "5 items",
    header: "PURCHASE ORDER",
    color: "#3B82F6", // blue-500
    icon: <FileText className="w-3 h-3 text-blue-500" />
  },
  {
    type: 'spreadsheet',
    vendor: "VDL Industrial Modules",
    poNumber: "PO-2024-0591",
    total: "€23,100.00",
    items: "7 items",
    header: "SPREADSHEET",
    color: "#10B981", // emerald-500
    icon: <Table className="w-3 h-3 text-emerald-500" />
  },
];

interface DocumentCardProps {
  phase?: string;
  style?: React.CSSProperties;
  poIndex: number;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ phase = 'queued', style = {}, poIndex }) => {
  const po = purchaseOrders[poIndex];
  
  return (
    <div 
      className={`
        absolute w-64 h-80 bg-white rounded-xl shadow-md border border-gray-200 p-6
        ${(phase === 'sliding' || phase === 'dissolving') ? 'document-sliding' : ''}
      `}
      style={style}
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        {po.icon}
        <span className={`text-[11px] font-bold uppercase tracking-wider ${po.type === 'email' ? 'text-[#FF4500]' : po.type === 'pdf' ? 'text-blue-600' : 'text-emerald-600'}`}>
          {po.header}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-400 w-10 uppercase font-bold">From:</span>
          <span className="text-[11px] font-bold text-gray-700 truncate flex-1">{po.vendor}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-400 w-10 uppercase font-bold">PO #:</span>
          <span className="text-[11px] font-bold text-[#FF4500]">{po.poNumber}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className={`grid grid-cols-3 gap-1 p-1 rounded mb-2 ${po.type === 'email' ? 'bg-orange-50' : po.type === 'pdf' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
          <span className={`text-[9px] uppercase font-bold px-1 ${po.type === 'email' ? 'text-[#FF4500]' : po.type === 'pdf' ? 'text-blue-600' : 'text-emerald-600'}`}>Item</span>
          <span className={`text-[9px] uppercase font-bold px-1 text-center ${po.type === 'email' ? 'text-[#FF4500]' : po.type === 'pdf' ? 'text-blue-600' : 'text-emerald-600'}`}>Qty</span>
          <span className={`text-[9px] uppercase font-bold px-1 text-right ${po.type === 'email' ? 'text-[#FF4500]' : po.type === 'pdf' ? 'text-blue-600' : 'text-emerald-600'}`}>Price</span>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 px-1 border-b border-gray-50 last:border-0 pb-1">
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
              <div className="h-2 bg-[#FF4500]/20 rounded-full w-1/2 mx-auto"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Total Amount</span>
        <span className="text-[12px] font-black text-gray-900">{po.total}</span>
      </div>
    </div>
  );
};

const HeroAnimation = () => {
  const [documents, setDocuments] = useState([
    { id: 1, poIndex: 0, phase: 'queued' },
    { id: 2, poIndex: 1, phase: 'queued' },
    { id: 3, poIndex: 2, phase: 'queued' },
  ]);
  const [currentPODataIndex, setCurrentPODataIndex] = useState(0);
  const [filledFields, setFilledFields] = useState([false, false, false, false]);
  const [showValidated, setShowValidated] = useState(false);
  const [shredParticles, setShredParticles] = useState([]);
  
  const nextIdRef = useRef(4);
  const shredIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Shredding particle logic
    const startShredding = () => {
      if (shredIntervalRef.current) return;
      
      shredIntervalRef.current = setInterval(() => {
        const newParticles = Array.from({ length: 12 }, () => ({
          id: Math.random(),
          x: 0, // Relative to the orange line
          y: Math.random() * 320, // Document height (h-80 = 320px)
          endX: 100 + Math.random() * 200,
          endY: -60 + Math.random() * 120,
          size: 5 + Math.random() * 6,
          rotation: Math.random() * 360,
          duration: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 0.1,
          color: Math.random() > 0.4 ? '#FF4500' : Math.random() > 0.5 ? '#FB923C' : '#FFF7ED'
        }));

        setShredParticles(prev => [...prev, ...newParticles]);
        
        // Cleanup particles
        setTimeout(() => {
          setShredParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 800);
      }, 100);
    };

    const stopShredding = () => {
      if (shredIntervalRef.current) {
        clearInterval(shredIntervalRef.current);
        shredIntervalRef.current = null;
      }
    };

    const advancePipeline = () => {
      setDocuments(prev => {
        const next = [...prev];
        const frontQueuedIndex = next.findIndex(d => d.phase === 'queued');
        
        if (frontQueuedIndex >= 0) {
          const docId = next[frontQueuedIndex].id;
          const poIndex = next[frontQueuedIndex].poIndex;
          
          // Start sliding
          next[frontQueuedIndex].phase = 'sliding';
          
          // Independent lifecycle for this specific document
          // With 3s duration and pl-12 (48px) start:
          // Hits line at 2s, finishes at 3s
          
          // 1. Start shredding particles (when it hits the line at 2s)
          setTimeout(() => {
            startShredding();
          }, 2000);
          
          // 2. Stop shredding particles (when it's through at 3s)
          setTimeout(() => {
            stopShredding();
            triggerDataFill(poIndex);
          }, 3000);
          
          // 3. Remove document
          setTimeout(() => {
            setDocuments(curr => curr.filter(d => d.id !== docId));
          }, 3500);
        }

        // 3. Add new documents to back to keep the queue full
        while (next.length < 12) {
          const lastDoc = next[next.length - 1];
          const lastPOIndex = lastDoc ? lastDoc.poIndex : -1;
          next.push({
            id: nextIdRef.current++,
            poIndex: (lastPOIndex + 1) % purchaseOrders.length,
            phase: 'queued'
          });
        }

        return next;
      });
    };

    const triggerDataFill = (poIndex: number) => {
      setCurrentPODataIndex(poIndex);
      setFilledFields([false, false, false, false]);
      setShowValidated(false);

      // Sequential fill
      setTimeout(() => setFilledFields([true, false, false, false]), 400);
      setTimeout(() => setFilledFields([true, true, false, false]), 700);
      setTimeout(() => setFilledFields([true, true, true, false]), 1000);
      setTimeout(() => setFilledFields([true, true, true, true]), 1300);
      setTimeout(() => setShowValidated(true), 1600);
    };

    const intervalId = setInterval(advancePipeline, 4000);
    advancePipeline(); // Initial kick-off

    return () => clearInterval(intervalId);
  }, []);

  const po = purchaseOrders[currentPODataIndex];

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <style>{`
        @keyframes slideToCenter {
          0%   { transform: translateX(0); }
          100% { transform: translateX(784px); }
        }
        .document-sliding {
          animation: slideToCenter 3s linear forwards;
        }
        @keyframes linePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; box-shadow: 0 0 12px rgba(255, 69, 0, 0.4); }
        }
        .line-pulse {
          animation: linePulse 2s ease-in-out infinite;
        }
        @keyframes particleFly {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--endX), var(--endY)) scale(0) rotate(var(--rotation));
            opacity: 0;
          }
        }
        .particle {
          animation: particleFly var(--duration) ease-out forwards;
          animation-delay: var(--delay);
        }
        @keyframes fieldAppear {
          0%   { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .field-filling {
          animation: fieldAppear 0.3s ease-out forwards;
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .validated-pop {
          animation: popIn 0.4s ease-out forwards;
        }
      `}</style>

      <div className="bg-white/50 rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden h-[450px] flex items-center justify-between">
        {/* Left Half: Document Source & Sliding Path */}
        <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-start pl-12">
          <div className="relative w-64 h-80">
            {documents.map((doc, index) => {
              const queuedDocs = documents.filter(d => d.phase === 'queued');
              const queuedIndex = queuedDocs.findIndex(d => d.id === doc.id);
              
              let style = {};
              if (doc.phase === 'queued') {
                const offset = Math.min(queuedIndex, 2) * 8;
                style = {
                  top: `${offset}px`,
                  left: `${offset}px`,
                  zIndex: 5 - queuedIndex,
                  opacity: 1 - (queuedIndex * 0.2),
                  transform: `scale(${1 - (queuedIndex * 0.025)})`,
                };
              } else if (doc.phase === 'sliding' || doc.phase === 'dissolving') {
                style = { zIndex: 1 };
              }

              return (
                <DocumentCard 
                  key={doc.id} 
                  phase={doc.phase} 
                  style={style}
                  poIndex={doc.poIndex}
                />
              );
            })}
          </div>
        </div>

        {/* Center: Processing Engine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#FF4500] -translate-x-1/2 line-pulse z-5"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg border-2 border-[#FF4500] z-20 flex items-center justify-center p-3">
          <img 
            src="/logo.svg" 
            alt="Orderpilot Icon" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Shred Particles */}
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-64 h-80 pointer-events-none z-10">
          {shredParticles.map((p: any) => (
            <div
              key={p.id}
              className="absolute rounded-[1px] particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                left: `${p.x}px`,
                top: `${p.y}px`,
                '--endX': `${p.endX}px`,
                '--endY': `${p.endY}px`,
                '--rotation': `${p.rotation}deg`,
                '--duration': `${p.duration}s`,
                '--delay': `${p.delay}s`,
              } as any}
            />
          ))}
        </div>

        {/* Right Half: Captured Information */}
        <div className="w-1/2 flex justify-end items-center pr-12">
          <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-200 p-5 z-20">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF4500]"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Captured Information</span>
              </div>
              <span className="text-[10px] font-semibold text-[#FF4500]">99.9% ACCURACY</span>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Field</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Extracted Data</span>
            </div>
            <div className="border-b border-gray-100 mb-2"></div>

            <div className="space-y-1">
              <DataRow label="Vendor Name" value={po.vendor} isFilled={filledFields[0]} />
              <DataRow label="PO Number" value={po.poNumber} isFilled={filledFields[1]} />
              <DataRow label="Total Amount" value={po.total} isFilled={filledFields[2]} />
              <DataRow label="Line Items" value={po.items} isFilled={filledFields[3]} />
            </div>

            <div className="border-b border-gray-100 my-3"></div>
            
            <div className={`h-6 flex items-center justify-center transition-opacity duration-300 ${showValidated ? 'opacity-100' : 'opacity-0'}`}>
              {showValidated && (
                <div className="text-xs font-semibold text-[#FF4500] flex items-center gap-1 validated-pop">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  VALIDATED & ERP READY
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DataRowProps {
  label: string;
  value: string;
  isFilled: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, isFilled }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs font-medium text-gray-600">{label}</span>
    <div className="text-right">
      {isFilled ? (
        <span className="text-xs font-bold text-gray-900 field-filling inline-block">{value}</span>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 border-2 border-gray-200 border-t-[#FF4500] rounded-full animate-spin"></div>
          <span className="text-[10px] text-gray-400 italic">processing...</span>
        </div>
      )}
    </div>
  </div>
);

export default HeroAnimation;
