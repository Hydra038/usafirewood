'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct, deleteProduct, addProductImages } from '@/app/actions/admin';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/admin/ImageUpload';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean; altText: string }>>([]);
  const [existingImages, setExistingImages] = useState<Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
  }>>([]);

  useEffect(() => {
    async function loadProduct() {
      const { id } = await params;
      setProductId(id);
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      setProduct(data);
      if (data.product_images && data.product_images.length > 0) {
        setExistingImages(data.product_images);
      }
      setLoading(false);
    }

    loadProduct();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
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

    const result = await updateProduct(productId, productData);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    // Handle new images if any
    if (images.length > 0) {
      const supabase = createClient();
      const newImages = images.filter(img => img.url.startsWith('blob:'));
      
      if (newImages.length > 0) {
        const uploadedImages = await Promise.all(
          newImages.map(async (image) => {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const file = new File([blob], `${Date.now()}.jpg`, { type: blob.type });
            
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
            
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
            
            return {
              url: publicUrl,
              altText: image.altText,
              isPrimary: image.isPrimary,
            };
          })
        );

        const validImages = uploadedImages.filter((img): img is { url: string; altText: string; isPrimary: boolean } => img !== null);
        
        if (validImages.length > 0) {
          await addProductImages(productId, validImages);
        }
      }
    }

    router.push('/admin/products');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    const result = await deleteProduct(productId);

    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.push('/admin/products');
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/admin/products" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>

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
                  defaultValue={product.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={product.slug}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product.description || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.sku}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.price}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.compare_at_price || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.stock_quantity}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.wood_type}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Type *
                </label>
                <select
                  name="unit_type"
                  required
                  defaultValue={product.unit_type}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
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
                  defaultValue={product.moisture_content || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  defaultValue={product.weight_lbs || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  defaultValue={product.dimensions || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_heat_treated"
                  defaultChecked={product.is_heat_treated}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Heat Treated</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_seasoned"
                  defaultChecked={product.is_seasoned}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Seasoned</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_kiln_dried"
                  defaultChecked={product.is_kiln_dried}
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
              productId={productId}
              existingImages={existingImages}
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
                  defaultValue={product.meta_title || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  rows={2}
                  defaultValue={product.meta_description || ''}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={product.is_active}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    defaultChecked={product.is_featured}
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
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
