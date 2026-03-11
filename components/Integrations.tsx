
import React from 'react';
import { motion } from 'motion/react';

const Integrations: React.FC = () => {
  const logos = [
    { name: 'SAP', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg' },
    { name: 'Oracle', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'Odoo', url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Odoo_logo.svg' },
    { name: 'MS Dynamics', url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Microsoft_Dynamics_365_logo.svg' },
    { name: 'Exact', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Exact_Software_Logo.svg/1200px-Exact_Software_Logo.svg.png' },
    { name: 'AFAS', url: 'https://logos-world.net/wp-content/uploads/2023/12/AFAS-Software-Logo.png' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Integrates with your entire stack</h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        {logos.map((logo, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.1, opacity: 1 }}
            className="h-10 md:h-12 flex items-center"
          >
            <img src={logo.url} alt={logo.name} className="h-full object-contain" referrerPolicy="no-referrer" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-24 text-center bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl max-w-4xl mx-auto relative overflow-hidden"
      >
         <div className="absolute top-0 left-0 w-2 h-full bg-rb2-orange"></div>
         <p className="text-2xl md:text-3xl font-serif font-medium text-gray-900 leading-relaxed mb-10 italic">
           "Orderpilot was the easiest integration we've ever done. We were live with our SAP S/4HANA instance in under 48 hours."
         </p>
         <div className="flex items-center justify-center space-x-4">
            <img src="https://picsum.photos/seed/marcus/100/100" alt="Avatar" className="w-14 h-14 rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
            <div className="text-left">
               <p className="text-lg font-bold text-gray-900 leading-none">Marcus Jensen</p>
               <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-bold">Logistics Director, GlobalTrade Corp</p>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

export default Integrations;
