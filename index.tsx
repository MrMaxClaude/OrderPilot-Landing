
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PostHogProvider } from '@posthog/react';
import posthog from 'posthog-js';
import App from './App';
import { getStoredConsent } from './src/lib/cookieConsent';

// Initialize PostHog (analytics off until cookie consent — see CookieConsent + getStoredConsent)
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    debug: import.meta.env.VITE_PUBLIC_POSTHOG_DEBUG === 'true',
    opt_out_capturing_by_default: true,
    loaded: (client) => {
      if (import.meta.env.DEV) client.debug();
      const consent = getStoredConsent();
      if (consent?.analytics) client.opt_in_capturing();
    },
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: false,
    secure_cookie: true,
    property_denylist: ['$initial_referrer', '$initial_referring_domain'],
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PostHogProvider>
  </React.StrictMode>
);
