
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoBenefits from './components/BentoBenefits';
import POTransformation from './components/POTransformation';
import HowItWorks from './components/HowItWorks';
import SocialProof from './components/SocialProof';
import DemoForm from './components/DemoForm';
import Footer from './components/Footer';
import CalculatorCTA from './components/CalculatorCTA';
import CalculatorPage from './components/CalculatorPage';

const App: React.FC = () => {
  const location = useLocation();
  const isCalculatorPage = location.pathname === '/calculator';

  return (
    <div className="min-h-screen bg-warm-bg font-sans selection:bg-rb2-orange/30 selection:text-rb2-orange">
      {!isCalculatorPage && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <BentoBenefits />
              <POTransformation />
              <HowItWorks />
              <SocialProof />
              <DemoForm />
            </>
          } />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Routes>
      </main>

      {!isCalculatorPage && <Footer />}
      <CalculatorCTA />
    </div>
  );
};

export default App;
