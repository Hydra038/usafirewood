import { getAllProductsAdmin } from '@/app/actions/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <Link
            href="/admin/products/new"
            className="w-full sm:w-auto text-center bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition"
          >
            + Add Product
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product: any) => {
                const primaryImage = product.product_images?.find((img: any) => img.is_primary);
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-gray-100 flex-shrink-0">
                          {primaryImage && (
                            <Image
                              src={primaryImage.image_url}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.wood_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.stock_quantity > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock_quantity > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {products.map((product: any) => {
            const primaryImage = product.product_images?.find((img: any) => img.is_primary);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-3 mb-3">
                  <div className="relative w-20 h-20 rounded bg-gray-100 flex-shrink-0">
                    {primaryImage && (
                      <Image
                        src={primaryImage.image_url}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.wood_type}</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.stock_quantity > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock_quantity > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Stock: {product.stock_quantity}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Edit Product
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
