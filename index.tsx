
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PostHogProvider } from '@posthog/react';
import posthog from 'posthog-js';
import App from './App';

// Initialize PostHog
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    debug: import.meta.env.VITE_PUBLIC_POSTHOG_DEBUG === 'true',
    // Disable in development to avoid noise
    loaded: (posthog) => {
      if (import.meta.env.DEV) posthog.debug();
    },
    // Enhanced privacy settings for EU compliance
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: false,
    secure_cookie: true,
    // Capture less data by default for privacy
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
