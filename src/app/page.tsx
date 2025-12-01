import Link from 'next/link';

export default async function HomePage() {
  return (
    <>
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-wood-900 to-wood-700 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-wood-900/70"></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
              Premium Firewood Delivered to Your Door
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-wood-100 drop-shadow-md">
              Seasoned and kiln-dried hardwood firewood. Heat-treated and ready to burn. Free
              delivery within 50 miles.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                href="/products"
                className="text-center bg-primary-600 hover:bg-primary-700 text-white px-8 sm:px-10 py-4 rounded-lg font-semibold transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="text-center bg-white/20 hover:bg-white/30 text-white px-8 sm:px-10 py-4 rounded-lg font-semibold transition backdrop-blur-md border-2 border-white/30 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Seasoned for 12+ months and kiln-dried for optimal burning
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">Free delivery within 50 miles, same-week service</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Heat Treated</h3>
              <p className="text-sm sm:text-base text-gray-600">
                All firewood is heat-treated to prevent pests and comply with regulations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Benefits Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Create Your Account Today</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-primary-100">
              Get exclusive benefits, track your orders, and enjoy faster checkout!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Order Tracking</h3>
                <p className="text-primary-100 text-xs sm:text-sm">
                  Track your deliveries in real-time and view order history
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Fast Checkout</h3>
                <p className="text-primary-100 text-xs sm:text-sm">
                  Save your delivery address for quick and easy ordering
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Exclusive Offers</h3>
                <p className="text-primary-100 text-xs sm:text-sm">
                  Get notified about special deals and seasonal discounts
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/auth/register"
                className="bg-white hover:bg-gray-100 text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Create Free Account
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition backdrop-blur-sm border-2 border-white/30"
              >
                Already Have an Account? Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 bg-wood-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Choose Firewood USA?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            We've been providing premium firewood to families for over 10 years. Our wood is
            sustainably sourced, properly seasoned, and delivered with care.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">10+</div>
              <div className="text-xs sm:text-sm text-gray-600">Years in Business</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">5000+</div>
              <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Heat Treated</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">50mi</div>
              <div className="text-xs sm:text-sm text-gray-600">Free Delivery</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
