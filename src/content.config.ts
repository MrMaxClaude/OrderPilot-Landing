import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string().optional(),
  }),
});

const hero = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/hero' }),
  schema: z.object({
    badge: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    ctaPrimary: z.object({ text: z.string(), href: z.string() }),
    ctaSecondary: z.object({ text: z.string(), href: z.string() }),
    erpList: z.array(z.string()),
  }),
});

const benefits = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/benefits' }),
  schema: z.object({
    costSection: z.object({
      label: z.string(),
      headline: z.string(),
      mathRows: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          highlight: z.boolean().default(false),
        }),
      ),
      summaryLabel: z.string(),
      summaryValue: z.string(),
      sidebar: z.string(),
      sidebarFootnote: z.string(),
    }),
    before: z.object({
      label: z.string(),
      items: z.array(
        z.object({
          metric: z.string(),
          description: z.string(),
        }),
      ),
    }),
    after: z.object({
      label: z.string(),
      items: z.array(
        z.object({
          metric: z.string(),
          description: z.string(),
        }),
      ),
    }),
    calculatorCta: z.object({
      headline: z.string(),
      description: z.string(),
      buttonText: z.string(),
      buttonHref: z.string(),
    }),
    whySection: z.object({
      label: z.string(),
      headline: z.string(),
    }),
    cards: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        secondDescription: z.string().optional(),
        badge: z.string().optional(),
        erps: z.array(z.string()).optional(),
        variant: z.enum(['default', 'standout', 'wide', 'compact']).default('default'),
        colSpan: z.number().default(2),
      }),
    ),
  }),
});

const howItWorks = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/howItWorks' }),
  schema: z.object({
    label: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    steps: z.array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        descriptionHtml: z.string().optional(),
        illustrationType: z.enum(['connect', 'process', 'validate']),
      }),
    ),
    extractedFields: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
    validationBadges: z.array(z.string()),
    erps: z.array(z.string()),
    cta: z.object({
      text: z.string(),
      href: z.string(),
      subtitle: z.string(),
    }),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    company: z.string(),
    role: z.string().optional(),
    pill: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const trust = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/trust' }),
  schema: z.object({
    headline: z.string(),
    description: z.string(),
    badges: z.array(
      z.object({
        label: z.string(),
        icon: z.string(),
      }),
    ),
    quote: z.string(),
    quoteAuthor: z.string(),
    quoteRole: z.string(),
  }),
});

const integrations = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/integrations' }),
  schema: z.object({
    headline: z.string(),
    logos: z.array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    ),
    quote: z.string(),
    quoteAuthor: z.string(),
    quoteRole: z.string(),
    quoteAvatar: z.string().optional(),
  }),
});

const faqSchema = z.object({
  question: z.string(),
  order: z.number(),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/faqs' }),
  schema: faqSchema,
});

const pricingFaqs = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/pricingFaqs' }),
  schema: faqSchema,
});

const plans = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/plans' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    monthlyPrice: z.number().nullable(),
    yearlyPrice: z.number().nullable(),
    orderLimit: z.string(),
    features: z.array(z.string()),
    popular: z.boolean(),
    ctaText: z.string(),
    iconId: z.string(),
    order: z.number(),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/cases' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    company: z.string(),
    industry: z.string(),
    location: z.string(),
    volume: z.string(),
    logo: z.string().optional(),
    quote: z.string(),
    quoteAuthor: z.string(),
    quoteRole: z.string(),
    metrics: z.array(
      z.object({
        value: z.string(),
        unit: z.string(),
        label: z.string(),
        description: z.string(),
      }),
    ),
    implementationSteps: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    roi: z.object({
      paybackMonths: z.number(),
      annualSavings: z.number(),
      annualCost: z.number(),
      netSavings: z.number(),
      roiPercentage: z.number(),
      hourlyRate: z.number(),
    }),
    order: z.number().default(0),
  }),
});

export const collections = {
  pages,
  hero,
  benefits,
  howItWorks,
  testimonials,
  trust,
  integrations,
  faqs,
  pricingFaqs,
  plans,
  cases,
};
