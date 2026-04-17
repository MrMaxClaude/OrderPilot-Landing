/**
 * Copy for the knowledge base hub (/knowledge-base/) — support tips and resource teasers.
 */

export type KbSupportTip = { title: string; text: string };

export const KB_SUPPORT_TIPS: KbSupportTip[] = [
  {
    title: 'What OrderPilot needs from your team to go live',
    text: 'A stable inbound channel for POs (shared mailbox or folder), read access to vendor and item master data in your ERP, and one procurement owner who can confirm exception rules. Most mid-market teams are live in a few weeks without middleware projects.',
  },
  {
    title: 'When to keep a human in the loop',
    text: 'OrderPilot posts automatically when confidence is high. When a field is ambiguous or conflicts with master data, the PO goes to a review queue with context so approvers fix only exceptions — not every line.',
  },
  {
    title: 'How OrderPilot differs from generic document AI',
    text: 'OrderPilot is built only for purchase orders: PO-specific validation, ERP-native connectors, and workflows procurement teams expect. That focus is what keeps processing under a minute per order with audit-friendly outcomes.',
  },
  {
    title: 'Sizing PO volume for pricing',
    text: 'Plans are anchored on monthly purchase order volume (for example up to 1,000 POs on the standard tier). If you are between brackets, use the ROI calculator or talk to us — we map mixed channels (email + portal + EDI) to a single clear count.',
  },
];

export type KbResource = {
  href: string;
  title: string;
  excerpt: string;
  label: string;
};

export const KB_RESOURCE_CARDS: KbResource[] = [
  {
    href: '/calculator/',
    title: 'ROI calculator',
    excerpt: 'Estimate time saved and cost impact from automating PO intake with your volume and stack.',
    label: 'Tool',
  },
  {
    href: '/pricing/',
    title: 'Pricing & plans',
    excerpt: 'Transparent mid-market tiers, native ERP connectors, and what is included without hidden implementation fees.',
    label: 'Pricing',
  },
  {
    href: '/cases/',
    title: 'Customer cases',
    excerpt: 'How teams like yours reduced manual entry and sped up month-end after switching to OrderPilot.',
    label: 'Stories',
  },
  {
    href: '/privacy/',
    title: 'Privacy & data handling',
    excerpt: 'How we process PO content, retention, subprocessors, and what stays under your control.',
    label: 'Trust',
  },
];
