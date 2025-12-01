import Link from 'next/link';

export const metadata = {
  title: 'Shipping Information - Firewood USA',
  description: 'Learn about our delivery options, shipping areas, and delivery process for premium firewood.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
      {/* Hero Section */}
      <div className="bg-wood-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Shipping Information
            </h1>
            <p className="text-base sm:text-lg text-wood-100">
              Everything you need to know about our delivery service
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Free Delivery */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                🚚 Free Delivery Within 50 Miles
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                We offer complimentary delivery for all orders within 50 miles of our location. 
                Orders beyond this range may be subject to additional delivery fees.
              </p>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Delivery Areas
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
              <p className="mb-4">
                We proudly serve the following areas with our premium firewood delivery service:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Within 50 miles: <strong>FREE delivery</strong></li>
                <li>50-75 miles: Additional $25 delivery fee</li>
                <li>75-100 miles: Additional $50 delivery fee</li>
                <li>Beyond 100 miles: Contact us for a custom quote</li>
              </ul>
              <p className="text-sm italic">
                * Delivery fees are calculated based on the distance from our facility to your delivery address.
              </p>
            </div>
          </section>

          {/* Delivery Process */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              How Delivery Works
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Place Your Order</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Select your firewood and complete your order online. You'll receive an order confirmation email.
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
                    <h3 className="text-lg font-bold mb-2">Schedule Delivery</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      We'll contact you within 24 hours to schedule a convenient delivery time.
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
                    <h3 className="text-lg font-bold mb-2">Delivery Day</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Our team will deliver and stack your firewood at your specified location.
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
                    <h3 className="text-lg font-bold mb-2">Enjoy Your Fire</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Your firewood is ready to use immediately. No additional seasoning required!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Times */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Delivery Timeframes
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-3 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Standard Delivery:</strong> 2-5 business days from order placement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Rush Delivery:</strong> Next-day delivery available for additional fee (subject to availability)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span><strong>Scheduled Delivery:</strong> Choose your preferred delivery date during checkout</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Delivery Requirements */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Delivery Requirements
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
              <p className="mb-4">
                To ensure a smooth delivery, please ensure:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Clear access to the delivery location (driveway, garage, etc.)</li>
                <li>Space for our delivery vehicle to park safely</li>
                <li>No obstacles blocking the stacking area</li>
                <li>Someone 18+ available to receive the delivery</li>
              </ul>
              <p className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <strong>Note:</strong> If access issues prevent delivery, additional fees may apply for a return trip.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-wood-800 text-white rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Questions About Delivery?
            </h2>
            <p className="text-base sm:text-lg text-wood-100 mb-6">
              Our team is here to help with any shipping questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="bg-primary-800 text-white hover:bg-primary-900 px-6 sm:px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                View FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
