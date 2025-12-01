import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/app/actions/products';
import { formatCurrency } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary);
  const imageUrl = primaryImage?.image_url || '/placeholder-firewood.jpg';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4 transition group"
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
          Back to Products
        </Link>

        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-600 hover:text-primary-600">
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg p-8">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.is_heat_treated && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded text-sm font-semibold">
                  ✓ Heat Treated
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (if multiple images) */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition"
                  >
                    <Image src={img.image_url} alt={img.alt_text || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">per {product.unit_type.replace('_', ' ')}</p>
            </div>

            {/* Stock Status */}
            {product.stock_quantity > 0 ? (
              <div className="mb-6">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                  ✓ In Stock ({product.stock_quantity} available)
                </span>
              </div>
            ) : (
              <div className="mb-6">
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="mb-6 border-t border-b py-4">
              <h3 className="font-bold mb-3">Specifications</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Wood Type:</dt>
                  <dd className="font-semibold">{product.wood_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Unit:</dt>
                  <dd className="font-semibold">{product.unit_type.replace('_', ' ')}</dd>
                </div>
                {product.moisture_content && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Moisture Content:</dt>
                    <dd className="font-semibold">{product.moisture_content}%</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Seasoned:</dt>
                  <dd className="font-semibold">{product.is_seasoned ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Kiln-Dried:</dt>
                  <dd className="font-semibold">{product.is_kiln_dried ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Heat-Treated:</dt>
                  <dd className="font-semibold">{product.is_heat_treated ? 'Yes' : 'No'}</dd>
                </div>
                {product.weight_lbs && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight:</dt>
                    <dd className="font-semibold">{product.weight_lbs} lbs</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dimensions:</dt>
                    <dd className="font-semibold">{product.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Add to Cart */}
            {product.stock_quantity > 0 ? (
              <AddToCartButton productId={product.id} productName={product.name} />
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            {/* Interstate Shipping Notice */}
            {!product.is_heat_treated && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This product is not heat-treated and cannot be shipped
                  across state lines due to pest regulations. Local delivery only.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
