import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  wood_type: string;
  unit_type: string;
  is_heat_treated: boolean;
  stock_quantity: number;
  product_images?: Array<{
    image_url: string;
    alt_text?: string | null;
    is_primary: boolean;
  }>;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
