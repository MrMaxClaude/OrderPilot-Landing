import { config, collection, singleton, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

/**
 * Optional per-entry SEO override. If metaTitle / metaDescription / ogImage are
 * set they replace the defaults that come from the content's primary title and
 * description. noindex adds the robots-noindex meta tag for drafts / thank-you
 * pages without changing the file's publish state.
 */
const seoOverrideFields = fields.object(
  {
    metaTitle: fields.text({
      label: 'Meta title (browser tab + search result)',
      description:
        'Optional — overrides the primary title when it would otherwise be too long or not keyword-optimised for SEO.',
    }),
    metaDescription: fields.text({
      label: 'Meta description (search snippet)',
      description:
        'Optional — overrides the on-page description when what reads well in-page is not ideal as a search snippet.',
      multiline: true,
    }),
    ogImage: fields.text({
      label: 'Social share image (og:image) path',
      description:
        'Optional — absolute path under /public/ (e.g. /og-casestudy-ipn.png). Uses the default orderpilot-logo.png if empty.',
    }),
    noindex: fields.checkbox({
      label: 'Hide from search engines (noindex)',
      description:
        'When checked, adds <meta name="robots" content="noindex,nofollow">. Use only for drafts, admin / thank-you pages.',
      defaultValue: false,
    }),
  },
  {
    label: 'SEO overrides',
    description:
      'Optional. Leave empty to use the primary title + description + default social image.',
  },
);

/**
 * KB article schema — shared across 5 category-locked collections so Keystatic's
 * single-slug path pattern round-trips our src/content/kb/{category}/{slug}.mdx layout.
 */
function makeArticleCollection(params: {
  label: string;
  path: `src/content/kb/${string}/*`;
  categoryValue: string;
}) {
  return collection({
    label: params.label,
    slugField: 'title',
    path: params.path,
    format: { contentField: 'body' },
    entryLayout: 'content',
    columns: ['title', 'publishedAt'],
    schema: {
      title: fields.slug({
        name: {
          label: 'Title',
          description: 'Shown on the hub, category page, article header, browser tab, and social share.',
          validation: { length: { min: 1, max: 120 } },
        },
        slug: {
          label: 'URL slug',
          description:
            'Forms the /{category}/{slug}/ path. Auto-generated from the title — edit only if you need a specific permalink.',
        },
      }),
      description: fields.text({
        label: 'Description',
        description:
          'One-line summary used on cards, list items, meta description, and Article JSON-LD.',
        multiline: true,
        validation: { length: { min: 20, max: 220 } },
      }),
      category: fields.select({
        label: 'Category (locked)',
        description:
          'Each collection is category-locked. Do not change this — move the article to a different collection instead.',
        options: [
          { label: 'Getting Started', value: 'getting-started' },
          { label: 'Integraties', value: 'integraties' },
          { label: 'Tips & Best Practices', value: 'tips-best-practices' },
          { label: 'FAQ', value: 'faq' },
          { label: 'Updates', value: 'updates' },
        ],
        defaultValue: params.categoryValue as
          | 'getting-started'
          | 'integraties'
          | 'tips-best-practices'
          | 'faq'
          | 'updates',
      }),
      draft: fields.checkbox({
        label: 'Draft',
        description:
          'When checked, the article is hidden from the live site. Drafts remain visible on the dev server so you can preview.',
        defaultValue: false,
      }),
      tags: fields.array(
        fields.text({ label: 'Tag' }),
        {
          label: 'Tags',
          description:
            'Free-text tags. The first tag is used as an implicit sub-section on the category page.',
          itemLabel: (props) => props.value || '(empty)',
        },
      ),
      publishedAt: fields.date({
        label: 'Published at',
        description: 'Date used on the article header and in Article JSON-LD.',
        defaultValue: { kind: 'today' },
        validation: { isRequired: true },
      }),
      updatedAt: fields.date({
        label: 'Updated at',
        description:
          'Optional — leave blank until you materially revise the article. Shown next to the publish date.',
      }),
      readingTime: fields.integer({
        label: 'Reading time (minutes)',
        description:
          'Optional — if empty, estimated automatically from the article body.',
        validation: { min: 1, max: 120 },
      }),
      relatedArticles: fields.array(
        fields.text({ label: 'Related article slug' }),
        {
          label: 'Related articles',
          description:
            'Slugs of related articles (e.g. "quickstart"). If empty, related articles fall back to other articles in the same category.',
          itemLabel: (props) => props.value || '(empty)',
        },
      ),
      order: fields.integer({
        label: 'Order',
        description:
          'Lower numbers appear first within a category. Ties are broken by publish date (newest first).',
        defaultValue: 0,
      }),
      popular: fields.checkbox({
        label: 'Feature on the KB hub "Popular articles" shelf',
        description:
          'Surfaces this article on the hub above the category grid. If nothing is flagged, the shelf falls back to the three most recent articles.',
        defaultValue: false,
      }),
      seo: seoOverrideFields,
      body: fields.mdx({
        label: 'Article body',
        description: 'Markdown / MDX content. Headings become the table of contents. Use the + menu to insert a video, accordion, steps list, or callout.',
        options: {
          image: {
            directory: 'public/kb-images',
            publicPath: '/kb-images/',
          },
        },
        components: {
          Video: block({
            label: 'Video embed',
            description: 'YouTube, YouTube Shorts, or Vimeo URL. Rendered responsively, 16:9.',
            schema: {
              url: fields.url({
                label: 'Video URL',
                description: 'Full URL — e.g. https://www.youtube.com/watch?v=...',
                validation: { isRequired: true },
              }),
              title: fields.text({
                label: 'Title (for a11y)',
                description: 'Screen-reader-visible label.',
              }),
              caption: fields.text({
                label: 'Caption',
                description: 'Optional line of text under the video.',
              }),
            },
          }),
          Accordion: wrapper({
            label: 'Accordion (expandable FAQ)',
            description: 'Collapsible section. Click the summary to reveal the body.',
            schema: {
              title: fields.text({
                label: 'Summary heading',
                validation: { isRequired: true },
              }),
              hint: fields.text({
                label: 'Hint (optional)',
                description: 'Short subtitle shown next to the heading.',
              }),
              open: fields.checkbox({
                label: 'Open by default',
                defaultValue: false,
              }),
            },
          }),
          Steps: wrapper({
            label: 'Numbered steps (container)',
            description: 'Wrap one or more Step blocks inside.',
            schema: {},
          }),
          Step: wrapper({
            label: 'Step',
            description: 'Use inside a Steps block. The number is auto-incremented.',
            schema: {
              title: fields.text({
                label: 'Step title',
                validation: { isRequired: true },
              }),
            },
          }),
          Callout: wrapper({
            label: 'Callout (note / tip / warning)',
            description: 'Styled aside. Pick a tone.',
            schema: {
              tone: fields.select({
                label: 'Tone',
                options: [
                  { label: 'Info (orange)', value: 'info' },
                  { label: 'Tip (green)', value: 'tip' },
                  { label: 'Warning (amber)', value: 'warn' },
                  { label: 'Danger (red)', value: 'danger' },
                ],
                defaultValue: 'info',
              }),
              title: fields.text({
                label: 'Title (optional)',
                description: 'If empty, the tone name is used (Note / Tip / Heads up / Warning).',
              }),
            },
          }),
        },
      }),
    },
  });
}

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'rb2-bv', name: 'OrderPilot-Landing' },
  },
  ui: {
    brand: {
      name: 'OrderPilot CMS',
    },
    navigation: {
      'Site copy': ['hero', 'trust', 'integrations', 'pages'],
      'Layout': ['nav', 'footer'],
      'Proof & plans': ['testimonials', 'plans', 'cases'],
      'FAQ': ['faqs', 'pricingFaqs'],
      'Knowledge base': [
        'kb-getting-started',
        'kb-integraties',
        'kb-tips-best-practices',
        'kb-faq',
        'kb-updates',
      ],
    },
  },
  singletons: {
    hero: singleton({
      label: 'Homepage hero',
      path: 'src/content/hero/default',
      format: { data: 'json' },
      schema: {
        badge: fields.text({
          label: 'Badge',
          description: 'Small eyebrow above the headline (e.g. "NOW IN PUBLIC BETA").',
        }),
        headline: fields.text({
          label: 'Headline',
          multiline: true,
          description: 'Main hero headline. Line breaks are preserved.',
        }),
        subheadline: fields.text({
          label: 'Subheadline',
          multiline: true,
          description: 'One- to two-sentence supporting pitch.',
        }),
        ctaPrimary: fields.object(
          {
            text: fields.text({ label: 'Text' }),
            href: fields.text({
              label: 'Link',
              description:
                'Use #contact, /pricing, or any absolute URL.',
            }),
          },
          { label: 'Primary CTA' },
        ),
        ctaSecondary: fields.object(
          {
            text: fields.text({ label: 'Text' }),
            href: fields.text({
              label: 'Link',
              description:
                'Use #contact, /calculator, or any absolute URL.',
            }),
          },
          { label: 'Secondary CTA' },
        ),
        erpList: fields.array(
          fields.text({ label: 'ERP name' }),
          {
            label: 'ERP name list',
            description: 'Short list of ERPs shown under the hero.',
            itemLabel: (props) => props.value || '(empty)',
          },
        ),
      },
    }),
    trust: singleton({
      label: 'Trust & security section',
      path: 'src/content/trust/default',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Headline' }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        badges: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'Shield', value: 'shield' },
                { label: 'Lock', value: 'lock' },
                { label: 'Check circle', value: 'check-circle' },
              ],
              defaultValue: 'shield',
            }),
          }),
          {
            label: 'Badges',
            itemLabel: (props) => props.fields.label.value || '(empty)',
          },
        ),
        quote: fields.text({
          label: 'Trust quote',
          multiline: true,
        }),
        quoteAuthor: fields.text({ label: 'Quote author' }),
        quoteRole: fields.text({ label: 'Quote author role' }),
      },
    }),
    integrations: singleton({
      label: 'Integrations section',
      path: 'src/content/integrations/default',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Headline' }),
        logos: fields.array(
          fields.object({
            name: fields.text({ label: 'ERP name' }),
            url: fields.text({
              label: 'Logo URL',
              description: 'Full image URL (SVG or PNG).',
            }),
          }),
          {
            label: 'ERP logos',
            itemLabel: (props) => props.fields.name.value || '(empty)',
          },
        ),
        quote: fields.text({
          label: 'Integration quote',
          multiline: true,
        }),
        quoteAuthor: fields.text({ label: 'Quote author' }),
        quoteRole: fields.text({ label: 'Quote author role' }),
        quoteAvatar: fields.text({
          label: 'Avatar URL (optional)',
          description: 'Small round photo next to the quote.',
        }),
      },
    }),
    nav: singleton({
      label: 'Navigation',
      path: 'src/content/navigation/default',
      format: { data: 'json' },
      schema: {
        primaryLinks: fields.array(
          fields.object({
            text: fields.text({ label: 'Link text' }),
            href: fields.text({
              label: 'Link destination',
              description:
                'Use /pricing, /cases, /#how-it-works (on-page anchor), or any absolute URL.',
            }),
          }),
          {
            label: 'Primary nav links',
            description: 'Shown in the desktop nav and mobile menu.',
            itemLabel: (props) =>
              props.fields.text.value || props.fields.href.value || '(empty)',
          },
        ),
        cta: fields.object(
          {
            text: fields.text({ label: 'Button text' }),
            href: fields.text({
              label: 'Button destination',
              description: 'Typically /#contact or /pricing.',
            }),
          },
          { label: 'CTA button (orange pill on the right)' },
        ),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/footer/default',
      format: { data: 'json' },
      schema: {
        tagline: fields.text({
          label: 'Tagline',
          multiline: true,
          description: 'Short sentence under the logo.',
        }),
        linkGroups: fields.array(
          fields.object({
            heading: fields.text({
              label: 'Column heading',
              description: 'e.g. "Product", "Industry solutions", "Legal".',
            }),
            links: fields.array(
              fields.object({
                text: fields.text({ label: 'Link text' }),
                href: fields.text({ label: 'Link destination' }),
              }),
              {
                label: 'Links',
                itemLabel: (props) =>
                  props.fields.text.value || props.fields.href.value || '(empty)',
              },
            ),
          }),
          {
            label: 'Link columns',
            description:
              'The "Legal" column automatically gets a "Cookie settings" button appended for GDPR compliance.',
            itemLabel: (props) => props.fields.heading.value || '(empty)',
          },
        ),
        copyright: fields.text({
          label: 'Copyright line',
          description: 'Bottom of the footer.',
        }),
        complianceLabels: fields.array(
          fields.text({ label: 'Label' }),
          {
            label: 'Compliance labels',
            description: 'e.g. "ISO 27001 CERTIFIED", "GDPR COMPLIANT".',
            itemLabel: (props) => props.value || '(empty)',
          },
        ),
      },
    }),
  },
  collections: {
    pages: collection({
      label: 'Page meta (title / description / og image)',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { data: 'json' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Page title',
            description:
              'Used for the browser tab and social share. Route slug is locked: do not rename files.',
          },
          slug: {
            label: 'Route slug (locked)',
            description:
              'Must match the filename (home, pricing, cases, calculator, knowledge-base, pdf-demo). Do not change.',
          },
        }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          validation: { length: { min: 20, max: 220 } },
        }),
        ogImage: fields.text({
          label: 'OG image path (optional)',
          description: 'Absolute path under public/, e.g. /og-pricing.png.',
        }),
        noindex: fields.checkbox({
          label: 'Hide from search engines (noindex)',
          description:
            'Emits <meta name="robots" content="noindex,nofollow"> on this page. Use for thank-you pages or internal-only routes.',
          defaultValue: false,
        }),
      },
    }),
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      columns: ['author', 'company', 'order'],
      schema: {
        author: fields.slug({
          name: {
            label: 'Author',
            description: 'Person being quoted. Used as the slug.',
          },
          slug: {
            label: 'Filename slug',
            description: 'Filename in src/content/testimonials/. Keep short.',
          },
        }),
        quote: fields.text({
          label: 'Quote',
          multiline: true,
        }),
        company: fields.text({ label: 'Company' }),
        role: fields.text({
          label: 'Role (optional)',
          description: 'Job title. Combined with company on display.',
        }),
        pill: fields.text({
          label: 'Pill (optional)',
          description: 'Short badge shown above the quote (e.g. "Future-proof value").',
        }),
        featured: fields.checkbox({
          label: 'Featured',
          description: 'Pins the quote to the top of rotations.',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers appear first.',
          defaultValue: 0,
        }),
      },
    }),
    plans: collection({
      label: 'Pricing plans',
      slugField: 'name',
      path: 'src/content/plans/*',
      format: { data: 'json' },
      columns: ['name', 'monthlyPrice', 'order'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Plan name',
            description: 'Shown on the pricing card. Also the filename slug.',
          },
          slug: {
            label: 'Filename slug',
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        monthlyPrice: fields.integer({
          label: 'Monthly price (EUR)',
          description: 'Leave empty for custom-priced plans (e.g. Enterprise).',
        }),
        yearlyPrice: fields.integer({
          label: 'Yearly price (EUR)',
          description: 'Per-month price when billed annually. Leave empty for custom-priced.',
        }),
        orderLimit: fields.text({
          label: 'Order limit',
          description: 'e.g. "1,000 orders/month" or "Unlimited orders".',
        }),
        features: fields.array(
          fields.text({ label: 'Feature' }),
          {
            label: 'Features',
            itemLabel: (props) => props.value || '(empty)',
          },
        ),
        popular: fields.checkbox({
          label: 'Popular',
          description: 'Highlights the plan with a "Most popular" badge.',
          defaultValue: false,
        }),
        ctaText: fields.text({
          label: 'CTA button text',
          defaultValue: 'Talk to Expert',
        }),
        iconId: fields.select({
          label: 'Icon',
          options: [
            { label: 'Users', value: 'users' },
            { label: 'Zap', value: 'zap' },
            { label: 'Shield', value: 'shield' },
            { label: 'Rocket', value: 'rocket' },
            { label: 'Building', value: 'building' },
          ],
          defaultValue: 'users',
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers appear first left-to-right.',
          defaultValue: 0,
        }),
      },
    }),
    cases: collection({
      label: 'Case studies',
      slugField: 'title',
      path: 'src/content/cases/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['company', 'industry', 'order'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description:
              'Headline for the case study (HTML allowed, e.g. for emphasised words).',
          },
          slug: {
            label: 'Filename slug',
          },
        }),
        subtitle: fields.text({
          label: 'Subtitle',
          multiline: true,
        }),
        company: fields.text({ label: 'Company' }),
        industry: fields.text({ label: 'Industry' }),
        location: fields.text({ label: 'Location' }),
        volume: fields.text({
          label: 'Volume',
          description: 'e.g. "1,200+ purchase orders monthly".',
        }),
        logo: fields.text({
          label: 'Logo path (optional)',
          description: 'Path under /public/ or an absolute URL.',
        }),
        quote: fields.text({
          label: 'Hero quote',
          multiline: true,
        }),
        quoteAuthor: fields.text({ label: 'Quote author' }),
        quoteRole: fields.text({ label: 'Quote author role / company' }),
        metrics: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            unit: fields.text({ label: 'Unit' }),
            label: fields.text({ label: 'Label' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Metrics',
            itemLabel: (props) =>
              `${props.fields.value.value || ''} ${props.fields.unit.value || ''} — ${props.fields.label.value || ''}`.trim(),
          },
        ),
        implementationSteps: fields.array(
          fields.object({
            title: fields.text({ label: 'Step title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Implementation steps',
            itemLabel: (props) => props.fields.title.value || '(empty)',
          },
        ),
        roi: fields.object(
          {
            paybackMonths: fields.number({ label: 'Payback months' }),
            annualSavings: fields.integer({ label: 'Annual savings (EUR)' }),
            annualCost: fields.integer({ label: 'Annual cost (EUR)' }),
            netSavings: fields.integer({ label: 'Net savings (EUR)' }),
            roiPercentage: fields.integer({ label: 'ROI %' }),
            hourlyRate: fields.integer({ label: 'Hourly rate (EUR)' }),
          },
          { label: 'ROI figures' },
        ),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers appear first.',
          defaultValue: 0,
        }),
        seo: seoOverrideFields,
        body: fields.mdx({
          label: 'Long-form body (optional)',
          description: 'Used where the case page wants freeform copy below the structured data.',
        }),
      },
    }),
    faqs: collection({
      label: 'Homepage FAQs',
      slugField: 'question',
      path: 'src/content/faqs/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['question', 'order'],
      schema: {
        question: fields.slug({
          name: {
            label: 'Question',
          },
          slug: {
            label: 'Filename slug',
          },
        }),
        order: fields.integer({
          label: 'Order',
          defaultValue: 0,
        }),
        body: fields.mdx({
          label: 'Answer',
          description: 'Markdown. Links, lists, and emphasis render on the live site.',
        }),
      },
    }),
    pricingFaqs: collection({
      label: 'Pricing-page FAQs',
      slugField: 'question',
      path: 'src/content/pricingFaqs/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['question', 'order'],
      schema: {
        question: fields.slug({
          name: {
            label: 'Question',
          },
          slug: {
            label: 'Filename slug',
          },
        }),
        order: fields.integer({
          label: 'Order',
          defaultValue: 0,
        }),
        body: fields.mdx({
          label: 'Answer',
        }),
      },
    }),
    'kb-getting-started': makeArticleCollection({
      label: 'Getting Started',
      path: 'src/content/kb/getting-started/*',
      categoryValue: 'getting-started',
    }),
    'kb-integraties': makeArticleCollection({
      label: 'Integraties',
      path: 'src/content/kb/integraties/*',
      categoryValue: 'integraties',
    }),
    'kb-tips-best-practices': makeArticleCollection({
      label: 'Tips & Best Practices',
      path: 'src/content/kb/tips-best-practices/*',
      categoryValue: 'tips-best-practices',
    }),
    'kb-faq': makeArticleCollection({
      label: 'FAQ',
      path: 'src/content/kb/faq/*',
      categoryValue: 'faq',
    }),
    'kb-updates': makeArticleCollection({
      label: 'Updates',
      path: 'src/content/kb/updates/*',
      categoryValue: 'updates',
    }),
  },
});
