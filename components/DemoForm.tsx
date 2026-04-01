
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../src/hooks/useScrollAnimation';
import { usePostHogTracking } from '../src/hooks/usePostHogTracking';

const ContactForm: React.FC = () => {
  const sectionRef = useScrollAnimation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const { track, identifyUser, identifyCompany } = usePostHogTracking();

  // Track when form is viewed
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !formStarted) {
            track('inquiry_form_started', {
              source_page: window.location.pathname
            });
            setFormStarted(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [track, formStarted, sectionRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const poVolume = formData.get('poVolume') as string;

    // Create user and company IDs
    const userId = email;
    const companyId = `${company.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Identify user
    identifyUser(userId, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      full_name: `${firstName} ${lastName}`,
    });

    // Identify company
    identifyCompany(companyId, {
      name: company,
      po_volume: poVolume,
      industry: 'unknown', // We could add this to the form later
      size: poVolume, // Using PO volume as proxy for size
    });

    // Track form completion
    track('inquiry_form_completed', {
      company_size: poVolume,
      po_volume: poVolume,
      source_page: window.location.pathname,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 lg:py-24 px-6 bg-card-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center animate-tabFadeIn">
          <div className="w-20 h-20 bg-green-accent/10 text-green-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Inquiry Received!</h2>
          <p className="text-text-secondary text-lg mb-8">
            Our procurement automation expert will reach out within 2 hours to discuss your specific needs and see if OrderPilot is a good fit.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-rb2-orange font-bold hover:underline"
          >
            Send another inquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      ref={sectionRef as any}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card-white fade-in border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-4 block">/ GET IN TOUCH</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-8">
              Talk to a procurement automation<br />
              <span className="font-serif italic text-rb2-orange">expert.</span>
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Get in touch with our team to discuss your purchase order processing challenges. We'll explore your specific needs and see if OrderPilot is the right solution.
            </p>
            <p className="text-lg text-text-secondary mb-12 leading-relaxed">
              No commitment. No pressure. Just a conversation about your procurement automation needs.
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                { label: '99.9% Accuracy', desc: 'Consistently across all formats.' },
                { label: '60-Second Processing', desc: 'From inbox to ERP.' },
                { label: 'Native Integration', desc: 'Business Central, Exact Online, Odoo, NetSuite, SAP.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 p-1 bg-rb2-orange/10 text-rb2-orange rounded-full">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-text-primary">{item.label}</div>
                    <div className="text-sm text-text-secondary">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm text-text-secondary">Want to see the numbers first?</p>
              <Link
                to="/calculator"
                className="text-rb2-orange font-bold hover:underline text-sm"
              >
                Calculate your costs →
              </Link>
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-2">See exactly what manual processing costs your company each year.</p>
          </div>
          
          <div className="bg-warm-bg rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Work Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@company.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="Acme Corp"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Monthly PO Volume</label>
                <select name="poVolume" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all appearance-none">
                  <option>100 - 500 orders</option>
                  <option>500 - 2,000 orders</option>
                  <option>2,000 - 10,000 orders</option>
                  <option>10,000+ orders</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Message (Optional)</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your current PO processing challenges or specific questions you have..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rb2-orange focus:ring-1 focus:ring-rb2-orange outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rb2-orange text-white rounded-2xl font-bold py-4 hover:bg-rb2-orange-hover hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get in Touch <ArrowRight size={18} />
              </button>
              <p className="text-[10px] text-center text-text-muted font-bold uppercase tracking-widest">Free consultation. No obligation. No pressure.</p>
            </form>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-gray-100 text-center max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-serif italic text-text-primary md:whitespace-nowrap">
            OrderPilot. Purchase orders in. Clean data out. Your team back to real work.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
