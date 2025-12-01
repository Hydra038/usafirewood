import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Firewood USA',
  description: 'Get in touch with Firewood USA. Call, text, or email us for any inquiries about our premium firewood delivery services.',
};

export default function ContactPage() {
  const phone = '2352001489';
  const phoneFormatted = '(235) 200-1489';
  const email = 'info@firewoodusa.com';

  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Have questions about our firewood delivery service? We're here to help!
            </p>
          </div>

          {/* Contact Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16">
            {/* Call Us */}
            <a
              href={`tel:${phone}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary-500 transition-colors">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2 sm:mb-3">
                  {phoneFormatted}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Mon-Sat: 8am-6pm
                </p>
                <div className="mt-4 sm:mt-6 flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <span className="text-sm sm:text-base">Tap to call</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Text Us */}
            <a
              href={`sms:${phone}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-green-500 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500 transition-colors">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Text Us</h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                  {phoneFormatted}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Quick responses via SMS
                </p>
                <div className="mt-4 sm:mt-6 flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  <span className="text-sm sm:text-base">Send a message</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                How Can We Help?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Order Inquiries</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Questions about your order or delivery</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Pricing & Products</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Learn about our firewood options</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Delivery Areas</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Check if we deliver to your location</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">General Support</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Any other questions or concerns</p>
                  </div>
                </div>
              </div>

              <div className="bg-wood-50 rounded-xl p-4 sm:p-6 border border-wood-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wood-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Business Hours</h3>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Monday - Saturday:</span> 8:00 AM - 6:00 PM
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Sunday:</span> Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Order?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Browse our selection of premium firewood and get it delivered to your door
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Shop Firewood
              </Link>
              <a
                href={`tel:${phone}`}
                className="w-full sm:w-auto bg-primary-800 text-white hover:bg-primary-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
