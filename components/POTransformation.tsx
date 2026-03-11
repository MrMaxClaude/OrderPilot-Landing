import React, { useEffect, useRef, useState } from 'react';
import { 
  Mail, 
  FileText, 
  Table, 
  CheckCircle, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, useInView } from 'motion/react';

const POTransformation: React.FC = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const cards = [
    {
      id: 1,
      label: "Plain text email",
      rotation: "rotate-[-3deg]",
      icon: <Mail className="w-3.5 h-3.5 text-[#FF4500]" />,
      header: "INCOMING EMAIL",
      headerColor: "text-[#FF4500]",
      content: (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-600 font-medium">Hey Marco,</p>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Can you process this?<br />
            We need:
          </p>
          <ul className="text-[10px] text-gray-600 space-y-0.5">
            <li>- <span className="text-[#FF4500] font-medium">200x</span> Blue Widget A</li>
            <li>- <span className="text-[#FF4500] font-medium">50x</span> Red Connector B</li>
            <li>- <span className="text-[#FF4500] font-medium">75x</span> Steel Bracket C</li>
          </ul>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Ship to our Utrecht<br />
            warehouse please.
          </p>
          <div className="pt-2 border-t border-gray-50">
            <p className="text-[10px] font-medium text-gray-600">Jan de Vries</p>
            <p className="text-[10px] text-[#FF4500]/70 font-bold uppercase tracking-tighter">Breman Groep</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      label: "PDF attachment",
      rotation: "rotate-[-1deg]",
      icon: <FileText className="w-3.5 h-3.5 text-blue-500" />,
      header: "PURCHASE ORDER",
      headerColor: "text-blue-600",
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-gray-700">Nedcargo Logistics</p>
              <p className="text-[10px] text-[#FF4500] font-medium">PO-2024-1203</p>
              <p className="text-[10px] text-gray-500">Date: 15-02-2024</p>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
              <div className="w-4 h-1 bg-blue-200 rounded-full" />
            </div>
          </div>
          <table className="w-full text-[9px]">
            <thead>
              <tr className="bg-blue-50/50 text-blue-600 font-bold uppercase">
                <th className="px-2 py-1 text-left">Item</th>
                <th className="px-2 py-1 text-center">Qty</th>
                <th className="px-2 py-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="px-2 py-1 font-medium">A</td>
                <td className="px-2 py-1 text-center text-[#FF4500]">100</td>
                <td className="px-2 py-1 text-right">€45.00</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-2 py-1 font-medium">B</td>
                <td className="px-2 py-1 text-center text-[#FF4500]">250</td>
                <td className="px-2 py-1 text-right">€12.50</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-2 py-1 font-medium">C</td>
                <td className="px-2 py-1 text-center text-[#FF4500]">75</td>
                <td className="px-2 py-1 text-right">€89.00</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] font-bold text-gray-900 text-right">Total: <span className="text-[#FF4500]">€12,450.00</span></p>
        </div>
      )
    },
    {
      id: 3,
      label: "Excel spreadsheet",
      rotation: "rotate-0",
      icon: <Table className="w-3.5 h-3.5 text-emerald-500" />,
      header: "SPREADSHEET",
      headerColor: "text-emerald-600",
      content: (
        <div className="w-full border border-gray-200 text-[9px] overflow-hidden rounded-sm">
          <div className="flex bg-emerald-50 text-emerald-700 font-bold border-b border-gray-200">
            <div className="w-6 border-r border-gray-200 text-center py-0.5 bg-emerald-100/50"></div>
            <div className="flex-1 px-1.5 py-0.5 border-l border-gray-200 text-center">A</div>
            <div className="flex-1 px-1.5 py-0.5 border-l border-gray-200 text-center">B</div>
            <div className="flex-1 px-1.5 py-0.5 border-l border-gray-200 text-center">C</div>
          </div>
          {[
            { r: "1", a: "VDL Ind", b: "", c: "", aBold: true },
            { r: "2", a: "PO#", b: "2024", c: "-0591", highlight: true },
            { r: "3", a: "Widget", b: "30", c: "€850" },
            { r: "4", a: "Bolt", b: "150", c: "€3" },
            { r: "5", a: "Frame", b: "12", c: "€1200" },
            { r: "6", a: "", b: "Tot", c: "€23.1k", cBold: true }
          ].map((row, i) => (
            <div key={i} className={`flex border-b border-gray-100 last:border-0 ${row.highlight ? 'bg-emerald-50/30' : ''}`}>
              <div className="w-6 bg-gray-50 text-gray-400 text-center py-1 border-r border-gray-200">{row.r}</div>
              <div className={`flex-1 px-1.5 py-1 text-gray-600 border-l border-gray-100 truncate ${row.aBold ? 'font-bold text-emerald-800' : ''}`}>{row.a}</div>
              <div className="flex-1 px-1.5 py-1 text-gray-600 border-l border-gray-100 truncate text-center">{row.b}</div>
              <div className={`flex-1 px-1.5 py-1 border-l border-gray-100 truncate text-right ${row.cBold ? 'font-bold text-[#FF4500]' : 'text-gray-600'}`}>{row.c}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 4,
      label: "Extracted data",
      rotation: "rotate-0",
      icon: <div className="w-2 h-2 rounded-full bg-[#FF4500] shadow-[0_0_8px_rgba(255,69,0,0.4)]" />,
      header: "EXTRACTED DATA",
      headerColor: "text-gray-700",
      content: (
        <div className="space-y-1">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[9px] uppercase tracking-wider text-[#FF4500] font-bold">Customer</p>
            <p className="text-[11px] font-bold text-gray-800">VDL Industrial Modules</p>
          </div>
          <div className="p-2">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">PO Number</p>
            <p className="text-[11px] font-bold text-[#FF4500]">PO-2024-0591</p>
          </div>
          <div className="p-2">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Items</p>
            <div className="text-[10px] text-gray-600 space-y-0.5">
              <p className="flex justify-between"><span>Widget A</span> <span className="font-bold">30</span></p>
              <p className="flex justify-between"><span>Steel Bolt</span> <span className="font-bold">150</span></p>
              <p className="flex justify-between"><span>Frame Assembly</span> <span className="font-bold">12</span></p>
            </div>
          </div>
          <div className="pt-2 px-2 flex justify-between items-end">
            <p className="text-[9px] uppercase tracking-wider text-gray-400">Total</p>
            <p className="text-[12px] font-black text-gray-900">€23,100.00</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      label: "Validated & ERP ready",
      rotation: "rotate-0",
      isPayoff: true,
      icon: <CheckCircle className="w-3.5 h-3.5 text-[#FF4500]" />,
      header: "VALIDATED",
      headerColor: "text-[#FF4500]",
      content: (
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 flex-1 bg-[#FF4500]/10 rounded-full overflow-hidden">
              <div className="h-full w-full bg-[#FF4500]" />
            </div>
            <p className="text-[9px] font-black text-[#FF4500] whitespace-nowrap">100% MATCH</p>
          </div>
          
          <div className="flex justify-between items-start p-1.5 bg-orange-50/50 rounded border border-[#FF4500]/10">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#FF4500]/70 font-bold">Customer</p>
              <p className="text-[11px] font-bold text-gray-800">VDL Industrial Modules</p>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-[#FF4500] fill-[#FF4500]/10" />
          </div>

          <div className="flex justify-between items-start mt-2 px-1.5">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400">PO Number</p>
              <p className="text-[11px] font-bold text-[#FF4500]">PO-2024-0591</p>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-[#FF4500] fill-[#FF4500]/10" />
          </div>

          <div className="flex justify-between items-start mt-2 px-1.5">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400">Line Items (3)</p>
              <p className="text-[10px] text-gray-700 font-medium">All matched to catalog</p>
              <p className="text-[9px] text-[#FF4500] font-medium italic">Verified SKU & Price</p>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-[#FF4500] fill-[#FF4500]/10" />
          </div>

          <div className="flex justify-between items-start pt-2 px-1.5">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400">Total</p>
              <p className="text-[12px] font-black text-gray-900">€23,100.00</p>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-[#FF4500] fill-[#FF4500]/10" />
          </div>

          <div className="border-t border-[#FF4500]/20 pt-2 mt-2 flex items-center justify-center gap-1.5 bg-[#FF4500] text-white py-1 rounded shadow-sm">
            <CheckCircle className="w-3 h-3 text-white" />
            <p className="text-[10px] font-black uppercase tracking-tighter">SYNCED TO ERP</p>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-[#FF4500] shadow-xl border-4 border-white flex flex-col items-center justify-center z-10 transform rotate-12">
            <span className="text-lg font-black text-white leading-none">99.9%</span>
            <span className="text-[7px] uppercase tracking-wider text-white/90 font-bold text-center leading-tight">ACCURATE</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-warm-bg overflow-hidden border-t border-gray-100" ref={containerRef}>
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
        >
          / ANY FORMAT. ONE OUTPUT.
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight"
        >
          Every supplier sends POs differently.<br />
          OrderPilot reads <span className="font-serif italic text-rb2-orange">them all.</span>
        </motion.h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative">
          {/* Desktop/Tablet Layout */}
          <div className="hidden sm:flex items-end justify-center gap-4 md:gap-6 lg:gap-8">
            {cards.map((card, index) => (
              <React.Fragment key={card.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`
                      w-48 md:w-52 h-64 md:h-72 bg-white rounded-xl shadow-md border p-4
                      transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg
                      ${card.isPayoff ? 'border-2 border-[#FF4500]/30 shadow-lg' : 'border-gray-200'}
                      ${card.rotation}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                      {card.icon}
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${card.headerColor || 'text-gray-400'}`}>
                        {card.header}
                      </span>
                    </div>
                    {card.content}
                  </div>
                  <p className="text-xs font-medium text-gray-400 text-center mt-4">
                    {card.label}
                  </p>
                </motion.div>
                
                {index < cards.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 * index + 0.2 }}
                    className="mb-32 hidden md:block"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Horizontal Scroll Layout */}
          <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-4 -mx-4 no-scrollbar">
            {cards.map((card, index) => (
              <div key={card.id} className="snap-center flex-shrink-0 flex flex-col items-center">
                <div 
                  className={`
                    w-64 h-80 bg-white rounded-xl shadow-md border p-5
                    ${card.isPayoff ? 'border-2 border-[#FF4500]/30 shadow-lg' : 'border-gray-200'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    {card.icon}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${card.headerColor || 'text-gray-400'}`}>
                      {card.header}
                    </span>
                  </div>
                  <div className="scale-110 origin-top-left">
                    {card.content}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-400 text-center mt-4">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
          
          {/* Mobile Scroll Hint */}
          <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 w-12 h-32 bg-gradient-to-l from-warm-bg to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default POTransformation;
