import Link from 'next/link';

export const metadata = {
  title: 'About Us - Firewood USA',
  description: 'Learn about Firewood USA - your trusted source for premium seasoned firewood delivery.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
      {/* Hero Section */}
      <div className="bg-wood-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              About Firewood USA
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-wood-100">
              Premium firewood delivered to your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <section className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Story
            </h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Firewood USA was founded with a simple mission: to provide high-quality, seasoned firewood 
                to homes and businesses throughout the region. We understand that a great fire starts with 
                great wood, and we're committed to delivering the best.
              </p>
              <p className="mb-4">
                Our firewood is carefully selected, properly seasoned, and kiln-dried to ensure it burns 
                cleanly and efficiently. Whether you're warming your home, enjoying a backyard fire pit, 
                or preparing for winter, we have the perfect wood for your needs.
              </p>
            </div>
          </section>

          {/* What Makes Us Different */}
          <section className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">Premium Quality</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  All our firewood is carefully seasoned and kiln-dried to ensure optimal burning. 
                  We only use premium hardwoods like oak, cherry, maple, and hickory.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">Free Delivery</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We offer free delivery within 50 miles of our location. Your firewood will be 
                  stacked neatly and ready to use.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">🌡️</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">Heat-Treated</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our firewood is heat-treated to eliminate pests and ensure it's ready to burn 
                  immediately upon delivery.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">Satisfaction Guaranteed</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We stand behind our products 100%. If you're not completely satisfied with your 
                  firewood, we'll make it right.
                </p>
              </div>
            </div>
          </section>

          {/* Our Process */}
          <section className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Our Process
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Selection</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We carefully select premium hardwoods from sustainable sources.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Seasoning</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Our wood is properly seasoned to reduce moisture content below 20% for optimal burning.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Kiln-Drying</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We kiln-dry our firewood to ensure consistent moisture levels and eliminate pests.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Delivery</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Your firewood is delivered and stacked, ready to use immediately.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-wood-800 text-white rounded-lg p-6 sm:p-8 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Order?
            </h2>
            <p className="text-base sm:text-lg text-wood-100 mb-6 sm:mb-8">
              Browse our selection of premium firewood and get free delivery within 50 miles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Shop Firewood
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-primary-800 text-white hover:bg-primary-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
