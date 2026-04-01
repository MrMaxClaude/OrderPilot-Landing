
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePostHogTracking } from '../src/hooks/usePostHogTracking';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { track } = usePostHogTracking();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Results', href: '#results' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Cases', href: '/cases' },
    { name: 'About', href: '#benefits' },
  ];

  const handleNavClick = (href: string, linkName: string) => {
    // Track navigation click
    track('hero_cta_clicked', {
      cta_type: href.startsWith('#') ? 'expert_contact' : (href === '/pricing' ? 'pricing' : 'calculator'),
      cta_text: linkName,
      location: 'navbar'
    });

    if (href.startsWith('#')) {
      // If it's a hash link, navigate to home first if not already there
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll to section
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, just scroll to section
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Regular route navigation
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card-white/80 backdrop-blur-lg border-b border-gray-100 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button onClick={handleLogoClick} className="text-text-primary hover:opacity-80 transition-opacity">
          <Logo size={48} />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href, link.name)}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#contact', 'Get in Touch')}
            className="bg-rb2-orange text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-rb2-orange-hover hover:shadow-lg transition-all duration-200"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card-white border-b border-gray-100 p-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href, link.name)}
              className="block w-full text-left text-base font-medium text-text-secondary"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#contact', 'Get in Touch')}
            className="block w-full bg-rb2-orange text-white text-center rounded-2xl px-6 py-3 font-semibold"
          >
            Get in Touch
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
