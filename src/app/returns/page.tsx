import Link from 'next/link';

export const metadata = {
  title: 'Returns & Refunds - Firewood USA',
  description: 'Learn about our return policy, refund process, and satisfaction guarantee.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
      {/* Hero Section */}
      <div className="bg-wood-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Returns & Refunds
            </h1>
            <p className="text-base sm:text-lg text-wood-100">
              Your satisfaction is our priority
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Satisfaction Guarantee */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                ✅ 100% Satisfaction Guarantee
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                We stand behind the quality of our firewood. If you're not completely satisfied with 
                your purchase, we'll make it right.
              </p>
            </div>
          </section>

          {/* Return Policy */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Return Policy
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
              <p className="mb-4">
                At Firewood USA, we want you to be completely satisfied with your purchase. While firewood 
                is a natural product and returns are handled on a case-by-case basis, we're committed to 
                resolving any issues.
              </p>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3">
                Eligible for Return/Replacement:
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Firewood that is excessively wet or moldy</li>
                <li>Wood that doesn't match the ordered species</li>
                <li>Incorrect quantity delivered</li>
                <li>Damaged or unusable wood due to shipping</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3">
                Not Eligible for Return:
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Buyer's remorse or change of mind</li>
                <li>Minor variations in wood size or appearance (natural variation)</li>
                <li>Wood that has been used or burned</li>
                <li>Claims made more than 7 days after delivery</li>
              </ul>
            </div>
          </section>

          {/* How to Request a Return */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              How to Request a Return or Replacement
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Contact Us</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Call or text us at <strong>(235) 200-1489</strong> within 7 days of delivery to report any issues.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Provide Details</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Share your order number, photos of the issue, and a description of the problem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">We'll Review</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Our team will review your claim and respond within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Resolution</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      We'll either replace the firewood, issue a refund, or provide a credit for future orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Refund Process
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-3 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Processing Time:</strong> Refunds are processed within 3-5 business days of approval</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Refund Method:</strong> Refunds are issued to the original payment method</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Partial Refunds:</strong> May be offered for minor issues or partial orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Store Credit:</strong> Available as an alternative to refunds</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Damaged Delivery */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Damaged or Incorrect Delivery
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
              <p className="mb-4">
                If your delivery arrives damaged or incorrect:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li><strong>Do not accept the delivery</strong> if damage is visible</li>
                <li><strong>Take photos</strong> of the damaged wood or incorrect delivery</li>
                <li><strong>Contact us immediately</strong> at (235) 200-1489</li>
                <li><strong>We'll arrange</strong> for a replacement delivery at no cost</li>
              </ol>
              <p className="text-sm bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <strong>Tip:</strong> Inspect your delivery upon arrival. It's easier to address issues 
                immediately than after the wood has been stacked.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-wood-800 text-white rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need to Start a Return?
            </h2>
            <p className="text-base sm:text-lg text-wood-100 mb-6">
              Contact our customer service team and we'll help resolve your issue quickly.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Contact Customer Service
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
