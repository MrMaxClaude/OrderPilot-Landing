
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: 'About', href: '#benefits' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card-white/80 backdrop-blur-lg border-b border-gray-100 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="text-text-primary hover:opacity-80 transition-opacity">
          <Logo size={48} />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#demo"
            className="bg-rb2-orange text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-rb2-orange-hover hover:shadow-lg transition-all duration-200"
          >
            Book a Demo
          </a>
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
            <a 
              key={link.name}
              href={link.href}
              className="block text-base font-medium text-text-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#demo"
            className="block w-full bg-rb2-orange text-white text-center rounded-2xl px-6 py-3 font-semibold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book a Demo
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
