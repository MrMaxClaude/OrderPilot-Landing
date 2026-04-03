
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { requestOpenCookieConsent } from '../src/lib/cookieConsent';

const footerLink =
  'text-white/60 hover:text-white transition-colors';

const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link to="/" className="mb-6 block hover:opacity-80 transition-opacity">
              <Logo size={48} />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              The world&apos;s most accurate purchase order processing platform. Built for procurement
              teams that demand 100% accuracy.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/#benefits" className={footerLink}>
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className={footerLink}>
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/#results" className={footerLink}>
                  Results
                </Link>
              </li>
              <li>
                <Link to="/pricing" className={footerLink}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/privacy" className={footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => requestOpenCookieConsent()}
                  className={`${footerLink} text-left w-full`}
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <p>© 2026 ORDERPILOT BY RB2. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <span>ISO 27001 CERTIFIED</span>
            <span>GDPR COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
