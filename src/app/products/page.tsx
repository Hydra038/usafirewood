import { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getCategories } from '@/app/actions/products';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

export const metadata: Metadata = {
  title: 'Premium Firewood Products',
  description: 'Browse our selection of premium firewood - oak, cherry, maple, and more.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; wood?: string | string[]; search?: string | string[] }>;
}) {
  // Await search params
  const params = await searchParams;
  
  // Normalize search params to strings
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const wood = Array.isArray(params.wood) ? params.wood[0] : params.wood;
  const search = Array.isArray(params.search) ? params.search[0] : params.search;

  const products = await getProducts({
    category,
    woodType: wood,
    search,
  });

  const categories = await getCategories();

  const woodTypes = ['Oak', 'Cherry', 'Maple', 'Hickory', 'Ash', 'Pine', 'Cedar'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-wood-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center text-wood-100 hover:text-white mb-4 transition group"
          >
            <svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Our Products</h1>
          <p className="text-sm sm:text-base text-wood-100">
            Premium firewood, carefully seasoned and ready for delivery
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filters Dropdowns */}
        <ProductFilters
          categories={categories}
          woodTypes={woodTypes}
          selectedCategory={category}
          selectedWood={wood}
        />
        
        {/* Products Grid */}
        <div>
          {products.length > 0 ? (
            <>
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg text-gray-600 mb-4">No products found</p>
              <Link
                href="/products"
                className="text-sm sm:text-base text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
