import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Firewood USA',
  description: 'Read our privacy policy to learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const lastUpdated = 'December 2, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
      {/* Hero Section */}
      <div className="bg-wood-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-wood-100">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base lg:prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              At Firewood USA, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or make a purchase.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              Personal Information
            </h3>
            <p className="text-gray-600 mb-3">
              When you place an order or create an account, we may collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and shipping address</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>Order history and preferences</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              Automatically Collected Information
            </h3>
            <p className="text-gray-600 mb-3">
              When you visit our website, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and deliveries</li>
              <li>Provide customer service and support</li>
              <li>Improve our website and services</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Prevent fraudulent transactions and protect against security threats</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 mb-3">
              We do not sell or rent your personal information to third parties. We may share your 
              information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Service Providers:</strong> Payment processors, delivery services, and IT support</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-600 mb-3">
              We implement appropriate technical and organizational measures to protect your personal 
              information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Secure Socket Layer (SSL) encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="text-gray-600 mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive to 
              protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in to your account</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="text-gray-600 mt-3">
              You can control cookie preferences through your browser settings, though some features 
              may not function properly if cookies are disabled.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-600 mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To exercise these rights, contact us at{' '}
              <a href="tel:2352001489" className="text-primary-600 hover:underline">
                (235) 200-1489
              </a>
              .
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-600">
              Our website is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              8. Third-Party Links
            </h2>
            <p className="text-gray-600">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to review their privacy 
              policies before providing any personal information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. Any changes will be posted on this 
              page with an updated "Last Updated" date. We encourage you to review this policy 
              periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-600 mb-3">
              If you have questions or concerns about this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-wood-50 border-l-4 border-wood-600 p-6 rounded-lg">
              <p className="text-gray-700 font-semibold mb-2">Firewood USA</p>
              <p className="text-gray-600 text-sm">
                <strong>Phone/Text:</strong>{' '}
                <a href="tel:2352001489" className="text-primary-600 hover:underline">
                  (235) 200-1489
                </a>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <Link href="/contact" className="text-primary-600 hover:underline">
                  Visit our Contact Page
                </Link>
              </p>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-wood-800 text-white rounded-lg p-6 sm:p-8 text-center not-prose">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-base sm:text-lg text-wood-100 mb-6">
              We're committed to protecting your information. Contact us anytime.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
