
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoBenefits from './components/BentoBenefits';
import POTransformation from './components/POTransformation';
import HowItWorks from './components/HowItWorks';
import SocialProof from './components/SocialProof';
import ContactForm from './components/DemoForm';
import Footer from './components/Footer';
import CalculatorCTA from './components/CalculatorCTA';
import CalculatorPage from './components/CalculatorPage';
import PricingPage from './components/PricingPage';
import CasesPage from './components/CasesPage';
import PdfDemoPage from './components/PdfDemoPage';

const App: React.FC = () => {
  const location = useLocation();
  const isCalculatorPage = location.pathname === '/calculator';
  const isPricingPage = location.pathname === '/pricing';
  const isCasesPage = location.pathname === '/cases';
  const isPdfDemoPage = location.pathname === '/pdf-demo';

  return (
    <div className="min-h-screen bg-warm-bg font-sans selection:bg-rb2-orange/30 selection:text-rb2-orange">
      {!isCalculatorPage && !isPdfDemoPage && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <BentoBenefits />
              <POTransformation />
              <HowItWorks />
              <SocialProof />
              <ContactForm />
            </>
          } />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/pdf-demo" element={<PdfDemoPage />} />
        </Routes>
      </main>

      {!isCalculatorPage && !isCasesPage && !isPdfDemoPage && <Footer />}
      {!isCalculatorPage && !isCasesPage && !isPdfDemoPage && <CalculatorCTA />}
    </div>
  );
};

export default App;
