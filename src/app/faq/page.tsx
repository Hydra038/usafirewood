import Link from 'next/link';

export const metadata = {
  title: 'FAQ - Firewood USA',
  description: 'Frequently asked questions about our firewood products, delivery, and services.',
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'General Questions',
      questions: [
        {
          q: 'What types of firewood do you offer?',
          a: 'We offer premium hardwoods including Oak, Cherry, Maple, Hickory, Ash, and softwoods like Pine and Cedar. Each type has unique burning characteristics.',
        },
        {
          q: 'Is your firewood seasoned and ready to burn?',
          a: 'Yes! All our firewood is properly seasoned and kiln-dried to below 20% moisture content. It\'s ready to burn immediately upon delivery.',
        },
        {
          q: 'How is your firewood packaged?',
          a: 'Firewood is delivered in bulk or in convenient cord/half-cord bundles. We stack it neatly at your designated location.',
        },
      ],
    },
    {
      category: 'Ordering & Payment',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Simply browse our products online, add items to your cart, and complete the checkout process. You can also call us at (235) 200-1489 to place an order.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and digital payment methods through our secure checkout system.',
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'Yes, you can modify or cancel your order within 24 hours of placing it. Contact us immediately at (235) 200-1489.',
        },
      ],
    },
    {
      category: 'Delivery',
      questions: [
        {
          q: 'Do you offer free delivery?',
          a: 'Yes! We offer free delivery within 50 miles of our location. Additional fees apply for distances beyond 50 miles.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery is 2-5 business days. We\'ll contact you within 24 hours to schedule a convenient delivery time.',
        },
        {
          q: 'Will you stack the firewood?',
          a: 'Yes! Our delivery team will stack your firewood at your specified location as part of the standard delivery service.',
        },
        {
          q: 'What if I\'m not home during delivery?',
          a: 'We can arrange to deliver and stack the wood even if you\'re not home, as long as we have clear access and instructions on where to place it.',
        },
      ],
    },
    {
      category: 'Product Quality',
      questions: [
        {
          q: 'How do I know the wood is dry enough?',
          a: 'All our firewood is kiln-dried to below 20% moisture content. We can provide a moisture reading upon request.',
        },
        {
          q: 'What\'s the difference between hardwood and softwood?',
          a: 'Hardwoods (Oak, Maple, Hickory) burn longer and hotter, ideal for heating. Softwoods (Pine, Cedar) ignite quickly and are great for kindling or ambiance fires.',
        },
        {
          q: 'Is your firewood treated for pests?',
          a: 'Yes, all our firewood is heat-treated during the kiln-drying process, which eliminates insects, larvae, and fungus.',
        },
        {
          q: 'How much wood is in a cord?',
          a: 'A full cord is 128 cubic feet (4\' x 4\' x 8\' when stacked). We also offer half cords (64 cubic feet) and quarter cords.',
        },
      ],
    },
    {
      category: 'Storage & Usage',
      questions: [
        {
          q: 'How should I store my firewood?',
          a: 'Store firewood in a dry, covered area with good airflow. Keep it off the ground and away from your home to prevent pest issues.',
        },
        {
          q: 'How long will my firewood last?',
          a: 'This depends on usage. A full cord typically lasts 6-8 weeks with daily use in a standard fireplace or wood stove.',
        },
        {
          q: 'Can I use this wood in a pizza oven?',
          a: 'Absolutely! Many of our hardwoods (especially Oak and Maple) are excellent for pizza ovens and outdoor cooking.',
        },
      ],
    },
    {
      category: 'Returns & Issues',
      questions: [
        {
          q: 'What if I\'m not satisfied with my firewood?',
          a: 'We offer a 100% satisfaction guarantee. Contact us within 7 days of delivery if there are any issues, and we\'ll make it right.',
        },
        {
          q: 'What if the wood is too wet?',
          a: 'This is extremely rare due to our kiln-drying process. If you receive wet wood, contact us immediately for a replacement or refund.',
        },
        {
          q: 'Can I return unused firewood?',
          a: 'Returns are handled case-by-case. Contact us at (235) 200-1489 to discuss your situation.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
      {/* Hero Section */}
      <div className="bg-wood-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-wood-100">
              Find answers to common questions about our firewood and services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Contact */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8 sm:mb-12">
            <p className="text-sm sm:text-base text-gray-700">
              <strong>Can't find your answer?</strong> Call or text us at{' '}
              <a href="tel:2352001489" className="text-primary-600 font-bold hover:underline">
                (235) 200-1489
              </a>
            </p>
          </div>

          {/* FAQ Categories */}
          {faqs.map((category, idx) => (
            <section key={idx} className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-2">
                      <span className="text-primary-600 flex-shrink-0">Q:</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 ml-6">
                      <strong className="text-primary-600">A:</strong> {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Additional Resources */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/shipping"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="text-lg font-bold mb-2">Shipping Info</h3>
                <p className="text-sm text-gray-600">
                  Learn about delivery areas, times, and requirements
                </p>
              </Link>

              <Link
                href="/returns"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">↩️</div>
                <h3 className="text-lg font-bold mb-2">Returns Policy</h3>
                <p className="text-sm text-gray-600">
                  Understand our satisfaction guarantee and return process
                </p>
              </Link>

              <Link
                href="/about"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">ℹ️</div>
                <h3 className="text-lg font-bold mb-2">About Us</h3>
                <p className="text-sm text-gray-600">
                  Learn more about our company and what we do
                </p>
              </Link>

              <Link
                href="/contact"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">📞</div>
                <h3 className="text-lg font-bold mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">
                  Get in touch with our customer service team
                </p>
              </Link>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-wood-800 text-white rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-base sm:text-lg text-wood-100 mb-6">
              Our team is here to help you find the perfect firewood for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                className="bg-primary-800 text-white hover:bg-primary-900 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                Shop Firewood
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
