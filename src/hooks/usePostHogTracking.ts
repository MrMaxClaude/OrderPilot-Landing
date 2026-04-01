import { usePostHog } from '@posthog/react';
import { useLocation } from 'react-router-dom';

// Marketing funnel event types
interface AwarenessEvents {
  page_viewed: {
    page: string;
    source?: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
  };
  hero_cta_clicked: {
    cta_type: 'expert_contact' | 'calculator' | 'pricing';
    cta_text: string;
    location: string;
  };
  value_proposition_viewed: {
    section: 'benefits' | 'how_it_works' | 'case_study';
    time_spent?: number;
  };
  case_study_viewed: {
    case: string;
    section?: string;
  };
}

interface InterestEvents {
  pricing_page_viewed: {
    plan_focus?: 'starter' | 'growth' | 'enterprise';
    pricing_toggle?: 'monthly' | 'yearly';
  };
  calculator_started: {
    entry_point: 'hero' | 'navbar' | 'pricing' | 'footer' | 'internal' | 'external';
  };
  calculator_completed: {
    cost_savings: number;
    po_volume: number;
    processing_time: number;
    team_size: number;
  };
  how_it_works_viewed: {
    step_reached: number;
    completed: boolean;
  };
}

interface ConsiderationEvents {
  inquiry_form_started: {
    source_page: string;
  };
  inquiry_form_completed: {
    company_size: string;
    industry?: string;
    po_volume: string;
    source_page: string;
  };
  demo_form_started: {
    source_page: string;
  };
  demo_form_completed: {
    company_size: string;
    industry?: string;
    po_volume: string;
    source_page: string;
  };
  integration_info_viewed: {
    erp_type: 'business_central' | 'exact' | 'odoo' | 'netsuite' | 'sap';
  };
  faq_engaged: {
    question_opened: string;
    section: string;
  };
}

interface ConversionEvents {
  expert_contacted: {
    urgency_level: 'high' | 'medium' | 'low';
    industry?: string;
    company_size?: string;
  };
  demo_scheduled: {
    urgency_level: 'high' | 'medium' | 'low';
    industry?: string;
    company_size?: string;
  };
  trial_requested: {
    plan_type: 'starter' | 'growth' | 'enterprise';
  };
  contact_sales: {
    trigger: string;
    page: string;
  };
}

type MarketingEvents = AwarenessEvents & InterestEvents & ConsiderationEvents & ConversionEvents;

export const usePostHogTracking = () => {
  const posthog = usePostHog();
  const location = useLocation();

  // Track marketing funnel events with proper typing
  const track = <T extends keyof MarketingEvents>(
    event: T,
    properties: MarketingEvents[T]
  ) => {
    if (!posthog) return;

    // Add common properties
    const enrichedProperties = {
      ...properties,
      $current_url: window.location.href,
      $pathname: location.pathname,
      $timestamp: new Date().toISOString(),
      // Add UTM parameters if present
      ...(new URLSearchParams(location.search).get('utm_source') && {
        utm_source: new URLSearchParams(location.search).get('utm_source'),
        utm_campaign: new URLSearchParams(location.search).get('utm_campaign'),
        utm_medium: new URLSearchParams(location.search).get('utm_medium'),
      }),
    };

    posthog.capture(event, enrichedProperties);
  };

  // Identify user (for demo form submissions)
  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (!posthog) return;

    posthog.identify(userId, {
      ...properties,
      $identified_at: new Date().toISOString(),
    });
  };

  // Set user properties without identifying
  const setUserProperties = (properties: Record<string, any>) => {
    if (!posthog) return;
    posthog.people.set(properties);
  };

  // Track page views with marketing context
  const trackPageView = (pageName: string, additionalProps?: Record<string, any>) => {
    track('page_viewed', {
      page: pageName,
      source: document.referrer || 'direct',
      ...additionalProps,
    });
  };

  // Feature flag helpers (for A/B testing)
  const getFeatureFlag = (flagKey: string) => {
    if (!posthog) return null;
    return posthog.getFeatureFlag(flagKey);
  };

  const isFeatureEnabled = (flagKey: string) => {
    if (!posthog) return false;
    return posthog.isFeatureEnabled(flagKey);
  };

  // Group analytics for B2B (company-level tracking)
  const identifyCompany = (companyId: string, properties: Record<string, any>) => {
    if (!posthog) return;

    posthog.group('company', companyId, {
      ...properties,
      identified_at: new Date().toISOString(),
    });
  };

  return {
    track,
    identifyUser,
    setUserProperties,
    trackPageView,
    getFeatureFlag,
    isFeatureEnabled,
    identifyCompany,
    posthog,
  };
};