'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, addProductImages } from '@/app/actions/admin';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import { createClient } from '@/lib/supabase/client';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean; altText: string }>>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      compare_at_price: formData.get('compare_at_price') 
        ? parseFloat(formData.get('compare_at_price') as string) 
        : null,
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      sku: formData.get('sku'),
      wood_type: formData.get('wood_type'),
      unit_type: formData.get('unit_type'),
      is_heat_treated: formData.get('is_heat_treated') === 'on',
      moisture_content: formData.get('moisture_content') 
        ? parseFloat(formData.get('moisture_content') as string) 
        : null,
      is_seasoned: formData.get('is_seasoned') === 'on',
      is_kiln_dried: formData.get('is_kiln_dried') === 'on',
      weight_lbs: formData.get('weight_lbs') 
        ? parseFloat(formData.get('weight_lbs') as string) 
        : null,
      dimensions: formData.get('dimensions') || null,
      is_active: formData.get('is_active') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      meta_title: formData.get('meta_title') || null,
      meta_description: formData.get('meta_description') || null,
    };

    const result = await createProduct(productData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Upload images if any
    if (result.data && images.length > 0) {
      const productId = result.data.id;
      const supabase = createClient();
      
      // Upload images to Supabase Storage
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          // Check if it's a file object (blob URL)
          if (image.url.startsWith('blob:')) {
            // Need to fetch the blob and convert to file
            const response = await fetch(image.url);
            const blob = await response.blob();
            const file = new File([blob], `${Date.now()}.jpg`, { type: blob.type });
            
            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${productId}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });
            
            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              if (uploadError.message.includes('Bucket not found')) {
                alert('⚠️ Supabase Storage not set up!\n\nPlease create the "product-images" bucket in Supabase Storage.\n\nSee IMAGE_UPLOAD_QUICKSTART.md for instructions.');
              }
              return null;
            }
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
            
            return {
              url: publicUrl,
              altText: image.altText,
              isPrimary: image.isPrimary,
            };
          }
          return image;
        })
      );

      const validImages = uploadedImages.filter((img): img is { url: string; altText: string; isPrimary: boolean } => img !== null);
      
      if (validImages.length > 0) {
        await addProductImages(productId, validImages);
      }
    }

    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/admin/products" 
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Premium Oak Full Cord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., premium-oak-full-cord"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., OAK-CORD-001"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="350.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compare At Price ($)
                </label>
                <input
                  type="number"
                  name="compare_at_price"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="400.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wood Type *
                </label>
                <input
                  type="text"
                  name="wood_type"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Oak, Cherry, Maple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Type *
                </label>
                <select
                  name="unit_type"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select unit type</option>
                  <option value="cord">Full Cord</option>
                  <option value="face_cord">Face Cord</option>
                  <option value="bundle">Bundle</option>
                  <option value="rack">Rack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moisture Content (%)
                </label>
                <input
                  type="number"
                  name="moisture_content"
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="18.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  name="weight_lbs"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="3500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 4ft x 4ft x 8ft"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_heat_treated"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Heat Treated</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_seasoned"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Seasoned</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_kiln_dried"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Kiln Dried</span>
              </label>
            </div>
          </div>

          {/* Product Images */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            <ImageUpload
              onImagesChange={(newImages) => setImages(newImages)}
            />
          </div>

          {/* SEO & Status */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">SEO & Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="SEO title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="SEO description"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
