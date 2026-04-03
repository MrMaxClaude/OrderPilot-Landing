import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import posthog from 'posthog-js';
import { getStoredConsent, saveConsent, OPEN_COOKIE_CONSENT_EVENT } from '../src/lib/cookieConsent';

const syncPostHog = (analyticsAllowed: boolean) => {
  if (!import.meta.env.VITE_PUBLIC_POSTHOG_KEY) return;
  if (analyticsAllowed) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
    posthog.reset();
  }
};

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(() => getStoredConsent() === null);

  useEffect(() => {
    const onOpen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, onOpen);
  }, []);

  const acceptAll = () => {
    saveConsent(true);
    syncPostHog(true);
    setVisible(false);
  };

  const essentialOnly = () => {
    saveConsent(false);
    syncPostHog(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto rounded-2xl border border-gray-200/80 bg-card-white/95 backdrop-blur-md shadow-2xl shadow-text-primary/10 p-5 sm:p-6">
        <h2
          id="cookie-consent-title"
          className="text-base sm:text-lg font-bold text-text-primary mb-2"
        >
          Cookies & privacy
        </h2>
        <p
          id="cookie-consent-desc"
          className="text-sm text-text-secondary leading-relaxed mb-5"
        >
          We use cookies to run the site and, with your permission, analytics (PostHog) to
          understand how visitors use OrderPilot. See our{' '}
          <Link
            to="/privacy"
            className="text-rb2-orange font-semibold hover:underline underline-offset-2"
          >
            privacy & cookie notice
          </Link>
          .
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-3 sm:justify-end">
          <button
            type="button"
            onClick={essentialOnly}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary border border-gray-200 hover:bg-warm-bg-alt transition-colors"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rb2-orange text-white hover:bg-rb2-orange-hover transition-colors shadow-lg shadow-rb2-orange/20"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
