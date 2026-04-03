import React from 'react';
import { Link } from 'react-router-dom';
import { requestOpenCookieConsent } from '../src/lib/cookieConsent';

const tableWrap = 'overflow-x-auto rounded-xl border border-gray-200 bg-white my-4';
const th = 'text-left text-xs font-bold uppercase tracking-wide text-text-primary px-4 py-3 border-b border-gray-100 bg-warm-bg-alt';
const td = 'text-sm text-text-secondary px-4 py-3 border-b border-gray-50 align-top';

const PrivacyPage: React.FC = () => {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-text-secondary text-sm leading-relaxed">
      <h1 className="text-3xl sm:text-4xl font-black text-text-primary mb-2">
        Privacy &amp; Cookie Policy
      </h1>
      <p className="text-text-muted text-sm mb-2">
        <a
          href="https://order-pilot.ai"
          className="text-rb2-orange font-semibold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          order-pilot.ai
        </a>
      </p>
      <p className="text-text-secondary text-sm mb-10">
        <strong className="text-text-primary">Last updated:</strong> 1 April 2026
      </p>

      <p className="mb-8">
        At rb2 B.V., we value the protection of your personal data. Through our website,{' '}
        <a
          href="https://order-pilot.ai"
          className="text-rb2-orange font-semibold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          order-pilot.ai
        </a>
        , personal data is collected, and cookies are placed. This Privacy and Cookie Policy explains
        how we handle your data and protect your privacy, in full compliance with applicable privacy
        laws, including the General Data Protection Regulation (GDPR).
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Who are we?</h2>
        <p className="mb-4">
          Orderpilot is a product of rb2 B.V. We are based in the Netherlands and can be reached via:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-text-primary">Email:</strong>{' '}
            <a href="mailto:info@order-pilot.ai" className="text-rb2-orange font-semibold hover:underline">
              info@order-pilot.ai
            </a>
          </li>
          <li>
            <strong className="text-text-primary">Phone:</strong> +31 (0)299 200 800
          </li>
          <li>
            <strong className="text-text-primary">Address:</strong> Wilhelminalaan 1-C, 1441 EK
            Purmerend, The Netherlands
          </li>
          <li>
            <strong className="text-text-primary">Chamber of Commerce (KvK):</strong> 37141751
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">What personal data do we process?</h2>
        <p className="mb-4">
          Depending on your interaction with our website, we may process the following personal data:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Name, email address, and company name (if provided via contact or demo request forms)</li>
          <li>Phone number (if provided)</li>
          <li>
            User data, such as website behavior (pages visited, time on site, referral source)
          </li>
          <li>IP address (anonymized for analytics)</li>
          <li>Cost calculator input</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Why do we process your personal data?</h2>
        <p className="mb-4">We process your personal data to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Respond to your inquiries or demo requests</li>
          <li>Send you relevant information about Orderpilot (only with your consent)</li>
          <li>Analyze and improve website usage and performance</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Legal grounds for processing</h2>
        <p className="mb-4">We process your data based on:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-text-primary">Your consent</strong> (e.g. when you submit a form
            or accept analytics cookies)
          </li>
          <li>
            <strong className="text-text-primary">Legitimate interest</strong> (e.g. limited website
            and security operations where applicable)
          </li>
          <li>
            <strong className="text-text-primary">Performance of an agreement</strong> (e.g. when you
            sign up for a demo or trial)
          </li>
          <li>
            <strong className="text-text-primary">Compliance with legal obligations</strong>
          </li>
        </ul>
        <p className="mt-4 text-text-muted text-xs">
          Where we rely on consent (for example for PostHog analytics), you can withdraw it at any
          time without affecting the lawfulness of processing based on consent before its withdrawal.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">How do we secure your data?</h2>
        <p className="mb-4">
          Your personal data is protected against misuse and unauthorized access. We implement measures
          such as:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Encrypted connections (HTTPS/TLS)</li>
          <li>Two-step verification for access to our systems</li>
          <li>Secure storage of data</li>
          <li>Regular security reviews</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">How long do we retain your data?</h2>
        <p className="mb-4">
          Your personal data is not retained longer than strictly necessary for the purposes for which
          it is processed. Specifically:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Contact form submissions: 12 months after last interaction</li>
          <li>Analytics data: up to 26 months (PostHog default retention, configurable)</li>
          <li>Email marketing data: until you unsubscribe</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">What are your rights?</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-text-primary">Access</strong> the personal data we process about you
          </li>
          <li>
            <strong className="text-text-primary">Request corrections</strong> to inaccurate or outdated
            data
          </li>
          <li>
            <strong className="text-text-primary">Request deletion</strong> of your data
          </li>
          <li>
            <strong className="text-text-primary">Object</strong> to the processing of your data
          </li>
          <li>
            <strong className="text-text-primary">Request data portability</strong> (receive your data
            in a structured format)
          </li>
          <li>
            <strong className="text-text-primary">Withdraw consent</strong> at any time
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:info@order-pilot.ai" className="text-rb2-orange font-semibold hover:underline">
            info@order-pilot.ai
          </a>
          . We will respond within 30 days.
        </p>
        <p className="mt-4">
          You also have the right to file a complaint with the Dutch Data Protection Authority
          (Autoriteit Persoonsgegevens):{' '}
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            className="text-rb2-orange font-semibold hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            autoriteitpersoonsgegevens.nl
          </a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Third-party services and sub-processors</h2>
        <p className="mb-4">We use the following third-party services on our website:</p>
        <div className={tableWrap}>
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr>
                <th className={th}>Service</th>
                <th className={th}>Purpose</th>
                <th className={th}>Data processed</th>
                <th className={th}>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>PostHog</td>
                <td className={td}>Website analytics</td>
                <td className={td}>Usage events, device/browser data; IP treated per PostHog settings</td>
                <td className={td}>EU (when configured for EU hosting)</td>
              </tr>
              <tr>
                <td className={td}>Resend</td>
                <td className={td}>Transactional &amp; marketing emails</td>
                <td className={td}>Email address, name</td>
                <td className={td}>USA (SOC 2 compliant)</td>
              </tr>
              <tr>
                <td className={td}>Vercel</td>
                <td className={td}>Website hosting &amp; CDN</td>
                <td className={td}>Server logs, IP addresses, request metadata</td>
                <td className={td}>
                  Global infrastructure (including US &amp; EU); see{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    className="text-rb2-orange font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vercel&apos;s privacy policy
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-gray-200 my-12" />

      <section className="mb-10">
        <h2 className="text-2xl font-black text-text-primary mb-4">Cookie Policy</h2>
        <p className="mb-6">
          Cookies are small information files that are stored on or retrieved from your device (such as
          a PC, tablet, or smartphone) via your web browser when you visit a website.
        </p>

        <h3 className="text-lg font-bold text-text-primary mb-3">What cookies do we use?</h3>

        <h4 className="text-base font-bold text-text-primary mt-6 mb-3">
          Functional storage (strictly necessary)
        </h4>
        <p className="mb-4">
          These technologies are necessary for the site to remember your choices and to operate our
          consent mechanism. Under the ePrivacy rules, strictly necessary cookies do not require
          consent.
        </p>
        <div className={tableWrap}>
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className={th}>Name / key</th>
                <th className={th}>Purpose</th>
                <th className={th}>Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>
                  <code className="text-xs bg-warm-bg-alt px-1.5 py-0.5 rounded">orderpilot-cookie-consent</code>{' '}
                  (localStorage)
                </td>
                <td className={td}>Stores whether you accepted or declined analytics</td>
                <td className={td}>Until you clear site data or change preference via the banner</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-base font-bold text-text-primary mt-8 mb-3">Analytics (PostHog)</h4>
        <p className="mb-4">
          We use PostHog for website analytics <strong className="text-text-primary">only after you consent</strong>.
          PostHog is configured to prioritize privacy, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Anonymized or limited IP handling per PostHog project settings</li>
          <li>Data stored in the EU when using the EU data region</li>
          <li>No sale of data to unrelated third parties for their own advertising</li>
        </ul>
        <p className="mb-4 text-xs text-text-muted">
          PostHog may set cookies and/or use browser storage (e.g. keys prefixed with{' '}
          <code className="bg-warm-bg-alt px-1 rounded">ph_</code> tied to your project). Exact names
          and expiry depend on your PostHog SDK version and persistence settings (we use cookie +
          localStorage where enabled). Typical maximum duration is up to ~1 year unless you clear
          storage earlier.
        </p>
        <div className={tableWrap}>
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className={th}>Cookie / storage</th>
                <th className={th}>Purpose</th>
                <th className={th}>Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>
                  PostHog identifiers (e.g. <code className="text-xs bg-warm-bg-alt px-1 rounded">ph_*</code>)
                </td>
                <td className={td}>Session and returning visitor analytics</td>
                <td className={td}>Up to ~1 year; cleared if you withdraw consent or delete cookies</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-base font-bold text-text-primary mt-8 mb-3">Marketing / tracking cookies</h4>
        <p>
          We do not use separate advertising or social pixels for cross-site tracking on this website.
          If we add such tools in the future, we will update this policy and, where required, ask for
          consent before they load.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Managing and deleting cookies</h2>
        <p className="mb-4">
          You can configure your browser to restrict cookies or delete them manually. For more
          information, refer to your browser&apos;s help or settings.
        </p>
        <p>
          Please note: some website functions may not work properly if you block all storage, including
          strictly necessary data for remembering your cookie choice.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Consent management</h2>
        <p className="mb-4">
          When you first visit our site, you can accept analytics or choose essential-only processing.
          You can reopen the preference panel at any time:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Via <strong className="text-text-primary">Cookie settings</strong> in the website footer</li>
          <li>Via the button below</li>
        </ul>
        <button
          type="button"
          onClick={() => requestOpenCookieConsent()}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold bg-rb2-orange text-white hover:bg-rb2-orange-hover transition-colors shadow-lg shadow-rb2-orange/15"
        >
          Change cookie preferences
        </button>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Third-party websites</h2>
        <p>
          This Privacy and Cookie Policy does not apply to websites of third parties that are linked
          to our website. We cannot guarantee that these third parties handle your personal data
          securely or responsibly. We recommend reading the privacy policies of these websites before
          using them.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Changes to this policy</h2>
        <p>
          We reserve the right to make changes to this Privacy and Cookie Policy. Please check this
          page regularly to stay informed of any updates. The date at the top of this page indicates
          when it was last updated.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Contact</h2>
        <p className="mb-4">If you have any questions about this Privacy and Cookie Policy:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-text-primary">Email:</strong>{' '}
            <a href="mailto:info@order-pilot.ai" className="text-rb2-orange font-semibold hover:underline">
              info@order-pilot.ai
            </a>
          </li>
          <li>
            <strong className="text-text-primary">Phone:</strong> +31 (0)299 200 800
          </li>
          <li>
            <strong className="text-text-primary">Address:</strong> Wilhelminalaan 1-C, 1441 EK
            Purmerend, The Netherlands
          </li>
        </ul>
      </section>

      <Link
        to="/"
        className="inline-block mt-8 text-sm font-bold text-rb2-orange hover:underline"
      >
        ← Back to home
      </Link>
    </article>
  );
};

export default PrivacyPage;
